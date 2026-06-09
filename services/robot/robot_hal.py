"""
NovaCare Robot - Hardware Abstraction Layer (HAL)
==================================================
Clean abstraction over the SERBot Prime X ``pop`` library.

All robot-specific hardware calls are encapsulated here so that:
  - Backend services import only this module, never ``pop`` directly.
  - On dev laptops (where ``pop`` is unavailable) every method degrades
    gracefully with a mock/fallback implementation.
  - Thread-safety is managed centrally.

Subsystems
----------
- CameraHAL:   CSI/USB camera via GStreamer (pop.Util)
- MotionHAL:   Omni-wheel control via pop.Pilot.SerBot
- AudioHAL:    Speaker + Microphone via pop.AudioPlay, gTTS, SpeechRecognition
- LidarHAL:    RPLiDAR A1 via pop.LiDAR.Rplidar
"""

import os
import sys
import time
import threading
import tempfile
from typing import Optional, Tuple, List, Dict

import cv2
import numpy as np

from config import (
    CAMERA_WIDTH, CAMERA_HEIGHT, CAMERA_FPS, CAMERA_INDEX,
    DEFAULT_SPEED, MAX_SPEED, OBSTACLE_STOP_DISTANCE_MM,
    TTS_LANG, TTS_TEMP_DIR, STT_LANG, STT_TIMEOUT, STT_PHRASE_TIMEOUT,
    LIDAR_ENABLED,
)

# ---------------------------------------------------------------------------
# Try importing the pop library (only available on the SERBot SBC)
# ---------------------------------------------------------------------------
_POP_AVAILABLE = False
_SerBot = None
_Rplidar = None
_AudioPlay = None
_pop_Util = None

try:
    from pop.Pilot import SerBot as _SerBotClass
    _SerBot = _SerBotClass
    _POP_AVAILABLE = True
    print("[OK] pop.Pilot.SerBot loaded")
except ImportError as e:
    print(f"[WARN] pop.Pilot.SerBot not available: {e}")

try:
    from pop.LiDAR import Rplidar as _RplidarClass
    _Rplidar = _RplidarClass
    _POP_AVAILABLE = True
    print("[OK] pop.LiDAR.Rplidar loaded")
except ImportError as e:
    print(f"[WARN] pop.LiDAR.Rplidar not available: {e}")

try:
    from pop import Util as _pop_Util_module
    _pop_Util = _pop_Util_module
    print("[OK] pop.Util loaded")
except ImportError as e:
    print(f"[WARN] pop.Util not available: {e}")

try:
    from pop import AudioPlay as _AudioPlayClass
    _AudioPlay = _AudioPlayClass
    print("[OK] pop.AudioPlay loaded")
except ImportError as e:
    print(f"[WARN] pop.AudioPlay not available: {e}")

# Optional imports for TTS/STT
try:
    from gtts import gTTS
    _GTTS_AVAILABLE = True
except ImportError:
    _GTTS_AVAILABLE = False
    print("[WARN] gTTS not installed (pip install gTTS)")

try:
    import speech_recognition as sr
    _SR_AVAILABLE = True
except ImportError:
    _SR_AVAILABLE = False
    print("[WARN] SpeechRecognition not installed (pip install SpeechRecognition)")


