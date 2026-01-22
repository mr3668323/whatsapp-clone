// Minimal native module for React Native 0.72.x
// This ensures libappmodules.so is generated

#include <jni.h>

JNIEXPORT jint JNI_OnLoad(JavaVM* vm, void* reserved) {
    return JNI_VERSION_1_6;
}
