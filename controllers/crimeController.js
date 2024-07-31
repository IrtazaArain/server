const pool = require("../config/db");
const axios = require("axios");

const populationOfKarachi = process.env.POPULATION_OF_KARACHI || 20382881;

const getCrimeCountByDistrict = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT district, COUNT(*) as count
        FROM crime_data
        GROUP BY district
        ORDER BY district
      `);
    res.json(result.rows);
  } catch (err) {
    console.error("Server error", err.message);
    res.status(500).send("Server error");
  }
};

const getCrimeCountByAgeGroup = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        CASE
          WHEN age = '13-24 years' THEN '13-24 years'
          WHEN age = '25 years and above' THEN '25 years and above'
          ELSE 'Unknown'
        END as age_group, 
        COUNT(*) as count
      FROM crime_data
      GROUP BY age_group
      ORDER BY age_group;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Server error", err.message);
    res.status(500).send("Server error");
  }
};

const getTotalCrimeIncidents = async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) as total FROM crime_data");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Server error", err.message);
    res.status(500).send("Server error");
  }
};

const getMonthlyCrimeIncidents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as total 
      FROM crime_data 
      WHERE EXTRACT(MONTH FROM date::timestamp) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM date::timestamp) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Server error", err.message);
    res.status(500).send("Server error");
  }
};

const getCrimeCountByType = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT crime, COUNT(*) as count
        FROM crime_data
        GROUP BY crime
      `);
    res.json(result.rows);
  } catch (err) {
    console.error("Server error", err.message);
    res.status(500).send("Server error");
  }
};

const getCrimeCountByTransport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        CASE
          WHEN position('Car' in transport) > 0 THEN 'Car'
          WHEN position('Bike' in transport) > 0 THEN 'Bike'
          WHEN position('Public transportation' in transport) > 0 THEN 'Public transportation'
          ELSE 'Other'
        END as transport_mode, 
        COUNT(*) as count
      FROM crime_data
      GROUP BY transport_mode
      ORDER BY transport_mode;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Server error", err.message);
    res.status(500).send("Server error");
  }
};

const getOverallCrimeRate = async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) as total FROM crime_data");
    const totalCrimes = result.rows[0].total;
    const crimeRate = (totalCrimes / populationOfKarachi) * 100000;
    res.json({ crime_rate: crimeRate.toFixed(2) });
  } catch (err) {
    console.error("Server error", err.message);
    res.status(500).send("Server error");
  }
};

const predict = async (req, res) => {
  try {
    const response = await axios.get(process.env.MODEL_ENDPOINT);
    const predictions = response.data;

    if (Array.isArray(predictions)) {
      res.json({ predictions });
    } else {
      console.error("Unexpected response format:", predictions);
      res
        .status(500)
        .json({ error: "Unexpected response format from model endpoint" });
    }
  } catch (error) {
    if (error.response) {
      console.error(
        "Error fetching predictions:",
        error.response.status,
        error.response.statusText
      );
      console.error("Response data:", error.response.data);
      res.status(error.response.status).json({
        error: error.response.statusText,
        details: error.response.data,
      });
    } else if (error.request) {
      console.error("No response received:", error.request);
      res.status(500).json({
        error: "No response received from model endpoint",
        details: error.request,
      });
    } else {
      console.error("Error:", error.message);
      res
        .status(500)
        .json({ error: "Error fetching predictions", details: error.message });
    }
  }
};

module.exports = {
  getCrimeCountByDistrict,
  getCrimeCountByAgeGroup,
  getTotalCrimeIncidents,
  getMonthlyCrimeIncidents,
  getCrimeCountByType,
  getCrimeCountByTransport,
  getOverallCrimeRate,
  predict,
};
