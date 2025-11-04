import styles from './ProfileBar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import WatchlistForm from "../WatchlistForm";

export const ProfileBar = () => {

    const goToProfile = () => {
        const router = useRouter();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.displayName) return;
            
        else {
            router.push(`/${user.displayName}`)
        }
    }

    const handleCreateReview = () => {
        // review form
    }

    const handleCreateWatchlist = async () => {
        <WatchlistForm />
    }

    return (
        <div className={styles.profileBarContainer}>
            <div onClick={goToProfile} className={styles.userInfo}>
                <Image 
                    src="/images/cinnamoroll.png"
                    width={50}
                    height={50}
                    alt=""
                />
                <div className={styles.handle}>
                    {/* name */}
                    <p>notalyssa</p>
                    {/* username */}
                    <p>@notalyssa</p>
                </div>
            </div>
            <div className={styles.userOptions}>
                <Link href='/myLists'>My Watchlists</Link>
                <Link href="/my-reviews">My Reviews</Link>
                <Link href="/profile-settings">Profile Settings</Link>
                <a onClick={handleCreateWatchlist} href="/createWatchlist">Create New Watchlist</a>
                <a onClick={handleCreateReview} href="/">Write a Review</a>
            </div>
        </div>
    )
}

export default ProfileBar;