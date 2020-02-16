import React from 'react';
import './NewsFeedComponent.scss';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import LoadingIcon from '../../assets/loading.svg';
import ExternalIcon from '../../assets/external';

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
        const url = `http://localhost:3000/articles?numArticles=${NUM_ARTICLES}&lastTimestamp=${this.lastTimestamp}&userId=${this.props.userId}`;
        axios.get(url).then((res) => {
            if (res.data.length > 0) {
                this.lastTimestamp = res.data[res.data.length-1].timestamp;
                this.setState({ articles: this.state.articles.concat(res.data) });
            }
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            this.setState({ loading: false });
        });
    }

    openArticleLink = (article) => {
        if (article.link) {
            if (article.tags) {
                const url = 'http://localhost:3000/stats';
                const data = {
                    userId: this.props.userId,
                    categories: article.tags
                };
                axios.post(url, data).catch((err) => {
                    console.error(err);
                });
            }
            window.open(article.link, "_blank");
        }
    }

    ArticleTags = (props) => {
        let { tags } = props;

        return (
            <div className='article-tags'>
                {
                    tags.map((item, index) => (
                    <div key={index} className='article-tag'>{item}</div>
                    ))
                }
            </div>
        );
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
            <div className='news-article-container' onClick={() => this.openArticleLink(article)}>
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
                        <ExternalIcon />
                        {article.summarizedText ? article.fullText : article.fullText}
                        {
                            article.tags && article.tags.length > 0 ?
                            <this.ArticleTags tags={article.tags} /> :
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
            return <div className='loading-container'><img alt='loading' src={LoadingIcon} /></div>
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
                                <this.NewsFeedItem key={index} article={item} />
                            ))
                        }
                        </Masonry>
                    </div>
                </main>
            );
        }
    }
}
