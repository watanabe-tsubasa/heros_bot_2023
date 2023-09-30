type RecordNumber = {
  type: "RECORD_NUMBER";
  value: string;
};

type ModifierOrCreator = {
  type: "MODIFIER" | "CREATOR";
  value: {
    code: string;
    name: string;
  };
};

type NumberField = {
  type: "NUMBER";
  value: string;
};

type RadioButton = {
  type: "RADIO_BUTTON";
  value: string; // or boolean, if you prefer and ensure boolean values are provided
};

type FileField = {
  type: "FILE";
  value: any[]; // If possible, specify a more precise type instead of 'any'
};

type RevisionOrId = {
  type: "__REVISION__" | "__ID__";
  value: string;
};

type SingleLineText = {
  type: "SINGLE_LINE_TEXT";
  value: string;
};

type UpdatedOrCreatedTime = {
  type: "UPDATED_TIME" | "CREATED_TIME";
  value: string;
};

type Calc = {
  type: "CALC";
  value: string;
};

type kintoneRecordTypes = {
  "レコード番号": RecordNumber;
  "更新者": ModifierOrCreator;
  "作成者": ModifierOrCreator;
  intenseActions: NumberField;
  isTrained: RadioButton;
  impactOnSurroundings: NumberField;
  avatar: FileField;
  $revision: RevisionOrId;
  userName: SingleLineText;
  userId: SingleLineText;
  "更新日時": UpdatedOrCreatedTime;
  isBattled: RadioButton;
  powerfulVoiceOrSound: NumberField;
  totalParams: Calc;
  overwhelmingPresence: NumberField;
  auraOfAwe: NumberField;
  rebirthCount: NumberField;
  "作成日時": UpdatedOrCreatedTime;
  $id: RevisionOrId;
};

export default kintoneRecordTypes;