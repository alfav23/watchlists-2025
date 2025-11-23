"use client";
import styles from './MyLists.module.scss';
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import { db } from "@/lib/firebaseConfig";
import { arrayRemove, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { FaSearch, FaTrash } from "react-icons/fa"; 
import { MdEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa6';
import { FaEyeSlash } from "react-icons/fa";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiStarOffLine } from "react-icons/ri";
import { Filter } from 'firebase-admin/firestore';

const privateWatchlistsPage = () => {
    const { user, loading } = useAuth();
    const uid = user?.uid;
    const router = useRouter();

    const deleteWatchlist = async(watchlist: any) => {
        
        const docRef = doc(db, "watchlists", watchlist.id);
        try {
            await deleteDoc(docRef);
            console.log("Successfully deleted document:", watchlist.id);
        } catch (error) {
            console.error("Error deleting document:", error)
        }
    }

    const handleDeleteItem = async (watchlist: any, item: any) => {
        const docRef = doc(db, "watchlists", watchlist.id);
        const items = [...watchlist.items];
        const updatedItems = items.filter((i) => i !== item);
        try {
            await updateDoc(docRef, {
                items: updatedItems
            });
            console.log("Item successfully deleted:", item);
        } catch (error) {
            console.log("Unable to delete item", error);
        }
        
    }

    const handleUnsave = async (watchlist: any) => {
        const docRef = doc(db, "watchlists", watchlist.id);
        try {
            await updateDoc(docRef, {
                savedBy: arrayRemove(uid),
                favorited: false
            });
            console.log("Successfully unsaved watchlist:", watchlist.title);
        } catch(error) {
            console.log("Could not unsave watchlist:", error)
        }
    }

    const handleEdit = (watchlist: any) => {
        router.push(`/editPage/${watchlist.id}`)
    }

    const handleChangePrivacy = async (watchlist: any) => {
        try {
            const docRef = doc(db, "watchlists", watchlist.id);
            if (watchlist.private == true){
                await updateDoc(docRef, {
                    private: false
                });
                    console.log(watchlist, "successfully made public"); 
            } else {
                await updateDoc(docRef, {
                    private: true
                });
            }
            } catch (error) {
                console.error("Failed to update watchlist status", error);
            }
    }

// filter watchlists based on public or private status
    const watchlists = collection(db, "watchlists");
    // build queries only when user is available to avoid undefined values in where()
    const q = user ? query(watchlists, where("creatorID", "==", user.displayName)) : null;
    const qS = (user && uid) ? query(watchlists, where("favorited", "==", true), where("savedBy", "array-contains", uid)) : null;
    const [privateWatchlists, setPrivateWatchlists] = useState<any[]>([]);
    const [savedWatchlists, setSavedWatchlists] = useState<any[]>([]);

    useEffect(() => {
        const fetchPrivateWatchlists = async () => {
            if (!q) return;
            const querySnapshot = await getDocs(q);
            const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPrivateWatchlists(lists);
        };
        fetchPrivateWatchlists();
    }, [q]);

    useEffect(() => {
        const fetchSavedWatchlists = async () => {
            if (!qS) return;
            const querySnapshot = await getDocs(qS);
            const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSavedWatchlists(lists);
        };
        fetchSavedWatchlists();
    }, [qS]);

    return (
        <AuthGuard>
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
                        <div className={styles.userOptions}>
                            <Link href='/'>Feed</Link>
                            / 
                            {/* <Link href="/my-reviews">My Reviews</Link>
                            /  */}
                            {/* <Link href="/profile-settings">Profile Settings</Link>
                            /  */}
                            <a onClick={() => {}} href="/createWatchlist">Create New List</a>
                            {/* / 
                            <a onClick={() => {}} href="review-form">Write a Review</a> */}
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
                </div>
            </div>
            <h2>My Lists:</h2>
            <div className={styles.privateListsFeed}>
                {privateWatchlists.length === 0 ? (
                    <p>Nothing to see here!</p>
                ) : (
                    privateWatchlists.map((watchlist) => (
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
                                                <a onClick={() => handleDeleteItem(watchlist, item)}> X</a>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={styles.tags}>
                                        <p>Tags:</p>
                                        {Array.isArray(watchlist.tags) && watchlist.tags.map((tag: string, idx: number) => (
                                            <a key={`${watchlist.id}-tag-${idx}`}>#{tag.replaceAll(" ", "")}</a>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    {(watchlist.private == true)?(
                                        <FaEye className={styles.makePublic} onClick={()  => handleChangePrivacy(watchlist)}/>
                                    ):
                                    (
                                        <FaEyeSlash className={styles.makePrivate} onClick={()  => handleChangePrivacy(watchlist)}/>
                                        )}
                                    <MdEdit className={styles.edit} onClick={() => handleEdit(watchlist)}/>

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
                                    <a href={`/${watchlist.creatorID.replaceAll(" ", "")}`}>@{watchlist.creatorID.replaceAll(" ", "")}</a>
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
                                    <p style={{fontSize: 28}}>
                                        <RiStarOffLine className={styles.unsave} onClick={() => handleUnsave(watchlist)}/>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
        </AuthGuard>
    );
}

export default privateWatchlistsPage;
