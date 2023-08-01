"use strict";

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    return await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: 1,
          email: "admin@mail.com",
          name: "admin",
          password: "12345678",
          role: "Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("Users", { [Op.or]: [{ id: 1 }] });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
