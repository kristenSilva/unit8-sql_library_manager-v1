var express = require('express');
var router = express.Router();
const db = require('../models/index');
const { Op } = db.Sequelize;

//import Book model
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}

/* GET book collection. */
router.get('/', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll();
  res.render("books/index", {books, title: "Books"});
}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("books/new-book", { book: {}, title: "New Book" });
});

/* POST create book. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try{
    book = await Book.create(req.body);
    res.redirect(`/books`);   
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      //non-persistent model instance, will get saved automatically by create once form is valid
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors, title: "New Book" });
    } else {
      //catch all other errors in asyncHandler's catch block
      throw error;
    }
  }
}));

/* GET individual book. */
router.get("/:id", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  //catch incorrect book.id request
  if(book){
    res.render("books/update-book", { book });
  } else {
    const err = new Error();
    err.status = 404;
    err.message = "Looks like the book you requested doesn't exist in our library."
    next(err);
  }
}));

/* Update a book. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try{
    book = await Book.findByPk(req.params.id);
    //cat incorrect book.id request
    if(book){
      await book.update(req.body);
      res.redirect(`/books`);
    } else {
      const err = new Error();
      err.status = 404;
      err.message = "Looks like the book you requested doesn't exist in our library."
      next(err);   
    }
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      //set the book id to ensure correct book is updated
      book.id = req.params.id;
      res.render("books/update-book", { book, errors: error.errors, title: "Update Book" });
    } else {
      //catch all other errors in asyncHandler's catch block
      throw error;
    }   
  }  
}));

/* Delete individual book. */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    await book.destroy();
    res.redirect(`/books`);
  } else {
    const err = new Error();
    err.status = 404;
    err.message = "Looks like the book you requested doesn't exist in our library."
    next(err);     
  }
}));

module.exports = router;
