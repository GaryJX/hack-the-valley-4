var express = require('express');
var router = express.Router();
const NewsApi = require("newsapi");
const newsapi = new NewsApi("81f9f0508eed4fd6b5792bf70e4b7ad1");

/* GET news listing. */
router.get('/everything', function(req, res, next) {
  let source = req.query.source;
  let language = req.query.language;
  if(source){
    newsapi.v2.everything({
        sources: source,
        language: language
      }).then(response => {
        res.send(response)
      });
  }else{
      console.log("empty source: ".concat(source));
      res.status("400").send("empty source: ".concat(source));
  }
});

module.exports = router;
