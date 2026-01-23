// src/services/userLookupService.ts

import firestore from '@react-native-firebase/firestore';

export const findUserByPhoneNumber = async (phoneNumber: string) => {
  const snapshot = await firestore()
    .collection('users')
    .where('phoneNumber', '==', phoneNumber)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];

  return {
    uid: doc.id,
    ...doc.data(),
  };
};
