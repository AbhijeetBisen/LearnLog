const express = require("express");
const {
  createJournalController,
  updateJournalController,
  deleteJournalController,
  getAllJournalController,
  getSingleJournalController,
  searchEntries,
} = require("../controllers/journal.controller");

const router = express.Router();

router.post("/create-journal", createJournalController);
router.put("/update-journal/:journalId", updateJournalController);
router.delete("/:journalId", deleteJournalController);
router.get("/allJournal", getAllJournalController);
router.get("/singleJournal/:journalId", getSingleJournalController);
router.get("/search", searchEntries);

module.exports = router;