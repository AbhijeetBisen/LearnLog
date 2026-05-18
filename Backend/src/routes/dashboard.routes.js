const express = require("express");

const {
  totalJournalController,
  getTotalStudyHoursController,
  getRecentTopics,
  getProductivityOverview,
  getWeeklySummaryController,
} = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/getTotalJournal", totalJournalController);

router.get("/getTotalStudyHour", getTotalStudyHoursController);

router.get("/getRecentJournal", getRecentTopics);

router.get("/productivity", getProductivityOverview);

router.get("/weekly-summary", getWeeklySummaryController);

module.exports = router;
