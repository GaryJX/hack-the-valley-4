import React from 'react';
import './NewsFeedComponent.scss';
import axios from 'axios';
import Masonry from 'react-masonry-css';

const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2,
};

let containerCount = 0;

class CellContainer extends React.Component {
    constructor(props) {
        super(props);
        this.containerId = containerCount++;
    }

    render() {
        const { data } = this.props;

        return (
            <div className='news-article' {...this.props}>
                <div className='news-article--header'>
                    {data.title}
                </div>
                <div className='news-article--summary'>
                    {data.summarizedText}
                </div>
            </div>
        );
    }
}

export default class NewsFeedComponent extends React.Component {
    constructor(props) {
        super(props);
        const width = window.innerWidth;
        this.state = {
            // Test Mock Data
            // articles: [
            //     {
            //         title: 'Clickbait title 1',
            //         summarizedText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //         link: 'https://www.cnn.com/2020/02/15/opinions/presidents-day-george-washington-real-story-coe-carr/index.html',
            //         timestamp: 1581795106000,
            //     },
            //     {
            //         title: 'Clickbait title 2',
            //         summarizedText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //         link: 'https://www.cnn.com/2020/02/15/opinions/presidents-day-george-washington-real-story-coe-carr/index.html',
            //         timestamp: 1581795106000,
            //     },                
            //     {
            //         title: 'Clickbait title 3',
            //         summarizedText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //         link: 'https://www.cnn.com/2020/02/15/opinions/presidents-day-george-washington-real-story-coe-carr/index.html',
            //         timestamp: 1581795106000,
            //     },
            //     {
            //         title: 'Clickbait title 1',
            //         summarizedText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //         link:  'https://www.cnn.com/2020/02/15/opinions/presidents-day-george-washington-real-story-coe-carr/index.html',
            //         timestamp: 1581795106000,
            //     },
            //     {
            //         title: 'Clickbait title 2',
            //         summarizedText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //         link: 'https://www.cnn.com/2020/02/15/opinions/presidents-day-george-washington-real-story-coe-carr/index.html',
            //         timestamp: 1581795106000,
            //     },                
            //     {
            //         title: 'Clickbait title 3',
            //         summarizedText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt consectetur adipiscing elit, sed do eiusmod tempor incididunt consectetur adipiscing elit, cing elit, sed do eiusmod tempor incididunt consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //         link:  'https://www.cnn.com/2020/02/15/opinions/presidents-day-george-washington-real-story-coe-carr/index.html',
            //         timestamp: 1581795106000,
            //     },
            //     {
            //         title: 'Clickbait title 1',
            //         summarizedText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //         link:  'https://www.cnn.com/2020/02/15/opinions/presidents-day-george-washington-real-story-coe-carr/index.html',
            //         timestamp: 1581795106000,
            //     },
            //     {
            //         title: 'Clickbait title 2',
            //         summarizedText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //         link: 'https://www.cnn.com/2020/02/15/opinions/presidents-day-george-washington-real-story-coe-carr/index.html',
            //         timestamp: 1581795106000,
            //     },                
            //     {
            //         title: 'Clickbait title 2',
            //         summarizedText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //         link:  'https://www.cnn.com/2020/02/15/opinions/presidents-day-george-washington-real-story-coe-carr/index.html',
            //         timestamp: 1581795106000,
            //     },     
            // ],
            articles: []
        }

        this.getNewsArticles();
    }

    getNewsArticles = () => {
        // TODO: Grab data from /articles endpoint, and populate my state with it
        axios.get('http://localhost:3000/articles?numArticles=3').then((res) => {
            console.log(res);
            console.log('Received data');

        }).catch((err) => {
            console.error(err);

        });
    }

    openArticleLink = (link) => {
        if (link) {
            window.open(link, "_blank");
        }
    }

    NewsFeedItem = (props) => {
        const { article } = props;
        const months = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        let dateString = null;
        if (article.timestamp) {
            const date = new Date(article.timestamp);
            dateString = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
        }

        return (
            <div className='news-article-container' onClick={() => this.openArticleLink(article.link)}>
                <div className='news-article'>
                    <div className='news-article--header'>
                        <div className='news-article--header-title'>{article.title}</div>
                        {
                            dateString ?
                            <div className='news-article--header-timestamp'>{dateString}</div> :
                            null
                        }
                    </div>
                    <div className='news-article--summary'>
                        <div className='news-article--summary-title'>Summary</div>
                        {article.summarizedText}
                        {
                            article.tags && article.tags.length > 0 ?
                            <div>TODO: Article tags</div>:
                            null
                        }
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const breakpointColumnsObj = {
            default: 3,
            900: 2,
            600: 1
        };
        
        return (
            <main className='news-feed'>
                <div className='news-feed-header'>Your Curated News Feed</div>
                <div className='articles-container'>
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className='masonry-grid'
                        columnClassName='masonry-grid-column'
                    >
                    {
                        this.state.articles.map((item, index) => (
                            <this.NewsFeedItem article={item} />
                        ))
                    }
                    </Masonry>
                </div>
            </main>
        );
    }
}

const styles = {
    container: {
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        // border: '0.5px solid black',
    },
    containerGridLeft: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        border: '0.5px solid black',
    },
    containerGridRight: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        border: '0.5px solid black',
    },
};