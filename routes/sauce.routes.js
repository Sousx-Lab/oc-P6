const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce.controller');
const auth = require('../middleware/security/auth');

/** Sauce Routes */
router.get('/', auth, sauceController.getAllSauces);
router.post('/', sauceController.createSauce);
router.get('/:id', auth, sauceController.getOneSauce);
router.put('/:id', auth, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.post('/:id/like', auth, sauceController.ratingSauce);

module.exports = router;