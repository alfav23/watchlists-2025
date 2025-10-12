'use client';
import { useState } from 'react';
import styles from './Watchlist.module.scss';
import Image from "next/image";
import { CiStar, CiHeart } from 'react-icons/ci';
import { TfiComment } from "react-icons/tfi";
import { db } from '../../lib/firebaseConfig';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { IoMdHeart } from "react-icons/io";
import { FaStar } from "react-icons/fa6";

interface WatchlistProps {
    isPrivate: boolean;
    watchlistId: string;
    title: string;
    tags: object;
    category: string;
    username: string;
    items: object;
    saves: number;
    likes: number;
    comments: number;
    onDelete: (watchlistId: string) => void;
}

export default function Watchlist({
    isPrivate,
    username,
    watchlistId,
    title,
    tags,
    category,
    items,
    saves,
    likes,
    comments,
    onDelete
}: WatchlistProps) {
    const router = useRouter();
    const [ heartDisplay, setHeartDisplay ] = useState(false);
    const [ starDisplay, setStarDisplay ] = useState(false);
    const [ saveCount, setSaveCount ] = useState(saves || 0);
    const [ isSaved, setIsSaved ] = useState(false);
    const [ likeCount, setLikeCount ] = useState(likes || 0);
    const [ isLiked, setIsLiked ] = useState(false);
    const [ commentCount, setCommentCount ] = useState(comments || 0);
    let status = "";
    

        if (isPrivate !== false) {
            status = "Private"
        } else {
            status = "Public"
        }

    const handleSave = async () => {
        const newSaveCount = saveCount + 1;
        setIsSaved(!isSaved);
        setSaveCount(newSaveCount);
        setStarDisplay((prevStarDisplay) => !prevStarDisplay);

        try{
            const watchlistRef = doc(db, "watchlists", watchlistId);
            await updateDoc(watchlistRef, {
                saves: newSaveCount,
            });
        } catch(error){
            console.error("Failed to update save count", error);
        }
    };

    const handleLike = async() => {
        const newLikeCount = likeCount + 1;
        setIsLiked(!isLiked);
        setLikeCount(newLikeCount);
        setHeartDisplay((prevHeartDisplay) => !prevHeartDisplay);
    }

    const handleComment = async () => {
        const newCommentCount = commentCount + 1;
        setCommentCount(newCommentCount);

        return (
            <div>
                {/* <CommentForm/> */}
            </div>
        )
    }

    const handleWatchlistClick = async () => {
        router.push(`/${watchlistId}`)
    }

    return (
        <div className={styles.watchlistContainer}>
            <div onClick={handleWatchlistClick} className={styles.watchlist}>
                <div className={styles.watchlistHeader}>
                    <div className={styles.userInfo}>
                        <Image 
                            src="/images/cinnamoroll.png"
                            width={50}
                            height={50}
                            alt='Lily profile pic'
                        />
                        <a href={username}>@{username}</a>
                    </div>
                    <div className={styles. watchlistDescription}>
                        <p>{status}</p>
                        <p>{category}</p>
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
                    </ul>
                    <div className={styles.tags}>
                        Tags:
                        <a href='#anime'>#anime</a>
                        <a href="#cartoon"> #cartoon</a>
                        <a href={`/${watchlistId}`}> #...</a>
                    </div>
                </div>
            </div>
            <div className={styles.reactions}>
                <CiStar className={styles.favorite} onClick={handleSave}/>
                <FaStar style={{ display: starDisplay ? "flex" : "none" }} className={styles.userFavorited}/>
                <span>{saves}</span>

                <CiHeart className={styles.like} onClick={handleLike}/>
                <IoMdHeart style={{ display: heartDisplay ? "flex" : "none" }} className={styles.userLiked}/>
                <span>{likes}</span>

                <TfiComment className={styles.comment} onClick={handleComment}/>
                <span>{comments}</span>
            </div>
        </div>
    )
}