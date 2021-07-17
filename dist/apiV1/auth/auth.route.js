"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const user = express_1.Router();
const controller = new auth_controller_1.default();
// Setup New User
user.post('/userSetup', controller.userSetup);
exports.default = user;
//# sourceMappingURL=auth.route.js.map