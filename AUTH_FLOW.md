# WhatsApp Clone - Authentication Flow Documentation

## Overview

This document explains the complete authentication flow implemented in the WhatsApp clone app, including Firebase integration, navigation logic, and session persistence.

## 🔐 Authentication Architecture

### Firebase Authentication
- **Provider**: Firebase Phone Authentication
- **Dummy OTP**: `123456` (for development/testing)
- **Test Phone Number**: `+16505551234` (Firebase test number)
- **Storage**: Phone numbers stored in both Firebase Auth (when possible) and Firestore

### Key Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Manages Firebase authentication state
   - Detects fresh installs
   - Provides `user`, `loading`, `initializing` to entire app

2. **AppNavigator** (`src/navigation/AppNavigator.tsx`)
   - Decides which navigation stack to show (AuthStack vs AppStack)
   - Based on Firebase auth state and app initialization status

3. **SplashScreen** (`src/modules/auth/screens/SplashScreen.tsx`)
   - Always shows first
   - Waits for Firebase auth state initialization
   - Navigates to PrivacyPolicy if user not authenticated

4. **OTPVerificationScreen** (`src/modules/auth/screens/OTPVerificationScreen.tsx`)
   - Handles OTP verification
   - Links phone credential to Firebase Auth user
   - Stores phone number in Firestore
   - Marks app as initialized after successful OTP

## 📱 App Flow Scenarios

### 🟢 First Time Install & Open

1. **App opens** → `SplashScreen` shows (always first)
2. **SplashScreen** waits for Firebase auth state
3. **No user found** → Navigate to `PrivacyPolicy`
4. **User accepts privacy** → Navigate to `PhoneVerification`
5. **User enters phone number** → Navigate to `OTPVerification`
6. **User enters OTP `123456`**:
   - Firebase checks if phone exists in Firestore
   - If exists → Fetch user data
   - If not exists → Create new user document in Firestore
   - Link phone credential to Firebase Auth user (using test phone number)
   - Store actual phone number in Firestore
   - Mark app as initialized in AsyncStorage
7. **AppNavigator detects** user exists + app initialized → Show `AppStack` (Home/Chats)
8. **Home screen** displays chats from `dummyChats.ts`

**Key Points:**
- Fresh install always starts from registration
- OTP verification creates/updates user in Firestore
- Phone number stored in both Firebase Auth (when linked) and Firestore
- App marked as initialized only after successful OTP

### 🔵 App Closed from Background (NOT Uninstalled)

1. **App opens** → `SplashScreen` shows
2. **SplashScreen** waits for Firebase auth state
3. **Firebase auth state check**:
   - User exists AND has phone provider → `AppNavigator` shows `AppStack`
   - User exists AND app initialized (after OTP) → `AppNavigator` shows `AppStack`
4. **Home screen** displays chats from `dummyChats.ts`

**Key Points:**
- Firebase automatically persists authentication session
- No need to re-enter phone number or OTP
- Direct navigation to Home screen
- Skips all auth screens (PrivacyPolicy, PhoneVerification, OTPVerification)

### 🔴 App Uninstalled or Reinstalled / `yarn android`

1. **App removed from device** → Local storage cleared, Firebase session lost
2. **App reinstalled** → Fresh install detected
3. **App opens** → `SplashScreen` shows
4. **Fresh install detected** → `AppNavigator` forces `AuthStack`
5. **Start from scratch**:
   - Navigate to `PrivacyPolicy`
   - Navigate to `PhoneVerification`
   - Navigate to `OTPVerification`
6. **User enters phone number and OTP `123456`**:
   - Firebase checks Firestore for existing phone number
   - If phone exists → Restore user data and chats
   - If phone does not exist → Create new user
7. **After OTP** → Navigate to `AppStack` (Home/Chats)

**Key Points:**
- Uninstall clears all local data (AsyncStorage, Firebase session)
- Reinstall always starts from registration
- Firebase Firestore persists user data (if phone number exists, restore chats)
- Fresh install detection ensures registration flow

## 🔄 Navigation Logic

### AppNavigator Decision Tree

```
AppNavigator checks:
├─ Is fresh install? (AsyncStorage key missing)
│  └─ YES → Show AuthStack (registration flow)
│
└─ NO (app initialized)
   ├─ User exists AND has phone provider?
   │  └─ YES → Show AppStack (home/chats)
   │
   ├─ User exists AND app initialized (after OTP)?
   │  └─ YES → Show AppStack (home/chats)
   │
   └─ NO user or incomplete registration
      └─ Show AuthStack (registration flow)
```

### Navigation Stacks

**AuthStack** (Registration Flow):
- `Splash` → `PrivacyPolicy` → `PhoneVerification` → `OTPVerification`

**AppStack** (Main App):
- `MainTabs` (Home/Chats) → `ChatDetail` → `Settings`

## 🔐 Firebase Auth State Management

### AuthContext Logic

1. **On App Start**:
   - Check AsyncStorage for `@whatsapp_app_initialized` key
   - If key missing → Fresh install detected
   - If fresh install → Sign out any existing Firebase user
   - Subscribe to `auth().onAuthStateChanged()`

