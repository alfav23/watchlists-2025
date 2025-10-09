import styles from './Feed.module.scss';
import Watchlist from '../Watchlist';

export const Feed = () => {
    return (
        <div className={styles.feedContainer}>
            <div className={styles.feedTitle}>
                <h1>Feed</h1>
                <button className={styles.friendsTab}  >friends</button>
                <button className={styles.everyoneTab}>everyone
                </button>
            </div>
            <div className={styles.watchlistsContainer}>
                <ul>
                    <li className={styles.watchlist}>
                        <Watchlist />
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Feed;