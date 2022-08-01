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
const {email, password, full_name, billing_address, default_shipping_address, country, phone, user_type } = req.body
try{
con.query(
  `INSERT INTO users (email,password,full_name,billing_address,default_shipping_address,country,phone,user_type) VALUES('${email}', '${password}','${full_name}','${billing_address}', '${default_shipping_address}', '${country}',' ${phone}', '${user_type}')`,
 (err, result) => {
      if (err) throw err;
      res.send(result);
    }
    );
} catch (error) {
  console.log(error);
};
});

router.get("/:id", (req, res) => {
    try {
        con.query(`SELECT * FROM users WHERE user_id =${req.params.id}`, (err, result) => {
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
        con.query(`DELETE  FROM users WHERE user_id =${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
});
// Register
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";
    const {
      full_name,
      email,
      user_type,
      phone,
      country,
      billing_address,
      default_shipping_address,
    } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let user = {
      full_name,
      email,
      // We sending the hash value to be stored witin the table
      password: hash,
      user_type,
      phone,
      country,
      billing_address,
      default_shipping_address,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`User ${(user.full_name, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});

// Login
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email not found please register");
      } else {
        // Decryption
        // Accepts the password stored in database and the password given by user (req.body)
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        // If password does not match
        if (!isMatch) {
          res.send("Password incorrect");
        } else {
          res.send(result);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Update user
router.put("/update-user/:id", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      user_id: req.params.id,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        let updateSql = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        let updateUser = {
          full_name: req.body.full_name,
          email: req.body.email,
          password: hash,
          user_type: req.body.user_type,
          phone: req.body.phone,
          country: req.body.country,
          billing_address: req.body.billing_address,
          default_shipping_address: req.body.default_shipping_address,
        };
        con.query(updateSql, updateUser, (err, updated) => {
          if (err) throw err;
          console.log(updated);
          res.send("Successfully Updated");
        });
      } else {
        res.send("User not found");
      }
    });
  } catch (error) {
    console.log(error);
  }
});


 

module.exports = router;