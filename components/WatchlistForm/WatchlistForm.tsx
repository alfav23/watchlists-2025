"use client";
import styles from "./WatchlistForm.module.scss";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useState } from "react";

const WatchlistForm = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const router = useRouter();

    // watchlist data values
    const [ genre, setGenre ] = useState<string>("");
    const [ items, setItems ] = useState<string[]>([]);
    const [ tags, setTags ] = useState<string[]>([]);
    const [ title, setTitle ] = useState<string>("");
    const [ isPrivate, setIsPrivate ] = useState<boolean>(true);

    const handleAddShow = () => {
       items.push();
    }

    const pushList = async(event: React.FormEvent) => {
        event.preventDefault();

        const collectionRef = collection(db, "watchlists");
        const newWatchlistData = {
            creatorID: user ? user.uid : null,
            genre: genre,
            items: items,
            tags: tags,
            private: isPrivate
        }

        try {
            const docRef = await addDoc(collectionRef, newWatchlistData);
            console.log("Successfully added watchlist with ID:", docRef.id);
        } catch(e) {
            console.error("Error adding watchlist:", e);
        }

        // navigate after creating
        if (!isPrivate) {
            router.push("/");
        } else {
            router.push("/myLists");
        }
    }

    return (
        <div className={styles.watchlistFormContainer}>
            <form className={styles.watchlistForm} onSubmit={pushList}>
                <input 
                    type="text" 
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Main Genre"
                    value={genre} 
                    onChange={(e) => setGenre(e.target.value)}
                />
                <div className={styles.addItemSection}>
                    <ul className={styles.itemsList}>
                        {items.length === 0 ? (
                            <p>Add at least one movie or show to publish your list!</p>
                        ) : (
                        items.map((item) => (
                            <li key={item.indexOf(item)} className={styles.item}>
                            </li>
                        )))}
                    </ul>
                    <form>
                        <input type="text" />
                        <button 
                            onSubmit={handleAddShow} 
                            className={styles.addShowButton}
                        >
                            Add movie or show to your list!
                        </button>
                    </form>
                </div>
                <p>Public lists will appear on the feed.</p>
                <p>{`Private lists will only be visible to you${user ? `, ${user.displayName || user.email}` : '' }!`}</p>
                <select 
                    name="status-setting" 
                    id="status-setting"
                    value={isPrivate ? 'private' : 'public'} 
                    onChange={(e) => setIsPrivate(e.target.value === 'private')} 
                >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
                <button type="submit">Create Watchlist</button>
            </form>
        </div>
    )
}

export default WatchlistForm;