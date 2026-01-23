import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

export const registerForPushNotifications = async (uid: string) => {
  // Ask permission (important)
  await messaging().requestPermission();

  // Get FCM token
  const token = await messaging().getToken();

  // Save token in Firestore
  await firestore()
    .collection('users')
    .doc(uid)
    .update({
      fcmToken: token,
    });

  console.log('✅ FCM token saved:', token);
};
