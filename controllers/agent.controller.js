import { ExpressError } from "../expressError.js";
import Agent from "../models/agent.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const openAIBearerToken = process.env.OPENAI_API_KEY;

async function sendMessage(convo, sender, message, receiver) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are having a conversation with another AI agent. Your personalities are: ${receiver.traits.join(
            ", "
          )} and the last 10 messages of the conversation are ${convo.recentMessages.toString()}`,
        },
        { role: "user", content: message },
      ],
    },
    {
      headers: { Authorization: `Bearer ${openAIBearerToken}` },
    }
  );

  // Store the response in memory
  //   memory[agent].push({
  //     role: "assistant",
  //     content: response.data.choices[0].message.content,
  //   });

  const returnedMessage = response.data.choices[0].message.content;
  if (returnedMessage) {
    const newMessage = new Message({
      sender: sender._id,
      content: returnedMessage,
      conversation: convo._id,
    });
    await newMessage.save();
    convo.messages.push(newMessage);
    if (convo.recentMessages.length > 10) {
      convo.recentMessages.shift({
        content: returnedMessage,
        from: receiver.name,
      });
    }
    convo.recentMessages.push({
      content: returnedMessage,
      from: receiver.name,
    });
    await convo.save();
    console.log(`From ${receiver.name}: `, returnedMessage);
  } else {
    return console.log("No returnedMessage found!");
  }
  setTimeout(async () => {
    // flip sender and receiver
    console.log("in Timeout");
    return await sendMessage(convo, receiver, returnedMessage, sender);
  }, 15000);
}

// Agent conversation flow
export async function agentConversation(req, res, next) {
  try {
    console.log("openAIBearerToken:: ", openAIBearerToken);

    const { senderName, receiverName, message } = req.body;
    if (!senderName || !receiverName || !message) {
      return console.log("Incomplete post body!!");
    }
    const sender = await Agent.findOne({ name: senderName });
    //   const memoryContext = memory[agent].map((msg) => ({
    //     role: msg.role,
    //     content: msg.content,
    //   }));
    if (!sender) {
      console.log("No Agent Found for ", senderName);
    } else {
      console.log("found sender");
    }
    const receiver = await Agent.findOne({ name: receiverName });
    //   const memoryContext = memory[agent].map((msg) => ({
    //     role: msg.role,
    //     content: msg.content,
    //   }));
    if (!receiver) {
      console.log("No Agent Found for ", receiverName);
    } else {
      console.log("found receiver");
    }

    const newConversation = new Conversation({
      participant1: sender._id,
      participant2: receiver._id,
      messages: [],
    });

    await newConversation.save();

    sender.conversations.push(newConversation);
    await sender.save();
    receiver.conversations.push(newConversation);
    await receiver.save();

    const newMessage = new Message({
      sender: sender._id,
      content: message,
      conversation: newConversation._id,
    });
    await newMessage.save();
    newConversation.messages.push(newMessage);
    newConversation.recentMessages.push({
      content: message,
      from: sender.name,
    });
    await newConversation.save();

    await sendMessage(newConversation, sender, message, receiver);
  } catch (error) {
    return next(error);
  }
}

export async function getAllAgents(req, res, next) {
  try {
    const Agents = await Agent.find();
    return res.json({ agents: Agents });
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

export async function createAgent(req, res, next) {
  try {
    // Extract parameters from the request body
    const { name, traits, preferences, happiness } = req.body;

    // Validate the required fields
    if (!name || !traits || !preferences || happiness === undefined) {
      return res.status(400).json({
        message:
          "Missing required fields: name, traits, preferences, or happiness",
      });
    }

    // Create a new agent
    const newAgent = new Agent({
      name,
      traits,
      preferences,
      happiness,
    });

    // Save the agent to the database
    const savedAgent = await newAgent.save();

    return res.status(201).json({
      message: "Agent created successfully",
      agent: savedAgent,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
