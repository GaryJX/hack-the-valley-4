let Parser = require('rss-parser');
var parser = new Parser();

var DomParser = require('dom-parser');
var domParser = new DomParser();

let { PythonShell } = require('python-shell');

const request = require('request');

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

var cnnXML = ['http://rss.cnn.com/rss/cnn_topstories.rss', 'http://rss.cnn.com/rss/cnn_world.rss', 'http://rss.cnn.com/rss/cnn_allpolitics.rss', 'http://rss.cnn.com/rss/cnn_tech.rss', 'http://rss.cnn.com/rss/cnn_health.rss']

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

            if (article.title == '' || article.fullText == '' || article.timestamp == '' || article.link == '') {
                // console.log("Invaid. Item...");
                // console.dir(item);
                // console.dir(article);
            } else {
                let query = db.collection('articles').where('fullText', '==', article.fullText).get().then(snapshot => {

                    if (!snapshot.empty) {
                        console.log(`${article.title} exists in database, not adding!`);
                        return; // Article exists.
                    }

                    request(aItem... Not saving in DB");
                    // console.dir(article);rticle.link, function (err, res, body) {
                        var dom = domParser.parseFromString(body);
                        var articleBody = dom.getElementsByClassName('zn-body__paragraph');
                        if (articleBody) {
                            var articleContent = '';
                            articleBody.forEach(element => {
                                articleContent += element.textContent + ' ';
                            });

                            summarizeAndStore(article, articleContent);
                        }
                    });
                }).catch(err => {
                    console.log(`Error checking if article ${article.title} exists`, err);
                });
            }
        });
    });
}

function summarizeAndStore(article, articleContent) {
    PythonShell.run('processText.py', { args: [articleContent] }, function (error, results) {
        if (error) throw error;

        // Set result to article.summarizedText
        if (results && results[0]) {
            article.summarizedText = results[0];
        }

        if (article.title == '' || article.fullText == '' || article.title == '' || article.summarizedText == '' || article.link == '') {
            // console.log("Invaid. Item... Not saving in DB");
            // console.dir(article);
        } else {
            // Save the article to db.
            console.log(`Saved ${article.title} to db`);
            db.collection('articles').add(article);
        }
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
