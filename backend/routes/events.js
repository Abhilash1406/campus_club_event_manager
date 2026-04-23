const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, authorize } = require('../middleware/auth');
const {
  getApprovedEvents,
  getEvent,
  createEvent,
  getOrganizerPendingEvents,
  getOrganizerAllEvents,
  organizerApproveEvent,
  organizerRejectEvent,
  getAdminPendingEvents,
  getAllEventsAdmin,
  adminApproveEvent,
  adminRejectEvent,
  getMyProposals,
  uploadCertificateTemplate
} = require('../controllers/eventController');

// Multer config for certificate template uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/certificates';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `template_${req.params.id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Public
router.get('/approved', getApprovedEvents);

// Student
router.get('/my-proposals', protect, authorize('student'), getMyProposals);
router.post('/', protect, authorize('student'), createEvent);

// Organizer
router.get('/organizer/pending', protect, authorize('organizer'), getOrganizerPendingEvents);
router.get('/organizer/all', protect, authorize('organizer'), getOrganizerAllEvents);
router.put('/:id/organizer-approve', protect, authorize('organizer'), organizerApproveEvent);
router.put('/:id/organizer-reject', protect, authorize('organizer'), organizerRejectEvent);
router.put('/:id/certificate-template', protect, authorize('organizer'), upload.single('template'), uploadCertificateTemplate);

// Admin
router.get('/admin/pending', protect, authorize('admin'), getAdminPendingEvents);
router.get('/admin/all', protect, authorize('admin'), getAllEventsAdmin);
router.put('/:id/admin-approve', protect, authorize('admin'), adminApproveEvent);
router.put('/:id/admin-reject', protect, authorize('admin'), adminRejectEvent);

// Public (must come after specific routes)
router.get('/:id', getEvent);

module.exports = router;
