const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnections");
const {hashSync, genSaltSync, compare} = require('bcrypt');
const jwt = require('jsonwebtoken');


// Login
router.post("/login", (req, res) => {
  try {
    const {Patient_email, Patient_password} = req.body;
    let sql = `SELECT * FROM Patients WHERE Patient_email = '${Patient_email}'`;
   
    con.query(sql, async (err, result) => {
      if (err) throw err;
      if (!result.length || (result == null)) {
        res.send("Email not found please register");
      } else {
          await compare(Patient_password, result[0].Patient_password, 
            (cErr, cResults)=> {
              if(cErr) throw cErr;
              if(cResults) {
                  const payload = {
                        patient: {
                          Patient_id: result[0].patient_Patient_id,
                            Patient_email: result[0].patient_Patient_email,
                            Patient_password: result[0].patient_Patient_password,
                            Patient_name: result[0].patient_Patient_name,
                            Patient_surname: result[0].patient_Patient_surname,
                            Patient_contact: result[0].patient_Patient_contact,
                            Patient_added_on: result[0].patient_Patient_added_on,
                        }
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
                          res.status(200).json({msg: 'You logged in', token });
                        }
                      );
              }else {
                res.status(409).json({msg: "You provide a wrong password"})
              }
          })


        // const isMatch = await compare(
        //   Patient_password,
        //   result[0].patient_Patient_password
        // );
        // if (!isMatch) {
        //   res.send("Password incorrect");
        // } else {
        //   // The information the should be stored inside token
        //   const payload = {
        //     patient: {
        //       Patient_id: result[0].patient_Patient_id,
        //         Patient_email: result[0].patient_Patient_email,
        //         Patient_password: result[0].patient_Patient_password,
        //         Patient_name: result[0].patient_Patient_name,
        //         Patient_surname: result[0].patient_Patient_surname,
        //         Patient_contact: result[0].patient_Patient_contact,
        //     },
        //   };
        //   // Creating a token and setting expiry date
        //   jwt.sign(
        //     payload,
        //     process.env.jwtSecret,
        //     {
        //       expiresIn: "365d",
        //     },
        //     (err, token) => {
        //       if (err) throw err;
        //       res.json({msg: 'You logged in', token });
        //     }
        //   );
        // }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Verify
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



// router.post('/', (req, res) => {
// const {Patient_id,Patient_email,Patient_password,Patient_name,Patient_surname,Patient_contact} = req.body
// try{
// con.query(
//   `INSERT INTO Patients (Patient_id,Patient_email,Patient_password,Patient_name,Patient_surname,Patient_contact) VALUES('${Patient_id}', '${Patient_email}','${Patient_password}','${Patient_name}', '${Patient_surname}', '${Patient_contact}')`,
//  (err, result) => {
//       if (err) throw err;
//       res.send(result);
//     }
//     );
// } catch (error) {
//   console.log(error);
// };
// });

router.get("/:id", (req, res) => {
    try {
        con.query(`SELECT * FROM Patients WHERE Patient_id =${req.params.id}`, (err, result) => {
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
        con.query(`DELETE  FROM Patients WHERE Patient_id =${req.params.id}`, (err, result) => {
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
    let sql = "INSERT INTO Patients SET ?";
    const {
      Patient_email,
      Patient_password,
      Patient_name,
      Patient_surname,
      Patient_contact,
      Patient_added_on,
    } = req.body;
    const salt = genSaltSync(10);
    const hash = hashSync(Patient_password, salt);
    let patient = {
      Patient_email,
      // We sending the hash value to be stored witin the table
      Patient_password: hash,
      Patient_name,
      Patient_surname,
      Patient_contact,
      Patient_added_on,
    };
    con.query(sql, patient, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`patient ${(patient.Patient_email, patient.Patient_password)} created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});


router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM Patients", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});


// Login
// router.post("/login", (req, res) => {
//   try {
//     let sql = "SELECT * FROM Patients WHERE ?";
//     let patient = {
//       Patient_email: req.body.Patient_email,
//     };
//     con.query(sql, patient, async (err, result) => {
//       if (err) throw err; 
//       if (result.length === 0) {
//         res.send("Email not found please register");
//       } else {
//         // Decryption
//         // Accepts the password stored in database and the password given by user (req.body)
//         const isMatch = await bcrypt.compare(
//           req.body.Patient_password,
//           result[0].Patient_password
//         );
//         // If password does not match
//         if (!isMatch) {
//           res.send("Password incorrect");
//         } else {
//           res.send(result);
//         } 
//       } 
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

router.put("/:id", (req, res) => {
    const {
       Patient_email,
      Patient_password,
      Patient_name,
      Patient_surname,
      Patient_contact,
      Patient_added_on,
      
    } = req.body;
    try {
        con.query(`UPDATE Patients SET Patient_email='${Patient_email}', Patient_password='${Patient_password}', Patient_name ='${Patient_name}', Patient_surname='${Patient_surname}', Patient_contact='${Patient_contact}',Patient_added_on='${Patient_added_on}'   WHERE patient_id =${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
  });
 

module.exports = router;