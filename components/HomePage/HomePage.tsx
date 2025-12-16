'use client';
import styles from "./HomePage.module.scss";
import Feed from "../Feed";
import Discover from '../Discover';
import Header from '../Header';
import ProfileBar from "../ProfileBar";
import { useState } from "react";

export const HomePage = () => {
    const [ listFilter, setListFilter ] = useState<string>("random");

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Header />
            </div>
            <div className={styles.mainContent}>
                <div className={styles.leftSideBar}>
                    <ProfileBar />
                    <Discover setSearchParam={setListFilter} searchParam={listFilter} />
                </div>
                
                <div className={styles.feed}>
                    <Feed searchParam={listFilter}/>
                </div>
                
            </div>
        </div>
    )
}

export default HomePage;