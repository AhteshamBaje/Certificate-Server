import express from 'express'
import registerApi from '../Controllers/RegisterController.js';

const registerRouter = express.Router();

registerRouter.post('/' , registerApi);


export default registerRouter;