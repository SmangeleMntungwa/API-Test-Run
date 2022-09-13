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
    res.send(result);
  }
});

router.get("/:id", (req, res) => {
    try {
        con.query(`SELECT * FROM Therapy WHERE Therapy_id =${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });



  router.delete("/:id", (req, res) => {
    try {
        con.query(`DELETE  FROM Therapy WHERE Therapy_id =${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
});
 

//Update my Therapy by id
  router.put("/:id", (req, res) => {
    const {
      Therapy_id,
      title,
      description,
      category,
      image,
      Appointment_date,
      Start_time,
      End_time,
      
    } = req.body;
    try {
        con.query(`UPDATE Therapy SET  Therapy_id ='${Therapy_id}', title='${title}', description ='${description}', category='${category}', image='${image}',Appointment_date='${Appointment_date}', Start_time='${Start_time}', End_time='${End_time}'   WHERE Therapy_id =${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });

router.post("/", (req, res) => {
    const one_therapy = {
      title:req.body.title,
      description:req.body.description,
      category:req.body.category,
      image:req.body.image,
      Appointment_date:req.body.Appointment_date,
      Start_time:req.body.Start_time,
      End_time:req.body.End_time,
    } 
    try {
        con.query(`INSERT INTO Therapy SET ?`,one_therapy, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });



module.exports = router;