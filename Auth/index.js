// login
//const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const con = require("../../lib/db_connection");
require ('dotenv').config;
async function Login (req, res) {
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
          const isMatch = await bcrypt.compare(
            req.body.password,
            result[0].password
          );
          if (!isMatch) {
            res.send("Password incorrect");
          } else {
            // The information the should be stored inside token
            const payload = {
              user: {
                user_id: result[0].user_id,
                full_name: result[0].full_name,
                email: result[0].email,
                user_type: result[0].user_type,
                phone: result[0].phone,
                country: result[0].country,
                billing_address: result[0].billing_address,
                default_shipping_address: result[0].default_shipping_address,
              },
            };
            // Creating a token and setting expiry date
            jwt.sign(
              payload,
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
  };
  // register
async function Register (req, res) {
  let sql = "INSERT INTO users SET ?";
  //the body requested
  const {
    full_name,
    email,
    password,
    user_type,
    phone,
    country,
    billing_address,
    default_shipping_address,
  } = req.body;
  // The start of hashing / encryption
  //bcrypt is being used
  //salr is the legnth of the character ie. a=10charachters
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
//database terms
  let user = {
    full_name,
    email,
    // We sending the hash value to be stored within the table
    password:hash,
    user_type,
    phone,
    country,
    billing_address,
    default_shipping_address,
  };
  //SQL Query
  //connection to database made here
  con.query(sql, user, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(`User ${(user.full_name, user.email)} created successfully`)
  });
// } catch (error) {
//   console.log(error);
}
  module.export ={
    Login,
    Register
  }