import styles from '../../page.module.css'
export default function Cart(props) {
  const cStyle = {
   

  }
  return (
    <div className={styles.cartItem}>
          <div style={cStyle}> 
          <div onClick={() => props.clickHandler(props)}>
            <p>Title: {props.title}</p>
            <p>Price: {props.price}€</p>
            <p>Owner: {props.owner}</p>

            </div>
      </div>
    </div>
  );
}
