const express = require('express');
const EventCtrl = require('../controllers/event.controller');

const router = express.Router();

router.get('/', EventCtrl.getAllEvents);
router.get('/:id', EventCtrl.getEvent);

module.exports = router;
