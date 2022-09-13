const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnections");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// get all users
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


// Add to users
router.post("/", (req, res) => {
  const user = {
    email:req.body.email,
    password:req.body.password,
    full_name:req.body.full_name,
    phone:req.body.phone,
    user_type:req.body.user_type,
    
  } 
  try {
      con.query(`INSERT INTO users SET ?`,user, (err, result) => {
          if (err) throw err;
          res.send(result);
      });
  } catch (error) {
      console.log(error);
      res.status(400).send(error)
  }
});

// Get a single user by ID from USERS table
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


//update user by id
router.put("/:id", (req, res) => {
    const {
      email,
      password,
      full_name,
      phone,
      user_type,
     
      
    } = req.body;
    try {
        con.query(`UPDATE users SET  email='${email}', password ='${password}', full_name='${full_name}', phone='${phone}', user_type='${user_type}'   WHERE user_id ="${req.params.id}"`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });

// Delete single user from database

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
      email,
      password,
      full_name,
      phone,
      user_type,
    
    } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let user = {
      email,
      // We sending the hash value to be stored witin the table
      password: hash,
      full_name,
      phone,
      user_type,
    };

    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      // res.send(`User ${(user.full_name, user.email)} created successfully`);
      res.send(user)
    });
  } catch (error) {
    console.log(error);
  }});


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
// information to be stored in token

const  user ={
                user_Id: result[0].user_Id,
                email: result[0].email,
                password: result[0].password,
                full_name: result[0].full_name,
                phone: result[0].phone,
                user_type: result[0].user_type,
              }
            // Creating a token and setting expiry date
            jwt.sign(
            user,
              process.env.jwtSecret,
              {
                expiresIn: "365d",
              },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

    
// verify
router.get("/users/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});
router.get("/", (req, res) => {
      try {
        let sql = "SELECT * FROM users";
        con.query(sql, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      } catch (error) {
        console.log(error);
      }
    });
  
module.exports = router;