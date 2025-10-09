import styles from './ProfileBar.module.scss';
import Image from 'next/image';

export const ProfileBar = () => {
    return (
        <div className={styles.profileBarContainer}>
            <Image 
                src="/images/cinnamoroll"
                width={50}
                height={50}
                alt="user avatar"
            />
            User info
        </div>
    )
}

export default ProfileBar;