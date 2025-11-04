'use client';
import { useState, useEffect } from 'react';
import styles from './Watchlist.module.scss';
import Image from "next/image";
import { CiStar, CiHeart } from 'react-icons/ci';
import { TfiComment } from "react-icons/tfi";
import { db } from "../../lib/firebaseConfig";
import { doc, updateDoc, collection, query, getDocs, where, getDoc } from 'firebase/firestore';
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
}

export default function Watchlist({
    isPrivate,
    comments
}: WatchlistProps) {
    const router = useRouter();
    const [ likedWatchlists, setLikedWatchlists ] = useState<{[key: string]: boolean}>({});
    const [ savedWatchlists, setSavedWatchlists ] = useState<{[key: string]: boolean}>({});
    const [ commentCount, setCommentCount ] = useState(comments || 0);
    const colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];
    const profilePicURL = "https://picsum.photos/50";
    
        let status = "";

        if (isPrivate !== false) {
            status = "Private"
        } else {
            status = "Public"
        }

        const getProfilePic = async (watchlist: any) => {
            try {
                const watchlistRef = doc(db, "watchlists", watchlist.id);
                const watchlistSnap = await getDoc(watchlistRef);
                const watchlistData = watchlistSnap.data();
                const creator = watchlistData?.creatorID;
                if (!creator) return null;

                const creatorRef = doc(db, "users", creator);
                const creatorSnap = await getDoc(creatorRef);
                const creatorData = creatorSnap.data();
                return JSON.stringify(creatorData?.profilePicURL)  || null;
            } catch (error) {
                console.error("Failed to fetch profile pic", error);
                return null;
            }
        };

        const handleSave = async (watchlist: any) => {
            const isSaved = savedWatchlists[watchlist.id];
            const newSaveCount = isSaved ? watchlist.saves - 1 : watchlist.saves + 1;
            
            try {
                const watchlistRef = doc(db, "watchlists", watchlist.id);
                await updateDoc(watchlistRef, {
                    saves: newSaveCount,
                    favorited: !isSaved
                });
                
                setSavedWatchlists(prev => ({
                    ...prev,
                    [watchlist.id]: !isSaved
                }));
                
                // Fetch latest data
                await fetchPublicWatchlists();
                console.log(watchlist.title, "has", newSaveCount, "saves! Watchlist is saved to your lists!");
            } catch(error) {
                console.error("Failed to update save count", error);
            }
        };

        const handleLike = async(watchlist: any) => {
            const isLiked = likedWatchlists[watchlist.id];
            const newLikeCount = isLiked ? watchlist.likes - 1 : watchlist.likes + 1;
            
            try {
                const watchlistRef = doc(db, "watchlists", watchlist.id);
                await updateDoc(watchlistRef, {
                    likes: newLikeCount,
                });
                
                setLikedWatchlists(prev => ({
                    ...prev,
                    [watchlist.id]: !isLiked
                }));
                
                // Fetch latest data
                await fetchPublicWatchlists();
                console.log(watchlist.title, "now has", newLikeCount, "likes!");
            } catch(error) {
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

        const handleCommentClick = async (watchlist: any) => {
            console.log("Leave a comment");
            router.push(`/commentForm/${watchlist.id}`);
            
        };

        const handleWatchlistClick = async (watchlist: any) => {
            router.push(`/${watchlist.id}`)
        };

    // filter watchlists based on public or private status
    const watchlists = collection(db, "watchlists");
    const q = query(watchlists, where("private", "==", false));
    const [publicWatchlists, setPublicWatchlists] = useState<any[]>([]);

    const fetchPublicWatchlists = async () => {
        const querySnapshot = await getDocs(q);
        const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPublicWatchlists(lists);
    };

    useEffect(() => {
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
                                        src={profilePicURL}
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
                            <CiStar key={`${watchlist.id}-star`} className={styles.favorite} onClick={() => handleSave(watchlist)}/>
                            <FaStar 
                                key={`${watchlist.id}-starred`}  
                                style={{ display: savedWatchlists[watchlist.id] ? "flex" : "none" }} 
                                className={styles.userFavorited}
                            />
                            <span>{watchlist.saves}</span>

                            <CiHeart key={`${watchlist.id}-heart`}  className={styles.like} onClick={() => handleLike(watchlist)}/>
                            <IoMdHeart 
                                key={`${watchlist.id}-hearted`}  
                                style={{ display: likedWatchlists[watchlist.id] ? "flex" : "none" }} 
                                className={styles.userLiked}
                            />
                            <span>{watchlist.likes}</span>

                            <TfiComment key={`${watchlist.id}-comment`}  className={styles.comment} onClick={() => handleCommentClick(watchlist)}/>
                            <span>{comments}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}