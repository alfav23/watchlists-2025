import styles from "./Discover.module.scss";
import { FaSearch } from "react-icons/fa";

export const Discover = () => {
    return (
        <div className={styles.discoverContainer}>
            Discover
            <div className={styles.searchContainer}>
                <input className={styles.search} type="text" placeholder="Search"/>
                <div className={styles.searchIcon}>
                <FaSearch />  
                </div>
            </div>
            <div className={styles.userOptions}>
                <a>Recommended for you...</a>
                <a>Anime</a>
                <a>Trending</a>
                <a>True Crime</a>
                <a>Holiday</a>
                <a>Action</a>
                <a>Documentaries</a>
                <a>Romance</a>
                <a>Comedy</a>
            </div>
        </div>
    )
}

export default Discover;