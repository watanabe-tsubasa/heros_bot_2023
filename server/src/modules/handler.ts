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
  // console.log(text);
  const evaluateResult = await gptReply(text);
  const replyMessage = JSON.stringify(evaluateResult);

  const response: TextMessage = {
    type: 'text',
    text: replyMessage
  };

  await client.replyMessage(replyToken, response);
}