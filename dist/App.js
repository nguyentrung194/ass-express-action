"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const index_1 = require("./apiV1/index");
class App {
    constructor() {
        this.express = express();
        this.setMiddlewares();
        this.setRoutes();
    }
    setMiddlewares() {
        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(helmet());
    }
    setRoutes() {
        this.express.use('/v1', index_1.default);
    }
}
exports.default = new App().express;
//# sourceMappingURL=App.js.map