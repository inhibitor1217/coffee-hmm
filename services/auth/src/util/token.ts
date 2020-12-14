import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import { appStage, env } from '.';
import service from '../services';
import { AppStage } from '../types/env';

const issuer = (): string => `${env('APP_STAGE')}.auth.coffee-hmm.inhibitor.io`;
const secretKey = async (): Promise<string> =>
  appStage() === AppStage.local
    ? env('JWT_SECRET_KEY')
    : service().secret().get('JWT_SECRET_KEY');

export enum TokenSubject {
  accessToken = 'access_token',
}

export type TokenSubjectStrings = keyof typeof TokenSubject;

export const generateToken = async <T extends Record<string, unknown>>(
  payload: T,
  options?: SignOptions
): Promise<string> => {
  const jwtSecretKey = await secretKey();
  return new Promise((resolve, reject) => {
    sign(
      payload,
      jwtSecretKey,
      {
        ...options,
        issuer: issuer(),
      },
      (err, token) => {
        if (err || !token) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const verifyToken = async <T extends Record<string, unknown>>(
  token: string,
  options?: VerifyOptions
): Promise<T> => {
  const jwtSecretKey = await secretKey();
  return new Promise<T>((resolve, reject) => {
    verify(
      token,
      jwtSecretKey,
      {
        ...options,
        issuer: issuer(),
      },
      (err, payload) => {
        if (err || !payload) {
          reject(err);
        } else {
          resolve(payload as T);
        }
      }
    );
  });
};
