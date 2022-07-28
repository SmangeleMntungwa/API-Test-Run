const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnections");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM categories", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/', (req, res) => {
const {name, description, thumbnail} = req.body
try{
con.query(
  `INSERT INTO categories (name,description,thumbnail) VALUES('${name}', '${description}','${thumbnail}')`,
 (err, result) => {
      if (err) throw err;
      res.send(result);
    }
    );
} catch (error) {
  console.log(error);
};
});

router.delete("/:id", (req, res) => {
    try {
        con.query(`DELETE  FROM categories WHERE user_id =${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
});
 


module.exports = router;