var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccount.json");
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

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
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/object', function(req, res, next) {

  db.collection("objectdump").add(
    req.body
  )
  res.json(req.body);
});

module.exports = router;