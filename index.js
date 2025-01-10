// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken');

// Initialize the app
const app = express();

// Define a port from environment variables or default to 5000
const port = process.env.PORT || 5000;

// Add middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

//mongo db intrigation
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.o9sii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



//testing and run connection
async function run() {
    try {
    //   await client.connect();  //conment this line here
    //   await client.db("admin").command({ ping: 1 });  //conment this line here
    //   console.log("Connected to MongoDB successfully!"); //conment this line here



        //adding path here
    

      app.get('/api',(req,res)=>{
        res.send('Welcome to test api..... of')
    })

    const secret=process.env.JWT_Secret
    //adding jwt token

    app.post('/jwt',(req,res)=>{

      console.log(req.query)

      const {email} =req.query;

      if (!email) {
        return res.status(400).json({ error: 'Username is required' });
      }
    
      // Payload for the token
      const payload = { email };
    
      // Generate the token (expires in 1 hour)
      const token = jwt.sign(payload, secret, { expiresIn: '24h' });
    console.log(token)
      res.json({ token });

    })

    } finally {
     // await client.close();
    }
  }
  run().catch(console.dir);
  





// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the Express.js Boilerplate!');
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
