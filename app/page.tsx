
import styles from "./page.module.scss";
import HomePage from "@/components/HomePage/HomePage";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <HomePage />
      </main>
    </div>
  );
}
