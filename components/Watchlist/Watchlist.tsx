'use client';
import { useEffect, useState } from 'react';
import styles from './Watchlist.module.scss';
import Image from "next/image";
import { CiStar, CiHeart } from 'react-icons/ci';
import { TfiComment } from "react-icons/tfi";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from '../../lib/firebaseConfig';
import { orderBy, getDocs, query, collection } from 'firebase/firestore';

export const Watchlist = () => {
    
    const [ watchlists, setWatchlists ] = useState<any[]>([]);
    const [ fullName, setFullName ] = useState<string>("");
    const [ username, setUsername ] = useState<string>("");
    const { user } = useAuth();

    // useEffect(() => {
    //     const fetchWatchlists = async () => {
    //         try {
    //             const q = query(collection(db, "public-watchlists"), orderBy("createdAt", "desc"));
    //             const querySnapshot = await getDocs(q);
    //             const watchlistsData = querySnapshot.docs.map((doc) => {
    //                 const data = doc.data();

    //                 return {
    //                     id: doc.id,
    //                     ...data, 
    //                 }
    //             }),
    //         };
    //     });
    //     setWatchlists(watchlistsData);
    // } catch (error) {
    //     console.error("Error fetching watchlists", error);
    // }
    // return (
    //     public-watchlist.forEach(watchlist => {
            
    //     });

    return (
        <div className={styles.watchlist}>
            <div className={styles.reactions}>
                {/* save/favorite */}
                <CiStar className={styles.favorite} />
                {/* like */}
                <CiHeart className={styles.like} />
                {/* comment */}
                <TfiComment className={styles.comment} />
            </div>
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
                    Tags:
                    <a href='#anime'>#anime</a>
                    <a href="#cartoon"> #cartoon</a>
                    <a href='#seeMore'> #...</a>
                </div>
            </div>
        </div>
    )
}

export default Watchlist;