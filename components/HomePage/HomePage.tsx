'use client';
import styles from "./HomePage.module.scss";
import Feed from "../Feed";

export const HomePage = () => {
    return (
        <div className={styles.container}>
            Main Content
            <Feed />
        </div>
    )
}

export default HomePage;