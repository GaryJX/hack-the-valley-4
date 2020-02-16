import React from 'react';
import './NewsFeedComponent.scss';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import LoadingIcon from '../../assets/loading.svg';


const NUM_ARTICLES = 12;

export default class NewsFeedComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: true,
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
        const windowHeight = window.innerHeight + window.pageYOffset;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        return (windowHeight + 5) >= (docHeight);
    }

    getNewsArticles = () => {
        console.log('Called real news articles')
        // TODO: Grab data from /articles endpoint, and populate my state with it
        const url = `http://localhost:3000/articles?numArticles=${NUM_ARTICLES}&lastTimestamp=${this.lastTimestamp}&preferredCategories=helloworld`;
        console.log(url);
        axios.get(url).then((res) => {
            if (res.data.length > 0) {
                this.lastTimestamp = res.data[res.data.length-1].timestamp;
                this.setState({ articles: this.state.articles.concat(res.data) });
            }
            console.log(res);
            console.log('Received data');
            console.log(res.data[res.data.length - 1]);

        }).catch((err) => {
            console.error(err);

        }).finally(() => {
            this.setState({ loading: false });
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
                        {article.summarizedText ? article.summarizedText : article.fullText}
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

        if (this.state.loading) {
            return <div className='loading-container'><img src={LoadingIcon} /></div>
        } else {
            return (
                <main className='news-feed'>
                    <div className='news-feed-header'>Your News Feed</div>
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