const express = require('express');
const router = express.Router();
const { getClubs, getClub, createClub, updateClub, deleteClub } = require('../controllers/clubController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getClubs);
router.get('/:id', getClub);
router.post('/', protect, authorize('admin'), createClub);
router.put('/:id', protect, authorize('admin'), updateClub);
router.delete('/:id', protect, authorize('admin'), deleteClub);

module.exports = router;