# ============================================================================
# Camera HAL
# ============================================================================
class CameraHAL:
    """
    Manages the robot camera.

    On SERBot: uses ``pop.Util.gstrmer()`` for a GStreamer pipeline optimised
    for the on-board CSI/USB camera.

    On dev machines: falls back to ``cv2.VideoCapture(CAMERA_INDEX)``.
    """

    def __init__(self):
        self._cap: Optional[cv2.VideoCapture] = None
        self._lock = threading.Lock()
        self._open()

    def _open(self):
        if os.environ.get("NOVACARE_LIGHTWEIGHT") == "1":
            print("[OK] CameraHAL in LIGHTWEIGHT mode (no hardware camera)")
            self._cap = None
            return

        if _pop_Util is not None:
            try:
                _pop_Util.enable_imshow()
            except Exception:
                pass
            try:
                pipeline = _pop_Util.gstrmer(CAMERA_WIDTH, CAMERA_HEIGHT)
                self._cap = cv2.VideoCapture(pipeline, cv2.CAP_GSTREAMER)
                if self._cap.isOpened():
                    print(f"[OK] Camera opened via GStreamer pipeline ({CAMERA_WIDTH}x{CAMERA_HEIGHT})")
                    return
                else:
                    print("[WARN] GStreamer pipeline failed - falling back to default camera")
            except Exception as e:
                print(f"[WARN] GStreamer error: {e} - falling back to default camera")

        # Fallback: standard OpenCV VideoCapture
        self._cap = cv2.VideoCapture(CAMERA_INDEX)
            
        if self._cap.isOpened():
            self._cap.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_WIDTH)
            self._cap.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)
            self._cap.set(cv2.CAP_PROP_FPS, CAMERA_FPS)
            print(f"[OK] Camera opened via VideoCapture({CAMERA_INDEX})")
        else:
            print("[FAIL] No camera available")
            self._cap = None

    @property
    def is_available(self) -> bool:
        return self._cap is not None and self._cap.isOpened()

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        """Read a single BGR frame. Thread-safe."""
        with self._lock:
            if not self.is_available:
                return False, None
            ret, frame = self._cap.read()
            return ret, frame

    def read_frame_base64(self, quality: int = 80) -> Optional[str]:
        """Read a frame and return as base64-encoded JPEG string."""
        import base64
        ret, frame = self.read_frame()
        if not ret or frame is None:
            return None
        _, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, quality])
        return base64.b64encode(buf).decode("utf-8")

    def read_frame_jpeg_bytes(self, quality: int = 80) -> Optional[bytes]:
        """Read a frame and return raw JPEG bytes (for MJPEG streaming)."""
        ret, frame = self.read_frame()
        if not ret or frame is None:
            return None
        _, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, quality])
        return buf.tobytes()

    def is_obstacle_ahead(self) -> bool:
        """
        Lightweight Canny-edge density heuristic for camera-based obstacle avoidance.
        Returns True if an obstacle is detected in front of the robot.
        """
        try:
            ret, frame = self.read_frame()
            if not ret or frame is None:
                return False
            h, w = frame.shape[:2]
            # Lower 55% region of interest (ROI)
            roi = frame[int(h * 0.45):, :]
            gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
            blur = cv2.GaussianBlur(gray, (5, 5), 0)
            edges = cv2.Canny(blur, 50, 150)
            third = edges.shape[1] // 3
            left_density = np.count_nonzero(edges[:, :third]) / (edges.shape[0] * max(1, third))
            center_density = np.count_nonzero(edges[:, third:2*third]) / (edges.shape[0] * max(1, third))
            right_density = np.count_nonzero(edges[:, 2*third:]) / (edges.shape[0] * max(1, third))
            
            # center_density > 0.03 or max(left, right) > 0.05 indicates an obstacle
            obstacle = center_density > 0.03 or max(left_density, right_density) > 0.05
            return bool(obstacle)
        except Exception as e:
            print(f"Error in CameraHAL.is_obstacle_ahead: {e}")
            return False

    def release(self):
        with self._lock:
            if self._cap is not None:
                self._cap.release()
                self._cap = None


