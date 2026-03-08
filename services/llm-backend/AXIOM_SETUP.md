# Axiom Logging Setup for NovaBot

## Current Status

Your dataset **"nova-care"** is in the **EU region (eu-central-1)**, but your API token appears to be associated with the **US region (us-east-1)**.

## The Issue

Axiom requires that:
- The dataset and API token must be in the **same region**
- Currently: Dataset = EU, Token = US (mismatch)

## Solutions

### Option 1: Use EU Region API Token (Recommended)

1. Go to your Axiom dashboard: https://app.axiom.co
2. Navigate to **Settings** → **API Tokens**
3. Create a new API token in the **EU region**
4. Update your `.env` file:
   ```env
   AXIOM_API_KEY=your_eu_region_token_here
   AXIOM_DATASET=nova-care
   ```

### Option 2: Create Dataset in US Region

1. Go to your Axiom dashboard
2. Create a new dataset named "nova-care" in the **US region**
3. Update your `.env` file:
   ```env
   AXIOM_DATASET=nova-care
   ```
   (Keep your current US region token)

### Option 3: Use Different Dataset Name

If you have a US region dataset, update the dataset name:

```env
AXIOM_DATASET=your-us-dataset-name
```

## Testing

After fixing the region mismatch, test with:

```powershell
python test_axiom_simple.py
```

Or run the full test suite:

```powershell
python test_axiom.py
```

## Verify Logs in Axiom

1. Go to: https://app.axiom.co
2. Select dataset: **nova-care**
3. Query logs:
   ```
   ["nova-care"] | limit 100
   ```

## Current Configuration

- **Dataset**: nova-care
- **API Token**: xaat-063770e6-7169-4fb0-beb8-dfc53593c62e
- **Issue**: Region mismatch (EU dataset, US token)

Once the region is fixed, all logs will be sent automatically!
