import { Policy } from '@coffee-hmm/common';
import DataLoader from 'dataloader';
import { getManager } from 'typeorm';
import { KoaContextState } from '../types/koa';

export const DEFAULT_USER_POLICY_NAME = 'DefaultUserPolicy';

export const createPolicyLoader = (state: KoaContextState) =>
  new DataLoader<string, Policy>(async (policyIds) => {
    await state.connection();

    const normalized = await getManager()
      .createQueryBuilder(Policy, 'policy')
      .whereInIds(policyIds)
      .getMany()
      .then((policies) =>
        Array.normalize<Policy>(policies, (policy) => policy.id)
      );

    return policyIds.map((id) => normalized[id]);
  });
