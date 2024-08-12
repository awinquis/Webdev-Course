
import styles from "../../page.module.css";
import { useEffect, useState } from "react";
import { API_BASE } from "@/utils/api";
import Cart from "./Cart";
import Card from "./Card";
const ACCESS_TOKEN_KEY = "access_token";

export default function BrowseCards() {
	const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;	const [cardList, setCardList] = useState([]);
	const [cart, setCart] = useState([]);
	const [cartRender, setCartRender] = useState([]);
	const [price, setPrice] = useState("");
	const [errortext, setError] = useState("");
	const [searchterm, setSearchterm] = useState("");

	//a function for fetching (and searching for) all the cards
	const fetchCards = async (search = searchterm) => {
		try {
			const url = search
				? `${API_BASE}/item/?search=${search}`
				: `${API_BASE}/item/`;
			const response = await fetch(url);
			const result = await response.json();
			const APICARDS = result.map((item, key) => {
				return (
					<Card
						title={item.title}
						desc={item.desc}
						price={item.price}
						owner={item.owner}
						status={item.status}
						created={item.created}
						key={key}
						clickHandler={() => addtoCart(item)}
					/>
				);
			});
			setCardList(APICARDS);
			return result;
		} catch (error) {
			setError("Error fetching data:" + error.message);
		}
	};

	//returns authentication status
	const authStatus = async (path, options = {}) => {
		const res = await fetch(`${API_BASE}/me`, {
			headers: {
				Authorization: "Bearer " + token,
			},
			...options,
		});
		return res;
	};

	//add element to cart state
	const addtoCart = async (item) => {
		
		setError("");
		const result2 = await authStatus();
		const textresult2 = await result2.text();
		const textresultat2fix = textresult2.replace(/"/g, "");
		if (result2.status === 401) {
			setError("Not logged in");
			return;
		}
		if (item.owner === textresultat2fix) {
			setError("Cannot add own items");
			return;
		}

		if (
			cart.findIndex((e) => e.created === item.created) != -1 &&
			cart.findIndex((e) => e.title === item.title) !== -1
		) {
			setError("You cannot add the same item again");
			return;
		}
		setCart((prevCart) => [...prevCart, item]);	};
		//setError("Successfully added item to cart")

	//remove element from cart
	const deletefromCart = (item) => {
		setCart(cart.filter((e) => e.id !== item.id));
	};

	const updateCart = async () => {
		//make cartItemList that contains the items added to the cart
		const cartItemList = cart.map((item, key) => (
			<Cart
				title={item.title}
				price={item.price}
				owner={item.owner}
				key={key}
				clickHandler={() => deletefromCart(item)}
			/>
		));
		//calculate price
		let totPrice = 0;
		cart.forEach((e) => {
			totPrice += Number(e.price);
		});
		setCartRender(cartItemList);
		setPrice(totPrice.toString());
		fetchCards()
	};

	const updateItemStatus = async (item) => {
		try {

			const result2 = await authStatus();
			const textresult2 = await result2.text();
			const textresultat2fix = textresult2.replace(/"/g, "");


			//for duplicating the card, leaving the duplicate in the sellers myitems with the status "SOLD"
			try {
				const response = await fetch(`/api/purchase/`, {
					method: 'POST',
				  	headers: {
						'Content-Type': 'application/json',
						"Authorization": "Bearer " + token,
				  },
				  body: JSON.stringify({
						price: item.price,
						title: item.title,
						desc: item.desc,
						owner: textresultat2fix,
						status: "PURCHASED"
				  })
				});
				await response.json();
				fetchCards();
			  } catch (error) {
				return error;
			  }

			  //for putting the newly bought item in the buyers myitems cards with status "PURCHASED"
			const response = await fetch(`/api/buy-item/${item.id}/`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,

				},
				body: JSON.stringify({
					price: item.price,
					title: item.title,
					desc: item.desc,
					owner: item.owner,
					status: "SOLD",
				}),
			});
			const res = await response.json();
			fetchCards();
			return res;
		} catch (error) {
			return error;
		}
	};



	const pay = async () => {
		const user = await authStatus();
		if (user.status === 401) {
			setError("Not logged in");
			return;
		}
		if (cart.length == 0) {
			setError("Cart is empty");
			return;
		}
		//fetch cards
		const cards = await fetchCards();
		let temp_array = [];
		let temp_array2 = [];

		
		//loop through cards
		cards.forEach((d) => {
			cart.forEach((t) => {
				if (d.id == t.id) {
					//check if its the same item
					if (d.price !== t.price) {
						//check if their prices are the same
						temp_array.push(d); //if they are not, push item to temp array
					}
				}
			});
		});
		cart.forEach(cartItem => {
			let found = false;
			cards.forEach(cardItem => {
			  if (cartItem.id === cardItem.id) {
				found = true;
			  }
			});
			if (!found) {
			  temp_array2.push(cartItem);
			}
		  });
		  

		const changes = temp_array;
		const bought = temp_array2;
		let sentence = "Error: ";
		let sentence2 = "Error: ";

		if (changes.length !== 0) {
			changes.forEach((c) => {
				sentence += "Price has changed for: " + c.title + ",  ";
			});
			sentence += "Remove changed item(s) and try again!";

			setError(sentence);
			return;
		}
		if (bought.length !== 0) {
			bought.forEach((x) => {
				sentence2 += x.title + " has already been bought,  ";
			});
			sentence2 += "Remove bought item(s) and try again!";

			setError(sentence2);
			return;
		}

		cart.forEach((d) => {
			updateItemStatus(d);
		});

		//reset the cart
		setCart([]);
		setPrice("");
		setError("Successfully bought items");	
	};

	useEffect(() => {
		fetchCards(searchterm);
	}, [searchterm]);
	useEffect(() => {
		updateCart();
	  }, [cart]);
	
	

	return (
		<>
			<form className={styles.form}
				onSubmit={(e) => {
					e.preventDefault();
					const form = e.target;
					// @ts-ignore
					const formData = new FormData(form);
					const formJson = Object.fromEntries(formData.entries());
					setSearchterm(formJson.search.toString());
					fetchCards(searchterm);
				}}
			>
				<label>
					Search:
					<input name="search" />
				</label>
				<button type="submit">Search</button>
			</form>
			<div className={styles.error}>		{errortext}	</div>
			<div className={styles.cardList}>	{cardList}	</div>
			<div className={styles.error}>		{errortext}	</div>

			<div className={styles.cart}>
				<h1>CART</h1>
				<p>Total items: {cart.length}</p>
				<p>Total price: {price}€</p>
				<button onClick={pay}>Pay</button>
			</div>
			{cartRender}
		</>
	);
}
