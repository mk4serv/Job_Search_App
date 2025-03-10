import { Router } from 'express';
import * as messageServices from './Services/message.services.js';
import { errorHandlerMiddleware } from '../../Middleware/error-handler.middleware.js';
import { authenticationMiddleware } from '../../Middleware/authentication.middleware.js';



const messageController = Router();

// ✅ Send Message
messageController.post("/send", authenticationMiddleware(), errorHandlerMiddleware(messageServices.sendMessageServices));

// ✅ Get Messages
messageController.get("/list", authenticationMiddleware(), errorHandlerMiddleware(messageServices.getMessagesServices));

// ✅ Get User Messages
messageController.get("/messages", authenticationMiddleware(), errorHandlerMiddleware(messageServices.getUserMessagesServices));

export default messageController;