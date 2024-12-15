const axios = require("axios");
dotenv.config();

const createAgent = async (personality) => {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "GPT-3.5",
      messages: [
        {
          role: "system",
          content: `You are an AI with the following personality: ${personality}`,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );
  return response.data;
};

createAgent("You're a curious and playful AI who loves exploring new ideas.");
