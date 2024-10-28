import express from 'express';
import userRoutes from './userRoutes';
import symbolRoutes from './symbolRoutes';
import orderRoutes from './orderRoutes';
import orderbookRoutes from './orderbookRoutes';
import mintRoutes from './mintRoute';
import onrampRoutes from './onrampRoutes';
import balanceRoutes from './balanceRoutes';
import allbalancesRoutes from './allbalancesRoutes';
import automarket from './autoMarket'

const router = express.Router();

router.use('/user', userRoutes); 
router.use('/symbol',symbolRoutes);
router.use('/onramp',onrampRoutes);
router.use('/balance', balanceRoutes);
router.use('/balances', allbalancesRoutes)
router.use('/trade',mintRoutes)
router.use('/order', orderRoutes)  
router.use('/orderbook',orderbookRoutes);
router.use('/create', automarket);

export default router;