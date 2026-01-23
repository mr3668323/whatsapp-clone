import { Platform, PermissionsAndroid } from 'react-native';
import Contacts, { Contact as RNContact } from 'react-native-contacts';
import firestore from '@react-native-firebase/firestore';
import type { UserData } from './userService';

export interface WhatsAppContact {
  uid: string;
  name: string;
  phoneNumber: string;
}

export interface ContactFetchResult {
  contacts: WhatsAppContact[];
  permissionDenied: boolean;
}

/**
 * Normalize a raw phone string to something comparable to the E.164 numbers
 * we store in Firestore (e.g. +923001234567).
 *
 * NOTE: We do NOT change Firestore schema or auth logic here.
 * This helper is ONLY for matching device contacts against Firestore.
 */
export const normalizePhoneNumberForMatch = (
  rawPhone: string | null | undefined,
  currentUserPhone?: string | null
): string | null => {
  if (!rawPhone) {
    return null;
  }

  // Remove spaces, dashes, brackets etc.
  let cleaned = rawPhone.replace(/[\s\-().]/g, '');

  // If it already starts with + and digits, keep it (basic E.164-style)
  if (cleaned.startsWith('+')) {
    cleaned = '+' + cleaned.slice(1).replace(/\D/g, '');
    return cleaned.length > 3 ? cleaned : null;
  }

  // If we have the current user's phone in E.164, try to reuse its country code
  let countryPrefix: string | null = null;
  if (currentUserPhone && currentUserPhone.startsWith('+')) {
    const match = currentUserPhone.match(/^\+\d{1,3}/);
    if (match) {
      countryPrefix = match[0];
    }
  }

  // Strip all non-digits
  cleaned = cleaned.replace(/\D/g, '');

  if (!cleaned) {
    return null;
  }

  // Remove leading 0 for local numbers (common pattern)
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  if (countryPrefix) {
    return `${countryPrefix}${cleaned}`;
  }

  // Fallback: if we cannot infer country, just prefix +
  return `+${cleaned}`;
};

const requestContactsPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'WhatsApp clone needs access to your contacts to show who is on WhatsApp.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log('[contactService] Error requesting contacts permission:', (error as any)?.message);
      return false;
    }
  }

  // iOS – use react-native-contacts helpers
  try {
    const permission = await Contacts.checkPermission();
    if (permission === 'authorized') {
      return true;
    }
    if (permission === 'denied') {
      return false;
    }
    const req = await Contacts.requestPermission();
    return req === 'authorized';
  } catch (error) {
    console.log('[contactService] iOS contacts permission error:', (error as any)?.message);
    return false;
  }
};

/**
 * Fetch device contacts and match them against Firestore users collection.
 * Only returns contacts that are both:
 *  - Present in device contacts
 *  - Registered in Firestore (users collection)
 */
export const getWhatsAppContacts = async (
  currentUserUid: string | null | undefined,
  currentUserPhone?: string | null
): Promise<ContactFetchResult> => {
  const hasPermission = await requestContactsPermission();

  if (!hasPermission) {
    console.log('[contactService] Contacts permission denied');
    return { contacts: [], permissionDenied: true };
  }

  try {
    const rawContacts: RNContact[] = await Contacts.getAllWithoutPhotos();

    const phoneToNameMap: Record<string, string> = {};
    const normalizedPhones: Set<string> = new Set();

    rawContacts.forEach(contact => {
      const displayName =
        contact.displayName ||
        `${contact.givenName || ''} ${contact.familyName || ''}`.trim() ||
        'Unknown';

      (contact.phoneNumbers || []).forEach(phoneEntry => {
        const normalized = normalizePhoneNumberForMatch(
          phoneEntry.number,
          currentUserPhone
        );
        if (normalized) {
          normalizedPhones.add(normalized);
          // Prefer the first encountered name for this phone
          if (!phoneToNameMap[normalized]) {
            phoneToNameMap[normalized] = displayName;
          }
        }
      });
    });

    const phones = Array.from(normalizedPhones);
    if (phones.length === 0) {
      return { contacts: [], permissionDenied: false };
    }

    const db = firestore();
    const results: WhatsAppContact[] = [];

    // Firestore `in` queries are limited to 10 items per query
    const batchSize = 10;
    for (let i = 0; i < phones.length; i += batchSize) {
      const batch = phones.slice(i, i + batchSize);
      const snapshot = await db
        .collection('users')
        .where('phoneNumber', 'in', batch)
        .get();

      snapshot.forEach(doc => {
        const data = doc.data() as Partial<UserData> & { name?: string };
        const uid = doc.id;

        // Skip current user here – they are handled as a dedicated \"My Number\" entry
        if (currentUserUid && uid === currentUserUid) {
          return;
        }

        const phoneNumber = data.phoneNumber || '';
        const contactName =
          phoneToNameMap[phoneNumber] ||
          data.name ||
          data.phoneNumber ||
          'Unknown';

        results.push({
          uid,
          name: contactName,
          phoneNumber,
        });
      });
    }

    // Sort alphabetically by name
    results.sort((a, b) => a.name.localeCompare(b.name));

    return { contacts: results, permissionDenied: false };
  } catch (error) {
    console.log('[contactService] Error fetching contacts:', (error as any)?.message);
    return { contacts: [], permissionDenied: false };
  }
};

