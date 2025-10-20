import styles from './Feed.module.scss';
import Watchlist  from '../Watchlist';
import { MdAddBox } from "react-icons/md";

export const Feed = () => {
    return (
        <div className={styles.feedContainer}>
            <div className={styles.feedTitle}>
                <h1>Feed</h1>
                {/* <div className={styles.feedTabs}>
                    <button className={styles.friendsTab}>friends</button>
                    <button className={styles.everyoneTab}>everyone
                    </button>
                </div> */}
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
                            username=''
                            items={[]}
                            item=""
                            genre=''
                            saves={0}
                            likes={0}
                            comments={0}
                            onDelete={(watchlistId) => {
                            watchlistId = "";
                            }}
                        />
                    </li>
                </ul>
            </div>
            <button className={styles.createWatchlist}>
                Create Watchlist 
                <MdAddBox />
            </button>
        </div>
    )
}

export default Feed;