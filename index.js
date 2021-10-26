const express = require('express');
var cors = require('cors');
const ObjectId = require('mongodb').ObjectId; 
const app = express();
const port = 5000;


// middleware
app.use(cors());
app.use(express.json());

// Yp1zrImnemR9qBM8
// mydbuser1


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://mydbuser1:Yp1zrImnemR9qBM8@cluster0.ucxei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// insert e jaite hbe 
async function run() {
    try {
      await client.connect();
      const database = client.db("foodDB");
      const usersCollection = database.collection("users");

      // get api
      app.get('/users',async(req,res)=>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
      })


      // post api

      app.post('/users',async(req,res)=>{
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        res.json(result);
        console.log('got new user',req.body);
        console.log('added user',result);
      });

      
      app.put('/users/:id',async(req,res)=>{

        const id = req.params.id;
        console.log('updating user', req)
        const updateUser = req.body;
        const filter = {_id: ObjectId(id)};
        const options = {upsert: true};
        const updateDoc = {
          $set: {
            name: updateUser.name,
            email: updateUser.email

          },
        };
        const result = await usersCollection.updateOne(filter,updateDoc,options);
        res.json(result);
      })

      // delete api 
      app.delete('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await usersCollection.deleteOne(query);
        res.json(result);
        console.log('delete', result);
      });

      // update api 
      app.get('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const user = await usersCollection.findOne(query);

        console.log('load user with id', id);
        res.json(user);
      });







      // create a document to insert
      // const doc = {
      //   name: "Special",
      //   email: "special@gmail.com",
      // }
      // const result = await usersCollection.insertOne(doc);
      // console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);


// client.connect(err => {
//   const collection = client.db("foodMaster").collection("users");
//   console.log('hit')
//   const user = {name: 'mahi', email:'mahi@gmail.com', phone:'01277777777'}
//   collection.insertOne(user)
//   .then( ()=>{
//       console.log('insert user')
//   })
//   perform actions on the collection object
//   client.close();
// });


app.get('/',(req,res)=>{
    res.send('dkdk')
})

app.listen(port,()=>{
    console.log('runnig server on port', port)
})
