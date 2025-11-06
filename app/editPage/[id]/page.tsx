"use client";

import { useEffect, useState } from "react";
import styles from "../editPage.module.scss";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

export default function EditPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<any>(null);

  // form fields
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [itemInput, setItemInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "watchlists", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          console.warn("Watchlist not found", id);
          setWatchlist(null);
        } else {
          const data = { id: snap.id, ...(snap.data() as any) };
          setWatchlist(data);
          setTitle(data.title || "");
          setGenre(data.genre || "");
          setItems(Array.isArray(data.items) ? data.items : []);
          setTags(Array.isArray(data.tags) ? data.tags : []);
        }
      } catch (e) {
        console.error("Failed to fetch watchlist", e);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, [id]);

  const handleAddItem = () => {
    if (!itemInput) return;
    setItems(prev => [...prev, itemInput]);
    setItemInput("");
  };

  const handleAddTag = () => {
    if (!tagInput) return;
    setTags(prev => [...prev, tagInput]);
    setTagInput("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!watchlist) return;
    try {
      const ref = doc(db, "watchlists", id);
      await updateDoc(ref, {
        title,
        genre,
        items,
        tags,
      });
      // navigate back to user's lists or the watchlist page
      router.push('/myLists');
    } catch (err) {
      console.error("Failed to update watchlist", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!watchlist) return <p>Watchlist not found</p>;

  const image = "/images/cinnamoroll.png";
  const colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];

  return (
  
    <div className={styles.mainContent}>
      <div className={styles.headerContainer}>
        <h1>Edit Watchlist</h1>
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
              <a onClick={() => {}} href="watchlist-form">Create New Watchlist</a>
                        / 
              <a onClick={() => {}} href="review-form">Write a Review</a>
           </div>
         </div>
      <form onSubmit={handleSave} className={styles.editForm}>
        <div className={styles.editContainer}>
          <div className={styles.watchlistContainer}>
            <div style={{backgroundColor: `${colorPalette[Math.floor(Math.random()*(4 - 0 + 1) + 0)]}`}} className={styles.watchlist}>
              <div className={styles.watchlistHeader}>
                <div className={styles.userInfo}>
                  <Image 
                    src={image}
                    width={50}
                    height={50}
                    alt=""
                  />
                  <a href={`/${user?.displayName?.replaceAll(" ", "")}`}>@{user?.displayName?.replaceAll(" ", "")}</a>
                </div>
                <div className={styles.watchlistDescription}>
                  <p>{watchlist.private ? "Private" : "Public"}</p>
                  {/* <label>Genre</label> */}
                  <input style={{width: "80%", fontFamily: "PressStart2P", fontSize: 8}} placeholder={watchlist.genre} value={genre} onChange={e => setGenre(e.target.value)} />
                  <p>Movies + Shows</p>
                </div>
              </div>

              <div className={styles.watchlistContent}>
                
                  {/* <label>Title</label> */}
                  <input style={{fontSize: 20, width: '100%'}} className={styles.titleInput} placeholder={watchlist.title} value={title} onChange={e => setTitle(e.target.value)} />

                  {/* <label>Items</label> */}
                  <ul className={styles.items}>
                    {items.map((it, idx) => (
                      <li key={`${watchlist.id}-edit-item-${idx}`}>
                        <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                          <input
                            value={it}
                            onChange={e => setItems(prev => prev.map((p, i) => i === idx ? e.target.value : p))}
                            style={{flex: 1}}
                          />
                          <button
                            type="button"
                            onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}
                            className={styles.remove}
                          >
                            x
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div style={{display: 'flex', gap: '8px', marginBottom: 8}}>
                    <input value={itemInput} onChange={e => setItemInput(e.target.value)} placeholder="New item" />
                    <button type="button" onClick={handleAddItem} className={styles.addNewItem}>+</button>
                  </div>

                  <label style={{ fontSize: 10 }}>Tags:</label>
                  <div className={styles.tags} style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    {tags.map((t, idx) => (
                      <div key={`${watchlist.id}-edit-tag-${idx}`} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                        #<input
                          value={t}
                          onChange={e => setTags(prev => prev.map((p, i) => i === idx ? e.target.value : p))}
                        />
                        <button
                          type="button"
                          onClick={() => setTags(prev => prev.filter((_, i) => i !== idx))}
                          className={styles.remove}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{display: 'flex', gap: 8, marginTop: 8}}>
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="New tag" />
                    <button type="button" onClick={handleAddTag} className={styles.addNewItem}>+</button>
                  </div>  
              </div>
            </div>
            <div className={styles.actions} style={{ marginTop: 16 }}>
              <button type="submit" className={styles.saveChanges}>Save changes</button>
              <button type="button" onClick={() => router.back()} className={styles.cancel}>Cancel</button>
            </div>
          </div>
        </div>
        </form>
    </div>
  );
}
