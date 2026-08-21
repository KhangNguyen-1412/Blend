const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/summary', reportController.getReportSummary);
router.get('/export', reportController.exportCSV);
router.get('/export-excel', reportController.exportExcel);

module.exports = router;
