const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce.controller');

/** Sauce Routes */
router.get('/', sauceController.getAllSauces);
router.post('/', sauceController.createSauce);
router.get('/:id', sauceController.getOneSauce);
router.put('/:id', sauceController.modifySauce);
router.delete('/:id', sauceController.deleteSauce);
router.post('/:id/like', sauceController.ratingSauce);

module.exports = router;