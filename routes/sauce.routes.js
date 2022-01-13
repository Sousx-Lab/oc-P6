const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce.controller');
const auth = require('../middleware/security/auth');
const multer = require('../middleware/multer/multer.config');

/** Sauce Routes */
router.get('/', auth, sauceController.getAllSauces);
router.post('/', auth, multer, sauceController.createSauce);
router.get('/:id', auth, sauceController.getOneSauce);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.post('/:id/like', auth, sauceController.ratingSauce);

module.exports = router;