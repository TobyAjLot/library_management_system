import User from './user.js';
import Book from './book.js';

/** Class representing a library */
export default class Library {
  /** Initialize a library */
  constructor() {
    this.user = new User();
    this.book = new Book();
  }

  /**
   * Adds a new book to the library.
   * @param {object} book - The book object to add.
   * @param {string} book.title - The title of the book.
   * @param {string} book.author - The author of the book.
   * @param {number} book.isbn - The ISBN of the book.
   * @returns {object} The newly added book.
   */
  addBook(book) {
    return this.book.create(book);
  }

  /**
   * Removes a book from the library by ISBN.
   * @param {number} isbn - The ISBN of the book to remove.
   * @returns {object} An object containing success status and the removed book.
   */
  removeBook(isbn) {
    const book = this.book.delete(isbn);
    return { success: true, removedBook: book };
  }

  /**
   * Searches for books in the library.
   * @param {object} query - The search query.
   * @param {string} [query.title] - The title of the book.
   * @param {string} [query.author] - The author of the book.
   * @param {number} [query.isbn] - The ISBN of the book.
   * @returns {object|array|null} The found book(s) or null if not found.
   */
  searchBook(query) {
    return this.book.findOneOrMany(query);
  }

  /**
   * Adds a new user to the library.
   * @param {object} user - The user object to add.
   * @param {string} user.name - The name of the user.
   * @returns {object} The newly added user.
   */
  addUser(user) {
    return this.user.create(user);
  }

  /**
   * Removes a user from the library by ID.
   * @param {number} id - The ID of the user to remove.
   * @returns {object} An object containing success status and the removed user.
   */
  removeUser(id) {
    const user = this.user.delete(id);
    return { success: true, removedUser: user };
  }

  /**
   * Searches for a user in the library.
   * @param {object} query - The search query.
   * @param {number} [query.id] - The ID of the user.
   * @param {string} [query.name] - The name of the user.
   * @returns {object|null} The found user or null if not found.
   */
  searchUser(query) {
    return this.user.findOne(query);
  }

  /**
   * Allows a user to borrow a book from the library.
   * @param {number} userId - The ID of the user borrowing the book.
   * @param {number} isbn - The ISBN of the book to borrow.
   * @returns {object|string} An object containing the success status and message, or an error message.
   */
  borrowBook(userId, isbn) {
    try {
      const user = this.user.findOne({ id: userId });
      const book = this.book.findOneOrMany({ isbn });

      if (!user) throw new Error('User not found');
      if (!book) throw new Error('Book not found');

      if (this.isBookAvailable(book.isbn)) {
        user.borrowedBooks.push(book.isbn);
        book.isAvailable = false;
      } else {
        return `Book: ${book.title} is not available at the moment`;
      }

      return {
        success: true,
        message: `User ${user.name} has successfully borrowed book ${book.title}`,
      };
    } catch (error) {
      return error.message;
    }
  }

  /**
   * Returns a borrowed book to the library.
   * @param {number} userId - The ID of the user.
   * @param {number} isbn - The ISBN of the book to return.
   * @returns {object|string} An object containing the success status and message, or an error message.
   */
  returnBook(userId, isbn) {
    try {
      const user = this.user.findOne({ id: userId });
      const book = this.book.findOneOrMany({ isbn });

      if (!user) throw new Error('User not found');
      if (!book) throw new Error('Book not found');

      const borrowedBook = user.borrowedBooks.find(
        (bookIsbn) => bookIsbn === isbn
      );
      if (borrowedBook) {
        user.borrowedBooks = user.borrowedBooks.filter(
          (book) => book !== borrowedBook
        );
        book.isAvailable = true;
      } else {
        return 'User did not borrow this book';
      }

      return {
        success: true,
        message: `User ${user.name} has successfully returned book ${book.title}`,
      };
    } catch (error) {
      return error;
    }
  }

  /**
   * Checks if a book is available in the library.
   * @param {number} isbn - The ISBN of the book to check.
   * @returns {boolean|string} True if the book is available, or an error message.
   * @throws Will throw an Error if the book is not found.
   */
  isBookAvailable(isbn) {
    try {
      const foundBook = this.book.findOneOrMany({ isbn });

      if (!foundBook) throw new Error('Book not found');

      return foundBook.isAvailable;
    } catch (error) {
      return error.message;
    }
  }
}

/** Function to test the Library Management System */
function main() {
  // Usage example
  const library = new Library();

  // Adding a new user
  const newUser = library.addUser({ name: 'Tobi' });
  console.log(newUser);

  // Adding a new book
  const newBook = library.addBook({
    title: 'Harry Potter and the Prisoner of Azkaban',
    author: 'J.K Rowling',
    isbn: 12347,
  });
  console.log(newBook);

  // Searching for a user
  const user = library.searchUser({ id: 1 });
  console.log(user);

  // Searching for a book
  const book = library.searchBook({ author: 'J.K Rowling' });
  console.log(book);

  // Borrowing a book
  console.log(library.borrowBook(1, 12345)); // Should return success message

  // Checking book availability
  console.log(library.isBookAvailable(12345)); // Should return false

  // Returning a book
  console.log(library.returnBook(1, 12345)); // Should return success message

  // Checking book availability
  console.log(library.isBookAvailable(12345)); // Should return true

  // Removing a user
  const removedUser = library.removeUser(1);
  console.log(removedUser);

  // Removing a book
  const removedBook = library.removeBook(12345);
  console.log(removedBook);
}

main();