# ============================================================================
# Motion HAL
# ============================================================================
class MotionHAL:
    """
    Controls the SERBot's 3-axis omni-wheel drive.

    On SERBot: uses ``pop.Pilot.SerBot()``.
    On dev machines: prints movement commands to console (mock mode).
    """

    def __init__(self):
        self._bot = None
        self._lock = threading.Lock()
        self._speed = DEFAULT_SPEED
        self._moving = False

        if _SerBot is not None:
            try:
                self._bot = _SerBot()
                print("[OK] SerBot motor controller initialized")
            except Exception as e:
                print(f"[FAIL] SerBot motor init failed: {e}")
        else:
            print("[WARN] MotionHAL in MOCK mode (no pop.Pilot)")

    @property
    def is_available(self) -> bool:
        return self._bot is not None

    @property
    def is_moving(self) -> bool:
        return self._moving

    def set_speed(self, speed: int):
        self._speed = max(0, min(speed, MAX_SPEED))

    def move(self, angle: int, speed: Optional[int] = None):
        """Move at *angle* (0=forward, 90=right, …) at given *speed*."""
        s = speed if speed is not None else self._speed
        s = max(0, min(s, MAX_SPEED))
        with self._lock:
            self._moving = True
            if self._bot:
                self._bot.move(angle, s)
            else:
                print(f"[MOCK] move(angle={angle}, speed={s})")

    def forward(self, speed: Optional[int] = None):
        self.move(0, speed)

    def backward(self, speed: Optional[int] = None):
        self.move(180, speed)

    def left(self, speed: Optional[int] = None):
        self.move(270, speed)

    def right(self, speed: Optional[int] = None):
        self.move(90, speed)

    def turn_left(self, speed: Optional[int] = None):
        s = speed if speed is not None else self._speed
        with self._lock:
            self._moving = True
            if self._bot:
                self._bot.turnLeft()
            else:
                print(f"[MOCK] turnLeft(speed={s})")

    def turn_right(self, speed: Optional[int] = None):
        s = speed if speed is not None else self._speed
        with self._lock:
            self._moving = True
            if self._bot:
                self._bot.turnRight()
            else:
                print(f"[MOCK] turnRight(speed={s})")

    def stop(self):
        with self._lock:
            self._moving = False
            if self._bot:
                self._bot.stop()
            else:
                print("[MOCK] stop()")

    def move_for(self, angle: int, duration_s: float, speed: Optional[int] = None):
        """Move in a direction for a fixed duration, then stop."""
        self.move(angle, speed)
        time.sleep(duration_s)
        self.stop()

    def start_tracking(self, target: str = "face"):
        """Start built-in pop.Pilot SerBot tracking (e.g. face/color)."""
        with self._lock:
            self._moving = True
            if self._bot and hasattr(self._bot, "tracking"):
                self._bot.tracking(target)
                print(f"[OK] SerBot built-in tracking started for: {target}")
            else:
                print(f"[MOCK] start_tracking(target={target})")

    def stop_tracking(self):
        """Stop built-in pop.Pilot SerBot tracking."""
        with self._lock:
            if self._bot and hasattr(self._bot, "stopTracking"):
                self._bot.stopTracking()
                print("[OK] SerBot built-in tracking stopped")
            elif self._bot and hasattr(self._bot, "tracking"):
                # some pop versions stop tracking by passing None or empty
                try:
                    self._bot.tracking("")
                except:
                    pass
            self.stop()

    def navigate_to(self, location_name: str):
        """Start built-in SerBot room navigation / SLAM mapping."""
        with self._lock:
            self._moving = True
            if self._bot and hasattr(self._bot, "navigation"):
                self._bot.navigation(location_name)
                print(f"[OK] SerBot navigating to: {location_name}")
            else:
                print(f"[MOCK] navigate_to(location={location_name})")


