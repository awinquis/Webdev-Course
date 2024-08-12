"use client";
import { useState } from "react";
import { API_BASE } from "@/utils/api";
import Link from "next/link";
import styles from '../page.module.css';


const RegisterPage = () => {
  const [info, setInfo] = useState("");
  const register = async ({username, password, email}) => {
    const res = await fetch(`${API_BASE}/register/`, {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({username, password, email}),
    });
    const data = await res.json()
    setInfo(JSON.stringify(data))
  }
  return (
    <div className={styles.main}>
      <h1>Sign up</h1>
      <form className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          // @ts-ignore
          const formData = new FormData(form);
          const formJson = Object.fromEntries(formData.entries());
          // @ts-ignore
          register(formJson)
        }}
      >
        <label>
           Username:
          <input
            type="text"
            name="username"
            required
          />
        </label>
        <label>
           E-mail: 
          <input
            type="email"
            name="email"
            required
          />
        </label>
        <label>
           Password: 
          <input
            type="password"
            name="password"
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div>
      <p>{info}</p>
      </div>
      <Link className={styles.back} href="/">Back</Link>
     
    </div>
  );
};
export default RegisterPage;
