import { Client, ClientConfig, ImageMessage, TemplateMessage, TextMessage } from "@line/bot-sdk";
import { gptReply } from "./gptReply";
import { deleteData, finishCycle, getIsBattled, getIsTrained, getParams, setInitialData, toNextCycle, updateParams } from "./kintoneFunc";

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || 'copy_paste_here',
  channelSecret: process.env.CHANNEL_SECRET || 'copy_paste_here',
};
const client = new Client(clientConfig);

export const createFish = async (userId:string, replyToken: string, text: string) => {

  // kintone上にデータを作成し、全初期ステータスが0のデータを作り、ししゃもの絵を描く
  const { displayName } = await client.getProfile(userId);
  await setInitialData(userId, displayName);
  const response: TextMessage = {
    type: 'text',
    text: '育成するししゃもが生成されました\n泣く子も黙る言葉をかけてししゃもを強くしましょう'
  };
  await client.replyMessage(replyToken, response)
}

export const growUpFish = async (userId:string, replyToken: string, text: string) => {
  const isTrained = await getIsTrained(userId);
  let replyMessage: string;
  if(isTrained) {
    replyMessage = '侵略者が迫っています。戦ってください';
  } else {
    const evaluateResult = await gptReply(text);
    const {
      overwhelmingPresence,
      powerfulVoiceOrSound,
      intenseActions,
      auraOfAwe,
      impactOnSurroundings,
    } = evaluateResult;
    await updateParams(
      userId, 
      overwhelmingPresence,
      powerfulVoiceOrSound,
      intenseActions,
      auraOfAwe,
      impactOnSurroundings,
    );
    replyMessage = 'あなたの言葉でししゃもは強く育ちました。\n侵略者と戦いましょう';
  }

  const response: TextMessage = {
    type: 'text',
    text: replyMessage
  };
  await client.replyMessage(replyToken, response);

  // 釣り人とマグロ漁船のカルーセル
  const carousel: TemplateMessage = {
    "type": "template",
    "altText": "侵略者：釣り人かまぐろ漁船か",
    "template": {
      "type": "carousel",
      "columns": [
        {
          "thumbnailImageUrl": "https://i.gyazo.com/988757b44def91ae63b7b9cecc75994c.png",
          "imageBackgroundColor": "#FFFFFF",
          "title": "釣り人",
          "text": "冷酷なる侵略者",
          "defaultAction": {
            "type": "message",
            "label": "戦う",
            "text": "釣り人"
          },
          "actions": [
            {
              "type": "message",
              "label": "戦う",
              "text": "釣り人"
            },
          ]
        },
        {
          "thumbnailImageUrl": "https://i.gyazo.com/b37fabcf58b6b12bb915df04362f6920.png",
          "imageBackgroundColor": "#000000",
          "title": "まぐろ漁船",
          "text": "今日も大漁",
          "defaultAction": {
            "type": "message",
            "label": "戦う",
            "text": "まぐろ漁船"
          },
          "actions": [
            {
              "type": "message",
              "label": "戦う",
              "text": "釣り人"
            },
          ]
        }
      ],
      "imageAspectRatio": "rectangle",
      "imageSize": "cover"
    }
  }
  await client.pushMessage(userId, carousel);
}

export const struggleToInvader = async (userId:string, replyToken: string, text: string) => {

  const params = await getParams(userId);
  const {
    overwhelmingPresence,
    powerfulVoiceOrSound,
    intenseActions,
    auraOfAwe,
    impactOnSurroundings,
    rebirthCount,
  } = params;
  const totalParams = overwhelmingPresence + powerfulVoiceOrSound + intenseActions + auraOfAwe + impactOnSurroundings;
  const sendLooseResult = async (id: string) => {
    const carousel: TemplateMessage = {
      "type": "template",
      "altText": "敗北",
      "template": {
        "type": "carousel",
        "columns": [
          {
            "thumbnailImageUrl": "https://i.gyazo.com/0cc02757ac69510186fb9e76b0618e0d.jpg",
            "imageBackgroundColor": "#FFFFFF",
            "title": "ご馳走様でした",
            "text": "あなたの負け",
            "defaultAction": {
              "type": "message",
              "label": "転生する",
              "text": "転生する"
            },
            "actions": [
              {
                "type": "message",
                "label": "転生する",
                "text": "転生する"
              },
            ]
          },
        ],
        "imageAspectRatio": "square",
        "imageSize": "cover"
      }
    }
    await client.pushMessage(id, carousel)
  };

  const replyMessage = `${text}と戦います`;
  const response: TextMessage = {
    type: 'text',
    text: replyMessage
  };

  switch (text) {
    case '釣り人':
      await client.replyMessage(replyToken, response);
      if (totalParams > 35 * (rebirthCount + 1)) {
        await finishCycle(userId);
        const message: TextMessage[] = [
          {
            "type": "text",
            "text": "釣り人を血祭りに上げました"
          },
          {
            "type": "text",
            "text": "お疲れ様でした。転生して次の世代に能力を引き継いでいきましょう"
          },
        ]
        await client.pushMessage(userId, message)
      } else {
        await deleteData(userId);
        await sendLooseResult(userId);
      }
      break;
    case 'まぐろ漁船':
      await client.replyMessage(replyToken, response);
      if (totalParams > 500) {
        await finishCycle(userId);
        await updateParams(userId, 50, 50, 50, 50, 50,);
        const message: TextMessage = {
          "type": "text",
          "text": "おめでとうございます。まぐろ漁船を沈めました。引き続き海を守りましょう"
        }
        await client.pushMessage(userId, message)
      } else {
        await deleteData(userId);
        await sendLooseResult(userId);
      }
      break;
    default:
      console.log("不明なエラーです");
      break;
    }
}

export const rebirthFish = async (userId:string, replyToken: string, text: string) => {
  
  const isTrained = await getIsTrained(userId);
  const isBattled = await getIsBattled(userId);

  let pushMessage: string;
  if (isTrained&&isBattled) {
    await toNextCycle(userId);
    const ImageResponse: ImageMessage = {
      type: 'image',
      originalContentUrl: 'https://i.gyazo.com/becf3530a425ca0645bdfa8d75971b09.png',
      previewImageUrl: 'https://i.gyazo.com/becf3530a425ca0645bdfa8d75971b09.png',
    };
  
    await client.replyMessage(replyToken, ImageResponse);
    pushMessage = '生き残ったししゃもはたくさんの卵を残し、次の世代に力を引き継ぎました\nまた泣く子も黙る言葉をかけて、ししゃもを強く育てましょう'; //ステータスによって、9,000-13,000個の卵を表示
  } else {
    pushMessage = 'ししゃもにはまだやることが残っています。転生するときではありません'
  }

  const response: TextMessage = {
    type: 'text',
    text: pushMessage
  };

  await client.pushMessage(userId, response);
}