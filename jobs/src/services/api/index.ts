import axios, { AxiosInstance } from 'axios';
import { CafeImageStateStrings, CafeStateStrings } from '@coffee-hmm/common';
import { env, logLevel } from '../../util';
import { Logger } from '../../util/logger';

type CafeRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  place: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    pinned: boolean;
  };
  metadata: AnyJson;
  state: CafeStateStrings;
  image: {
    count: number;
    list: {
      id: string;
      createdAt: string;
      updatedAt: string;
      cafeId: string;
      index: number;
      isMain: boolean;
      metadata: AnyJson;
      relativeUri: string;
      state: CafeImageStateStrings;
    }[];
  };
  views: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };
  numLikes: number;
};

class ApiService {
  private instance: AxiosInstance;

  private logger: Logger;

  constructor() {
    this.instance = axios.create({ baseURL: env('API_SERVICE') });
    this.logger = new Logger(logLevel());
  }

  async getAllCafes(): Promise<CafeRecord[]> {
    let cursor: string | undefined;
    const cafes: CafeRecord[] = [];

    do {
      // eslint-disable-next-line no-await-in-loop
      const [list, nextCursor] = await this.getCafes({ cursor });
      cafes.push(...list);
      cursor = nextCursor;
    } while (cursor !== undefined);

    return cafes;
  }

  private async getCafes({
    cursor,
  }: {
    cursor?: string;
  }): Promise<[CafeRecord[], string | undefined]> {
    const response = await this.instance.get<{
      cafe: {
        list: CafeRecord[];
      };
      cursor?: string;
    }>('/cafe/list', {
      params: { limit: 64, cursor },
    });

    const {
      cafe: { list },
      cursor: nextCursor,
    } = response.data;

    return [list, nextCursor];
  }
}

export default new ApiService();
