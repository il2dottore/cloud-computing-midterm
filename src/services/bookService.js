const { readConnection, writeConnection } = require('../config/database');
const { BookReadModel, BookWriteModel } = require('../models/Book');

class BookService {
  async getAllBooks() {
    if (readConnection.readyState === 1) {
      return await BookReadModel.find().sort({ createdAt: -1 }).lean();
    }
    if (writeConnection.readyState === 1) {
      return await BookWriteModel.find().sort({ createdAt: -1 }).lean();
    }
    return [];
  }

  async createBook(bookData) {
    const targetModel = writeConnection.readyState === 1 ? BookWriteModel : BookReadModel;
    const newBook = new targetModel(bookData);
    return await newBook.save();
  }

  async simulateUnauthorizedWrite(bookData) {
    const illegalBook = new BookReadModel(bookData);
    return await illegalBook.save();
  }
}

module.exports = new BookService();
