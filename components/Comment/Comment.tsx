
// Helper utilities for comment/watchlist actions.
import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

// Exported function to create a simple test watchlist.
// This avoids running auth/firestore operations at module import time.
export async function createTestWatchlist() {
    try {
        const { getAuth } = await import('firebase/auth');
        const auth = getAuth();
        const user = auth.currentUser;

        const collectionRef = collection(db, "watchlists");
        const docRef = await addDoc(collectionRef, {
            title: "test",
            user: user?.displayName ?? null,
        });

        console.log("Created test watchlist", docRef.id);
        return docRef;
    } catch (err) {
        console.error("Failed to create test watchlist", err);
        throw err;
    }
}