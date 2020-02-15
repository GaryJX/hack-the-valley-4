let Parser = require('rss-parser');
var parser = new Parser();

const request = require('request');

var DomParser = require('dom-parser');
var domParser = new DomParser();
const firebase = require("firebase");

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


// Constants
var newYorkTimesXML = ['https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/EnergyEnvironment.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Economy.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/PersonalTech.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Books.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Music.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Television.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Theater.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/US.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Education.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml']

var cbcXML = ['https://www.cbc.ca/cmlink/rss-topstories', 'https://rss.cbc.ca/lineup/world.xml',
    'https://rss.cbc.ca/lineup/canada.xml', 'https://rss.cbc.ca/lineup/politics.xml', 'https://rss.cbc.ca/lineup/business.xml',
    'https://rss.cbc.ca/lineup/health.xml', 'https://rss.cbc.ca/lineup/arts.xml', 'https://rss.cbc.ca/lineup/technology.xml']

var cnnXML = ['http://rss.cnn.com/rss/cnn_topstories.rss']

function addArticle(article) {
    // Check if this article exists in db.
    let query = db.collection('articles').where('fullText', '==', article.fullText).get().then(snapshot => {

        if (!snapshot.empty) {
            console.log(`${article.title} exists in database, not adding!`);
            return; // Article exists.
        }

        // Does not exist... let's add it. No need to summarize now.
        db.collection('articles').add(article);
        console.log(`Added article: ${article.title}`);

    }).catch(err => {
        console.log(`Error checking if article ${article.title} exists`, err);
    });
}
/**
 * {
  creator: 'Peter Libbey',
  title: 'Martin Luther King Jr. Day: 8 Places in New York to Remember His Legacy',
  link: 'https://www.nytimes.com/2020/01/16/arts/mlk-day-events-new-york.html?emc=rss&partner=rss',
  pubDate: 'Thu, 16 Jan 2020 17:20:12 +0000',
  'dc:creator': 'Peter Libbey',
  content: 'At events across the city, you can commemorate King’s achievements or follow his example of activism and service.',
  contentSnippet: 'At events across the city, you can commemorate King’s achievements or follow his example of activism and service.',
  guid: 'https://www.nytimes.com/2020/01/16/arts/mlk-day-events-new-york.html',
  categories: [
    { _: 'Brooklyn Academy of Music', '$': [Object] },
    {
      _: 'Cathedral Church of St John the Divine (Manhattan, NY)',
      '$': [Object]
    },
    { _: 'Manhattan Country School', '$': [Object] },
    { _: 'Museum of the City of New York', '$': [Object] },
    {
      _: 'Schomburg Center for Research in Black Culture',
      '$': [Object]
    },
    { _: 'King, Martin Luther Jr', '$': [Object] }
  ],
  isoDate: '2020-01-16T17:20:12.000Z'
}

 */
var newYorkTimesParser = async function () {
    newYorkTimesXML.forEach(async link => {
        let feed = await parser.parseURL(link);
        feed.items.forEach(item => {
            addArticle({
                title: item.title || '',
                fullText: item.content || '',
                summarizedText: item.content || '',
                author: item.creator || '',
                timestamp: new Date(item.isoDate || '').getTime() || '',
                link: item.link || ''
            });
        });
    });
}

var cbcParser = async function () {
    cbcXML.forEach(async link => {
        let feed = await parser.parseURL(link);
        feed.items.forEach(item => {
            addArticle({
                title: item.title || '',
                fullText: item.contentSnippet || '',
                summarizedText: item.contentSnippet || '',
                author: item.creator || '',
                timestamp: new Date(item.isoDate || '').getTime() || '',
                link: item.link || ''
            });
        });
    });
}

var cnnParser = async function () {
    cnnXML.forEach(async link => {
        let feed = await parser.parseURL(link);
        feed.items.forEach(item => {
            var article = {
                title: item.title || '',
                fullText: item.contentSnippet || '',
                summarizedText: item.contentSnippet || '',
                author: item.creator || '',
                timestamp: new Date(item.isoDate || '').getTime() || '',
                link: item.guid || ''
            };

            request(article.link, function (err, res, body) {
                var dom = domParser.parseFromString(body);
                var articleBody = dom.getElementsByClassName('zn-body__paragraph');
                if(articleBody) {
                    console.log("----");
                    articleBody.forEach(element => {
                        console.log(element.textContent);
                    });
                    console.log("----");
                }
                
            });

            
            // console.log(article.link);
            // xray('http://google.com', 'title')(function(err, title) {
                // console.log(title) // Google
            // })
            // xray(article.link, 'title')(function (err, result) {
            //     console.dir(result);
            // });
            // request(article.link, function (err, res, body) {
            //     var soup = new JSSoup(body);
            //     var tag = soup.findAll('div');
            //     console.log(tag);
            // });
            // addArticle();
        });
    });
}

var parseServiceMapping = {
    'newyorktimes': newYorkTimesParser,
    'cbc': cbcParser,
    'cnn': cnnParser
}

function populateFromService(key) {
    parseServiceMapping[key]();
}

populateFromService('cnn');
