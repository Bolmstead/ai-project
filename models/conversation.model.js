import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    participant1: {
      type: Schema.Types.ObjectId,
      ref: "agent",
    },
    participant2: {
      type: Schema.Types.ObjectId,
      ref: "agent",
    },
    messages: [
      {
        type: "String",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Assignment", conversationSchema);
