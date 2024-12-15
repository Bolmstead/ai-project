import axios from "axios";
import Agent from "../models/agent.model";

const openAIBearerToken = process.env.OPENAI_API_KEY;

// OpenAI API function
async function getResponse(agentName, message) {
  console.log("🚀 ~ getResponse ~ agentName, message:", agentName, message);
  const agent = await Agent.findOne({ name: agentName });
  console.log("🚀 ~ getResponse ~ agent:", agent);
  //   const memoryContext = memory[agent].map((msg) => ({
  //     role: msg.role,
  //     content: msg.content,
  //   }));

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI with the following personality: ${agent.traits.join(
            ", "
          )}`,
        },
        { role: "user", content: message },
      ],
    },
    {
      headers: { Authorization: `Bearer ${openAIBearerToken}` },
    }
  );
  console.log("🚀 ~ getResponse ~ response:", response);

  // Store the response in memory
  //   memory[agent].push({
  //     role: "assistant",
  //     content: response.data.choices[0].message.content,
  //   });

  return response.data.choices[0].message.content;
}

// Agent conversation flow
async function agentConversation(agent1Name, agent2Name) {
  console.log(
    "🚀 ~ agentConversation ~ agent1Name, agent2Name:",
    agent1Name,
    agent2Name
  );
  const agent1Message = "Hello! How are you feeling today?";

  const agent1Response = await getResponse(agent1Name, agent1Message);
  console.log(`Agent 1: ${agent1Response}`);

  //   updatePersonality("agent1", agent1Response);

  const agent2Response = await getResponse(agent2Name, agent1Response);
  console.log(`Agent 2: ${agent2Response}`);

  //   updatePersonality("agent2", agent2Response);
}

agentConversation("Helpful AI", "Grumpy AI");
