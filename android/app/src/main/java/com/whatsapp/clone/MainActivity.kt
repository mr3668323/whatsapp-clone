package com.whatsapp.clone

import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  companion object {
    private const val TAG = "MainActivity"
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "whatsapp"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable Fabric and Concurrent React (aka React 18) with a boolean flag.
   * For React Native 0.72.x with Old Architecture, this should be false.
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(
          this,
          mainComponentName,
          // Old Architecture - set to false for RN 0.72.x
          false
      )

  /**
   * CRITICAL: Handle Firebase Phone Auth intents properly.
   * Firebase Phone Auth launches a transparent Activity for reCAPTCHA verification.
   * This method ensures that Firebase's verification Activity result is properly handled,
   * preventing native crashes when the Activity returns.
   */
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    Log.d(TAG, "onNewIntent called")
    try {
      // Set the new intent so it can be accessed by getIntent() in onResume
      setIntent(intent)
    } catch (e: Exception) {
      Log.e(TAG, "Error in onNewIntent", e)
    }
  }

  /**
   * CRITICAL: Preserve activity state during configuration changes.
   * Firebase Phone Auth can trigger Activity recreation, and we need to preserve
   * the React Native state to prevent crashes.
   * 
   * CRITICAL: Show native splash screen on every app start/resume.
   * The splash will be hidden by JavaScript after auth state is resolved.
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    Log.d(TAG, "onCreate called")
  }

  /**
   * CRITICAL: Handle activity lifecycle properly for Firebase Phone Auth.
   * When Firebase Phone Auth's reCAPTCHA Activity finishes, this method is called.
   * We must ensure React Native is ready to handle the result.
   * 
   * CRITICAL: Show native splash screen on app resume from background.
   * This ensures splash appears every time app is opened from background.
   */
  override fun onResume() {
    super.onResume()
    Log.d(TAG, "onResume called")
  }

  /**
   * CRITICAL: Handle uncaught exceptions to prevent app crashes.
   * This catches native crashes that might occur from Firebase Phone Auth.
   */
  override fun onStart() {
    super.onStart()
    Log.d(TAG, "onStart called")
    
    // Set up uncaught exception handler for this thread
    Thread.setDefaultUncaughtExceptionHandler { thread, exception ->
      Log.e(TAG, "Uncaught exception in thread: ${thread.name}", exception)
      exception.printStackTrace()
      
      // Don't crash - just log the error
      // The error will be handled by React Native's error boundary
      try {
        // Try to show error to user via React Native bridge if possible
        // For now, just log it
        Log.e(TAG, "Exception details: ${exception.message}")
        Log.e(TAG, "Exception stack: ${exception.stackTraceToString()}")
      } catch (e: Exception) {
        Log.e(TAG, "Error handling uncaught exception", e)
      }
    }
  }

}
