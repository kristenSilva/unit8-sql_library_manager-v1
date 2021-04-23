'use strict';

const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a value for 'title'"
        },
        notEmpty: {
          msg: "Book title cannot be left empty"
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a value for 'author'"
        },
        notEmpty: {
          msg: "Author cannot be left empty"
        }
      }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, { sequelize });

  return Book;
};