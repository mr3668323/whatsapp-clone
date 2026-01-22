let phoneAuthInProgress = false;

export const setPhoneAuthInProgress = (value: boolean) => {
  phoneAuthInProgress = value;
  console.log('[phoneAuthState] phoneAuthInProgress =', value);
};

export const isPhoneAuthInProgress = (): boolean => {
  return phoneAuthInProgress;
};

