const Complaint = require('../models/Complaint');

async function findSimilarComplaints(category, location) {
  return Complaint.findSimilar(category, location, 5);
}

module.exports = { findSimilarComplaints };
