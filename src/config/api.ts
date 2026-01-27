/**
 * API Configuration - Single Source of Truth
 * 
 * IMPORTANT: For physical devices, replace with your PC's local IP address
 * Find your IP: 
 * - Windows: ipconfig (look for IPv4 Address)
 * - Mac/Linux: ifconfig or ip addr
 * 
 * Example: If your PC's IP is 192.168.1.105, use:
 * const API_BASE_URL = 'http://192.168.1.105:5000';
 */

const PC_LOCAL_IP = '192.168.49.216';

export const API_BASE_URL = `http://${PC_LOCAL_IP}:5000`;

// For development debugging
if (__DEV__) {
  console.log('[API Config] Using backend URL:', API_BASE_URL);
}
