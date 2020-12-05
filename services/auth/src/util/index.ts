export const env = (key: string): string => {
  const maybeEnv = process.env[key];

  if (!maybeEnv) {
    throw Error(`environment variable ${key} is not set`);
  }
  return maybeEnv;
};

export const buildString = () =>
  `${env('APP_NAME')}@${env('APP_VERSION')}-${env('APP_STAGE')}`;
