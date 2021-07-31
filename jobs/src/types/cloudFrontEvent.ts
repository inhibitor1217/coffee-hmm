import type {
  CloudFrontRequestEvent,
  CloudFrontRequestResult,
  CloudFrontResponseEvent,
  CloudFrontResponseResult,
} from 'aws-lambda';
import type { EventContext } from './event';

export interface CloudFrontRequestEventContext extends EventContext {
  event: CloudFrontRequestEvent;
}

export interface CloudFrontResponseEventContext extends EventContext {
  event: CloudFrontResponseEvent;
}

export type CloudFrontRequestEventHandler = (
  context: CloudFrontRequestEventContext
) => Promise<{ result: CloudFrontRequestResult; body: AnyJson }>;

export type CloudFrontResponseEventHandler = (
  context: CloudFrontResponseEventContext
) => Promise<{ result: CloudFrontResponseResult; body: AnyJson }>;
