import { Client, ClientConfig, MessageAPIResponseBase, TextMessage, WebhookEvent } from "@line/bot-sdk";
import { gptReply } from "./gptReply";

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || 'copy_paste_here',
  channelSecret: process.env.CHANNEL_SECRET || 'copy_paste_here',
};
const client = new Client(clientConfig);

export const createFish = async (userId:string, replyToken: string, text: string) => {
  console.log('createFish');
}

export const growUpFish = async (userId:string, replyToken: string, text: string) => {
  const evaluateResult = await gptReply(text);
  const replyMessage = 'あなたの言葉でししゃもは強く育ちました。\n侵略者と戦いましょう'; // カルーセルで釣り人とまぐろ漁船を選ばせる

  const response: TextMessage = {
    type: 'text',
    text: replyMessage
  };

  await client.replyMessage(replyToken, response);
}

export const struggleToInvader = async (userId:string, replyToken: string, text: string) => {
  console.log('struggleToInvader');
  switch (text) {
    case '釣り人':
      console.log("釣り人と戦います");
      break;
    case 'まぐろ漁船':
      console.log("まぐろ漁船と戦います");
      break;
    default:
      console.log("不明なエラーです");
      break;
  }
}

export const rebirthFish = async (userId:string, replyToken: string, text: string) => {
  console.log('rebirthFish');
}