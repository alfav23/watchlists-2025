import styles from './Feed.module.scss';
import Watchlist  from '../Watchlist';
import { SiVoidlinux } from 'react-icons/si';

export const Feed = () => {
    return (
        <div className={styles.feedContainer}>
            <div className={styles.feedTitle}>
                <h1>Feed</h1>
                <button className={styles.friendsTab}>friends</button>
                <button className={styles.everyoneTab}>everyone
                </button>
            </div>
            <div className={styles.watchlistsContainer}>
                <ul>
                    <li className={styles.watchlist}>
                        <Watchlist
                            isPrivate={false}
                            watchlistId="lil_lily-01"
                            title="Lily's Anime Recs"
                            tags={["anime", "cartoon", "romance", "drama", "action", "adventure"]}
                            username='lil_lily'
                            items={["Spirited Away", "Howl's Moving Castle", "Graveyard of Fireflies", "Naruto"]}
                            category='Anime'
                            saves={3}
                            likes={12}
                            comments={4}
                            onDelete={(watchlistId) => {
                               watchlistId = "";
                            }}
                        />
                    </li>
                    <li className={styles.watchlist}>
                        <Watchlist
                            isPrivate={false}
                            watchlistId="lil_lily-01"
                            title="Lily's Anime Recs"
                            tags={["anime", "cartoon", "romance", "drama", "action", "adventure"]}
                            username='lil_lily'
                            items={["Spirited Away", "Howl's Moving Castle", "Graveyard of Fireflies", "Naruto"]}
                            category='Anime'
                            saves={3}
                            likes={12}
                            comments={4}
                            onDelete={(watchlistId) => {
                               watchlistId = "";
                            }}
                        />
                    </li>
                    <li className={styles.watchlist}>
                        <Watchlist
                            isPrivate={false}
                            watchlistId="lil_lily-01"
                            title="Lily's Anime Recs"
                            tags={["anime", "cartoon", "romance", "drama", "action", "adventure"]}
                            username='lil_lily'
                            items={["Spirited Away", "Howl's Moving Castle", "Graveyard of Fireflies", "Naruto"]}
                            category='Anime'
                            saves={3}
                            likes={12}
                            comments={4}
                            onDelete={(watchlistId) => {
                               watchlistId = "";
                            }}
                        />
                    </li>
                    <li className={styles.watchlist}>
                        <Watchlist
                            isPrivate={false}
                            watchlistId="lil_lily-01"
                            title="Lily's Anime Recs"
                            tags={["anime", "cartoon", "romance", "drama", "action", "adventure"]}
                            username='lil_lily'
                            items={["Spirited Away", "Howl's Moving Castle", "Graveyard of Fireflies", "Naruto"]}
                            category='Anime'
                            saves={3}
                            likes={12}
                            comments={4}
                            onDelete={(watchlistId) => {
                               watchlistId = "";
                            }}
                        />
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Feed;