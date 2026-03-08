"""
Simple test to verify Axiom connection and dataset
"""
from axiom_py import Client
from datetime import datetime

# Initialize client
client = Client(token="xaat-063770e6-7169-4fb0-beb8-dfc53593c62e")

print("=" * 60)
print("Testing Axiom Connection")
print("=" * 60)
print()

# Test 1: Send a simple event
print("1. Sending test event to 'nova-care' dataset...")
try:
    test_event = {
        "_time": datetime.utcnow().isoformat() + "Z",
        "message": "Test from Python script",
        "service": "NovaBot",
        "test": True
    }
    
    client.ingest_events(
        dataset="nova-care",
        events=[test_event]
    )
    print("   ✓ Event sent successfully!")
    print()
except Exception as e:
    print(f"   ✗ Error: {str(e)}")
    print()
    print("   Note: If you see a region mismatch error, your dataset")
    print("   might be in a different region than your API token.")
    print("   Check your Axiom dashboard for the correct region.")
    print()

# Test 2: Query the dataset
print("2. Querying 'nova-care' dataset...")
try:
    query = '["nova-care"] | limit 10'
    result = client.query(query)
    print(f"   ✓ Query successful! Found {len(result.rows) if hasattr(result, 'rows') else 'N/A'} rows")
    print()
except Exception as e:
    print(f"   ✗ Query error: {str(e)}")
    print()

print("=" * 60)
print("Test completed!")
print("=" * 60)
print()
print("Check your Axiom dashboard:")
print("  https://app.axiom.co")
print()
print("Query your logs:")
print('  ["nova-care"] | limit 100')
