const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.getAllInventory);
router.get('/dockets', inventoryController.getAllDockets);
router.post('/dockets', inventoryController.createDocket);
router.post('/', inventoryController.createInventoryItem);
router.put('/:id', inventoryController.updateStock);
router.delete('/:id', inventoryController.deleteInventoryItem);

module.exports = router;
