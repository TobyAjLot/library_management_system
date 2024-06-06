/** Class representing a user collection */
export default class User {
  /** Initialize the user collection */
  constructor() {
    this.users = [
      {
        id: 1,
        name: 'Harry',
        borrowedBooks: [],
      },
      {
        id: 2,
        name: 'Hermione',
        borrowedBooks: [],
      },
      {
        id: 3,
        name: 'Ronald',
        borrowedBooks: [],
      },
      {
        id: 4,
        name: 'Nevile',
        borrowedBooks: [],
      },
      {
        id: 5,
        name: 'Draco',
        borrowedBooks: [],
      },
    ];
  }

  /**
   * Create a new user and add them to the collection.
   * @param {object} user - The user details.
   * @param {string} user.name - The name of the user.
   * @returns {object} The newly created user with an added borrowedBooks property.
   */
  create(user) {
    const id = this.users.length ? this.users[this.users.length - 1].id + 1 : 1;
    const newUser = { id, ...user, borrowedBooks: [] };

    // Save user to database
    this.users.push(newUser);
    return newUser;
  }

  /**
   * Find a user by ID or name.
   * @param {object} query - The search query.
   * @param {number} [query.id] - The ID of the user.
   * @param {string} [query.name] - The name of the user.
   * @returns {object|null} The found user, or null if no user is found.
   */
  findOne({ id, name }) {
    // Find user by id
    if (id) {
      const user = this.users.find((user) => user.id === id);
      return user;
    }

    // Find user by name
    if (name) {
      const user = this.users.find((user) => user.name === name);
      return user;
    }

    return null;
  }

  /**
   * Delete a user from the collection by ID.
   * @param {number} id - The ID of the user to delete.
   * @returns {object} The deleted user.
   * @throws {Error} If the user is not found.
   */
  delete(id) {
    const removedUser = this.findOne({ id });

    if (!removedUser) {
      throw new Error('User not found');
    }
    // Delete user from database
    this.users = this.users.filter((user) => user.id !== id);

    return removedUser;
  }
}
