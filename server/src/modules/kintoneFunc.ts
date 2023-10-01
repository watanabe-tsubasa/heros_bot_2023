import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import kintoneRecordTypes from '../utils/types/kintoneRecordTypes';
import gptResult from '../utils/types/gptTypes';

const { KINTONE_API_TOKEN, KINTONE_SUB_DOMAIN, KINETONE_APP_ID } = process.env;

const client = new KintoneRestAPIClient({
  baseUrl: `https://${KINTONE_SUB_DOMAIN}.cybozu.com`,
  auth: {
    apiToken: KINTONE_API_TOKEN
  }
});
const app = KINETONE_APP_ID;
const getNumberValue = (value: any): number => {
  if (typeof value === 'string') {
    return parseInt(value);
  }
  // Handle other types as per your use case, or throw an error if unexpected type is encountered.
  throw new Error('Unexpected value type for parsing to number.');
};

type extendGptResult = gptResult & {
  rebirthCount: number;
}

export const getAllRecords = async (): Promise<kintoneRecordTypes[]> => {
  try {
    const res = await client.record.getAllRecords({
      app: app
    });
    return res as kintoneRecordTypes[];
  } catch(err) {
    console.log(err);
    throw err;
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
    throw err;
  };
};

export const getIsExistId = async (id: string): Promise<boolean> => {
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
    throw err;
  };
};

export const getIsTrained = async (id: string): Promise<boolean> => {
  try {
    const res = await client.record.getAllRecords({
      app: app
    });
    const filteredRes = res.filter(elem => elem.userId.value === id)
    const { isTrained } = filteredRes[0];
    if (isTrained.value === 'true') {
      return true;
    } else {
      return false;
    }
  } catch(err) {
    console.log(err);
    throw err;
  };
};

export const getIsBattled = async (id: string): Promise<boolean> => {
  try {
    const res = await client.record.getAllRecords({
      app: app
    });
    const filteredRes = res.filter(elem => elem.userId.value === id)
    const { isBattled } = filteredRes[0];
    if (isBattled.value === 'true') {
      return true;
    } else {
      return false;
    }
  } catch(err) {
    console.log(err);
    throw err;
  };
};



export const getParams = async (id: string): Promise<extendGptResult> => {
  try {
    const res = await client.record.getAllRecords({
      app: app
    });
    const filteredRes = res.filter(elem => elem.userId.value === id)
    const {
      overwhelmingPresence,
      powerfulVoiceOrSound,
      intenseActions,
      auraOfAwe,
      impactOnSurroundings,
      rebirthCount
    } = filteredRes[0];

    const params = {
      overwhelmingPresence: getNumberValue(overwhelmingPresence.value),
      powerfulVoiceOrSound: getNumberValue(powerfulVoiceOrSound.value),
      intenseActions: getNumberValue(intenseActions.value),
      auraOfAwe: getNumberValue(auraOfAwe.value),
      impactOnSurroundings: getNumberValue(impactOnSurroundings.value),
      rebirthCount: getNumberValue(rebirthCount.value),
    };

    return params;

  } catch(err) {
    console.log(err);
    throw err;
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
    await client.record.addRecord({app, record});
  } catch(err) {
    console.error(err);
  };
};

export const updateParams = async (
  id: string,
  overwhelmingPresence: number,
  powerfulVoiceOrSound: number,
  intenseActions: number,
  auraOfAwe: number,
  impactOnSurroundings: number,
  ) => {
  
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
    await client.record.updateRecord({
      app: app,
      id: specificRecords[0].$id.value,
      record: record
    });
  } catch(err) {
    console.error(err);
    throw err;
  };
};

export const deleteData = async(id: string) => {
  const specificRecords = await getSpecificIdRcord(id);
  try {
    await client.record.deleteRecords({app: app, ids: [specificRecords[0].$id.value]})
  } catch(err) {
    console.error(err);
    throw err;
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
    await client.record.updateRecord({
      app: app,
      id: specificRecords[0].$id.value,
      record: record
    });
  } catch(err) {
    console.error(err);
    throw err;
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
    await client.record.updateRecord({
      app: app,
      id: specificRecords[0].$id.value,
      record: record
    });
  } catch(err) {
    console.error(err);
    throw err;
  };
}