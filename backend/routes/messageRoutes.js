const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/threads', messageController.getThreads);
router.post('/threads', messageController.addThread);
router.get('/threads/:threadId/messages', messageController.getMessages);
router.post('/threads/:threadId/messages', messageController.addMessage);
router.put('/messages/:messageId/read', messageController.updateMessageRead);

module.exports = router;