# ============================================================================
# Audio HAL
# ============================================================================
class AudioHAL:
    """
    Manages the robot's speaker and microphone.

    TTS: gTTS → save to temp WAV/MP3 → play via pop.AudioPlay (or fallback).
    STT: SpeechRecognition library with Google backend.
    """

    def __init__(self):
        self._lock = threading.Lock()
        self._audio_player = None
        os.makedirs(TTS_TEMP_DIR, exist_ok=True)

        if os.environ.get("NOVACARE_LIGHTWEIGHT") == "1":
            print("[OK] AudioHAL in LIGHTWEIGHT mode (no hardware AudioPlay)")
            return

        if _AudioPlay is not None:
            try:
                # Some pop.AudioPlay versions require a positional 'file' argument.
                # We satisfy this by initializing with an empty temporary WAV file,
                # then cleaning it up immediately to avoid Segmentation Fault.
                tmp_name = None
                try:
                    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                        tmp_name = tmp.name
                    self._audio_player = _AudioPlay(tmp_name)
                    print("[OK] AudioPlay initialized with dummy file (robot speaker)")
                except Exception:
                    # Fallback to no-argument constructor if signature is different
                    try:
                        self._audio_player = _AudioPlay()
                        print("[OK] AudioPlay initialized empty (robot speaker)")
                    except Exception as inner_e:
                        print(f"[WARN] AudioPlay inner init failed: {inner_e}")
                        self._audio_player = None
                finally:
                    if tmp_name and os.path.exists(tmp_name):
                        try:
                            os.remove(tmp_name)
                        except Exception:
                            pass
            except Exception as e:
                print(f"[WARN] AudioPlay outer init failed: {e}")

    @property
    def tts_available(self) -> bool:
        return _GTTS_AVAILABLE

    @property
    def stt_available(self) -> bool:
        return _SR_AVAILABLE

    def speak(self, text: str, lang: str = None, block: bool = True) -> bool:
        """
        Convert text to speech and play on the robot speaker.

        Falls back to os-level playback commands if pop.AudioPlay is unavailable.
        Returns True if audio was played (or queued).
        """
        if not text.strip():
            return False
        if not _GTTS_AVAILABLE:
            print(f"[TTS-MOCK] {text}")
            return False

        lang = lang or TTS_LANG
        try:
            tts = gTTS(text=text, lang=lang)
            filepath = os.path.join(TTS_TEMP_DIR, f"tts_{int(time.time()*1000)}.mp3")
            tts.save(filepath)

            if block:
                self._play_file(filepath)
            else:
                t = threading.Thread(target=self._play_file, args=(filepath,), daemon=True)
                t.start()
            return True
        except Exception as e:
            print(f"[TTS Error] {e}")
            return False

    def _play_file(self, filepath: str):
        """Play an audio file through the best available backend."""
        with self._lock:
            try:
                if self._audio_player:
                    self._audio_player.play(filepath)
                elif sys.platform == "linux":
                    os.system(f"mpg123 -q '{filepath}' 2>/dev/null || aplay '{filepath}' 2>/dev/null")
                elif sys.platform == "darwin":
                    os.system(f"afplay '{filepath}'")
                else:
                    # Windows or other - use pygame or system player
                    try:
                        import pygame
                        pygame.mixer.init()
                        pygame.mixer.music.load(filepath)
                        pygame.mixer.music.play()
                        while pygame.mixer.music.get_busy():
                            time.sleep(0.1)
                    except ImportError:
                        os.system(f'start /min "" "{filepath}"')
            finally:
                # Clean up temp file
                try:
                    os.remove(filepath)
                except OSError:
                    pass

    def listen(self, timeout: int = None, phrase_timeout: int = None) -> Optional[str]:
        """
        Listen for speech and return recognised text.
        Returns None if nothing was recognised or STT is unavailable.
        """
        if not _SR_AVAILABLE:
            print("[STT-MOCK] listen() called but SpeechRecognition not available")
            return None

        timeout = timeout or STT_TIMEOUT
        phrase_timeout = phrase_timeout or STT_PHRASE_TIMEOUT

        recognizer = sr.Recognizer()
        try:
            with sr.Microphone() as source:
                recognizer.adjust_for_ambient_noise(source, duration=0.5)
                print("[STT] Listening...")
                audio = recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_timeout)
                print("[STT] Processing...")
                text = recognizer.recognize_google(audio, language=STT_LANG)
                print(f"[STT] Recognised: {text}")
                return text
        except sr.WaitTimeoutError:
            print("[STT] Timeout - no speech detected")
            return None
        except sr.UnknownValueError:
            print("[STT] Could not understand audio")
            return None
        except sr.RequestError as e:
            print(f"[STT] Google API error: {e}")
            return None
        except Exception as e:
            print(f"[STT] Error: {e}")
            return None


