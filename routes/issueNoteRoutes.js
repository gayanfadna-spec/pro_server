const express = require('express');
const router = express.Router();
const { getIssueNotes, createIssueNote } = require('../controllers/issueNoteController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getIssueNotes)
    .post(protect, createIssueNote);

module.exports = router;
