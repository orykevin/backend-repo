import { db, admin } from '../config/firebaseConfig';
import { User, UserUpdateData } from '../entities/user';

const USERS_COLLECTION = 'USERS';

const getUsersCollection = () => {
  if (!db) {
    throw new Error('Firestore database instance is not available. Ensure Firebase Admin SDK is initialized.');
  }
  return db.collection(USERS_COLLECTION);
};

export const getUserData = async (userId: string) => {
  if (!db) throw new Error('db not found')
  const userRef = db.collection("USERS").doc(userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    return null;
  }

  const userData = userSnap.data();
  return userData;
};

export const updateUserData = async (userId: string, data: UserUpdateData): Promise<void> => {
  try {
    const userRef = getUsersCollection().doc(userId);
    let dataPayload: Partial<User> & { lastUpdated: admin.firestore.FieldValue } = {
      ...data,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    };

    const docSnap = await userRef.get();
    if (!docSnap.exists) {
      dataPayload.id = userId
      dataPayload.createdAt = admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp;
      console.log(`Creating new user document for ID: ${userId}`);
    } else {
      console.log(`Updating user document for ID: ${userId}`);
      delete dataPayload.createdAt;
    }

    await userRef.set(dataPayload, { merge: true });

    console.log(`User data successfully updated/created for ID: ${userId}`);
  } catch (error) {
    console.error(`Error updating user data for ID ${userId}:`, error);
    throw new Error('Failed to update user data in Firestore.'); // Re-throw for handling in controller
  }
};


export const createUserDocumentIfNotExists = async (userId: string, initialData: UserUpdateData): Promise<void> => {
  try {
    const userRef = getUsersCollection().doc(userId);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      const dataToCreate: Partial<User> = {
        ...initialData,
        id: userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
      };
      await userRef.set(dataToCreate);
      console.log(`Created initial user document for ID: ${userId}`);
    } else {
      console.log(`User document already exists for ID: ${userId}. No action taken by createUserDocumentIfNotExists.`);
    }
  } catch (error) {
    console.error(`Error checking/creating user document for ID ${userId}:`, error);
    throw new Error('Failed to ensure user document exists.');
  }
};
