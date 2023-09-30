import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const image = await openai.images.generate({
    prompt: "A fierce smelt fish, shishamo",
    size: "256x256",
    response_format: "url"
  });

  console.log(image.data);
}
main();