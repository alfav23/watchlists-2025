'use client';
import { useState, useEffect } from 'react';
import styles from './Watchlist.module.scss';
import Image from "next/image";
import { CiStar, CiHeart } from 'react-icons/ci';
import { TfiComment } from "react-icons/tfi";
import { db } from "../../lib/firebaseConfig";
import { doc, updateDoc, collection, query, getDocs, setDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { IoMdHeart } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import CommentForm  from "../CommentForm";
// import { getAuth } from 'firebase/auth';

interface WatchlistProps {
    watchlist: object;
    isPrivate: boolean;
    watchlistId: string;
    title: string;
    tags: object;
    genre: string;
    username: string;
    items: object;
    item: string;
    saves: number;
    likes: number;
    comments: number;
    onDelete: (watchlistId: string) => void;
}

export default function Watchlist({
    isPrivate,
    watchlistId,
    saves,
    likes,
    comments
}: WatchlistProps) {
    const router = useRouter();
    const [ heartDisplay, setHeartDisplay ] = useState(false);
    const [ starDisplay, setStarDisplay ] = useState(false);
    const [ saveCount, setSaveCount ] = useState(saves || 0);
    const [ isSaved, setIsSaved ] = useState(false);
    const [ likeCount, setLikeCount ] = useState(likes || 0);
    const [ isLiked, setIsLiked ] = useState(false);
    const [ commentCount, setCommentCount ] = useState(comments || 0);
    const image = "/public/images/cinnamoroll.png";
    const colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];
    
        let status = ""

        if (isPrivate !== false) {
            status = "Private"
        } else {
            status = "Public"
        }

        const handleSave = async (watchlist: any) => {
            const newSaveCount = saveCount + 1;
            setIsSaved(!isSaved);
            setSaveCount(newSaveCount);
            setStarDisplay((prevStarDisplay) => !prevStarDisplay);

            try{
                const watchlistRef = doc(db, "watchlists", watchlist.id);
                await updateDoc(watchlistRef, {
                    saves: newSaveCount,
                    favorited: true
                });
                console.log(watchlist.title, "has", newSaveCount, "saves! Watchlist is saved to your lists!");
            } catch(error){
                console.error("Failed to update save count", error);
            }
        };

        const handleLike = async(watchlist: any) => {
            const newLikeCount = likeCount + 1;
            setIsLiked(!isLiked);
            setLikeCount(newLikeCount);
            setHeartDisplay((prevHeartDisplay) => !prevHeartDisplay);

            try{
                const watchlistRef = doc(db, "watchlists", watchlist.id);
                await updateDoc(watchlistRef, {
                    likes: newLikeCount,
                });
                console.log(watchlist.title, "now has", newLikeCount, "likes!");
            } catch(error){
                console.error("Failed to update like count", error);
            }
        };

        const handleCommentSubmit = async(watchlist: any) => {
        
            const newCommentCount = commentCount + 1;
            setCommentCount(newCommentCount);

            try {
                const watchlistRef = doc(db, "watchlists", watchlist.id);
                await updateDoc(watchlistRef, {
                    comments: newCommentCount,
                });
                    console.log(watchlist.title, "comments:", newCommentCount);
                } catch (error) {
                    console.error("Failed to update comment count", error);
                }

            };

        const handleCommentClick = async () => {
            console.log("Leave a comment");
            router.push("/commentForm")
            
        };

        const handleWatchlistClick = async () => {
            router.push(`/${watchlistId}`)
        };

    // filter watchlists based on public or private status
    const watchlists = collection(db, "watchlists");
    const q = query(watchlists, where("private", "==", false));
    const [publicWatchlists, setPublicWatchlists] = useState<any[]>([]);

    useEffect(() => {
        const fetchPublicWatchlists = async () => {
            const querySnapshot = await getDocs(q);
            const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPublicWatchlists(lists);
        };
        fetchPublicWatchlists();
    }, []);

    // // get profile pic from users collection
    // const users = collection(db, "users");
    // const qU = query(users, where("userId", "==", "creatorId"));

    // const fetchCreator = async () =>{
    //     const querySnapshotU = await getDocs(qU);
    //     const userIds = querySnapshotU.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // };
    // fetchCreator();

    return (
        <div>
            {publicWatchlists.length === 0 ? (
                <p>Your feed is empty!</p>
            ) : (
                publicWatchlists.map((watchlist) => (
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
                            <div onClick={handleWatchlistClick} className={styles.watchlistContent}>
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
                        <div className={styles.reactions}>
                            <CiStar className={styles.favorite} onClick={() => handleSave(watchlist)}/>
                            <FaStar style={{ display: starDisplay ? "flex" : "none" }} className={styles.userFavorited}/>
                            <span>{watchlist.saves}</span>

                            <CiHeart className={styles.like} onClick={() => handleLike(watchlist)}/>
                            <IoMdHeart style={{ display: heartDisplay ? "flex" : "none" }} className={styles.userLiked}/>
                            <span>{watchlist.likes}</span>

                            <TfiComment className={styles.comment} onClick={() => handleCommentClick}/>
                            <span>{comments}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}