const express = require('express');
const BuildCtrl = require('../controllers/buid.controller');

const router = express.Router();

router.get('/', BuildCtrl.getAllBuilds);
router.get('/:id', BuildCtrl.getBuild);
router.get('/:id/events', BuildCtrl.getBuildEvents);

module.exports = router;
