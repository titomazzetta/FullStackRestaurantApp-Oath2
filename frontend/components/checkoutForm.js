// CheckoutForm.js
import React, { useState, useContext } from "react";
import { useRouter } from 'next/router';
import { FormGroup, Label, Input, Modal, ModalBody } from "reactstrap";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CardSection from "./cardSection";
import AppContext from "./context";
import { useSession } from "next-auth/react";
import styles from '../styles/Home.module.css';

function CheckoutForm() {
  const [data, setData] = useState({ address: "", city: "", state: "" });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const appContext = useContext(AppContext);
  const { data: session } = useSession();
  const router = useRouter();

  function onChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function submitOrder() {
    if (!stripe || !elements) {
      console.error("Stripe has not loaded");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { token, stripeError } = await stripe.createToken(cardElement);

    if (stripeError) {
      console.error("Error:", stripeError);
      setError(stripeError.message);
      return;
    }

    if (!session || !session.jwt) {
      console.error("No session or token found, user must be logged in to place an order");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.jwt}`,
        },
        body: JSON.stringify({
          user: appContext.user,
          total: appContext.cart.total,
          address: `${data.address}, ${data.city}, ${data.state}`,
          dishes: appContext.cart.items.map(item => ({ id: item.id })),
          token: token.id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          router.push('/');
        }, 2000);
      } else {
        const errorData = await response.text();
        setError(errorData);
      }
    } catch (error) {
      console.error("There was an error submitting the order:", error);
    }
  }

  return (
    <div className="paper" style={{ border: "1px solid lightgray", paddingLeft: "20px", paddingRight: "20px", boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)" }}>
      <h3 className={styles.checkoutTitle}>Checkout</h3>
      <hr />
      <FormGroup style={{ display: "flex" }}>
        {/* Input fields and other components */}
      </FormGroup>
      <CardSection data={data} stripeError={error} submitOrder={submitOrder} />
      <button onClick={submitOrder} className={styles.confirmOrderButton}>Confirm Order</button>
      <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)}>
        <ModalBody>Order successful! Redirecting to homepage...</ModalBody>
      </Modal>
    </div>
  );
}

export default CheckoutForm;

