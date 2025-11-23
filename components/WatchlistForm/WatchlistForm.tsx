"use client";
import styles from "./WatchlistForm.module.scss";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useState } from "react";

const WatchlistForm = () => {
    const { user, loading } = useAuth();

    if (loading) return null;
    const router = useRouter();
    const colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];

    // watchlist data values
    const [ genre, setGenre ] = useState<string>("");
    const [ item, setItem ] = useState<string>("");
    const [ items, setItems ] = useState<string[]>([]);
    const [ tags, setTags ] = useState<string[]>([]);
    const [ tag, setTag ] = useState<string>("");
    const [ title, setTitle ] = useState<string>("");
    const [ isPrivate, setIsPrivate ] = useState<boolean>(true);

    const handleAddShow = () => {
        if (!item || item.trim() === "") return;
        setItems(prev => [...prev, item.trim()]);
        setItem("");
        console.log("Show added:", item);
    }

    const handleAddTag = async () => {
        if (!tag || tag.trim() === "") return;
        setTags(prev => [...prev, tag.trim()]);
        setTag("");
        console.log("Tag added:", tag);
    }

    const pushList = async(event: React.FormEvent) => {
        event.preventDefault();

        const collectionRef = collection(db, "watchlists");
        const newWatchlistData = {
            creatorID: user ? user.displayName : null,
            title: title,
            genre: genre,
            items: items,
            tags: tags,
            private: isPrivate,
            likes: 0,
            saves: 0,
            comments: {
                commentCount: 0,
                comments: []
            },
            favorited: false,
            color: colorPalette[Math.floor(Math.random()*(4 - 0 + 1) + 0)]
            // profilePic: user?.profilePicURL
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
                    <p>Add at least one movie or show to publish your list!</p>
                    <ul className={styles.itemsList}>
                        {items.map((item) => (
                            <li key={Math.random()} className={styles.item}> {item}
                            </li>
                        ))}
                    </ul>
                    <div className={styles.addItemSection}>
                        <input 
                            value={item} 
                            type="text" 
                            placeholder="Movie or show title"
                            onChange={(e) => setItem(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleAddShow}
                            className={styles.addShowButton}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <div className={styles.addTagSection}>
                    <p>Add some tags so people can find your list!</p>
                    <ul className={styles.tagsList}>
                        {tags.map((tag) => (
                            <li key={Math.random()} className={styles.tag}>{tag}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <input 
                            value={tag} 
                            type="text"
                            placeholder="Enter a tag"
                            onChange={(e) => setTag(e.target.value)}
                        />
                        <button 
                            type="button"
                            onClick={handleAddTag} 
                            className={styles.addTagButton}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <p>Public lists will appear on the public feed.</p>
                <p>{`Private lists will only be visible to you${user ? `, ${user.displayName || user.email?.replaceAll(" ", "")}` : '' }!`}</p>
                <select 
                    name="status-setting" 
                    id="status-setting"
                    value={isPrivate ? 'private' : 'public'} 
                    onChange={(e) => setIsPrivate(e.target.value === 'private')} 
                >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
                <button className={styles.publishWatchlistButton} type="submit">Publish Watchlist</button>
            </form>
        </div>
    )
}

export default WatchlistForm;