'use client';

import styles from './Watchlist.module.scss';
import Image from "next/image";

export const Watchlist = () => {
    return (
        <div className={styles.watchlist}>
            <div className={styles.watchlistHeader}>
                <div className={styles.userInfo}>
                    <Image 
                        src="/images/cinnamoroll.png"
                        width={50}
                        height={50}
                        alt='Lily profile pic'
                    />
                    <p>@lil_lily</p>
                </div>
                <div className={styles. watchlistDescription}>
                    <p>Public</p>
                    <p>Anime</p>
                    <p>Movies + Shows</p>
                </div>
            </div>
            <div className={styles.watchlistContent}>
                <h1 className={styles.watchlistTitle}>Lily's Anime Recs</h1>
                <ul className={styles.items}>
                    <li className={styles.itemName}>Spirited Away</li>
                    <li className={styles.itemName}>Howl's Moving Castle</li>
                    <li className={styles.itemName}>Graveyard of Fireflies</li>
                    <li className={styles.itemName}>Naruto</li>
                    <a href="./#watchlistId">see more ...</a>
                </ul>
                <div className={styles.tags}>
                    <a href='#anime'>#anime</a>
                    <a href="#cartoon"> #cartoon</a>
                    <a href='#seeMore'> #...</a>
                </div>
            </div>
        </div>
    )
}

export default Watchlist;