'use client';

import { db } from "@/lib/firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../addComment.module.scss";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { FaRegComment } from "react-icons/fa";

export default function addComment () {

    const [ commentInput, setCommentInput ] = useState("");
    const [ commentCount, setCommentCount ] = useState(0);
    const [ userId, setUserId ] = useState("");
    const [watchlist, setWatchlist] = useState<any>(null);

    const params = useParams();
    const id = params?.id as string | undefined;
    const router = useRouter();
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (!id) return;
        const fetchWatchlist = async () => {
            try {
                const ref = doc(db, "watchlists", id!);
                const snap = await getDoc(ref);
                if (!snap.exists()) {
                    console.warn("Watchlist not found", id);
                    setWatchlist(null);
                } else {
                    const data = { id: snap.id, ...(snap.data() as any) };
                    setWatchlist(data); 
                } 
            } catch(error) {
                console.log("Error fetching watchlist", error)
            }
        } 
        fetchWatchlist();
    }, [id]); 

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!watchlist) return;
        
        if (commentInput == "") return;
        
        try {
            const ref = doc(db, "watchlists", id!);

            const commentsArray = watchlist.comments;
            const comments = commentsArray.comments;
            setCommentCount(comments.length + 1);
            await updateDoc(ref, {
                comments: {
                    commentCount: commentCount,
                    comments: [...comments, commentInput]
                } 
            });
            
            setCommentInput("");
            console.log("Comment,", "'", commentInput, "'", ",successfully added to watchlist:", id);
        } catch (error) {
            console.log("could not update comments", error);
        }
    }
   
    return (
        <div>
            <div className={styles.headerContainer}>
                <h1>Comment</h1>
            </div>
            <div className={styles.profileBarContainer}>
                <div className={styles.profileBarInner}>
                    <div className={styles.searchContainer}>
                        <input className={styles.search} type="text" placeholder="Search"/>
                        <div className={styles.searchIcon}>
                            <FaSearch />  
                        </div>
                    </div>
                    <div className={styles.userInfo}>
                        <Image 
                            src="/images/cinnamoroll.png"
                            width={50}
                            height={50}
                            alt=""
                        />
                        <div className={styles.handle}>
                            {/* name */}
                            <p>{user?.displayName?.replaceAll(" ", "")}</p>
                            {/* username */}
                            <p>@{user?.displayName?.replaceAll(" ", "")}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.userOptions}>
                    <Link href='/'>Feed</Link>
                        / 
                    <Link href="/my-reviews">My Reviews</Link>
                        / 
                    <Link href="/profile-settings">Profile Settings</Link>
                        / 
                    <a onClick={() => {}} href="/createWatchlist">Create New Watchlist</a>
                                    / 
                    <a onClick={() => {}} href="review-form">Write a Review</a>
                </div>
            </div>
            <div className={styles.commentFormContainer}>
                <form className={styles.commentForm} onSubmit={(e)=>{handlePost(e)}}>
                    <label>Comment<FaRegComment className={styles.speechBubble}/></label>
                    
                    <input 
                        type="text" 
                        placeholder={`What are you thinking, ${user?.displayName?.replaceAll(" ", "")}?`}
                        value={commentInput}
                        onChange={(e)=>setCommentInput(e.target.value)}
                    />
                    <button className={styles.post}>
                        Post
                    </button>
                </form>
            </div>
        </div>
    )
}