import styles from './ProfileBar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import WatchlistForm from "../WatchlistForm";
// profile images will be static

export const ProfileBar = () => {

    const router = useRouter();
    const { user, loading } = useAuth();

    if (loading) {
        return null; // or a loading placeholder
    }
    
    const goToProfile = () => {
        if (!user || !user.displayName) return;
                
        else {
            router.push(`/profile/${user.uid}`)
        }
    }

    const logOut = async () => {
        const { getAuth } = await import('firebase/auth');
        const auth = getAuth();
        // call signOut on the auth instance
        signOut(auth).then(() => {
            router.push('/login')
            console.log("Sign out successful")
        }).catch((error) => {
            console.log("An error happened", error);
        });
    }
    
    const handleCreateWatchlist = async () => {
        <WatchlistForm />
    }

    return (
        <div>
            <div className={styles.profileBarContainer}>
                <div onClick={goToProfile} className={styles.userInfo}>
                    <Image 
                        src={'/images/cinnamoroll.png'}
                        width={50}
                        height={50}
                        alt={user?.displayName ?? 'profile'}
                    />
                    
                    <div className={styles.handle}>
                        {/* {!user?(
                            <a href='/login'>Log in</a>
                        ):
                        (  */}
                        <div>
                            <p>{user?.displayName?.replaceAll(" ", "")}</p>
                            <p>@{user?.displayName?.replaceAll(" ", "")}</p>
                            <a className={styles.logOut} onClick={logOut}>Log Out</a>
                        </div>
                        {/* )} */}
                    </div>
                </div>
                <div className={styles.userOptions}>
                    <Link href='/myLists'>My Watchlists</Link>
                    {/* <Link href="/my-reviews">My Reviews</Link> */}
                    {/* <Link href="/profile-settings">Profile Settings</Link> */}
                    <a onClick={handleCreateWatchlist} href="/createWatchlist">Create New List</a>
                    {/* <a onClick={handleCreateReview} href="/">Write a Review</a> */}
                </div>
            </div>
    
        </div>
    )

}

export default ProfileBar;