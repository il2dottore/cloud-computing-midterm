const mongoose = require('mongoose');
const { readConnection, writeConnection } = require('../config/database');

const bookSchema = new mongoose.Schema(
  {
    bookCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'Chung',
      trim: true,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    vatPercent: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

const BookReadModel = readConnection.model('Book', bookSchema);
const BookWriteModel = writeConnection.model('Book', bookSchema);

module.exports = {
  bookSchema,
  BookReadModel,
  BookWriteModel,
};
