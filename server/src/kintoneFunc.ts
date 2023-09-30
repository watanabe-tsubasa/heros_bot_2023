import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import kintoneRecordTypes from './utils/types/kintoneRecordTypes';
import gptResult from './utils/types/gptTypes';

const { KINTONE_API_TOKEN, KINTONE_SUB_DOMAIN, KINETONE_APP_ID } = process.env;

const client = new KintoneRestAPIClient({
  baseUrl: `https://${KINTONE_SUB_DOMAIN}.cybozu.com`,
  auth: {
    apiToken: KINTONE_API_TOKEN
  }
});
const app = KINETONE_APP_ID;

export const getAllRecords = async (): Promise<kintoneRecordTypes[]> => {
  try {
    const res = await client.record.getAllRecords({
      app: app
    });
    console.log(res);
    return res as kintoneRecordTypes[];
  } catch(err) {
    console.log(err);
  };
};

export const isExistId = async (id: string): Promise<boolean> => {
  try {
    const res = await client.record.getAllRecords({
      app: app
    });
    const filteredRes = res.filter(elem => elem.userId.value === id)
    if (filteredRes.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch(err) {
    console.log(err);
  };
};

export const getSpecificIdRcord = async (id: string): Promise<kintoneRecordTypes[]> => {
  try {
    const res = await client.record.getAllRecords({
      app: app
    });
    const filteredRes = res.filter(elem => elem.userId.value === id)
    return filteredRes as kintoneRecordTypes[];
  } catch(err) {
    console.log(err);
  };
};

export const setInitialData = async (id: string, name: string) => {
  const record = {
    userId: { 
      value: id
    },
    userName: { 
      value: name
    },
  };

  try {
    const res = await client.record.addRecord({app, record});
    console.log(res)
  } catch(err) {
    console.error(err);
  };
};

export const updateParams = async (id: string, evaluateResult: gptResult) => {
  const {
    overwhelmingPresence,
    powerfulVoiceOrSound,
    intenseActions,
    auraOfAwe,
    impactOnSurroundings,
  } = evaluateResult;
  const specificRecords = await getSpecificIdRcord(id);

  const record = {
    overwhelmingPresence: {
      value: overwhelmingPresence + parseInt(specificRecords[0].overwhelmingPresence.value)
    },
    powerfulVoiceOrSound: {
      value: powerfulVoiceOrSound + parseInt(specificRecords[0].powerfulVoiceOrSound.value)
    },
    intenseActions: {
      value: intenseActions + parseInt(specificRecords[0].intenseActions.value)
    },
    auraOfAwe: {
      value: auraOfAwe + parseInt(specificRecords[0].auraOfAwe.value)
    },
    impactOnSurroundings: {
      value: impactOnSurroundings + parseInt(specificRecords[0].impactOnSurroundings.value)
    },
    isTrained: {
      value: 'true'
    },
  };

  try {
    const res = await client.record.updateRecord({
      app: app,
      id: specificRecords[0].$id.value,
      record: record
    });
    console.log(res);
  } catch(err) {
    console.error(err);
  };
};

export const deleteData = async(id: string) => {
  const specificRecords = await getSpecificIdRcord(id);
  try {
    await client.record.deleteRecords({app: app, ids: [specificRecords[0].$id.value]})
  } catch(err) {
    console.error(err);
  }
};

export const finishCycle = async (id: string) => {
  const specificRecords = await getSpecificIdRcord(id);

  const record = {
    isBattled: {
      value: 'true'
    },
  };

  try {
    const res = await client.record.updateRecord({
      app: app,
      id: specificRecords[0].$id.value,
      record: record
    });
    console.log(res);
  } catch(err) {
    console.error(err);
  };
};

export const toNextCycle = async (id: string) => {
  const specificRecords = await getSpecificIdRcord(id);

  const record = {
    isTrained: {
      value: 'false'
    },
    isBattled: {
      value: 'false'
    },
    rebirthCount: {
      value: parseInt(specificRecords[0].rebirthCount.value) + 1
    },
  };

  try {
    const res = await client.record.updateRecord({
      app: app,
      id: specificRecords[0].$id.value,
      record: record
    });
    console.log(res);
  } catch(err) {
    console.error(err);
  };
}