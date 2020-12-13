import Joi from 'joi';
import { KoaRouteHandler, VariablesMap } from '../types/koa';
import Exception, { ExceptionCode } from '../util/error';
import handler from './handler';

export const register: KoaRouteHandler<
  VariablesMap,
  VariablesMap,
  {
    profile: {
      name: string;
      email?: string;
    };
    policy: {
      id?: string;
      name?: string;
      value?: string;
    };
  }
> = handler(
  () => {
    throw new Exception(ExceptionCode.notImplemented);
  },
  {
    schema: {
      body: Joi.object()
        .keys({
          profile: Joi.object()
            .keys({
              name: Joi.string().min(1).max(30).required(),
              email: Joi.string().email(),
            })
            .required(),
          policy: Joi.object()
            .keys({
              id: Joi.string().uuid({ version: 'uuidv4' }),
              name: Joi.string().min(1).max(30),
              value: Joi.string(),
            })
            .xor('id', 'name', 'value')
            .required(),
        })
        .required(),
    },
  }
);

export const token: KoaRouteHandler = handler(() => {
  throw new Exception(ExceptionCode.notImplemented);
});
