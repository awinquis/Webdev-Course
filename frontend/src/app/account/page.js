"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
const ACCESS_TOKEN_KEY = "access_token";
import styles from '../page.module.css'


const Reset = () => {

  //I know that passwords in memory might cause seucrity problems
  const [password, setPassword] = useState("");
  const [newpassword, setnewPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [errortext, setError] = useState("");

	const [token, setToken] = useState(null);

  async function changePassword() {
    
    // Basic validation

    if (newpassword !== confirmpassword) {
      setError("New passwords do not match");
      return("New passwords do not match")
    }
  
    try {
      const response = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({password,newpassword}),
      });
  
      if (!response.ok) {
         const errorData = await response.json();
         console.log(errorData.message || 'Failed to change password');
      }
      await response.json();
      setError('Password changed successfully');
    } catch (error) {
      setError("Error changing password");
    }
  }
  
  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    setToken(storedToken);
    }, []);


  return (
    <div className={styles.main}>
          <h1>Change password</h1>
        <form 
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target;
            // @ts-ignore
            const formData = new FormData(form);
            const formJson = Object.fromEntries(formData.entries());
            // @ts-ignore
            await changePassword(formJson); // Call a function to handle password change
          }}
        >
          
          <label>
            Current Password:
            <input
              type="password"
              name="currentPassword"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              name="newPassword"
              required
              onChange={(e) => {
                setnewPassword(e.target.value);
              }}
            />
          </label>
          <label>
            Confirm New Password:
            <input
              type="password"
              name="confirmPassword"
              required
              onChange={(e) => {
                setconfirmPassword(e.target.value);
              }}
            />
          </label>
          <button type="submit">Change Password</button>
      </form>
      
      <div className={styles.error}>
            {errortext}
            </div>
      <br></br>
      <Link className={styles.back} href="../">Back</Link>
    </div>
  )
};
export default Reset;