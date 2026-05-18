const JournalModel = require("../models/journal.model");

const totalJournalController = async (req, res) => {
  try {
    let user_id = req.user._id;

    let totalJournal = await JournalModel.find({ user_id });

    let count = totalJournal.length;

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTotalStudyHoursController = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await JournalModel.aggregate([
      {
        $match: {
          user_id: userId,
        },
      },
      {
        $group: {
          _id: null,
          totalHours: {
            $sum: "$studyDuration",
          },
        },
      },
    ]);

    res.status(200).json({
      totalStudyHours: result[0]?.totalHours || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRecentTopics = async (req, res) => {
  try {
    const recentTopics = await JournalModel.find({
      user_id: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      recentTopics,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProductivityOverview = async (req, res) => {
  try {
    const overview = await JournalModel.aggregate([
      {
        $match: {
          user_id: req.user._id,
        },
      },
      {
        $group: {
          _id: "$difficultyLevel",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      overview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWeeklySummaryController = async (req, res) => {
  try {
    const userId = req.user._id;

    const lastWeek = new Date();

    lastWeek.setDate(lastWeek.getDate() - 7);

    const summary = await JournalModel.aggregate([
      {
        $match: {
          user_id: userId,
          createdAt: {
            $gte: lastWeek,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalTopics: {
            $sum: 1,
          },
          totalHours: {
            $sum: "$studyDuration",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      weeklySummary: summary[0] || {
        totalTopics: 0,
        totalHours: 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  totalJournalController,
  getTotalStudyHoursController,
  getRecentTopics,
  getProductivityOverview,
  getWeeklySummaryController,
};
