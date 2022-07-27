const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnections");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/', (req, res) => {
const {email, password, fullname, billing_address, default_shipping_address, country, phone, user_type } = req.body
});

try{
con.query(
  `INSERT INTO users ('${email}', '${password}','${fullname}','${billing_address}', '${default_shipping_address}', '${country}',' ${phone}', '${user_type}')`,
 (err, result) => {
      if (err) throw err;
      res.send(result);
    }
    );
} catch (error) {
  console.log(error);
};

module.exports = router;