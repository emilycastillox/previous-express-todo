// CRUD
// Create: new todos from the input (post)
// Read: (get) our files? Database?
// Update: (put) cross out and gray out completed todos
// Delete: Delete completed tasks

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://emilyc:emilyc@cluster0.uuqhr.mongodb.net/?retryWrites=true&w=majority";
const dbName = "todo";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('tasks').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {todos: result})
  })
})

app.post('/tasks', (req, res) => {
  console.log(req.body)
  console.log(req.body.todoItem)
  db.collection('tasks').insertOne({item: req.body.todoItem, done:false}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/done', (req, res) => {
  db.collection('tasks')
  .findOneAndUpdate({item: req.body.todoItem}, {
    $set: {
      done: true
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/clear', (req, res) => {
  db.collection('tasks').deleteMany({}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
