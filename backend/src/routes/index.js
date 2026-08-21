const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const statsRoutes = require('./statsRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const customerRoutes = require('./customerRoutes');
const promotionRoutes = require('./promotionRoutes');
const staffRoutes = require('./staffRoutes');
const reportRoutes = require('./reportRoutes');
const reservationRoutes = require('./reservationRoutes');
const supplierRoutes = require('./supplierRoutes');
const articleRoutes = require('./articleRoutes');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/stats', statsRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/customers', customerRoutes);
router.use('/promotions', promotionRoutes);
router.use('/staff', staffRoutes);
router.use('/reports', reportRoutes);
router.use('/reservations', reservationRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/articles', articleRoutes);

module.exports = router;
