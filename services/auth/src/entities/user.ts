import '../util/extension';

import {
  AuthProvider,
  Exception,
  ExceptionCode,
  Policy,
  User,
  UserProfile,
} from '@coffee-hmm/common';
import DataLoader from 'dataloader';
import { getManager } from 'typeorm';
import { KoaContextState } from '../types/koa';

export const parseFirebaseSignInProvider = (
  firebaseSignInProvider: string
): AuthProvider => {
  switch (firebaseSignInProvider) {
    case 'google.com':
      return AuthProvider.google;
    case 'custom':
      return AuthProvider.custom;
    default:
      throw new Exception(
        ExceptionCode.notImplemented,
        `given sign in method is not supported. got: ${firebaseSignInProvider}`
      );
  }
};

export const createUserLoader = (state: KoaContextState) =>
  new DataLoader<string, User>(async (userIds) => {
    await state.connection();

    const normalized = await getManager()
      .createQueryBuilder(User, 'user')
      .whereInIds(userIds)
      .getMany()
      .then((users) => Array.normalize<User>(users, (user) => user.id));

    return userIds.map((id) => normalized[id]);
  });

export const createUserProfileLoader = (state: KoaContextState) =>
  new DataLoader<string, UserProfile>(async (userIds) => {
    await state.connection();

    const normalized = await getManager()
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .whereInIds(userIds)
      .getMany()
      .then((users) => Array.normalize<User>(users, (user) => user.id));

    return userIds.map((id) => normalized[id]?.profile);
  });

export const createUserPolicyLoader = (state: KoaContextState) =>
  new DataLoader<string, Policy>(async (userIds) => {
    await state.connection();

    const normalized = await getManager()
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.policy', 'policy')
      .whereInIds(userIds)
      .getMany()
      .then((users) => Array.normalize<User>(users, (user) => user.id));

    return userIds.map((id) => normalized[id]?.policy);
  });
