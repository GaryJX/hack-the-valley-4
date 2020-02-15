var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccount.json");
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const { check, validationResult } = require('express-validator');
let {PythonShell} = require('python-shell');

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

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/object', function (req, res, next) {

  db.collection("objectdump").add(
    req.body
  )
  res.json(req.body);
});


router.post('/ingest/addArticle', [
  check('title').isString(),
  check('fullText').isString(),
  check('summarizedText').isString(),
  check('author').isString(),
  check('timestamp').isInt()],
  function (req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors});

    var article = {
      title: req.body.title,
      fullText: req.body.fullText,
      summarizedText: req.body.summarizedText,
      author: req.body.author,
      timestamp: req.body.timestamp
    }

    db.collection('articles').add(article);
    res.json(article);
});

router.post('/ingest/processText', [
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
    res.json(article);
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
    console.log("results..." + results);

    // Set result to article.summarizedText
    // Save the article to db.
  });
}


module.exports = router;