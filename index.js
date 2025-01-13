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

//adding database collection name here
const hrCollection=client.db('AssetFlow').collection
('hr')
const assetsCollection=client.db('AssetFlow').collection
('assetlist')

const pendingEmployeeCollection=client.db('AssetFlow').collection
('pendingEmployee')

const employeeCollection=client.db('AssetFlow').collection
('employee')

const allRequest=client.db('AssetFlow').collection
('request')


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

    //checking the the if this email is admin;
    app.post('/admin', async (req, res) => {
      try {
        const email = req.body.email; // Get email from request body
        console.log('Requested email:', email);
    
        // Find documents with matching email
        const result = await hrCollection.find({ email }).toArray();
    
        if (result.length === 0) {
          // No matching email found
          console.log("it from failed on")
          return res.send({ isAdmin:false });
        }
        
        // console.log("cheking shaik asumsion",result.email)
        // Assuming only one document is expected for the given email
        const expectedEmail = result[0].email; // Access the first document's email
        // console.log('Matched email:', expectedEmail);
    
        if(expectedEmail === email){
          console.log("suuceesed")
          return res.send({isAdmin:true}

           
          )
        }
        res.send("not matched");
      } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server error');
      }
    });

    //showing all assets list
    app.get('/assets',async(req,res)=>{

      
      const result=await assetsCollection.find().toArray()
      console.log(result)
      res.send(result)

    })

    //pending employee list
    app.get('/pending-employee',async(req,res)=>{

      
      const result=await pendingEmployeeCollection.find().toArray()
      console.log(result)
      res.send(result)

    })

    //employee list 
    app.get('/employee',async(req,res)=>{

      
      const result=await employeeCollection.find().toArray()
      // console.log(result)
      res.send(result)

    })



    //adding assets list 
    app.post('/addassets',async(req,res)=>{

      const data =req.body
      console.log(data)
      if(!data){

       return res.send('data is not given')
      }

      const result =await assetsCollection.insertOne(data)
      console.log(result)
      res.send(result)
    })

    //request item path


    
app.get('/request-items',async(req,res)=>{

      
      const result=await allRequest.find().toArray()
      console.log('request items get',result)
      res.send(result)

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