2. **Fresh Install**:
   - Clear Firebase auth state
   - Do NOT mark app as initialized
   - Let registration flow handle user creation

3. **App Reopen**:
   - Firebase automatically restores auth session
   - If user exists → Auth state updates via `onAuthStateChanged`
   - AppNavigator checks user state and shows appropriate stack

### OTP Verification Flow

1. **User enters OTP `123456`**
2. **Verify OTP**:
   - Check if OTP is `123456` (dummy OTP)
   - If dummy OTP:
     - Use Firebase test phone number (`+16505551234`) with test code (`123456`)
     - Request OTP for test number (Firebase test mode)
     - Create phone credential
     - Link credential to anonymous user (created in AuthContext)
     - Store actual phone number in Firestore
     - Mark app as initialized in AsyncStorage
3. **After linking**:
   - User now has phone provider in Firebase Auth
   - AppNavigator detects user + phone provider → Shows AppStack
   - Navigation to Home screen

### Phone Number Storage

**Firebase Auth**:
- Phone credential linked to user
- User has `phone` provider in `providerData`
- Phone number visible in Firebase Console → Authentication → Users

**Firestore**:
- User document: `users/{uid}`
- Fields: `uid`, `phoneNumber`, `countryCode`, `isVerified`, `createdAt`, `updatedAt`
- Actual phone number stored here (even if Firebase Auth uses test number)

## ⬅️ Back Button Behavior

### On Auth Screens (OTP, Phone Verification)
- **Back button** → Navigate to previous screen
- **Never exits app**
- Allows user to edit phone number or go back

### On Home/Chat Screen
- **First back press** → Show toast "Press again to exit"
- **Second back press** → Exit app
- **Never navigates back to auth screens**
- Implemented in `useBackHandler` hook

## 📊 Data Flow

### User Data
- **Firebase Auth**: User authentication, phone provider
- **Firestore**: User profile, phone number, metadata
- **AsyncStorage**: App initialization flag (`@whatsapp_app_initialized`)

### Chat Data
- **Current**: `dummyChats.ts` (static data)
- **Future**: Backend API will replace dummy data
- **Location**: `src/data/dummyChats.ts`
- **Usage**: Imported in `HomeScreen.tsx`

## 🔍 Why Auth Persists

1. **Firebase Automatic Persistence**:
   - Firebase Auth automatically persists authentication tokens
   - Tokens stored securely on device
   - Survives app restarts (unless app uninstalled)

2. **Session Restoration**:
   - On app reopen, Firebase checks stored tokens
   - If valid → Restores user session automatically
   - `onAuthStateChanged` fires with user object
   - AppNavigator detects user → Shows AppStack

3. **No Manual Logout**:
   - User stays logged in until:
     - App uninstalled
     - User explicitly logs out (future feature)
     - Firebase token expires (rare)

## 🧪 Testing Scenarios

### Test Case 1: First Install
1. Uninstall app
2. Run `yarn android`
3. **Expected**: Splash → Privacy → Phone → OTP → Home

### Test Case 2: App Reopen
1. Close app (don't uninstall)
2. Reopen app
3. **Expected**: Splash → Home (skips registration)

### Test Case 3: Uninstall/Reinstall
1. Uninstall app
2. Reinstall app
3. **Expected**: Splash → Privacy → Phone → OTP → Home

### Test Case 4: Back Button on Home
1. Navigate to Home screen
2. Press back button once
3. **Expected**: Toast "Press again to exit"
4. Press back button again
5. **Expected**: App exits

## 📝 Key Files Modified

- `src/contexts/AuthContext.tsx` - Auth state management
- `src/navigation/AppNavigator.tsx` - Navigation decision logic
- `src/modules/auth/screens/SplashScreen.tsx` - Initial screen logic
- `src/modules/auth/screens/OTPVerificationScreen.tsx` - OTP verification and phone linking
- `src/hooks/useBackHandler.ts` - Back button handling
- `src/data/dummyChats.ts` - Chat data (used in HomeScreen)

## 🚀 Future Enhancements

1. **Backend Integration**: Replace `dummyChats.ts` with real API calls
2. **User Profile**: Add profile picture, name, status
3. **Chat Persistence**: Store chats in Firestore
4. **Logout Feature**: Allow users to explicitly log out
5. **Phone Number Verification**: Use real SMS OTP (not dummy)

## ❓ FAQ

**Q: Why does Firebase show test phone numbers?**
A: For dummy OTP (`123456`), we use Firebase test phone number (`+16505551234`) to link phone credential. The actual phone number is stored in Firestore.

**Q: Why does app persist login after close?**
A: Firebase Auth automatically persists authentication tokens. On app reopen, Firebase restores the session automatically.

**Q: How does uninstall reset state?**
A: Uninstalling app clears all local storage (AsyncStorage, Firebase tokens). On reinstall, app detects fresh install and forces registration flow.

**Q: Why use dummy OTP?**
A: For development/testing. Real SMS requires Firebase project configuration and costs. Dummy OTP allows testing without SMS.

**Q: How are chats displayed?**
A: Currently using `dummyChats.ts` static data. Future backend will replace this with real chat data from Firestore/API.
