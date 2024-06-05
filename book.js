/** Class representing a collection of books */
export default class Book {
  /** Initialize the book collection */
  constructor() {
    this.books = [];
  }

  /**
   * Creates a new book and adds it to the collection.
   * @param {object} book - The book details.
   * @param {string} book.title - The title of the book.
   * @param {string} book.author - The author of the book.
   * @param {number} book.isbn - The ISBN of the book.
   * @returns {object} The newly created book object.
   */
  create(book) {
    const newBook = { ...book, isAvailable: true };

    // Save book to database
    this.books.push(newBook);

    return newBook;
  }

  /**
   * Find a book by title or ISBN, or find books by author.
   * @param {object} query - The search query containing title, isbn, or author.
   * @param {string} [query.title] - The title of the book.
   * @param {number} [query.isbn] - The ISBN of the book.
   * @param {string} [query.author] - The author of the book.
   * @returns {object|object[]|null} The found book object, an array of books by the author, or null if no book is found.
   */
  findOneOrMany({ title, isbn, author }) {
    // Find book by title
    if (title) {
      const book = this.books.find((book) => book.title === title);
      return book;
    }

    // Find book by isbn
    if (isbn) {
      const book = this.books.find((book) => book.isbn === isbn);
      return book;
    }

    // Find book(s) by author
    if (author) {
      const books = this.books.filter((book) => book.author === author);
      return books;
    }

    return null;
  }

  /**
   * Delete a book from the collection by ISBN.
   * @param {number} isbn - The ISBN of the book to delete.
   * @returns {object} The deleted book.
   * @throws {Error} If the book is not found.
   */
  delete(isbn) {
    const removedBook = this.findOneOrMany({ isbn });

    if (!removedBook) {
      throw new Error('Book not found ');
    }
    // Delete book from database
    this.books = this.books.filter((book) => book.isbn !== isbn);

    return removedBook;
  }
}
