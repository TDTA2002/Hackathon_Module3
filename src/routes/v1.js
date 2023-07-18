import express from 'express';
const router = express.Router();

import userModule from './modules/user.module'
router.use('/users', userModule)

import meoModule from './modules/meo.module'
router.use('/meos', meoModule)

module.exports = router;