import { Schema, model } from "mongoose";

const messagesSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      required: true,
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "conversation",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "agent",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Message", messagesSchema);
