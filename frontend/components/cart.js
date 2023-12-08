import React, { useContext } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import AppContext from "./context";
import Link from "next/link";
import styles from '../styles/Home.module.css';

function Cart() {
  const { cart, addItem, removeItem } = useContext(AppContext);
  const safeCart = cart || { items: [], total: 0 };

  const renderItems = () => {
    const { items } = safeCart;

    return items.map((item) => (
      <div className={styles.cartItem} key={item.id}>
        <div>
        <span id="item-quantity" style={{ color: 'black', fontSize: '20px' }}>{item.quantity}x</span>
        <button className={styles.plusMinusButton} onClick={() => addItem(item)}>+</button>
        <button className={styles.plusMinusButton} onClick={() => removeItem(item.id)}>-</button>
        <span id="item-price" style={{ color: 'black', fontSize: '20px', marginLeft: '10px' }}>${item.Price}</span>
          <span id="item-name" style={{ color: 'black', marginLeft: '10px', fontSize: '20px' }}>{item.Dish}</span>
        
        </div>
        <br></br>
      </div>
    ));
  };

  <br></br>

  const checkoutItems = () => {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.cartTotalBadge}>
          <h5>Total:</h5>
          <h3>${safeCart.total.toFixed(2)}</h3>
        </div>
        <Link href="/checkout/" passHref>
  <button className={styles.orderButton}>Order</button>
</Link>

      </div>
    );
  };

  return (
    <div className={styles.cartContainer}>
      
    <Card className={styles.cartCard}>
      <div className={styles.cartTitle}>
        <h3>Cart</h3>
      </div>
  
      <CardBody className={styles.cartBody}>
          <div className={styles.itemsContainer}> {/* Updated */}
            {renderItems()}
          </div>
          {checkoutItems()}
        </CardBody>
      </Card>
    </div>
  );
}

export default Cart;
