import joi from 'joi';
import { getRepository } from 'typeorm';
import { HTTP_OK } from '../../const';
import Event, { EventCategory, EventName } from '../../entities/event';
import { VariablesMap } from '../../types/koa';
import { enumKeyStrings } from '../../util';
import Exception, { ExceptionCode } from '../../util/error';
import handler from '../handler';

export const create = handler<
  VariablesMap,
  VariablesMap,
  {
    category: EventCategory;
    name: EventName;
    label?: string;
    value?: string;
  }
>(
  async (ctx) => {
    if (!ctx.request.body) {
      throw new Exception(ExceptionCode.badRequest);
    }

    const { category, name, label, value } = ctx.request.body;

    await ctx.state.connection();

    const event = await getRepository(Event)
      .createQueryBuilder('event')
      .insert()
      .values({ category, name, label, value, userId: ctx.state.uid })
      .returning(Event.columns)
      .execute()
      .then((insertResult) =>
        Event.fromRawColumns((insertResult.raw as Record<string, unknown>[])[0])
      );

    ctx.status = HTTP_OK;
    ctx.body = {
      event: event.toJsonObject(),
    };
  },
  {
    schema: {
      body: joi
        .object()
        .keys({
          category: joi
            .string()
            .valid(...enumKeyStrings(EventCategory))
            .required(),
          name: joi
            .string()
            .valid(...enumKeyStrings(EventName))
            .required(),
          label: joi.string().min(1).max(255),
          value: joi.string().min(1).max(255),
        })
        .required(),
    },
  }
);
