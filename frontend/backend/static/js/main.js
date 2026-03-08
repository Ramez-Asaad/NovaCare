// ===================================
// DASHBOARD INTERACTIVE FUNCTIONS
// ===================================

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    initSidebar();
    updateTime();
    setInterval(updateTime, 60000); // Update time every minute
});

// ===================================
// CHART INITIALIZATION
// ===================================

function initCharts() {
    // Traffic Chart (Line + Bar)
    const trafficCanvas = document.getElementById('trafficChart');
    if (trafficCanvas) {
        const trafficCtx = trafficCanvas.getContext('2d');
        new Chart(trafficCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Detection Events',
                        data: [12, 19, 15, 25, 22, 18, 20],
                        backgroundColor: 'rgba(78, 115, 223, 0.1)',
                        borderColor: 'rgba(78, 115, 223, 1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Fall Alerts',
                        data: [3, 5, 2, 4, 3, 2, 1],
                        backgroundColor: 'rgba(231, 74, 59, 0.1)',
                        borderColor: 'rgba(231, 74, 59, 1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(231, 74, 59, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12,
                                weight: '600'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        },
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }

    // Donut Chart (Alert Types)
    const donutCanvas = document.getElementById('donutChart');
    if (donutCanvas) {
        const donutCtx = donutCanvas.getContext('2d');
        new Chart(donutCtx, {
            type: 'doughnut',
            data: {
                labels: ['Fall Detected', 'Camera Issues', 'Network Alerts', 'System Warnings'],
                datasets: [{
                    data: [45, 20, 15, 20],
                    backgroundColor: [
                        'rgba(231, 74, 59, 0.8)',
                        'rgba(246, 194, 62, 0.8)',
                        'rgba(54, 185, 204, 0.8)',
                        'rgba(133, 135, 150, 0.8)'
                    ],
                    borderColor: [
                        'rgba(231, 74, 59, 1)',
                        'rgba(246, 194, 62, 1)',
                        'rgba(54, 185, 204, 1)',
                        'rgba(133, 135, 150, 1)'
                    ],
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 11,
                                weight: '600'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        },
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// ===================================
// SIDEBAR TOGGLE
// ===================================

function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
}

// ===================================
// SIMULATE ALERT FUNCTION
// ===================================

function simulateAlert() {
    // Show toast notification
    showToast('🚨 Fall Alert Simulated!', 'danger');

    // Update KPI card if on dashboard
    const alertCard = document.querySelector('.bg-primary-gradient .kpi-value');
    if (alertCard) {
        const currentValue = parseInt(alertCard.textContent);
        alertCard.textContent = currentValue + 1;
        
        // Animate the card
        alertCard.parentElement.parentElement.parentElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            alertCard.parentElement.parentElement.parentElement.style.transform = 'scale(1)';
        }, 200);
    }

    // Update notification badge
    updateNotificationBadge();
}

// ===================================
// STREAM MODAL FUNCTIONS
// ===================================

function openStreamModal() {
    const modal = new bootstrap.Modal(document.getElementById('streamModal'));
    modal.show();
    showToast('📹 Opening live stream...', 'info');
}

function closeStreamModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('streamModal'));
    if (modal) {
        modal.hide();
    }
}

// ===================================
// REFRESH DASHBOARD
// ===================================

function refreshDashboard() {
    showToast('🔄 Refreshing dashboard data...', 'info');
    
    // Simulate loading animation
    const refreshBtn = event.target.closest('button');
    const originalContent = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    refreshBtn.disabled = true;

    setTimeout(() => {
        refreshBtn.innerHTML = originalContent;
        refreshBtn.disabled = false;
        showToast('✅ Dashboard refreshed successfully!', 'success');
    }, 1500);
}

// ===================================
// REFRESH HEALTH STATUS
// ===================================

function refreshHealth() {
    showToast('🔄 Checking system health...', 'info');
    
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.classList.remove('bg-success');
        badge.classList.add('bg-warning');
        badge.textContent = 'Checking...';
    });

    setTimeout(() => {
        badges.forEach(badge => {
            badge.classList.remove('bg-warning');
            badge.classList.add('bg-success');
            badge.textContent = badge.closest('.card').querySelector('h5').textContent.includes('Camera') ? 'Active' :
                               badge.closest('.card').querySelector('h5').textContent.includes('Pi') ? 'Online' :
                               badge.closest('.card').querySelector('h5').textContent.includes('MQTT') ? 'Connected' : 'Loaded';
        });
        showToast('✅ System health check completed!', 'success');
    }, 1500);
}

// ===================================
// EXPORT REPORT
// ===================================

function exportReport() {
    showToast('📊 Preparing report for export...', 'info');
    
    setTimeout(() => {
        showToast('📥 Report downloaded successfully!', 'success');
    }, 1500);
}

// ===================================
// UPDATE NOTIFICATION BADGE
// ===================================

function updateNotificationBadge() {
    const badges = document.querySelectorAll('.notification-badge');
    badges.forEach(badge => {
        const currentValue = parseInt(badge.textContent);
        badge.textContent = currentValue + 1;
        
        // Animate
        badge.style.animation = 'none';
        setTimeout(() => {
            badge.style.animation = 'pulse 0.5s ease';
        }, 10);
    });

    // Update sidebar badge
    const sidebarBadge = document.querySelector('.sidebar .badge');
    if (sidebarBadge) {
        const currentValue = parseInt(sidebarBadge.textContent);
        sidebarBadge.textContent = currentValue + 1;
    }
}

// ===================================
// TOAST NOTIFICATION SYSTEM
// ===================================

function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    const bgColors = {
        'success': '#1cc88a',
        'danger': '#e74a3b',
        'warning': '#f6c23e',
        'info': '#36b9cc'
    };

    toast.style.cssText = `
        background: ${bgColors[type] || bgColors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        min-width: 300px;
        max-width: 400px;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        cursor: pointer;
    `;
    toast.textContent = message;

    // Add to container
    toastContainer.appendChild(toast);

    // Remove on click
    toast.addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toastContainer.contains(toast)) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }
    }, 3000);
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// UPDATE TIME
// ===================================

function updateTime() {
    const timeElements = document.querySelectorAll('[data-time]');
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    timeElements.forEach(element => {
        element.textContent = timeString;
    });
}

// ===================================
// LOGIN FORM HANDLER
// ===================================

function handleLogin(event) {
    event.preventDefault();
    
    const alertDiv = document.getElementById('loginAlert');
    if (alertDiv) {
        alertDiv.classList.remove('d-none');
        
        setTimeout(() => {
            alertDiv.classList.add('d-none');
        }, 5000);
    }
    
    return false;
}

// ===================================
// CONSOLE LOG
// ===================================

console.log('%c🏥 NovaCare Fall Detection System', 'color: #4e73df; font-size: 20px; font-weight: bold;');
console.log('%cUI-Only Version - Backend integration required', 'color: #858796; font-size: 12px;');
console.log('%cAll data shown is dummy/placeholder data', 'color: #858796; font-size: 12px;');
