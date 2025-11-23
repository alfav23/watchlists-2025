"use client"
 
import { useAuth } from '@/context/AuthContext';
import styles from "./page.module.scss";
import HomePage from "@/components/HomePage/HomePage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Only redirect after auth has finished initializing
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // while redirecting, render nothing
    return null;
  }

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

