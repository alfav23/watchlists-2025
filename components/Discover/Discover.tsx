import { useState } from "react";
import styles from "./Discover.module.scss";
import { FaSearch } from "react-icons/fa";

export const Discover = () => {

    const [searchParam, setSearchParam ] = useState<string>("");


    return (
        <div className={styles.discoverContainer}>
            <div className={styles.discoverTitle}>Discover</div>
            <div className={styles.searchContainer}>
                <input className={styles.search} type="text" placeholder="Search" value={searchParam} onChange={(e) => setSearchParam(e.target.value)}/>
                <div className={styles.searchIcon}>
                <FaSearch />  
                </div>
            </div>
            <div className={styles.userOptions}>
                {/* <a>Recommended for you...</a> */}
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