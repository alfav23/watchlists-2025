import styles from './ProfileBar.module.scss';
import Image from 'next/image';

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
        </div>
    )
}

export default ProfileBar;