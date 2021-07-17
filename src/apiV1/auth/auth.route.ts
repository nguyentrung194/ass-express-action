import { Router } from 'express';
import Controller from './auth.controller';

const user: Router = Router();
const controller = new Controller();

// Setup New User
user.post('/userSetup', controller.userSetup);

export default user;
