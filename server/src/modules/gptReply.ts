import { OpenAI } from "openai";
import { systemPrompt } from "../utils/systemPrompt";
import { gptFunc } from "../utils/gptFunc";
import gptResult from "../utils/types/gptTypes";

export const gptReply = async (userMessage:string): Promise<gptResult> => {
  const openai = new OpenAI();
  const completion = await openai.chat.completions.create({
    messages: [
      {
          role: "system",
          content: systemPrompt
      },
      {
          role: "user",
          content: userMessage
      },
    ],
    functions: gptFunc,
    function_call: "auto",
    model: "gpt-3.5-turbo-0613",
  });

  const resultJsonString: string = completion.choices[0].finish_reason === "function_call"
  ? completion.choices[0].message.function_call!.arguments
  : "{\n  \"overwhelmingPresence\": 2,\n  \"powerfulVoiceOrSound\": 2,\n  \"intenseActions\": 2,\n  \"auraOfAwe\": 2,\n  \"impactOnSurroundings\": 2\n}"

  const parsedResult: gptResult = JSON.parse(resultJsonString);
  return parsedResult
}