# Festival Theme System - Firebase & Query Information

## Firebase Project Configuration

The system uses Firebase Admin SDK to connect to Firestore. The Firebase project is configured via environment variables:

### Required Environment Variables

Add these to your `.env.local` file:

```bash
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GEMINI_API_KEY=your-gemini-api-key
```

### How to Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Extract the values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and newlines)

## Firebase Data Structure

The system stores festival dates in Firestore with this structure:

**Collection:** `festivalDates`  
**Document ID:** Year (e.g., "2025")  
**Document Data:**
```json
{
  "year": 2025,
  "festivals": [
    {
      "id": "christmas",
      "name": "Christmas",
      "startDate": "2025-12-01",
      "endDate": "2026-01-02"
    },
    {
      "id": "diwali",
      "name": "Diwali",
      "startDate": "2025-10-20",
      "endDate": "2025-11-15"
    },
    // ... more festivals
  ],
  "lastUpdated": "2025-01-15T10:30:00.000Z"
}
```

## How to Check What's Stored in Firebase

### Method 1: Using the View API Endpoint

Visit or call:
```
GET /api/festivals/view?year=2025
```

This will show:
- Which Firebase project is connected
- Environment variable status
- Data stored for the requested year
- Any errors

Example:
```bash
curl http://localhost:3000/api/festivals/view?year=2025
```

### Method 2: Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Look for the `festivalDates` collection
5. Check documents by year (e.g., "2025", "2026")

### Method 3: Check Environment Variables

The view API also shows which environment variables are set (without exposing their values).

## When Does the System Query for Festivals?

### 1. **On Page Load** (Client-Side)
- When a user visits the site, `useFestivalTheme()` hook runs
- It calls `/api/festivals/active` immediately
- This happens in `src/components/FestivalTheme.tsx`

### 2. **Every Hour** (Automatic Refresh)
- The hook sets up an interval to check every hour
- This ensures the theme updates if the date changes
- Code: `setInterval(checkFestival, 1000 * 60 * 60)`

### 3. **Server-Side Query Flow**

When `/api/festivals/active` is called:

1. **Check Cache** (in-memory, 24-hour TTL)
   - If cached data exists and is fresh → return immediately
   - Location: `src/lib/festivalDates.ts`

2. **Query Firebase**
   - Tries to fetch from Firestore collection `festivalDates/{year}`
   - If found → cache it and return
   - If not found → proceed to auto-sync

3. **Automatic Sync** (NEW!)
   - If data doesn't exist in Firebase for **current year, next year, or previous year**
   - System automatically triggers a background sync using Gemini AI
   - Sync happens **non-blocking** - user gets immediate response
   - Sync populates Firebase for future requests
   - Location: `src/lib/festivalDates.ts` → `triggerAutoSync()`

4. **Fallback to Approximate Dates**
   - While sync is happening, user gets approximate dates immediately
   - Uses dates from `src/lib/festivalConfig.ts`
   - These are hardcoded approximate dates
   - Cached for 24 hours
   - Next request will get accurate dates from Firebase (after sync completes)

### 4. **Manual Sync** (Populate Firebase)

To populate Firebase with accurate dates:

```
GET /api/festivals/sync?year=2025
```

This will:
1. Use Gemini AI to fetch accurate festival dates
2. Store them in Firebase Firestore
3. Return the synced data

**When to run:**
- Once per year (or when you need updated dates)
- Can be automated with Vercel Cron Jobs
- Can be triggered manually when needed

## Query Flow Diagram

```
User visits site
    ↓
useFestivalTheme() hook runs
    ↓
Calls /api/festivals/active
    ↓
Server checks in-memory cache (24h TTL)
    ↓
If not cached → Query Firebase Firestore
    ↓
If Firebase has data → Cache & return ✅
    ↓
If Firebase empty → Check if year is relevant (current/next/previous)
    ↓
If relevant year → Trigger auto-sync in background (non-blocking)
    ↓
Return approximate dates immediately to user
    ↓
Auto-sync completes → Stores accurate dates in Firebase
    ↓
Next user request → Gets accurate dates from Firebase ✅
    ↓
FestivalThemeProvider applies theme
```

**Key Points:**
- **First user** in December/January gets approximate dates immediately
- **Background sync** fetches accurate dates via Gemini AI
- **Subsequent users** get accurate dates from Firebase
- **No waiting** - users never blocked by sync process

## Cache Behavior

- **Cache Duration:** 24 hours
- **Cache Location:** Server-side in-memory (Map)
- **Cache Key:** Year (e.g., 2025)
- **Cache Invalidation:** 
  - After 24 hours
  - Can be manually cleared (would need to add endpoint)

## Troubleshooting

### Check Firebase Connection

Visit: `/api/festivals/view?year=2025`

Look for:
- `firebaseProject`: Should show your project ID
- `environmentStatus`: All should be "✅ Set"
- `firebaseError`: Should be null if connected

### If Firebase is Not Configured

The system will:
1. Log an error
2. Fall back to approximate dates from config
3. Still work, but dates may not be accurate for lunar calendar festivals

### If No Data in Firebase

1. Call `/api/festivals/sync?year=2025` to populate
2. Check the response for any errors
3. Verify Gemini API key is set correctly

## Example API Calls

```bash
# View what's stored
curl http://localhost:3000/api/festivals/view?year=2025

# Sync festival dates for 2025
curl http://localhost:3000/api/festivals/sync?year=2025

# Get currently active festival
curl http://localhost:3000/api/festivals/active
```
