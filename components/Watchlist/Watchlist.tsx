'use client';
import { useState, useEffect } from 'react';
import styles from './Watchlist.module.scss';
import Image from "next/image";
import { CiStar, CiHeart } from 'react-icons/ci';
import { TfiComment } from "react-icons/tfi";
import { db } from "../../lib/firebaseConfig";
import { doc, updateDoc, collection, query, getDocs, where, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { IoMdHeart } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import { useAuth } from '@/context/AuthContext';

interface WatchlistProps {
    watchlist: object;
    isPrivate: boolean;
    watchlistId: string;
    title: string;
    tags: object;
    tag: string;
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
    comments,
    title,
    tags,
    tag,
    items,
    item
}: WatchlistProps) {
    const router = useRouter();
    const [ likedWatchlists, setLikedWatchlists ] = useState<{[key: string]: boolean}>({});
    const [ savedWatchlists, setSavedWatchlists ] = useState<{[key: string]: boolean}>({});
    const [ commentCount, setCommentCount ] = useState(comments || 0);
    const { user, loading } = useAuth();

    
        let status = "";

        if (isPrivate !== false) {
            status = "Private"
        } else {
            status = "Public"
        }

        const handleSave = async (watchlist: any) => {
            if (!user) {
                console.warn('User not signed in, cannot save');
                router.push("/signup");
                return;
            }
            const uid = user.uid;
            const isSaved = savedWatchlists[watchlist.id];

            try {
                const watchlistRef = doc(db, "watchlists", watchlist.id);
                if (isSaved) {
                    // remove user from savedBy
                    await updateDoc(watchlistRef, {
                        savedBy: arrayRemove(uid),
                        favorited: false
                    });
                } else {
                    // add user to savedBy
                    await updateDoc(watchlistRef, {
                        savedBy: arrayUnion(uid),
                        favorited: true
                    });
                }

                setSavedWatchlists(prev => ({
                    ...prev,
                    [watchlist.id]: !isSaved
                }));

                // Fetch latest data
                await fetchPublicWatchlists();
            } catch(error) {
                console.error("Failed to update savedBy", error);
            }
        };

        const handleLike = async(watchlist: any) => {
            if (!user) {
                console.warn('User not signed in, cannot like');
                return;
            }
            const uid = user.uid;
            const isLiked = likedWatchlists[watchlist.id];

            try {
                const watchlistRef = doc(db, "watchlists", watchlist.id);
                if (isLiked) {
                    // remove user from likedBy
                    await updateDoc(watchlistRef, {
                        likedBy: arrayRemove(uid)
                    });
                } else {
                    // add user to likedBy
                    await updateDoc(watchlistRef, {
                        likedBy: arrayUnion(uid)
                    });
                }

                setLikedWatchlists(prev => ({
                    ...prev,
                    [watchlist.id]: !isLiked
                }));

                // Fetch latest data
                await fetchPublicWatchlists();
            } catch(error) {
                console.error("Failed to update likedBy", error);
            }
        };

        const [ commentDisplayMap, setCommentDisplayMap ] = useState<{[key: string]: boolean}>({});

        const openComments = async (watchlist: any) => {
            // If there are no comments, go to add comment page
            if (!watchlist.comments || watchlist.comments.commentCount === 0){
                router.push(`/addComment/${watchlist.id}`);
                return;
            }

            setCommentDisplayMap(prev => ({
                ...prev,
                [watchlist.id]: !prev[watchlist.id]
            }));
        }

        const handleCommentClick = async (watchlist: any) => {
            router.push(`/addComment/${watchlist.id}`);
            
        };

        const handleWatchlistClick = async (watchlist: any) => {
            router.push(`/watchlists/${watchlist.id}`)
        };

        const getInfo = async() => {
            const url = 'https://imdb236.p.rapidapi.com/api/imdb/cast/nm0000190/titles';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '38a92bbf0amsh50e9a4f107733e5p1370ffjsnf948a3269db3',
                    'x-rapidapi-host': 'imdb236.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.text();
                console.log(result);
            } catch (error) {
                console.error(error);
            }
        }

    // filter watchlists based on public or private status
    const watchlists = collection(db, "watchlists");
    const q = query(watchlists, where("private", "==", false));
    const [publicWatchlists, setPublicWatchlists] = useState<any[]>([]);

    const fetchPublicWatchlists = async () => {
        const querySnapshot = await getDocs(q);
        const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPublicWatchlists(lists);

        // Set per-watchlist liked/saved state for current user
        if (user) {
            const likedMap: {[key: string]: boolean} = {};
            const savedMap: {[key: string]: boolean} = {};
            lists.forEach((l: any) => {
                likedMap[l.id] = Array.isArray(l.likedBy) ? l.likedBy.includes(user.uid) : false;
                savedMap[l.id] = Array.isArray(l.savedBy) ? l.savedBy.includes(user.uid) : false;
            });
            setLikedWatchlists(likedMap);
            setSavedWatchlists(savedMap);
        }

    };

    useEffect(() => {
        // refetch when user changes (or becomes available)
        fetchPublicWatchlists();
    }, [user]);

    return (
        <div className={styles.feed}>
            {publicWatchlists.length === 0 ? (
                <p>Your feed is empty!</p>
            ) : (
                publicWatchlists.map((watchlist) => (
                    <div key={watchlist.id} className={styles.watchlistContainer}>
                        <div style={{backgroundColor: `${watchlist.color}`}} className={styles.watchlist}>
                            <div className={styles.watchlistHeader}>
                                <div className={styles.userInfo}>
                                    <Image 
                                        style={{background: `${watchlist.color}`}}
                                        src={'/images/cinnamoroll.png'}
                                        width={50}
                                        height={50}
                                        alt={watchlist?.creatorID ?? 'creator'}
                                    />
                                    <p>@{watchlist.creatorID.replaceAll(" ", "")}</p>
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
                                        <li onClick={getInfo} key={idx} style={{color: "#000000"}}> {item}</li>
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
                            <span>{Array.isArray(watchlist.savedBy) ? watchlist.savedBy.length : (watchlist.saves ?? 0)}</span>

                            <CiHeart key={`${watchlist.id}-heart`}  className={styles.like} onClick={() => handleLike(watchlist)}/>
                            <IoMdHeart 
                                key={`${watchlist.id}-hearted`}  
                                style={{ display: likedWatchlists[watchlist.id] ? "flex" : "none" }} 
                                className={styles.userLiked}
                            />
                            <span>{Array.isArray(watchlist.likedBy) ? watchlist.likedBy.length : (watchlist.likes ?? 0)}</span>

                            <TfiComment key={`${watchlist.id}-comment`}  className={styles.comment} onClick={() => openComments(watchlist)}/>
                            <span>{watchlist.comments.commentCount}</span>
                        </div>
                        
                        <div className={styles.commentSection} style={{display: commentDisplayMap[watchlist.id] ? 'block' : 'none'}}>
                            <h3>Comments</h3>
                            <ul className={styles.commentsList}>
                                {Array.isArray(watchlist.comments?.comments) && watchlist.comments.comments.map((comment: any, idx: number) => {
                                        const isString = typeof comment === 'string';
                                        const username = isString ? null : (comment.username ?? comment.userId ?? 'Anonymous');
                                        const text = isString ? comment : (comment.text ?? '');
                                        return (
                                            <li className={styles.comment} key={idx}>
                                                {username && <div className={styles.commentHeader}><strong>{username}</strong></div>}
                                                <div className={styles.commentBody}>{text}</div>
                                            </li>
                                        );
                                    })}
                                    
                            </ul>
                            <button className={styles.addComment} onClick={() => handleCommentClick(watchlist)}>Add comment</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
