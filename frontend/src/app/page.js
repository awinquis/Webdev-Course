"use client";
import styles from "./page.module.css";
import Link from "next/link";
import Populate from "@/app/login/components/populate";
import BrowseCards from "@/app/myitems/components/BrowseCards";

export default function Home() {
  return (
    <main className={styles.main}>
       
       <nav className={styles.navbar}>
        <h1>WEB TECH.</h1>
          <ul>
            <li>
              <Link href="./myitems">MY ITEMS</Link>
            </li>
            <li>
              <Link href="./login/">LOG IN</Link>
            </li>
            <li>
              <Link href="./signup">SIGN UP</Link>
            </li>
            <li>
                <Populate/>
            </li>
          </ul>
      </nav>
        <BrowseCards></BrowseCards>
    </main>
  );
}
