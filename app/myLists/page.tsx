"use client";
import styles from './MyLists.module.scss';
import { db } from "@/lib/firebaseConfig";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { FaSearch, FaTrash } from "react-icons/fa"; 
import { MdEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa6';
import { getAuth} from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const privateWatchlistsPage = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const router = useRouter;

    // // add back when user has profile image option
    // const image = user.profileImage;

    const image = "/public/images/cinnamoroll.png";
    const colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];

    const deleteWatchlist = async(watchlist: any) => {
        
        const docRef = doc(db, "watchlists", watchlist.id);
        try {
            await deleteDoc(docRef);
            console.log("Successfully deleted document:", watchlist.id);
        } catch (error) {
            console.error("Error deleting document:", error)
        }
    }

    const handleDeleteItem = async (items: any) => {
        const docRef = doc(db, "watchlists", items.id)
        await deleteDoc(docRef);
        console.log("Item successfully deleted");
    }

    const handleEdit = () => {
        // <EditForm /> 
    }

    const handleMakePublic = async (watchlist: any) => {
        try {
            const docRef = doc(db, "watchlists", watchlist);
            await updateDoc(docRef, {
                private: false
            });
                console.log(watchlist, "successfully made public");
            } catch (error) {
                console.error("Failed to update watchlist status", error);
            }
    }

// filter watchlists based on public or private status
    const watchlists = collection(db, "watchlists");
    const q = query(watchlists, where("private", "==", true));
    const qS = query(watchlists, where("favorited", "==", true));
    const [privateWatchlists, setPrivateWatchlists] = useState<any[]>([]);
    const [savedWatchlists, setSavedWatchlists] = useState<any[]>([]);

    useEffect(() => {
        const fetchPrivateWatchlists = async () => {
            const querySnapshot = await getDocs(q);
            const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPrivateWatchlists(lists);
        };
        fetchPrivateWatchlists();
    }, []);

    useEffect(() => {
        const fetchSavedWatchlists = async () => {
            const querySnapshot = await getDocs(qS);
            const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSavedWatchlists(lists);
        };
        fetchSavedWatchlists();
    }, []);

    return (
        <div className={styles.mainContent}>
            <div className={styles.headerContainer}>
                <h1>{user?.displayName?.replaceAll(" ", "")}'s watchlists</h1>
            </div>
            <div>
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
                        <a onClick={() => {}} href="watchlist-form">Create New Watchlist</a>
                        / 
                        <a onClick={() => {}} href="review-form">Write a Review</a>
                    </div>
                </div>
            </div>
            <h2>Private Lists:</h2>
            <div className={styles.privateListsFeed}>
                {privateWatchlists.length === 0 ? (
                    <p>Nothing to see here!</p>
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
                                    <a href={`/${user?.displayName?.replaceAll(" ", "")}`}>@{user?.displayName?.replaceAll(" ", "")}</a>
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
                                        {Array.isArray(watchlist.items) && watchlist.items.map((item: string, idx: number) => (
                                            <li key={`${watchlist.id}-item-${idx}`}>
                                                {item}
                                                <a onClick={() => handleDeleteItem(watchlist)}> X</a>
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={styles.addNewItem}>Add New Item</button>
                                    <div className={styles.tags}>
                                        <p>Tags:</p>
                                        {Array.isArray(watchlist.tags) && watchlist.tags.map((tag: string, idx: number) => (
                                            <a key={`${watchlist.id}-tag-${idx}`}>#{tag}</a>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <FaEye className={styles.makePublic} onClick={handleMakePublic}/>

                                    <MdEdit className={styles.edit} onClick={handleEdit}/>

                                    <FaTrash className={styles.delete} onClick={() => deleteWatchlist(watchlist)}/>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* favorited/starred watchlists */}
            <h2>Saved Lists:</h2>
            <div className={styles.savedListsFeed}>
                {savedWatchlists.length === 0 ? (
                    <p>Nothing to see here!</p>
                ) : (
                    
                    savedWatchlists.map((watchlist) => (
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
                                    <a href={`/${watchlist.creatorID}`}>@{watchlist.creatorID}</a>
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
                                        {Array.isArray(watchlist.items) && watchlist.items.map((item: any, idx: number) => (
                                            <li key={`${watchlist.id}-saved-item-${idx}`}>{item}</li>
                                        ))}
                                    </ul>
                                    <div className={styles.tags}>
                                        <p>Tags:</p>
                                        {Array.isArray(watchlist.tags) && watchlist.tags.map((tag: any, idx: number) => (
                                            <a key={`${watchlist.id}-tag-${idx}`}>#{tag}</a>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <p style={{fontSize: 8}}>Unsave Icon Here</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default privateWatchlistsPage;

function updateUserData() {
    throw new Error('Function not implemented.');
}
