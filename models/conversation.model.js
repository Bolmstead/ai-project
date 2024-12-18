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
        type: Schema.Types.ObjectId,
        ref: "message",
      },
    ],
    recentMessages: [
      {
        content: {
          type: String,
          required: true,
        },
        from: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Assignment", conversationSchema);
