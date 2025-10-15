import styles from './ProfileBar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
// import WatchlistForm from "../WatchlistForm/WatchlistForm";

const handleCreateReview = () => {

}

const handleCreateWatchlist = async () => {
    // <WatchlistForm />
}

export const ProfileBar = () => {
    return (
        <div className={styles.profileBarContainer}>
            <div className={styles.userInfo}>
                <Image 
                    src="/images/cinnamoroll.png"
                    width={50}
                    height={50}
                    alt=""
                />
                {/* name */}
                <p>notalyssa</p>
                {/* username */}
                <p>@notalyssa</p>
            </div>
            <div className={styles.userOptions}>
                <Link href='/my-watchlists'>My Watchlists</Link>
                <Link href="/my-reviews">My Reviews</Link>
                <Link href="/profile-settings">Profile Settings</Link>
                <a onClick={handleCreateWatchlist} href="#watchlist-form">Create New Watchlist</a>
                <a onClick={handleCreateReview} href="#review-form">Write a Review</a>
            </div>
        </div>
    )
}

export default ProfileBar;