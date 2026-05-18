const JournalModel = require("../models/journal.model");

const createJournalController = async (req, res) => {
  try {
    let { topicName, description, studyDuration, difficultyLevel } = req.body;

    if (!topicName || !description || !studyDuration || !difficultyLevel) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let isExisted = await JournalModel.findOne({
      topicName,
      user_id: req.user._id,
    });
    if (isExisted) {
      return res.status(409).json({
        success: false,
        message: "Topic Name already existed",
      });
    }
    let journal = await JournalModel.create({
      user_id: req.user._id,
      topicName,
      description,
      studyDuration,
      difficultyLevel,
    });

    return res.status(200).json({
      success: true,
      message: "Journal is saved successfully",
      journal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const updateJournalController = async (req, res) => {
  try {
    let journalId = req.params.journalId;

    const updateJournal = await JournalModel.findOneAndUpdate(
      { _id: journalId, user_id: req.user._id },
      req.body,
      { new: true },
    );

    if (!updateJournal) {
      return res.status(404).json({
        success: false,
        message: "Journal not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Journal updated successfully",
      updateJournal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteJournalController = async (req, res) => {
  try {
    let journalId = req.params.journalId;
    const deleted = await JournalModel.findOneAndDelete({
      _id: journalId,
      user_id: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Journal not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Journal is deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const getAllJournalController = async (req, res) => {
  try {
    let allJournals = await JournalModel.find({ user_id: req.user._id });

    return res.status(200).json({
      message: "All journal fetched successfully",
      journal: allJournals,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Internal server error",
      error,
    });
  }
};

const getSingleJournalController = async (req, res) => {
  try {
    let journalId = req.params.journalId;

    const journal = await JournalModel.findOne({
      _id: journalId,
      user_id: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Journal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Journal is fetched successfully",
      journal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const searchEntries = async (req, res) => {
  try {
    const { topic, difficulty, date } = req.query;

    let filter = { user_id: req.user._id };

    if (topic) {
      filter.topicName = {
        $regex: topic,
        $options: "i",
      };
    }

    if (difficulty) {
      filter.difficultyLevel = difficulty;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      filter.createdAt = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const entries = await JournalModel.find(filter);

    res.status(200).json({
      success: true,
      message: "Found",
      entries,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJournalController,
  updateJournalController,
  deleteJournalController,
  getAllJournalController,
  getSingleJournalController,
  searchEntries,
};