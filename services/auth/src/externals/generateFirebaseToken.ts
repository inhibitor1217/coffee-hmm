/* eslint-disable no-console */
import firebase from 'firebase';
import firebaseAdmin from 'firebase-admin';
import { env } from '../util';
import { initializeFirebase, initializeFirebaseAdmin } from '../util/firebase';

initializeFirebase();
initializeFirebaseAdmin();

firebaseAdmin
  .auth()
  .createCustomToken(env('USER_ID'))
  .then((token) => firebase.auth().signInWithCustomToken(token))
  .then((credential) => credential.user?.getIdToken())
  .then((idToken) => console.log(idToken))
  .catch((err) => console.error('Error creating custom token:', err));