# ============================================================================
# LiDAR HAL
# ============================================================================
class LidarHAL:
    """
    Interfaces with the RPLiDAR A1 M8 via ``pop.LiDAR.Rplidar``.

    Provides raw scan vectors and a convenience ``is_obstacle_ahead()`` check.
    """

    def __init__(self):
        self._lidar = None
        self._lock = threading.Lock()

        if os.environ.get("NOVACARE_LIGHTWEIGHT") == "1":
            print("[OK] LidarHAL in LIGHTWEIGHT mode (no hardware LiDAR)")
            return

        if LIDAR_ENABLED and _Rplidar is not None:
            try:
                self._lidar = _Rplidar()
                self._lidar.connect()
                self._lidar.startMotor()
                print("[OK] RPLiDAR connected and motor started")
            except Exception as e:
                print(f"[WARN] LiDAR init failed: {e}")
                self._lidar = None
        else:
            print("[WARN] LidarHAL disabled or pop.LiDAR not available")

    @property
    def is_available(self) -> bool:
        return self._lidar is not None

    def get_scan(self) -> List[Dict]:
        """
        Return a list of scan points: [{"angle": float, "distance_mm": float}, …].
        Returns an empty list if LiDAR is unavailable.
        """
        if self._lidar is None:
            return []
        with self._lock:
            try:
                vectors = self._lidar.getVectors()
                return [
                    {"angle": v[0], "distance_mm": v[1]}
                    for v in vectors
                ]
            except Exception as e:
                print(f"[LiDAR] scan error: {e}")
                return []

    def is_obstacle_ahead(self, cone_degrees: int = 30,
                          distance_mm: int = OBSTACLE_STOP_DISTANCE_MM) -> bool:
        """Check if there's an obstacle within *cone_degrees* of forward direction."""
        scan = self.get_scan()
        if not scan:
            return False
        half_cone = cone_degrees / 2
        for point in scan:
            angle = point["angle"]
            # Forward is angle ≈ 0 (or ≈ 360)
            if (angle <= half_cone or angle >= 360 - half_cone):
                if 0 < point["distance_mm"] < distance_mm:
                    return True
        return False

    def get_distance_at(self, target_angle: float, cone_degrees: int = 15) -> float:
        """
        Get the minimum distance (in mm) to an obstacle at a specific angle.
        Returns float('inf') if no obstacle is in that cone.
        """
        scan = self.get_scan()
        if not scan:
            return float('inf')
            
        min_dist = float('inf')
        half_cone = cone_degrees / 2
        
        for point in scan:
            angle = point["angle"]
            dist = point["distance_mm"]
            
            # Normalize angles to handle 0/360 wrap-around
            diff = abs((angle - target_angle + 180) % 360 - 180)
            if diff <= half_cone and dist > 0:
                if dist < min_dist:
                    min_dist = dist
                    
        return min_dist

    def get_closest_obstacle(self) -> Tuple[float, float]:
        """
        Finds the closest obstacle.
        Returns (angle_degrees, distance_mm).
        Returns (0.0, float('inf')) if no obstacles detected.
        """
        scan = self.get_scan()
        if not scan:
            return 0.0, float('inf')
            
        min_dist = float('inf')
        best_angle = 0.0
        
        for point in scan:
            dist = point["distance_mm"]
            if 0 < dist < min_dist:
                min_dist = dist
                best_angle = point["angle"]
                
        return best_angle, min_dist

    def shutdown(self):
        if self._lidar:
            try:
                self._lidar.stopMotor()
            except Exception:
                pass


# ============================================================================
# Unified Robot HAL (singleton facade)
# ============================================================================
class RobotHAL:
    """
    Unified facade for all SERBot hardware subsystems.

    Usage::

        from robot_hal import get_robot
        robot = get_robot()
        robot.motion.forward()
        frame = robot.camera.read_frame()
        robot.audio.speak("Hello!")
        robot.motion.stop()
    """

    def __init__(self):
        print("=" * 50)
        print("  NovaCare - SERBot Hardware Abstraction Layer")
        print("=" * 50)
        self.camera = CameraHAL()
        self.motion = MotionHAL()
        self.audio = AudioHAL()
        self.lidar = LidarHAL()
        self._print_status()

    def _print_status(self):
        print("\n  Hardware Status:")
        print(f"    Camera:   {'[OK] READY' if self.camera.is_available else '[FAIL] N/A'}")
        print(f"    Motion:   {'[OK] READY' if self.motion.is_available else '[WARN] MOCK'}")
        print(f"    TTS:      {'[OK] READY' if self.audio.tts_available else '[FAIL] N/A'}")
        print(f"    STT:      {'[OK] READY' if self.audio.stt_available else '[FAIL] N/A'}")
        print(f"    LiDAR:    {'[OK] READY' if self.lidar.is_available else '[FAIL] N/A'}")
        print(f"    pop lib:  {'[OK] LOADED' if _POP_AVAILABLE else '[WARN] NOT AVAILABLE'}")
        print("=" * 50)

    def shutdown(self):
        """Gracefully release all hardware resources."""
        print("[HAL] Shutting down all hardware...")
        self.motion.stop()
        self.camera.release()
        self.lidar.shutdown()


# ---------------------------------------------------------------------------
# Singleton
# ---------------------------------------------------------------------------
_robot_instance: Optional[RobotHAL] = None


def get_robot() -> RobotHAL:
    """Get or create the singleton RobotHAL instance."""
    global _robot_instance
    if _robot_instance is None:
        _robot_instance = RobotHAL()
    return _robot_instance
