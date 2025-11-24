import styles from './Feed.module.scss';
import Watchlist  from '../Watchlist';
import { MdAddBox } from "react-icons/md";
import Link from 'next/link';

export const Feed = () => {
    return (
        <div className={styles.feedContainer}>
            <div className={styles.feedTitle}>
                <h1>Feed</h1>
            </div>
            <div className={styles.watchlistsContainer}>
                <ul>
                    <li className={styles.watchlist}>
                        <Watchlist
                            watchlist={[]}
                            isPrivate={false}
                            watchlistId=""
                            title=""
                            tags={[]}
                            tag=''
                            username=''
                            items={[]}
                            item=""
                            genre=''
                            saves={0}
                            likes={0}
                            comments={0}
                        />
                    </li>
                </ul>
            </div>
            <div className={styles.feedFooter}>
                <Link 
                    href='/createWatchlist'
                    className={styles.createWatchlist}>
                        <MdAddBox 
                            style={
                                {fontSize: 80, color: "#f38b8bff"}}
                        />
                </Link>
            </div>
                
        </div>
    )
}

export default Feed;