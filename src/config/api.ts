const PC_LOCAL_IP = '192.168.49.216';

export const API_BASE_URL = `http://${PC_LOCAL_IP}:5000`;

// For development debugging
if (__DEV__) {
  console.log('[API Config] Using backend URL:', API_BASE_URL);
}
