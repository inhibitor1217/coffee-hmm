import Router from '@koa/router';
import { Context } from 'koa';
import { KoaContextState } from '../../types/koa';
import * as policyControl from './policy.control';

const policy = new Router<KoaContextState, Context>();

policy.post('/', policyControl.postPolicy);
policy.get('/count', policyControl.getPolicyCount);
policy.get('/list', policyControl.getPolicyList);
policy.get('/:policyId', policyControl.getSinglePolicy);
policy.put('/:policyId', policyControl.putPolicy);
policy.delete('/:policyId', policyControl.deletePolicy);

export default policy;
