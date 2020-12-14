/* eslint-disable no-console */
import firebase from 'firebase';
import firebaseAdmin from 'firebase-admin';
import { env } from '../util';

const firebaseProjectName = `${env('APP_NAME')}-${env('APP_STAGE')}`;

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
  databaseURL: `https://${firebaseProjectName}.firebaseio.com`,
});

const localFirebaseConfiguration = {
  apiKey: 'AIzaSyBmgGtUXirbO8dOepUiAdOwoXTenwzKpuc',
  authDomain: 'coffee-hmm-auth-local.firebaseapp.com',
  projectId: 'coffee-hmm-auth-local',
  storageBucket: 'coffee-hmm-auth-local.appspot.com',
  messagingSenderId: '1052599771060',
  appId: '1:1052599771060:web:b3746156d360c970505ce1',
};

firebase.initializeApp(localFirebaseConfiguration);

firebaseAdmin
  .auth()
  .createCustomToken(env('USER_ID'))
  .then((token) => firebase.auth().signInWithCustomToken(token))
  .then((credential) => credential.user?.getIdToken())
  .then((idToken) => console.log(idToken))
  .catch((err) => console.error('Error creating custom token:', err));
