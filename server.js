const express = require('express')//access to express module
const app = express()//telling us to run the express function
const bodyParser = require('body-parser')//returns a string into an object :: built in express 
const MongoClient = require('mongodb').MongoClient//access to database

var db, collection; // declaring variables waiting to be assigned 

const url = "mongodb+srv://emilyc:emilyc@cluster0.uuqhr.mongodb.net/?retryWrites=true&w=majority";
const dbName = "todo";

//lets us know we successfully connected to database
app.listen(3000, () => { //listening to port waiting for server to be run
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')//has to come first so HTML will be rendered 
app.use(bodyParser.urlencoded({extended: true}))//body parser will be applied to url
app.use(bodyParser.json())//body parser will be applied to stringified JSON
app.use(express.static('public'))// anything in this public folder will be ran on server immediatley no route needed.

app.get('/', (req, res) => {// get request for when the page is loaded and url contains '/' -- or visible slash
  db.collection('tasks').find().toArray((err, result) => {//gathering all msgs in the databse and putting them in an array
    if (err) return console.log(err)// if something is wrong then inform
    res.render('index.ejs', {messages: result})
  })//put input message into index.ejs in order to render the msg in the dom** into property messages
})

app.post('/items', (req, res) => {// app post will include the new message into creating 
  db.collection('tasks').insertOne({date: req.body.date, msg: req.body.msg,completed:false }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/complete', (req, res) => { // creating a new document 
  console.log(req.body.date)
  console.log(req.body.msg)

  db.collection('tasks')
  .findOneAndUpdate({date: req.body.date, msg: req.body.msg}, {
    $set: {
      completed: true
      // if true turn into false, if false turn into true ( so ppl have an option to unfavorite)
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


// app.put('/messagesDown', (req, res) => {
//   // update request
//   db.collection('tasks')
//   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, { // find the name/message
//     $set: { // changes this part of the object
//       thumbUp:req.body.thumbUp - 1
//     }
//   }, {
//     sort: {_id: -1}, 
//     upsert: true
//     // creates something for you
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })

app.delete('/items', (req, res) => { // a delete request
  db.collection('tasks').findOneAndDelete({date: req.body.date, msg: req.body.msg}, (err, result) => {// find matching name/message object in a database and delete 
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
