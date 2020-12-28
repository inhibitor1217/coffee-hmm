import firebase from 'firebase';
import firebaseAdmin from 'firebase-admin';
import { initializeFirebase, initializeFirebaseAdmin } from '../util/firebase';

export const firebaseCustomIdToken = async (
  userId: string
): Promise<string> => {
  initializeFirebaseAdmin();
  initializeFirebase();

  const customToken = await firebaseAdmin.auth().createCustomToken(userId);
  const credential = await firebase.auth().signInWithCustomToken(customToken);

  if (!credential.user) {
    throw Error(`failed to sign in as custom user`);
  }

  return credential.user.getIdToken();
};
