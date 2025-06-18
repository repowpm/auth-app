"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Rutas públicas
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
// Rutas protegidas
router.get('/profile', auth_middleware_1.authMiddleware, auth_controller_1.getProfile);
exports.default = router;
