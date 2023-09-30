export const gptFunc = [
  {
    "name": "evaluateMessage",
    "description": "The user's words are evaluated based on five criteria: overwhelming presence, powerful voice or sound, intense actions, aura of awe, and the impact on the surroundings.",
    "parameters": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
          "overwhelmingPresence": {
              "type": "integer",
              "minimum": 1,
              "maximum": 10,
              "description": "Rating for the overwhelming presence, considering size, appearance, and intense gaze, etc."
          },
          "powerfulVoiceOrSound": {
              "type": "integer",
              "minimum": 1,
              "maximum": 10,
              "description": "Rating for the powerful voice or sound, considering high volume screams, roars, or booming bass, etc."
          },
          "intenseActions": {
              "type": "integer",
              "minimum": 1,
              "maximum": 10,
              "description": "Rating for the dangerous actions, considering fast movements, aggressive postures, and unpredictable behaviors, etc."
          },
          "auraOfAwe": {
              "type": "integer",
              "minimum": 1,
              "maximum": 10,
              "description": "Rating for the aura that induces awe, considering if the environment or background emphasizes its presence or if it has a unique aura that distinguishes it from its surroundings."
          },
          "impactOnSurroundings": {
              "type": "integer",
              "minimum": 1,
              "maximum": 10,
              "description": "Rating for the reactions from the surroundings, considering whether other beings or people react with fear, hide, stay silent, or keep distance, etc."
          }
      },
      "required": [
          "OverwhelmingPresence",
          "PowerfulVoiceOrSound",
          "DangerousActions",
          "AuraOfAwe",
          "ReactionOfSurroundings"
      ]
    }
  }
];

