// Cloudinary Configuration
// IMPORTANT: React Native does NOT support process.env by default (requires additional setup like react-native-config)
// Therefore, we use direct constants here. Replace 'YOUR_CLOUD_NAME' with your actual Cloudinary cloud name.
// You can find your cloud name in your Cloudinary dashboard: https://cloudinary.com/console

// ⚠️ REPLACE THIS WITH YOUR ACTUAL CLOUDINARY CLOUD NAME ⚠️
// Using cloud name from your Cloudinary dashboard (screenshot): 'dzhaqez4q'
// NOTE: This is SAFE because we are using UNSIGNED uploads. Do NOT put API secret here.
const CLOUDINARY_CLOUD_NAME = 'dzhaqez4q';

export const CLOUDINARY_CONFIG = {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: 'whatsapp_unsigned', // Make sure this preset exists in your Cloudinary account
  folder: 'whatsapp_clone',
  apiUrl: 'https://api.cloudinary.com/v1_1',
};

// Log configuration in development (after validation)
if (__DEV__) {
  console.log('[Cloudinary] ✅ Configuration loaded:', {
    cloudName: CLOUDINARY_CONFIG.cloudName,
    uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
    folder: CLOUDINARY_CONFIG.folder,
  });
}
