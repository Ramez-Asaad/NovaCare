"""
Simple test script for NovaBot Conversational AI
"""

from LLMs import ConversationalAI


def main():
    print("=" * 50)
    print("NovaBot Conversational AI Test")
    print("=" * 50)
    print()
    
    # Initialize the AI
    print("Initializing NovaBot...")
    ai = ConversationalAI()
    
    try:
        ai.initialize()
        print("\n✓ NovaBot is ready!")
        print("\n" + "-" * 50)
        print("Start chatting (type 'quit' or 'exit' to stop)")
        print("-" * 50 + "\n")
        
        # Interactive chat loop
        while True:
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'bye', 'q']:
                print("\nNovaBot: Goodbye! Take care! 👋")
                break
            
            if not user_input:
                continue
            
            # Get response
            print("NovaBot: ", end="", flush=True)
            response = ai.chat(user_input)
            print(response)
            print()
            
    except KeyboardInterrupt:
        print("\n\nNovaBot: Goodbye! 👋")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")


if __name__ == "__main__":
    main()

