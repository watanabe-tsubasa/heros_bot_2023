
import { KintoneRestAPIClient } from '@kintone/rest-api-client';

const { KINTONE_API_TOKEN, KINTONE_SUB_DOMAIN, KINETONE_APP_ID } = process.env;

const client = new KintoneRestAPIClient({
  baseUrl: `https://${KINTONE_SUB_DOMAIN}.cybozu.com`,
  auth: {
    apiToken: KINTONE_API_TOKEN
  }
});

const main = async () => {
  const app = KINETONE_APP_ID;
  // const record = {
  //   text: {
  //     value: '追加したいテキスト'
  //   }
  // };

  // Add Record
  try {
    const res = await client.record.getAllRecords({
      app: app
    });
    console.log(res);
  } catch(err) {
    console.log(err);
  };
};

main();

