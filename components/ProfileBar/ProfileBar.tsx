import styles from './ProfileBar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import WatchlistForm from "../WatchlistForm";

export const ProfileBar = () => {

    const router = useRouter();
    const auth = getAuth();
    const user = auth.currentUser;
    

    const goToProfile = () => {
        if (!user || !user.displayName) return;
                
        else {
            router.push(`/profile/${user.uid}`)
        }
    }

    const goToLogin = () => {
        if (!user || !user.displayName) return;
                
        else {
            router.push(`/login`);
        }
    }

    const handleCreateReview = () => {
        // review form
    }

    const handleCreateWatchlist = async () => {
        <WatchlistForm />
    }

    return (
        <div>
            <div className={styles.profileBarContainer}>
                <div onClick={goToProfile} className={styles.userInfo}>
                    <Image 
                        src={`/${user?.photoURL}`}
                        width={50}
                        height={50}
                        alt=""
                    />
                    
                    <div className={styles.handle}>
                        {!user?(
                            <a href='/login'>Log in</a>
                        ):
                        ( 
                        <div>
                            <p>{user?.displayName?.replaceAll(" ", "")}</p>
                            <p>@{user?.displayName?.replaceAll(" ", "")}</p>
                        </div>
                        )}
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
    
        </div>
    )

}

export default ProfileBar;