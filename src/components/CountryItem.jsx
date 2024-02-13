import styles from "./CountryItem.module.css";

function CountryItem(prop) {
  const { country } = prop;
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
