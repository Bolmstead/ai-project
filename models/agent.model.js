import { Schema, model } from "mongoose";

const agentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    traits: [
      {
        type: String,
        trim: true,
      },
    ],
    preferences: [
      {
        type: String,
        trim: true,
      },
    ],
    memory: [
      {
        type: String,
        trim: true,
      },
    ],
    happiness: {
      type: Number,
      trim: true,
    },
    conversations: [
      {
        type: Schema.Types.ObjectId,
        ref: "conversation",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Agent", agentSchema);
