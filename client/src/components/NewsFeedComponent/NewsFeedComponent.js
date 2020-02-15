import React from 'react';
import './NewsFeedComponent.scss';

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
                    {data.summary}
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
            articles: [
                {
                    title: 'Clickbait title 1',
                    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                {
                    title: 'Clickbait title 2',
                    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },                
                {
                    title: 'Clickbait title 3',
                    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                {
                    title: 'Clickbait title 1',
                    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                {
                    title: 'Clickbait title 2',
                    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },                
                {
                    title: 'Clickbait title 3',
                    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                {
                    title: 'Clickbait title 1',
                    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                {
                    title: 'Clickbait title 2',
                    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },                
            ],
        }
    }

    render() {
        return (
            <main className='news-feed'>
                <div className='news-feed-header'>Your Curated News Feed</div>
                <div className='articles-container'>
                    {/* <RecyclerListView 
                        useWindowScroll={true}
                        layoutProvider={this.layoutProvider} 
                        dataProvider={this.state.dataProvider}
                        rowRenderer={this.rowRenderer}
                    /> */}
                    {
                        this.state.articles.map((item, index) => (
                            <div className='news-article-container'>
                                <div className='news-article'>
                                    <div className='news-article--header'>
                                        {item.title}
                                    </div>
                                    <div className='news-article--summary'>
                                        {item.summary}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
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