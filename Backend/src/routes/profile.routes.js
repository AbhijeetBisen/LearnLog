const express=require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { getProfileController, updateProfileController, changePasswordController } = require('../controllers/profile.controller');

const router=express.Router()

router.get("/:id", authMiddleware, getProfileController);

router.put("/:id", authMiddleware, updateProfileController);

router.put("/:id/change-password", authMiddleware, changePasswordController);

module.exports=router