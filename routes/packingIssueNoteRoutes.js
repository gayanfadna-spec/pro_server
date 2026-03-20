const express = require('express');
const router = express.Router();
const { getPackingIssueNotes, createPackingIssueNote } = require('../controllers/packingIssueNoteController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPackingIssueNotes)
    .post(protect, admin, createPackingIssueNote);

module.exports = router;
