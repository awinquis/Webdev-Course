"use client";

import styles from "../page.module.css";

import { useState } from "react";
import { API_BASE } from "@/utils/api";
import Link from "next/link";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";


const refresh = async () => {
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  const res = await fetch(`${API_BASE}/token/refresh/`, {
    method: "POST",
    body: JSON.stringify({ refresh }),
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await res.json();
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
};

const getUserInfo = async (options = {}) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const res = await fetch(`${API_BASE}/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }, ...options
  });

  if (res.status === 401 && localStorage.getItem(REFRESH_TOKEN_KEY)) {
    await refresh()
      const res2 = await fetch(`${API_BASE}/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }, ...options
    });    
    return res2.text;
  }

  if (res.status == 401){
    return res.status;
  }
  else{
    return res.text()
  }
}


const logout = async () => {
  try {
    const response = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`, // Include the access token
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

  } catch (error) {
    console.error('Error during logout:', error);
  }
};



const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userinfo, setUserinfo] = useState("");

  const authenticate = async ({ username, password }) => {
    const res = await fetch(`${API_BASE}/token/`, {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    //adds tokens to localstorage
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
  };
  
  

  return (
    <div className={styles.main}>
      <h1>Login Page</h1>
      <p>{userinfo}</p>

      <form className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target;
          // @ts-ignore
          const formData = new FormData(form);
          const formJson = Object.fromEntries(formData.entries());
          // @ts-ignore
          await authenticate(formJson);
          const text = await getUserInfo(); // Get user info after successful login
          if (text == 401){
             setUserinfo("Could not log in"); // Update userinfo state with the retrieved data
          }
          else{
            setUserinfo("Logged in as: " + text.toString()); // Update userinfo state with the retrieved data

          }
        }}
      >
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={username}
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </label>
        <label>
          password:
          <input
            type="password"
            name="password"
            value={password}
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <button type="submit">log in</button>
        </form>
        
        <Link className={styles.back}  href="/account">Reset password</Link>

      <div className={styles.form}> 
        <h2>Log out</h2>
        <button
          type="button"
          onClick={async () => {
            await logout()
            const ress = await getUserInfo();
            if (ress == 401){
              setUserinfo("Logged out");
            }
            else{
              setUserinfo("Error: Could not log out")
            }
          }}
        >
          Log out</button>
      <br></br>
      </div>

      <Link className={styles.back} href="/">Back</Link>
    </div>

    
  );
};
export default LoginPage;
