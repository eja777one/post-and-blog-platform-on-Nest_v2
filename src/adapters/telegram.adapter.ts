import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class TelegramAdapter {
  private axiosInstance: AxiosInstance;
  static url: string;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `https://api.telegram.org/bot${process.env.TG_TOKEN}`
    });
  }

  async sendMessage(text: string, recipientId: number) {
    await this.axiosInstance
      .post(`sendMessage`, { chat_id: recipientId, text: text });
  };

  async setWebhook(url: string) {
    TelegramAdapter.url = url;
    await this.axiosInstance.post(`setWebhook`, { url });
  };

  async echo() {
    await axios.post(process.env.BASE_URL + "/app/echo",
      { url: TelegramAdapter.url, baseUrl: process.env.BASE_URL, tgToken: process.env.TG_TOKEN });
  }
}