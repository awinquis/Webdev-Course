"use client";
import {useState} from "react";
import styles from '../../page.module.css';
export default function Populate(){

    const [msg, setMsg] = useState("POPULATE DB");

    const populateClickHandler = async () => {
        const res = await fetch('http://127.0.0.1:8000/populate/', {
            })
        const info = await res.json()
        setMsg(info.message)
        //window.alert(info.message)

}

    return <>
        <button className={styles.populatedb} onClick={() => populateClickHandler() }>{msg}</button>    
    </>
}