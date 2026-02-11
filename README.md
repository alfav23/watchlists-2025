## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# Technical Summary

## Project Overview
**watchlists-2025** is a Next.js 13+ full-stack web application for creating, managing, and sharing movie/TV show watchlists. Users can authenticate, create public/private lists, like/save lists, and leave comments.

---

## Architecture & Approach

### Tech Stack
- **Frontend**: Next.js (App Router), React 18, TypeScript
- **Backend**: Firebase (Auth + Firestore real-time database)
- **Styling**: SCSS modules
- **Icons**: react-icons

### Design Pattern: Context API + Custom Hooks
The app centralizes authentication state using React Context to avoid prop drilling and enable consistent auth checks across components.

---

## Key React Hooks & Techniques

### 1. **Custom `useAuth()` Hook**
Located in `context/AuthContext.tsx`, provides centralized auth state:
```tsx
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);
```
- Wraps Firebase's `onAuthStateChanged()` 
- Exposes `{ user, loading }` to all components
- Prevents premature redirects with `loading` flag

### 2. **Early Return Pattern (with Caution)**
Components guard rendering behind loading checks but **must call all hooks before returns** to satisfy React's Rules of Hooks:
```tsx
const MyComponent = () => {
  const { user, loading } = useAuth();
  const router = useRouter();  // ✅ Hooks called BEFORE conditional return
  
  if (loading) return null;    // ✅ Safe: all hooks already called
  // ...
};
```

### 3. **Per-Resource UI State Maps**
Instead of single boolean flags, map UI state by resource ID to isolate toggles:
```tsx
const [likedWatchlists, setLikedWatchlists] = useState<{[key: string]: boolean}>({});
const [savedWatchlists, setSavedWatchlists] = useState<{[key: string]: boolean}>({});
const [commentDisplayMap, setCommentDisplayMap] = useState<{[key: string]: boolean}>({});
```
**Benefit**: Toggling like on one watchlist doesn't affect others.

### 4. **AuthGuard Component**
Protects client pages by wrapping children and redirecting unauthenticated users:
```tsx
export default function AuthGuard({ children, redirectTo = "/login" }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push(redirectTo);
  }, [loading, user, router, redirectTo]);

  if (loading) return null;
  if (!user) return null;

  return <>{children}</>;
}
```

### 5. **Query Guards**
Only construct Firestore queries when required data (user UID/displayName) is available:
```tsx
const q = user ? query(watchlists, where("creatorID", "==", user.displayName)) : null;

useEffect(() => {
  if (!q) return; // Skip if query is null
  // fetch...
}, [q]);
```
**Benefit**: Avoids `undefined` values in Firestore `where()` clauses.

### 6. **Optimistic UI Updates + Re-fetch Pattern**
Update local UI state immediately, then re-fetch server state to ensure consistency:
```tsx
const handleLike = async (watchlist) => {
  // Optimistic update
  setLikedWatchlists(prev => ({
    ...prev,
    [watchlist.id]: !prev[watchlist.id]
  }));

  // Update Firestore
  await updateDoc(watchlistRef, {
    likedBy: arrayUnion(uid)
  });

  // Re-fetch to sync counts
  await fetchPublicWatchlists();
};
```

---

## Firestore Schema & Data Flow

### Watchlist Document Structure
```javascript
{
  id: "doc_id",
  title: "Best Sci-Fi Films",
  creatorID: "John Doe",           // User displayName
  genre: "Sci-Fi",
  items: ["Inception", "Dune"],
  tags: ["thought-provoking"],
  private: false,
  color: "#ffdfba",
  
  // Engagement
  likedBy: ["uid1", "uid2"],       // Array of user UIDs who liked
  savedBy: ["uid3"],               // Array of user UIDs who saved
  
  // Comments
  comments: {
    commentCount: 2,
    comments: [
      { text: "Great list!", userId: "uid1", username: "Alice", createdAt: timestamp },
      { text: "Fresh picks", userId: "uid2", username: "Bob", createdAt: timestamp }
    ]
  }
}
```

### User Document Structure
```javascript
{
  // stored at users/{uid}
  fullName: "John Doe",
  userName: "johndoe",
  email: "john@example.com",
  photoURL: "https://picsum.photos/50",
  createdAt: timestamp
}
```

---

## Key Concepts & Patterns

### 1. **Denormalization for Performance**
Watchlists store `likedBy` and `savedBy` arrays directly so counts are immediately readable without joining.

### 2. **Comment Objects with Metadata**
Comments store creator info (`userId`, `username`, `createdAt`) alongside text, enabling rich UI display and future filtering by user.

### 3. **Static Image Strategy**
All profile avatars render `/images/cinnamoroll.png` (simplified UI, avoids external URL/domain issues).

### 4. **Dynamic Routes with App Router**
- `app/editPage/[id]/page.tsx` — Edit a specific watchlist
- `app/addComment/[id]/page.tsx` — Add comments to a watchlist
- Uses `useParams()` and `useRouter()` from `next/navigation`

### 5. **Form State Management**
WatchlistForm uses fine-grained `useState` for each field (title, genre, items array, tags array, etc.), with immutable updates:
```tsx
const [items, setItems] = useState<string[]>([]);

const handleAddShow = () => {
  setItems(prev => [...prev, item.trim()]);  // Immutable spread
  setItem("");                               // Clear input
};
```

### 6. **Atomic Firestore Operations**
Like/save uses `arrayUnion()` and `arrayRemove()` to safely add/remove single user UIDs:
```tsx
await updateDoc(watchlistRef, {
  likedBy: arrayUnion(uid)  // Atomic: prevents duplicates
});
```

---

## Component Hierarchy

```
app/layout.tsx
├─ AuthProvider (wraps all)
├─ Header
│  └─ ProfileBar (displays user avatar, logout)
├─ app/page.tsx (HomePage)
│  └─ Watchlist (feed of public lists)
├─ app/createWatchlist/page.tsx
│  └─ WatchlistForm
├─ app/editPage/[id]/page.tsx
│  └─ WatchlistForm (pre-filled)
├─ app/myLists/page.tsx
│  ├─ AuthGuard
│  └─ Private & Saved Watchlists
└─ app/addComment/[id]/page.tsx
   └─ Comment submission form
```

---

## Development Practices

### Rules of Hooks Compliance
- ✅ All hooks called at component top level
- ✅ Hooks called unconditionally (before early returns)
- ✅ Custom `useAuth()` hook encapsulates context access
- ✅ Dependency arrays explicitly list dependencies

### Error Handling
- Firestore errors logged to console
- Early returns for null/undefined guards
- Try-catch blocks around async operations

### Type Safety
- TypeScript with interface definitions for Firestore documents
- Props interfaces for components
- Type annotations on useState and event handlers

---

## Notable Implementation Decisions

1. **Context over Redux**: Light-weight auth state doesn't require Redux complexity
2. **Per-resource maps over global flags**: Enables isolated UI state for multiple watchlists in a single render
3. **Firestore arrays (likedBy/savedBy)**: Simple, atomic, and efficient for small-to-moderate engagement counts
4. **Comment objects**: Enables future sorting/filtering by creator without additional queries
5. **Static assets**: Avoids external image URL issues and simplifies CDN configuration