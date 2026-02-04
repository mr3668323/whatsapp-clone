// src/utils/mediaPicker.ts

import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

/**
 * Open camera to capture image or video
 */
export const openCamera = async () => {
  const result = await launchCamera({
    mediaType: 'mixed', // image + video
    quality: 1,
    saveToPhotos: true, // Save captured media to device photos
  });

  if (result.didCancel || !result.assets || result.assets.length === 0) {
    return null;
  }

  return result.assets[0];
};

/**
 * Pick image or video from device gallery
 */
export const pickImageOrVideo = async () => {
  const result = await launchImageLibrary({
    mediaType: 'mixed', // image + video
    quality: 1,
    selectionLimit: 1,
  });

  if (result.didCancel || !result.assets || result.assets.length === 0) {
    return null;
  }

  return result.assets[0];
};

/**
 * Pick document / audio / pdf / any file
 */
export const pickDocument = async () => {
  try {
    const res = await DocumentPicker.pickSingle({
      type: DocumentPicker.types.allFiles,
    });

    return res;
  } catch (error) {
    // User cancelled picker
    return null;
  }
};
