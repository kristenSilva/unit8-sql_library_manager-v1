var express = require('express');
var router = express.Router();

/* GET home page - redirect to books route in `book.js` */
router.get('/', (req, res, next) => {
  res.redirect("/books")
});

module.exports = router;
