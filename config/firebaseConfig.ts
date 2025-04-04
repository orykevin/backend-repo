import * as admin from 'firebase-admin';
import path from 'path';

console.log(path.join(__dirname, 'config.json'))
const serviceAccountPath = path.join(__dirname, 'config.json');
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized using Service Account Key.');
} catch (error: any) {
  console.error('Error initializing Firebase Admin SDK with Service Account Key:', error.message);
  console.warn(`Ensure the service account key file exists at: ${serviceAccountPath}`);
}


if (!admin.apps.length) {
  console.warn(`Firebase not initiialized 
  `);
}

let db: admin.firestore.Firestore | null = null;
if (admin.apps.length > 0) {
  try {
    db = admin.firestore();
    console.log('Firestore instance obtained.');
  } catch (error) {
    console.error("Error obtaining Firestore instance:", error);
  }
} else {
  console.warn("Firestore instance could not be obtained because Firebase Admin SDK is not initialized.");
}


export { admin, db };
