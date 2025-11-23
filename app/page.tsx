"use client"
 
import { Auth, getAuth } from "firebase/auth";
import styles from "./page.module.scss";
import HomePage from "@/components/HomePage/HomePage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser; 

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // undefined -> loading
  // null -> not logged in
  // {} -> logged in

  useEffect(() => {
    if (!user){
      setIsLoggedIn(false);
      console.log(isLoggedIn);
      router.push("/login")
    } else {
      setIsLoggedIn(true);
      console.log(isLoggedIn, user);
    }
  }, []); // Empty dependency array ensures it runs only once after initial render

    return (
      <div>
        <div className={styles.page}>
          <main className={styles.main}>
            <HomePage />
          </main>
        </div>
      </div>
    );
  }

