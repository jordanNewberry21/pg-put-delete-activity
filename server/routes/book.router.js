const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
      // Sends back the results in an object
      res.send(result.rows);
    })
    .catch(error => {
      console.log('error getting books', error);
      res.sendStatus(500);
    });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/', (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);
  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });

});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/:id', (req, res) => {
  let book = req.body; // Book with updated content
  let id = req.params.id; // id of the book to update
  console.log(`Updating book ${id} ...${book.title} `);
  let sqlText = `UPDATE books SET status='Read' WHERE id=$1;`;
// I tried putting my conditionals here to make sure inputs were valid
// I have it working fine on my client.js, but I'm not sure where to put
// it over here to get it to work.

  pool.query(sqlText, [id])
    .then((result) => {
      res.sendStatus(201);
    }).catch((error) => {
      console.log('Error from db:', error);
      res.sendStatus(500);
    });

  


});


// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.get('/:id', (req, res) => {
  let id = req.params.id;
  console.log('Getting book with id', id);
  let sqlText = `SELECT * FROM books WHERE id=$1;`;
  pool.query(sqlText, [id])
    .then((result) => {
      res.send(result.rows)
    }).catch((error) => {
      console.log('Error from db:', error);
      res.sendStatus(500);
    });
});


router.delete('/:id', (req, res) => {
  let id = req.params.id; // id of the thing to delete
  console.log('Delete route called with id of', id);
  let sqlText = `DELETE FROM books WHERE id=$1;`;
  pool.query(sqlText, [id])
    .then((result) => {
      console.log('Got back from delete');
      res.sendStatus(200);
    }).catch((error) => {
      console.log('Error from db:', error);
      res.sendStatus(500);
    });
  // at first I just had this route, and it wasn't working for me.
  // after thinking about it for a minute and looking at my notes
  // I realized I needed the other half of this route, the GET above
  // to actually be able to select what I want to delete.
});

module.exports = router;