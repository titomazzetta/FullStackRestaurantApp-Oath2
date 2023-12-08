/* pages/checkout.js */

import React, { useContext } from "react";
import { Row, Col, Button } from "reactstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/checkoutForm";
import AppContext from "../components/context";
import styles from '../styles/Home.module.css'; // Ensure this path is correct

function Checkout() {
  const { cart } = useContext(AppContext); 
  // get app context
  const {isAuthenticated} = useContext(AppContext);
  // isAuthenticated is passed to the cart component to display order button
  //const isAuthenticated  = true;
  
  // load stripe to inject into elements components
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);



  
  const {addItem, removeItem } = useContext(AppContext);
  const renderCartItems = () => {
    return cart.items.map((item, index) => (
      <div key={index} className={styles.checkoutCartItem}>
        <span>{item.quantity}x {item.Dish} - ${item.Price.toFixed(2)}</span>
        <button className={styles.plusMinusButton} onClick={() => addItem(item)}>+</button>
        <button className={styles.plusMinusButton} onClick={() => removeItem(item.id)}>-</button>
      </div>
    ));
  };

  return (
    <Row>
       <Col sm="12" md={{ size: 8, offset: 2 }} className={styles.checkoutCol}>
     
        <Elements stripe={stripePromise}>
          <br></br>
          <CheckoutForm />
          
        </Elements>
      
      
        <div className={styles.cartSection}>
        <h5 className={styles.centerText}>Your Cart:</h5>
          {renderCartItems()}
          <div className={styles.totalAmount}>
            Total: ${cart.total.toFixed(2)}
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default Checkout;