import { CLOUDINARY_CONFIG } from '../config/cloudinary';

export const uploadMedia = async (
  file: any,
  mediaType: 'image' | 'video' | 'audio' | 'file'
): Promise<string> => {
  try {
    // Configuration is validated at module load time in cloudinary.ts
    // If we reach here, config is valid (module would have thrown on import if invalid)

    // Prepare file data
    const fileName = file.fileName || file.name || `upload_${Date.now()}`;
    const fileType = file.type || 'image/jpeg';
    
    // Determine resource type based on media type
    let resourceType = 'auto';
    if (mediaType === 'image') {
      resourceType = 'image';
    } else if (mediaType === 'video') {
      resourceType = 'video';
    } else if (mediaType === 'audio') {
      resourceType = 'raw'; // Audio files are uploaded as raw
    } else {
      resourceType = 'raw'; // Other files as raw
    }

    // Create FormData
    const formData = new FormData();
    
    // Append file
    formData.append('file', {
      uri: file.uri || file.path,
      name: fileName,
      type: fileType,
    } as any);

    // Append upload preset
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    
    // Append folder
    formData.append('folder', CLOUDINARY_CONFIG.folder);

    // Log upload attempt in development
    if (__DEV__) {
      console.log('[Cloudinary] Uploading media:', {
        fileName,
        fileType,
        mediaType,
        resourceType,
        uri: file.uri || file.path,
      });
    }

    // Upload to Cloudinary
    const uploadUrl = `${CLOUDINARY_CONFIG.apiUrl}/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;

    // IMPORTANT: Do NOT set the Content-Type header manually.
    // React Native will automatically set the correct multipart/form-data
    // boundary for FormData. Manually setting it can cause
    // "TypeError: Network request failed" on Android.
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Cloudinary] Upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.secure_url) {
      console.error('[Cloudinary] No secure_url in response:', data);
      throw new Error('Cloudinary upload failed: No secure_url in response');
    }

    if (__DEV__) {
      console.log('[Cloudinary] ✅ Upload successful:', {
        secureUrl: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        bytes: data.bytes,
      });
    }

    return data.secure_url;
  } catch (error: any) {
    console.error('[Cloudinary] Upload error:', error);
    throw new Error(
      error.message || 'Failed to upload media to Cloudinary. Please check your configuration and network connection.'
    );
  }
};
