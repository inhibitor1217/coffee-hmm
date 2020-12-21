import firebase from 'firebase';
import firebaseAdmin from 'firebase-admin';
import { appStage, env } from '.';
import { AppStage } from '../types/env';

export const firebaseProjectName = (): string =>
  `${env('APP_NAME')}-${env('APP_STAGE')}`;

export const initializeFirebaseAdmin = () => {
  if (firebaseAdmin.apps.length > 0) {
    return;
  }

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
    databaseURL: `https://${firebaseProjectName()}.firebaseio.com`,
  });
};

const firebaseConfigurations = {
  local: {
    apiKey: 'AIzaSyBmgGtUXirbO8dOepUiAdOwoXTenwzKpuc',
    authDomain: 'coffee-hmm-auth-local.firebaseapp.com',
    projectId: 'coffee-hmm-auth-local',
    storageBucket: 'coffee-hmm-auth-local.appspot.com',
    messagingSenderId: '1052599771060',
    appId: '1:1052599771060:web:b3746156d360c970505ce1',
  },
};

export const initializeFirebase = () => {
  if (firebase.apps.length > 0) {
    return;
  }

  switch (appStage()) {
    case AppStage.local:
      firebase.initializeApp(firebaseConfigurations.local);
      break;
    default:
      break;
  }
};
