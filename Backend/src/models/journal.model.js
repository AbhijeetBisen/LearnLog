const mongoose = require("mongoose");

let journalSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    topicName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    studyDuration: {
      type: Number,
      required: true,
    },

    difficultyLevel: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

journalSchema.index({
  topicName: "text",
});

let JournalModel = mongoose.model("Journal", journalSchema);

module.exports = JournalModel;
