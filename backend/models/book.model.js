import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
    },
    description:  {
        type: String,
        required: true,
    },
    category:  {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    linkAcquisto: {
        type: String,
        required: true,
    },
    linkDownload: {
        type: String,
        required: true,
    }
  }, {
    timestamps: true,
  });

  const Book = mongoose.model.Book || mongoose.model('Book', bookSchema);

  export default Book;