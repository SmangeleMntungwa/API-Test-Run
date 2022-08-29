const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnections");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM Therapy", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/', (req, res) => {
const {Therapy_id, Therapy_description, Therapy_category, Therapy_image} = req.body
try{
con.query(
  `INSERT INTO Therapy (Therapy_id,Therapy_description,Therapy_category,Therapy_image,) VALUES('${Therapy_id}', '${Therapy_description}','${Therapy_category}','${Therapy_image}')`,
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
        con.query(`DELETE  FROM Therapy WHERE Patient_id =${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
});
 

module.exports = router;