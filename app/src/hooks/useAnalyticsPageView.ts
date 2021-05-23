import React from 'react';
import { useHistory } from 'react-router';
import firebase from 'firebase/app';
import 'firebase/analytics';
import { appStage, AppStage } from '../utils/function';

const appNames: { [key: string]: string } = {
  [AppStage.development]: 'coffee-hmm-local',
  [AppStage.production]: 'coffee-hmm',
};

export default function useAnalyticsPageView() {
  const history = useHistory();

  React.useEffect(() => {
    const analytics = firebase.apps[0]?.analytics();
    const appName = appNames[appStage()];

    analytics?.logEvent('screen_view', {
      app_name: appName,
      screen_name: history.location.pathname,
    });

    const cleanup = history.listen((location) => {
      analytics?.logEvent('screen_view', {
        app_name: appName,
        screen_name: location.pathname,
      });
    });

    return cleanup;
  }, [history]);
}