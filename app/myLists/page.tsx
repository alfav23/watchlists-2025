"use client";
import styles from './MyLists.module.scss';
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { FaTrash } from "react-icons/fa";
import onDelete from "../../components/Watchlist";
import { MdEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa6';
// import { getAuth } from 'firebase/auth';

const privateWatchlistsPage = () => {
    // // add back when user has profile image option
    // const auth = getAuth();
    // const user = auth.currentUser;
    // const image = user.profileImage;
    const image = "/public/images/cinnamoroll.png";
    const colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];

    const handleEdit = () => {
        
    }

    const handleMakePublic = () => {
    }

// filter watchlists based on public or private status
    const watchlists = collection(db, "watchlists");
    const q = query(watchlists, where("private", "==", true));
    const [privateWatchlists, setPrivateWatchlists] = useState<any[]>([]);

    useEffect(() => {
        const fetchPrivateWatchlists = async () => {
            const querySnapshot = await getDocs(q);
            const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPrivateWatchlists(lists);
        };
        fetchPrivateWatchlists();
    }, []);

    return (
        <div className={styles.privateListsFeed}>
            {privateWatchlists.length === 0 ? (
                <p>Your feed is empty!</p>
            ) : (
                privateWatchlists.map((watchlist) => (
                    <div key={watchlist.id} className={styles.watchlistContainer}>
                        <div style={{backgroundColor: `${colorPalette[Math.floor(Math.random()*(4 - 0 + 1) + 0)]}`}} className={styles.watchlist}>
                            <div className={styles.watchlistHeader}>
                                <div className={styles.userInfo}>
                                    <Image 
                                        style={{background: `${colorPalette[Math.floor(Math.random()*(4 - 0 + 1) + 0)]}`}}
                                        src={image}
                                        // src={creatorID.profilePic}
                                        width={50}
                                        height={50}
                                        alt=''
                                    />
                                    <a href={watchlist.creatorID}>@{watchlist.creatorID}</a>
                                </div>
                                <div className={styles.watchlistDescription}>
                                    <p>{watchlist.private ? "Private" : "Public"}</p>
                                    <p>{watchlist.genre}</p>
                                    <p>Movies + Shows</p>
                                </div>
                            </div>
                            <div className={styles.watchlistContent}>
                                <h1 className={styles.watchlistTitle}>{watchlist.title}</h1>
                                {/* map watchlist.items */}
                                <ul className={styles.items}>
                                    {Array.isArray(watchlist.items) && watchlist.items.map((item: any, idx: number) =>
                                        <li key={idx}>{item}</li>
                                    )}
                                </ul>
                                <div className={styles.tags}>
                                    <p>Tags:</p>
                                    {Array.isArray(watchlist.tags) && watchlist.tags.map((item: any, idx: number) =>
                                        <a key={idx}>#{item}</a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <FaEye className={styles.makePublic} onClick={handleMakePublic}/>

                            <MdEdit className={styles.edit} onClick={handleEdit}/>

                            <FaTrash className={styles.delete} onClick={() => onDelete(watchlist.id)}/>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default privateWatchlistsPage;