const express = require('express') ///
const app = express() /// 
const cors = require('cors') ///
const port = process.env.PORT || 3000; ///
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
require('dotenv').config()

// console.log('Auth0 Domain:', process.env.REACT_APP_AUTH0_DOMAIN);
// console.log('Client ID:', process.env.REACT_APP_AUTH0_CLIENT_ID);
// console.log('Audience:', process.env.REACT_APP_AUTH0_AUDIENCE);

//define stripe 
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);

// middleware
app.use(express.json()) ///
app.use(bodyParser.json());
app.use(cors({
})) ///
app.use(cookieParser());

//database
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@job-portal-demo.gsk5g2g.mongodb.net/`;
// mongodb+srv://sarthokali0427:<password>@jobportaldemo.nfomqpb.mongodb.net/

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}); ///

async function run() {
  
  try {
    await client.connect();

    // create db
    const db = client.db("mernJobPortal");
    const jobsCollections = db.collection("demoJobs");
    const blogsCollections = db.collection("demoBlogs");
    const eventsCollections = db.collection("demoEvents");
    const contentsCollections = db.collection("demoContents");
    const paymentsCollections = db.collection("demoPayments");
    
    // post a job
    app.post("/post-job",async(req,res)=> {
        const body = req.body;
        body.createAt = new Date();
        // console.log(body);
        const result = await jobsCollections.insertOne(body);
        if(result.insertedId){
            return res.status(200).send(result);
        }else{
            return res.status(404).send({
                message: "can not insert! try again later",
                status: false
            })
        }
    }) 
    // post a payment
    app.post("/post-payment",async(req,res)=> {
        const body = req.body;
        body.createAt = new Date();
        // console.log(body);
        const result = await paymentsCollections.insertOne(body);
        if(result.insertedId){
            return res.status(200).send(result);
        }else{
            return res.status(404).send({
                message: "can not insert! try again later",
                status: false
            })
        }
    }) 

    // post a blog
    app.post("/post-blog",async(req,res)=> {
        const body = req.body;
        body.createAt = new Date();
        // console.log(body);
        const result = await blogsCollections.insertOne(body);
        if(result.insertedId){
            return res.status(200).send(result);
        }else{
            return res.status(404).send({
                message: "can not insert! try again later",
                status: false
            })
        }
    }) 
    // post a event
    app.post("/MyEvents",async(req,res)=> {
        const body = req.body;
        body.createAt = new Date();
        // console.log(body);
        const result = await eventsCollections.insertOne(body);
        if(result.insertedId){
            return res.status(200).send(result);
        }else{
            return res.status(404).send({
                message: "can not insert! try again later",
                status: false
            })
        }
    }) 
    // post a content
    app.post("/post-content",async(req,res)=> {
        const body = req.body;
        body.createAt = new Date();
        // console.log(body);
        const result = await contentsCollections.insertOne(body);
        if(result.insertedId){
            return res.status(200).send(result);
        }else{
            return res.status(404).send({
                message: "can not insert! try again later",
                status: false
            })
        }
    })  

    app.get('/', (req, res) => {
     
      res.cookie('exampleCookie', 'cookieValue', { sameSite: 'None', secure: true });
      res.send('Cookie set successfully!');
    });

    //get all jobs
    app.get("/all-jobs",async(req,res) => {
        const jobs = await jobsCollections.find({}).toArray()
        res.send(jobs);
    })
    //get all payments
    app.get("/all-payments",async(req,res) => {
        const payments = await paymentsCollections.find({}).toArray()
        res.send(payments);
    })
    //get all blogs
    app.get("/all-blogs",async(req,res) => {
        const blogs = await blogsCollections.find({}).toArray()
        res.send(blogs);
    })
    //get all events
    app.get("/all-events",async(req,res) => {
        const events = await eventsCollections.find({}).toArray()
        res.send(events);
    })
    //get all contents
    app.get("/all-contents",async(req,res) => {
        const contents = await contentsCollections.find({}).toArray()
        res.send(contents);
    })

    //get single job using id
    app.get("/all-jobs/:id",async(req, res) => {
      const id = req.params.id;
      const job = await jobsCollections.findOne({
        _id: new ObjectId(id)
      })
      res.send(job)
    })
    //get single blog using id
    app.get("/all-blogs/:id",async(req, res) => {
      const id = req.params.id;
      const blog = await blogsCollections.findOne({
        _id: new ObjectId(id)
      })
      res.send(blog)
    })
    //get single event using id
    app.get("/all-events/:id",async(req, res) => {
      const id = req.params.id;
      const event = await eventsCollections.findOne({
        _id: new ObjectId(id)
      })
      res.send(event)
    })


    //get jobs by email
    app.get("/myJobs/:email", async(req,res)=> {
      // console.log(req.params.email)
      const jobs = await jobsCollections.find({postedBy : req.params.email}).toArray();
      res.send(jobs)
    })
    app.get("/myPayments/:userId", async(req,res)=> {
      // console.log(req.params.email)
      const payments = await paymentsCollections.find({postedBy : req.params.email}).toArray();
      res.send(payments)
    })

    //delete a job
    app.delete("/job/:id", async(req,res)=> {
      const id = req.params.id;
      const  filter = {_id: new ObjectId(id)}
      const result = await jobsCollections.deleteOne(filter);
      res.send(result)
    })

    //Update a jobs
    app.patch("/update-job/:id",async(req,res)=> {
      const id = req.params.id;
      const jobData = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateDoc = {
        $set: {
         ...jobData
        },
      };
      const result = await jobsCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Hello World!')
}) ///

app.listen(port, ()=> {
    console.log(`Example app listening on port ${port}`)
}) 