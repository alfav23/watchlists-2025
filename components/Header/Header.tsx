import Link from 'next/link';
import styles from './Header.module.scss';

export const Header = () => {
    return (
        <div className={styles.headerContainer}>
            <h1 className={styles.headerTitle}>mywatchlists</h1>
        </div>
    )
}

export default Header;