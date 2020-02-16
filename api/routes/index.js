var express = require('express');
const { check, validationResult } = require('express-validator');


var router = express.Router();
let {PythonShell} = require('python-shell');
var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccount.json");
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize stuff
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ingest-1fea9.firebaseio.com'
});

var firebaseConfig = {
  apiKey: "AIzaSyCVE8qj3LiQRu7nwy4CohDbtsCxS4_65xw",
  authDomain: "ingest-1fea9.firebaseapp.com",
  databaseURL: "https://ingest-1fea9.firebaseio.com",
  projectId: "ingest-1fea9",
  storageBucket: "ingest-1fea9.appspot.com",
  messagingSenderId: "793791917575",
  appId: "1:793791917575:web:dd55b32269a5b09fee84a2"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

// Home Page
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Object Dump
router.post('/object', function (req, res, next) {

  db.collection("objectdump").add(
    req.body
  )
  res.json(req.body);
});

/**
 * addArticle
 * 
 * When given an article, validate, process then put in db.
 */
router.post('/ingest/addArticle', [
  check('title').isString(),
  check('fullText').isString(),
  check('author').isString(),
  check('timestamp').isInt()],
  function (req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors});

    var article = {
      title: req.body.title,
      fullText: req.body.fullText,
      author: req.body.author,
      timestamp: req.body.timestamp
    }

    processText();
    res.status(200);
});

router.get('/articles',[
  check('numArticles').isInt(),
  check('lastTimestamp').isInt()], function(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors:errors});

    let numArticles = req.query.numArticles;
    let lastTimestamp = req.query.lastTimestamp;
    
    console.log(numArticles);
    let resp = [];
    //key by UID, timestamp(descending), then query by category, maybe we will have some sort of relevance score here later?
    db.collection('articles')
    .orderBy('timestamp','desc')
    .startAfter(Math.max(0, parseInt(lastTimestamp)))
    .limit(parseInt(numArticles))
    .get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        let data = doc.data();
        resp.push(data);
      })
      res.send(resp);
    }) 
  });

/**
 * Runs the NLP python script with the given article.
 * @param {article} article 
 */
function processText(article) {
  var options = {
    args: ['arg1', 'arg2 wow', 'arg3']
  }

  // TODO
  PythonShell.run('processText.py', options, function (error, results) {
    if(error) throw error;

    // Set result to article.summarizedText
    article.summarizedText = results;

    // Save the article to db.
    db.collection('articles').add(article);
  });
}


module.exports = router;