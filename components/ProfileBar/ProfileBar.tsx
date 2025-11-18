import styles from './ProfileBar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, signOut} from 'firebase/auth';
import WatchlistForm from "../WatchlistForm";

export const ProfileBar = () => {

    const router = useRouter();
    const auth = getAuth();
    const user = auth.currentUser;

    console.log(auth.currentUser);
    const goToProfile = () => {
        if (!user || !user.displayName) return;
                
        else {
            router.push(`/profile/${user.uid}`)
        }
    }

    const logOut = () => {
        signOut(auth).then(() => {
            router.push('/login')
            console.log("Sign out successful")
        }).catch((error) => {
            console.log("An error happened", error);
        });
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
                            <a className={styles.logOut} onClick={logOut}>Log Out</a>
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