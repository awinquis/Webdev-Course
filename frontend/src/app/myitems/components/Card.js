import styles from '../../page.module.css'

export default function Card(props) {
  const createdDate = new Date(props.created);
  const formattedDate = createdDate.toLocaleString('en-GB', {
    year: '2-digit',
    month: '2-digit',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div  className={styles.cardItem} onClick={() => props.clickHandler(props)}>
      <p>Title: {props.title}</p>
      <p>Description: {props.desc}</p>
      <p>Price: {props.price}€</p>
      <p>Owner: {props.owner}</p>
      <p>Status: {props.status}</p>
      <p>Created: {formattedDate}</p>

    </div>
  );
}
