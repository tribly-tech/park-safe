# Guest User Feature Implementation

## Overview
This feature shows a special registration card for users who log in with their phone number but haven't registered a vehicle yet. These users are greeted as "Hey guest" instead of by name.

## Changes Made

### 1. State Management (`src/app/page.tsx`)
- Added `hasRegisteredVehicle` state to track whether the user has registered a vehicle
- Defaults to `false` when a user logs in (guest mode)

### 2. Greeting Update
When the profile drawer is opened and the user is logged in:
- **With registered vehicle**: Shows "John Doe"
- **Without registered vehicle (guest)**: Shows "Hey guest"

### 3. Registration Card
A new card is displayed **above the Quick Actions section** when:
- User is logged in (`isLoggedIn === true`)
- User hasn't registered a vehicle (`hasRegisteredVehicle === false`)

The card features:
- QR code icon with gradient background
- Title: "Register park safe QR"
- Description: "Get your free QR code in 2 minutes"
- "Get Started" button that triggers vehicle registration

### 4. Development Helper
Added a toggle button in the Quick Actions section to easily switch between:
- Guest user (no registered vehicle)
- Registered user (has registered vehicle)

This makes it easy to test both states during development.

## How to Test

### Step 1: Start the Development Server
```bash
npm run dev
```
The server is running on: http://localhost:3001

### Step 2: Navigate to Login Page
1. Open http://localhost:3001
2. Click on the user icon in the top right corner to open the drawer
3. Click "Sign In" button

### Step 3: Complete Phone Login
1. Enter any 10-digit phone number (e.g., 9876543210)
2. Click "Continue"
3. Enter any 4-digit OTP (e.g., 1234)
4. Click "Verify" or wait for auto-verification

### Step 4: View Guest User Experience
After successful login, you'll be redirected to the home page with the drawer open. You should see:
- Greeting: "Hey guest" (instead of "John Doe")
- A prominent registration card above Quick Actions with:
  - Green gradient background
  - QR code icon
  - "Register park safe QR" title
  - "Get your free QR code in 2 minutes" description
  - "Get Started" button

### Step 5: Toggle Between States (Development Only)
In the Quick Actions section, you'll see an amber-colored card:
- Title: "Toggle User Type"
- Click this to switch between "Guest" and "Registered User" states
- This lets you compare both experiences

## Visual Design

### Registration Card Styling
```
- Background: Gradient from green (#f0fdf4) to white
- Border: Green (#1bb658)
- Shadow: 4px green shadow
- Icon: White background with green QR code icon
- Button: Green background with hover effects
```

### Location
The card appears in the profile drawer, positioned:
1. Below the header section (user profile info)
2. **Above** the "Quick Actions" section
3. Only visible when `isLoggedIn && !hasRegisteredVehicle`

## Future Enhancements

1. **Backend Integration**: Connect the `hasRegisteredVehicle` state to actual user data from API
2. **Registration Flow**: Implement the actual vehicle registration page/flow
3. **Persistence**: Store user state in localStorage or backend
4. **Remove Dev Toggle**: Remove the development toggle button in production

## Files Modified

- `src/app/page.tsx` - Main implementation file

## Screenshot Location
The reference design screenshot is saved at:
`/Users/aditya/.cursor/projects/Users-aditya-Documents-park-safe/assets/Screenshot_2026-01-28_at_1.34.00_AM-97ca24b5-a8d6-4641-b633-f7c7dd49e15a.png`
