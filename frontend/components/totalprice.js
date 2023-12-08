import Link from "next/link";
import React, { useContext } from "react";
import AppContext from "./context";
import styles from '../styles/Home.module.css';

function TotalPrice() {
  const { cart } = useContext(AppContext);
  const safeCart = cart || { total: 0 };

  // Only render the component if the total is greater than 0
  if (safeCart.total > 0) {
    return (
      <Link href="/checkout" passHref>
        <div className={styles.totalPriceBox}>
          <h5 className={styles.totalPriceText}>Cart Total: </h5>
          <h3 className={styles.totalPriceText}>
      ${safeCart.total.toFixed(2)}
    </h3>
        </div>
      </Link>
    );
  } else {
    return null; // Don't render anything if total is 0 or less
  }
}

export default TotalPrice;
