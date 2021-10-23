import axios, { AxiosInstance } from 'axios';
import SsmParameterStorage from '../ssm';

class SlackWebhookService {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create();
  }

  async send(message: AnyJson): Promise<void> {
    const webhookUrl = await SsmParameterStorage.get('SLACK_WEBHOOK_URL');
    return this.instance.post(webhookUrl, message);
  }
}

export default new SlackWebhookService();
