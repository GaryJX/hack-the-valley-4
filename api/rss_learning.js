let Parser = require('rss-parser');
var parser = new Parser();

// Constants
var newYorkTimesXML = ['https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml']

var newYorkTimesParser = async function () {
    newYorkTimesXML.forEach(async link => {
        let feed = await parser.parseURL(link);
        console.log(feed.items)
        feed.items.forEach(item => {
            console.dir(item);
            console.log(`${item.title}\n${item.link}\n${item.description}`);
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
