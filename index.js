// Import needed libraries
const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally

// Configure Server
const app = express(); // Initialize express as an app variable
app.set("port", process.env.PORT || 6969); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Dont let local development give errors

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  }); // Dont let local development give errors


// This is where we check URLs and Request methods to create functionality
// GET '/' is always what will be displayed on the home page of your application
app.get("/", (req, res) => {
  res.json({ msg: "Welcome, server running by Smangele Mntungwa" });
});


const userRoute = require("./routes/userRoute");
app.use("/users", userRoute);

const TherapyRoute = require("./routes/TherapyRoute");
app.use("/Therapy", TherapyRoute);


// Use individual routes when visiting these URLS
app.use("/users", userRoute);
app.use("/Therapy", TherapyRoute);

// Set up server to start listening for requests
app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});

// Import routes
// const userRoute = require("./routes/userRoute");
// const TherapyRoute = require("./routes/TherapyRoute");
