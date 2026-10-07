const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getHomePage.bind(bookController));

router.post('/books', bookController.createBook.bind(bookController));

router.post('/books/test-unauthorized-write', bookController.testLeastPrivilege.bind(bookController));

module.exports = router;
