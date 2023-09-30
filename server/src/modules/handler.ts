import { Client, ClientConfig, MessageAPIResponseBase, WebhookEvent } from "@line/bot-sdk";
import { createFish, growUpFish, rebirthFish, struggleToInvader } from "./lineFuncs";

export const textEventHandler = async (event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }
  const { userId } = event.source;
  const { replyToken } = event;
  const { text } = event.message;

  switch (text) {
    case '生み出す':
      createFish(userId, replyToken, text);
      break;
    case '釣り人':
    case 'まぐろ漁船':
      struggleToInvader(userId, replyToken, text);
      break;
    case '転生する':
      rebirthFish(userId, replyToken, text);
      break;
    default:
      growUpFish(userId, replyToken, text);
      break;
  }

}