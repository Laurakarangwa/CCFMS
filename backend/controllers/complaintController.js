const Complaint = require('../models/Complaint');
const { findSimilarComplaints } = require('../utils/duplicateCheck');
const { notifyStatusChange } = require('../utils/notifications');

async function create(req, res) {
  try {
    const { 
      category, 
      location, 
      description, 
      attachments,
      phoneNumber,
      district,
      sector,
      cell,
      village,
      incidentDate,
      urgencyLevel,
      gpsCoordinates,
      preferredContactMethod
    } = req.body;
    
    if (!category || !location || !description) {
      return res.status(400).json({ message: 'Category, location and description are required' });
    }
    
    const complaint = await Complaint.create({
      citizenId: req.user.id,
      category,
      location,
      description,
      attachments: attachments || [],
      phoneNumber,
      district,
      sector,
      cell,
      village,
      incidentDate,
      urgencyLevel,
      gpsCoordinates,
      preferredContactMethod
    });
    return res.status(201).json(complaint);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to create complaint' });
  }
}

async function checkDuplicate(req, res) {
  try {
    const { category, location } = req.query;
    if (!category || !location) return res.json({ similar: [] });
    const similar = await findSimilarComplaints(category, location);
    return res.json({ similar });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Duplicate check failed' });
  }
}

async function list(req, res) {
  try {
    console.log('=== COMPLAINTS LIST START ===');
    console.log('User role:', req.user.role);
    console.log('User ID:', req.user.id);
    console.log('User department ID:', req.user.department_id);
    console.log('Query params:', req.query);
    
    const filters = {};
    if (req.user.role === 'citizen') filters.citizenId = req.user.id;
    else if (req.user.role === 'officer' || req.user.role === 'supervisor') filters.assignedTo = req.user.id;
    else if (req.user.role === 'officer' && req.user.department_id) filters.departmentId = req.user.department_id;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.department_id) filters.departmentId = req.query.department_id;
    if (req.user.role === 'admin' || req.user.role === 'supervisor') {
      if (req.query.assigned_to) filters.assignedTo = req.query.assigned_to;
    }
    
    console.log('Final filters:', filters);
    
    const complaints = await Complaint.list(filters);
    console.log('Found complaints:', complaints.length);
    console.log('=== COMPLAINTS LIST END ===');
    
    return res.json(complaints);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to list complaints' });
  }
}

async function getById(req, res) {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (req.user.role === 'citizen' && complaint.citizen_id !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to view this complaint' });
    }
    return res.json(complaint);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to get complaint' });
  }
}

async function assign(req, res) {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    const { assigned_to, assigned_department_id } = req.body;
    const updated = await Complaint.assign(req.params.id, assigned_to, assigned_department_id);
    await notifyStatusChange(updated.reference_number, 'assigned', complaint.citizen_email);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Assign failed' });
  }
}

async function updateStatus(req, res) {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    const { status, resolution_notes } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    const valid = ['submitted', 'in_review', 'assigned', 'in_progress', 'resolved', 'closed', 'reopened'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const updated = await Complaint.updateStatus(req.params.id, status, resolution_notes);
    await notifyStatusChange(updated.reference_number, status, complaint.citizen_email);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Update failed' });
  }
}

module.exports = { create, checkDuplicate, list, getById, assign, updateStatus };
