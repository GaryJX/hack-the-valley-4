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

var cbcXML = ['https://www.cbc.ca/cmlink/rss-topstories']

    // var cnnXML = ['http://rss.cnn.com/rss/cnn_topstories.rss', 'http://rss.cnn.com/rss/cnn_world.rss', 'http://rss.cnn.com/rss/cnn_allpolitics.rss', 'http://rss.cnn.com/rss/cnn_tech.rss', 'http://rss.cnn.com/rss/cnn_health.rss']
    var cnnXML = ['http://rss.cnn.com/rss/cnn_topstories.rss'];

console.log("OK");

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

function isMalformedArticle(article) {
    return article.title == '' || article.fullText == '' || article.timestamp == '' || article.link == ''
}

var cbcParser = async function () {
    cbcXML.forEach(async link => {
        let feed = await parser.parseURL(link);
        feed.items.forEach(item => {
            var article = {
                title: item.title || '',
                fullText: item.contentSnippet || '',
                summarizedText: item.contentSnippet || '',
                author: item.creator || '',
                timestamp: new Date(item.isoDate || '').getTime() || '',
                link: item.link || ''
            }

            if(!isMalformedArticle(article)) {
                db.collection('articles').where('fullText', '==', article.fullText).get().then(snapshot => {
                    if(!snapshot.empty) {
                        console.log(`${article.title} exists in database, not adding!`);
                        return;
                    }

                    request(article.link, function(err, res, body) {
                        var dom = domParser.parseFromString(body);
                        var articleBody = dom.getElementsByClassName('story');
                        if (articleBody) {
                            var articleContent = '';
                            articleBody.forEach(element => {
                                articleContent += element.textContent + ' ';
                            });

                            // console.log(articleContent + '\n\n\n\n\n\n\n');
                            summarizeAndStore(article, articleContent);
                        }
                    });

                }).catch(err => {
                    console.log(`Error checking if article ${article.title} exists.`, err)
                });
            }
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
            
            if(!isMalformedArticle(article)) {
                db.collection('articles').where('fullText', '==', article.fullText).get().then(snapshot => {
                    if (!snapshot.empty) {
                        console.log(`${article.title} exists in database, not adding!`);
                        return; // Article exists.
                    }

                    request(article.link, function (err, res, body) {
                        var dom = domParser.parseFromString(body);
                        if(!dom || dom == '') 
                        // console.dir(dom);    
                        console.log(article.link);
                        var articleBody = dom.getElementsByClassName('zn-body__paragraph');
                        if (articleBody) {
                            var articleContent = '';
                            articleBody.forEach(element => {
                                articleContent += element.textContent + ' ';
                            });

                            console.log(articleContent + "\n\n\n\n");

                            summarizeAndStore(article, articleContent);
                        }
                    });
                }).catch(err => {
                    console.log(`Error checking if article ${article.title} exists.`, err)
                });
            }
        });
    });
}

var fs = require('fs');
var fsp = require('fs').promises;

async function summarizeAndStore(article, articleContent) {
    if(!articleContent || articleContent == '' || articleContent.trim() == '') return;

        // fs.open('test.txt', 'w', function (err, fd) {
        //     fs.writeSync(fd, articleContent);
        //     fs.fdatasyncSync(fd);
        //     fs.closeSync(fd);
            
        fs.writeFile('test.txt', articleContent, function(err) {
            if(err) throw err;
            PythonShell.run('nlp.py', { args: [] }, function (error, results) {
                if (error) throw error;
    
                console.log('asdad');
                console.dir(results);
                // Set result to article.summarizedText
                if (results && results[2]) {
                    console.dir(results[2]);
                    jsonObj = JSON.parse(results[2]);
    
                    article.summarizedText = jsonObj["summary"];
                    
                    // search tags
                    searchTags = [];
                    for (tag in jsonObj['classification_data']) {
                        searchTags.push(tag);
                    }
    
                    article.searchTags = searchTags;
                    
                    // categories
                    categories = [];
                    for (tag in jsonObj['entity_data']) {
                        categories.push(tag);
                    }
                    
                    article.categories = categories;
    
                    article.sentiment = jsonObj['sentiment_data'];
    
                    if (article.title == '' || article.fullText == '' || article.title == '' || article.summarizedText == '' || article.link == '') {
                        console.log("Invaid. Item... Not saving in DB");
                        console.dir(article);
                    } else {
                        // Save the article to db.
                        console.log(`Saved ${article.title} to db`);
                        console.dir(article);
                        db.collection('articles').add(article);
                    }
                }
            });
        });
        //});
        console.log('\n\n\n\n\nrunnn\n\n\n\n\n');

        /*let shell = new PythonShell('nlp.py', {mode : 'text'});
        shell.on('message', function (message) {
            console.log(message);
        });
        shell.send(articleContent);
        shell.end();*/
        

        // PythonShell.run('nlp.py', { args: [] }, function (error, results) {
        //     if (error) throw error;

        //     console.log('asdad');
        //     console.dir(results);
        //     // Set result to article.summarizedText
        //     if (results && results[1]) {
        //         console.dir(results[1]);
        //         jsonObj = JSON.parse(results[1]);

        //         article.summarizedText = jsonObj["summary"];
                
        //         // search tags
        //         searchTags = [];
        //         for (tag in jsonObj['classification_data']) {
        //             searchTags.push(tag);
        //         }

        //         article.searchTags = searchTags;
                
        //         // categories
        //         categories = [];
        //         for (tag in jsonObj['entity_data']) {
        //             categories.push(tag);
        //         }
                
        //         article.categories = categories;

        //         article.sentiment = jsonObj['sentiment_data'];

        //         if (article.title == '' || article.fullText == '' || article.title == '' || article.summarizedText == '' || article.link == '') {
        //             console.log("Invaid. Item... Not saving in DB");
        //             console.dir(article);
        //         } else {
        //             // Save the article to db.
        //             console.log(`Saved ${article.title} to db`);
        //             console.dir(article);
        //             db.collection('articles').add(article);
        //         }
        //     }
        // });
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
// summarizeAndStore({x: ''}, 'chor of the ABC News program, "This Week with Sam Donaldson and Cokie Roberts." He served as ABC just preside over the rebuilding of Lower Manhattan. He created affordable housing, improved education and reduced crime throughout the city.  Perhaps what struck me most about Bloomberg was when he talked about the biggest accomplishment of his first 100 days in office as mayor. He did not start bragging about the initiatives he was undertaking. Instead, he touted the');