import { Client, ClientConfig, TextMessage } from "@line/bot-sdk";
import { gptReply } from "./gptReply";

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || 'copy_paste_here',
  channelSecret: process.env.CHANNEL_SECRET || 'copy_paste_here',
};
const client = new Client(clientConfig);

export const createFish = async (userId:string, replyToken: string, text: string) => {
  console.log('createFish');
  // kintone上にデータを作成し、全初期ステータスが0のデータを作り、ししゃもの絵を描く
  const { displayName } = await client.getProfile(userId);
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
  // （isTrained = false, isBattled = false, rebirthCount++）
  // database: （isTrained = trueのとき isBattled = true）
  console.log('struggleToInvader');
  switch (text) {
    case '釣り人':
      console.log("釣り人と戦います");
      // 5つのパラメーター合計が35以下の場合ししゃもフライとなって、データが初期化される
      break;
      case 'まぐろ漁船':
        console.log("まぐろ漁船と戦います");
        // 5つのパラメーター合計が45以下の場合ししゃもフライとなって、データが初期化される
        break;
        default:
          console.log("不明なエラーです");
          break;
        }
      }

export const rebirthFish = async (userId:string, replyToken: string, text: string) => {
  // database:（isTrained = true&&isBattled = true のとき isTrained = false, isBattled = false, rebirthCount++）にし、新たにししゃもの絵を描く
  console.log('rebirthFish');

  const replyMessage = '生き残ったししゃもはたくさんの卵を残し、次の世代に力を引き継ぎました'; //ステータスによって、9,000-13,000個の卵を表示

  const response: TextMessage = {
    type: 'text',
    text: replyMessage
  };

  await client.replyMessage(replyToken, response);
}