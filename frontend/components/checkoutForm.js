import React, { useState, useContext } from "react";
import { useRouter } from 'next/router';
import { FormGroup, Label, Input, Modal, ModalBody } from "reactstrap";
import fetch from "isomorphic-fetch";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CardSection from "./cardSection";
import AppContext from "./context";
import Cookies from "js-cookie";
import styles from '../styles/Home.module.css';

function CheckoutForm() {
  const [data, setData] = useState({ address: "", city: "", state: "" });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const appContext = useContext(AppContext);
  const router = useRouter();

  function onChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function submitOrder() {
    // Ensure Stripe is loaded and we have the elements
    if (!stripe || !elements) {
        console.error("Stripe has not loaded");
        return;
    }

    const cardElement = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
        console.error("Error:", error);
        setError(error.message);
        return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:1337";
    const userToken = Cookies.get("token");


console.log("Token:", userToken); // Debugging line

    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify({
                user: appContext.user, // Assuming user is stored in appContext
                total: appContext.cart.total,
                address: `${data.address}, ${data.city}, ${data.state}`, // Combine address components
                dishes: appContext.cart.items.map(item => ({ id: item.id })),
                token: token.id,
            }),
        });

        if (response.ok) {
            const responseData = await response.json();
            setShowModal(true);
            
            // Set a timeout to close the modal and redirect
            setTimeout(() => {
              setShowModal(false); // Close modal
              router.push('/'); // Redirect to the homepage
          }, 2000); // Adjust the timeout duration as needed
// Show success modal
            // Additional success handling
        } else {
            const errorData = await response.text();
            setError(errorData);
            // Additional error handling
        }
    } catch (error) {
        console.error("There was an error submitting the order:", error);
    }
}


  return (
    <div className="paper" style={{border: "1px solid lightgray", paddingLeft: "20px", paddingRight: "20px", boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)",  }}>
      <h3 className={styles.checkoutTitle}>Checkout</h3>
      <hr />
      <FormGroup style={{ display: "flex" }}>
        {/* Address Input */}
        <div style={{ flex: "0.90", marginRight: 10 }}>
          <Label>Address</Label>
          <Input name="address" onChange={onChange} />
        </div>
      </FormGroup>
      <FormGroup style={{ display: "flex" }}>
        {/* City and State Input */}
        <div style={{ flex: "0.65", marginRight: "6%" }}>
          <Label>City</Label>
          <Input name="city" onChange={onChange} />
        </div>
        <div style={{ flex: "0.25", marginRight: 0 }}>
          <Label>State</Label>
          <Input name="state" onChange={onChange} />
        </div>
      </FormGroup>

      <CardSection data={data} stripeError={error} submitOrder={submitOrder} />

      <button onClick={submitOrder} className={styles.confirmOrderButton}>
        Confirm Order
      </button>

      <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)}>
        <ModalBody>
          Order successful! Redirecting to homepage...
        </ModalBody>
      </Modal>
    </div>
  );
}

export default CheckoutForm;
