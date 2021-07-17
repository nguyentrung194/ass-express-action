"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("./auth/auth.route");
const router = express_1.Router();
router.use('/', auth_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map