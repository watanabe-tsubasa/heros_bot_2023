import { Client, ClientConfig, MessageAPIResponseBase, TextMessage, WebhookEvent } from "@line/bot-sdk";
import { gptReply } from "./gptReply";


const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || 'copy_paste_here',
  channelSecret: process.env.CHANNEL_SECRET || 'copy_paste_here',
};
const client = new Client(clientConfig);

export const textEventHandler = async (event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }
  const { replyToken } = event;
  const { text } = event.message;
  console.log(text);
  const replyText = await gptReply(text);
  
  const response: TextMessage = {
    type: 'text',
    text: replyText
  };

  await client.replyMessage(replyToken, response);
}