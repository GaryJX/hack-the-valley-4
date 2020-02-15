var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");

const newsapiKey = "81f9f0508eed4fd6b5792bf70e4b7ad1"
/* GET news listing. */
router.get('/everything', function(req, res, next) {
  
  let source = req.query.sources;
  let language = req.query.language;

  let baseURL = "https://newsapi.org/v2/everything";
  if(source || language){
        let append = source && language ? "&" : "";
        let url = baseURL.concat("?",source ? 
        "sources=".concat(source) : "", 
        append, 
        language ? "language=".concat(language): "", 
        "&",
        "apiKey=".concat(newsapiKey));
        console.log(url);
        const respond = async url => {
            try{
                const response = await fetch(url);
                console.log("fetched");
                const json = await response.json();
                console.log(json);
                res.send(json);
                
            }catch(error){
                res.status("400").send("incorrect query parameters, incorrect language or source for article");
            }
            
        }

        respond(url);
  }else{
      console.log("empty source: ".concat(source));
      res.status("400").send("empty source: ".concat(source));
  }
});

module.exports = router;
