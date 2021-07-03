import React from "react";
import firebase from "firebase/app";
import "firebase/analytics";

import { AppStage } from "constants/enums/appStage";
import { appStage } from "utils";

const firebaseConfigs: { [key: string]: Record<string, string> } = {
  [AppStage.development]: {
    apiKey: "AIzaSyBe2adS-ZG9va6ORXgoP_pVdwQUCXM6qws",
    authDomain: "coffee-hmm-local.firebaseapp.com",
    projectId: "coffee-hmm-local",
    storageBucket: "coffee-hmm-local.appspot.com",
    messagingSenderId: "346930037805",
    appId: "1:346930037805:web:3c7984139795ac251be4a4",
    measurementId: "G-BGLCSKH9C3",
  },
  [AppStage.production]: {
    apiKey: "AIzaSyCMawQrJEr80OXot8YXgHyW5E6vlmyYbDY",
    authDomain: "coffee-hmm.firebaseapp.com",
    databaseURL: "https://coffee-hmm.firebaseio.com",
    projectId: "coffee-hmm",
    storageBucket: "coffee-hmm.appspot.com",
    messagingSenderId: "550686323110",
    appId: "1:550686323110:web:65d336f96018b796ec9f67",
    measurementId: "G-TRVKD51ZBD",
  },
};

export default function useFirebase() {
  React.useEffect(() => {
    if (firebase.apps.length > 0) {
      /* App already initialized. (skip) */
      return;
    }

    const firebaseConfig = firebaseConfigs[appStage()];

    if (!firebaseConfig) {
      console.warn(
        "Invalid firebase configuration. Skipping firebase initialization ...",
      );
      return;
    }

    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }, []);
}
