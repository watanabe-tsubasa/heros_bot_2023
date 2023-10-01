import { MessageAPIResponseBase, WebhookEvent } from "@line/bot-sdk";
import { createFish, growUpFish, rebirthFish, struggleToInvader } from "./lineFuncs";
import { getIsExistId } from "./kintoneFunc";

export const textEventHandler = async (event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }
  const { userId } = event.source;
  const { replyToken } = event;
  const { text } = event.message;
  const isExist = await getIsExistId(userId);

  if (isExist) {
    // userIdがkintone上に存在する場合
    switch (text) {
      case '転生する':
        rebirthFish(userId, replyToken, text);
        break;
      case '釣り人':
      case 'まぐろ漁船':
        struggleToInvader(userId, replyToken, text);
        break;
      default:
        growUpFish(userId, replyToken, text);
        break;
    }
  } else {
    // userIdがkintone上に存在しない場合
    createFish(userId, replyToken, text);
  }
}