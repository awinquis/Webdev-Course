"use client";
import UserCards from "@/app/myitems/components/UserCards"
import Link from "next/link";
import styles from '../page.module.css'
export default function Home() {

  return (
    <main className={styles.main}>
      <h1>My Items</h1>
      <p>Click on any item to edit its price</p>
        <UserCards></UserCards>
  
        <br></br>
        <Link className={styles.back} href="/">Back</Link>
        </main>
  );
}
