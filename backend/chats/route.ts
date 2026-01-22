/**
 * Chats Routes
 * Defines chat API endpoints
 */

import { Router } from 'express';
import { ChatsController } from './controller';

const router = Router();

// Get user's chats
router.get('/', ChatsController.getUserChats);

// Get chat by ID
router.get('/:chatId', ChatsController.getChatById);

// Create new chat
router.post('/', ChatsController.createChat);

export default router;
