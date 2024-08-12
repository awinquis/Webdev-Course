"use client"; 

import { useEffect, useState } from 'react';
import { API_BASE } from "@/utils/api";
import styles from '../../page.module.css';
import Card from "./Card";


const ACCESS_TOKEN_KEY = "access_token";

export default function UserCards(){


	  const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
    const [cardList, setCardList] = useState([]);
    const [errorm, setError] = useState("");
    
    const fetchCards = async () => {
      setCardList([]);
      try {
        const response = await fetch(`${API_BASE}/auth-item/`, {
          headers: {
            "Authorization": "Bearer " + token,
          },
          method: "GET",
        });
        const result = await response.json();
        const ItemListJSX = result.map((item, key) => {
          return<Card 
            title={item.title}
            desc={item.desc}
            price={item.price}
            owner={item.owner}
            status={item.status}
            created= {item.created}
            key={key}
            clickHandler={() => updateItemPrice(item)}            
          />
        });
        setCardList(ItemListJSX);
        return result
      } 
      catch (error) {
        setError("Not logged in");
      } 
    };

    const addItem = async (event) => {
      event.preventDefault(); // prevent the default form submission behavior
      const title = event.target.title.value;
      const price = event.target.price.value;
      const desc = event.target.desc.value;
      try {
        const response = await fetch('/api/additem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token,

          },
          body: JSON.stringify({
            title: title,
            price: price,
            desc: desc,
            status: "On sale"
          })
        });
        const res = await response.json();
        fetchCards();
        return res
      } catch (error) {
        setError(error); // handle any errors
      }
   
    }

   const updateItemPrice = async (item) => {
    if (item.status == "On sale"){
      setError(" ")
      const newPrice = prompt("Edit price:", item.price);
      if (newPrice !== null && newPrice !== "") {
        try {
          const response = await fetch(`/api/auth-item/${item.id}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + token,

            },
            body: JSON.stringify({ price: newPrice,title:item.title,desc:item.desc,owner:item.owner,status:item.status })
          });
          await response.json();
        fetchCards();
        } catch (error) {
          return(error);
        }
      }
  }
  else{
    setError("Cannot change price of purchased item")
  }
  };


    useEffect(() => {
      fetchCards();
    }, []);

    return(<>
                    
     <div className={styles.cardList}>
        {cardList}
      </div>
      
      <div className={styles.error}
      >{errorm}</div>


<div>
  <form onSubmit={addItem} className={styles.form}>
    <h3>Create new item</h3>
    <label>
      Title:<input type="text" name="title" required />
    </label>
    <label>
      Price:<input type="text" name="price"  required/>
    </label>
    <label>
      Description:<textarea name="desc" required/>
    </label>
    <button type="submit">Add item</button>
    <br/>
  </form>
</div>

      
    </>
    )
}