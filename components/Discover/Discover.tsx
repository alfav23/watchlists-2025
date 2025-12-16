import styles from "./Discover.module.scss";
import { FaSearch } from "react-icons/fa";


export const Discover = ({setSearchParam, searchParam}: any) => {

    return (
        <div className={styles.discoverContainer}>
            <div className={styles.discoverTitle}>Discover</div>
            <div className={styles.searchContainer}>
                <input className={styles.search} type="text" placeholder="Search" value={searchParam}/>
                <button className={styles.searchIcon}>
                    <FaSearch />  
                </button>
            </div>
            <div className={styles.userOptions}>
                {/* <button>Recommended for you...</button> */}
                <button onClick={() => setSearchParam("anime")}>Anime</button>
                <button onClick={() => setSearchParam("trending")}>Trending</button>
                <button onClick={() => setSearchParam("true crime")}>True Crime</button>
                <button onClick={() => setSearchParam("holiday")}>Holiday</button>
                <button onClick={() => setSearchParam("action")}>Action</button>
                <button onClick={() => setSearchParam("documentaries")}>Documentaries</button>
                <button onClick={() => setSearchParam("romance")}>Romance</button>
                <button onClick={() => setSearchParam("comedy")}>Comedy</button>
            </div>
        </div>
    )
}

export default Discover;