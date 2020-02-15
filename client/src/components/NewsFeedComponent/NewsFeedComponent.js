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

const NUM_ARTICLES = 12;

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
        this.state = {
            articles: [],
        }

        this.numArticles = NUM_ARTICLES;
        this.lastTimestamp = -1;

        this.getNewsArticles();
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () => {
        if (this.hasReachedBottom()) {
            console.log('Reached bottom!');
            this.getNewsArticles();
        }
    }

    hasReachedBottom = () => {
        return (
            document.body.offsetHeight + document.body.scrollTop ===
            document.body.scrollHeight
          );
    }

    getNewsArticles = () => {
        // TODO: Grab data from /articles endpoint, and populate my state with it
        axios.get(`http://localhost:3000/articles?numArticles=${NUM_ARTICLES}&lastTimestamp=${this.lastTimestamp}&preferredCategories=helloworld`).then((res) => {
            console.log(res);
            console.log('Received data');
            this.lastTimestamp = res.data[res.data.length-1].timestamp;
            this.setState({ articles: this.state.articles.concat(res.data) });

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
                        {/* Change to summarizedText */}
                        {article.fullText} 
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