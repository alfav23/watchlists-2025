'use client';
import styles from "./HomePage.module.scss";
import Feed from "../Feed";
import Discover from '../Discover';
import Header from '../Header';
import ProfileBar from "../ProfileBar";

export const HomePage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Header />
            </div>
            <div className={styles.mainContent}>
                <div className={styles.leftSideBar}>
                    <ProfileBar />
                    <Discover />
                </div>
                <div className={styles.feed}>
                    <Feed />
                </div>
                
            </div>
        </div>
    )
}

export default HomePage;