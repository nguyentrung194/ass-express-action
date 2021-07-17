import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import apiV1 from './apiV1/index';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.setRoutes();
  }

  private setMiddlewares(): void {
    this.express.use(cors());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(helmet());
  }

  private setRoutes(): void {
    this.express.use('/v1', apiV1);
  }

}

export default new App().express;
