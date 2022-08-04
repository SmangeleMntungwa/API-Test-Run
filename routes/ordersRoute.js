const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnections");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM orders", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/', (req, res) => {
const {user_id, amount, shipping_address, order_email, order_date, order_status} = req.body
try{
con.query(
  `INSERT INTO orders (user_id,amount,shipping_address,order_email,order_date,order_status) VALUES('${user_id}', '${amount}','${shipping_address}','${order_email}', '${order_date}', '${order_status}')`,
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
        con.query(`DELETE  FROM orders WHERE user_id =${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
});
 

module.exports = router;