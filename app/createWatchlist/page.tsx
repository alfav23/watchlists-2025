'use client'
import WatchlistForm from "@/components/WatchlistForm";
import styles from "./createWatchlist.module.scss";


const createWatchlist = () => {
    return (
        <div>
            <div className={styles.headerContainer}>
                <h1>Create List</h1>
            </div>
            <WatchlistForm/>
        </div>
    )
}

export default createWatchlist;