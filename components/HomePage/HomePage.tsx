'use client';
import styles from "./HomePage.module.scss";
import Feed from "../Feed";
import Discover from '../Discover';

export const HomePage = () => {
    return (
        <div className={styles.container}>
            <Discover />
            <Feed />
        </div>
    )
}

export default HomePage;