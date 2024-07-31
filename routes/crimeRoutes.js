const express = require("express");
const router = express.Router();
const {
  getCrimeCountByDistrict,
  getCrimeCountByAgeGroup,
  getTotalCrimeIncidents,
  getMonthlyCrimeIncidents,
  getCrimeCountByType,
  getCrimeCountByTransport,
  getOverallCrimeRate,
  predict,
} = require("../controllers/crimeController");

// Route to get crime count by district
router.get("/crime-count-by-district", getCrimeCountByDistrict);

// Route to get crime count by age group
router.get("/crime-count-by-age-group", getCrimeCountByAgeGroup);

// Route to get total number of crime incidents
router.get("/total-crime-incidents", getTotalCrimeIncidents);

// Route to get crime incidents for the current month
router.get("/monthly-crime-incidents", getMonthlyCrimeIncidents);

// Route to get crime count by type
router.get("/crime-count-by-type", getCrimeCountByType);

// Route to get crime count by transport mode
router.get("/crime-count-by-transport", getCrimeCountByTransport);

// Route to get overall crime rate for Karachi
router.get("/overall-crime-rate", getOverallCrimeRate);

// Route to handle predictions
router.get("/predict", predict);

module.exports = router;
