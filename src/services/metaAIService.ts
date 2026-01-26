// Meta AI Service - Backend API Integration
import { Platform } from 'react-native';

// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, use localhost
// For physical device, use your computer's IP address
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000';
    }
    // iOS simulator can use localhost
    return 'http://localhost:5000';
  }
  return 'https://your-production-api.com';
};

const API_BASE_URL = getApiBaseUrl();

export interface MetaAIChatRequest {
  userId: string;
  message: string;
}

export interface MetaAIChatResponse {
  reply: string;
  messageId?: string;
  timestamp?: string;
}

/**
 * Send message to Meta AI backend and get response
 */
export const sendMessageToMetaAI = async (
  userId: string,
  message: string
): Promise<MetaAIChatResponse> => {
  try {
    console.log('[MetaAI Service] Sending message to backend:', message.substring(0, 50));
    
    const response = await fetch(`${API_BASE_URL}/api/meta-ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: MetaAIChatResponse = await response.json();
    console.log('[MetaAI Service] ✅ Received response from backend');
    
    return data;
  } catch (error: any) {
    console.error('[MetaAI Service] ❌ Error calling backend:', error);
    throw error;
  }
};

/**
 * Check if backend is available
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.log('[MetaAI Service] Backend not available');
    return false;
  }
};
