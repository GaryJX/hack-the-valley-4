let Parser = require('rss-parser');
var parser = new Parser();

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
            // Check if this article exists in db.
            let query = db.collection('articles').where('fullText', '==', item.content).get().then(snapshot => {
                
                if(!snapshot.empty) {
                    console.log(`${item.title} exists in database, not adding!`);
                    return; // Article exists.
                }
                
                // Does not exist... let's add it. No need to summarize now.
                var timestamp = new Date(item.isoDate || '').getTime(); // TODO: Parse item.isoDate to time in millis.

                db.collection('articles').add({
                    title: item.title || '',
                    fullText: item.content || '',
                    summarizedText: item.content || '',
                    author: item.creator || '',
                    timestamp: timestamp || '',
                    link: item.link || ''
                });
                console.log(`Added article: ${item.title}`); 

            }).catch(err => {
                console.log("Error checking if article exists", err);
            });
        });
    });
}

var parseServiceMapping = {
    'newyorktimes': newYorkTimesParser
}

function populateFromService(key) {
    parseServiceMapping[key]();
}

populateFromService('newyorktimes');
