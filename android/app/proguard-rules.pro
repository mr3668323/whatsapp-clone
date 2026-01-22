# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# ============================================
# CRITICAL: Firebase Phone Authentication ProGuard Rules
# These rules prevent Firebase classes from being stripped in release builds,
# which would cause native crashes when Firebase Phone Auth is used.
# ============================================

# Keep Firebase Auth classes
-keep class com.google.firebase.auth.** { *; }
-keep class com.google.android.gms.internal.firebase-auth-api.** { *; }
-keep class com.google.firebase.auth.internal.** { *; }

# Keep Firebase Phone Auth reCAPTCHA Activity
-keep class com.google.firebase.auth.internal.RecaptchaActivity { *; }
-keep class com.google.firebase.auth.internal.GenericIdpActivity { *; }

# Keep Firebase App classes
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# Keep Firebase Auth providers
-keep class com.google.firebase.auth.PhoneAuthProvider { *; }
-keep class com.google.firebase.auth.PhoneAuthCredential { *; }

# Keep Firebase exceptions
-keep class com.google.firebase.FirebaseException { *; }
-keep class com.google.firebase.auth.FirebaseAuthException { *; }

# Keep Parcelable implementations for Firebase
-keepclassmembers class * implements android.os.Parcelable {
    public static final ** CREATOR;
}

# Keep Firebase serialization classes
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes Exceptions

# Prevent obfuscation of Firebase Auth method names
-keepnames class com.google.firebase.auth.** { *; }
-keepnames class com.google.android.gms.internal.firebase-auth-api.** { *; }

# Keep React Native Firebase classes
-keep class io.invertase.firebase.** { *; }
-keep class com.facebook.react.bridge.** { *; }
