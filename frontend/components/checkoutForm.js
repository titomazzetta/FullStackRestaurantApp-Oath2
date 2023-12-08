import React, { useState, useContext } from "react";
import { useRouter } from 'next/router';
import { FormGroup, Label, Input, Modal, ModalBody } from "reactstrap";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import AppContext from "./context";
import styles from '../styles/Home.module.css';
import CardSection from "./cardSection";

function CheckoutForm() {
    const [data, setData] = useState({ address: "", city: "", state: "" });
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const appContext = useContext(AppContext);
    const { data: session } = useSession();
    const router = useRouter();

    const onChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submitOrder = async () => {
        if (!stripe || !elements) {
            console.error("Stripe has not loaded");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { token, error: stripeError } = await stripe.createToken(cardElement);

        if (stripeError) {
            setError(stripeError.message);
            return;
        }

        if (!session) {
            console.error("No session found, user must be logged in to place an order");
            return;
        }
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
        const authToken = session.jwt;

        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    user: session.user.id,  // Assuming user ID is needed
                    total: appContext.cart.total,
                    address: `${data.address}, ${data.city}, ${data.state}`,
                    dishes: appContext.cart.items.map(item => ({ id: item.id })),
                    token: token.id,
                    email: session.user.email,  // Make sure email is included here
                }),
            });

            if (response.ok) {
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
    };

    return (
        <div className="paper" style={{ border: "1px solid lightgray", paddingLeft: "20px", paddingRight: "20px", boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)" }}>
            <h3 className={styles.checkoutTitle}>Checkout</h3>
            <hr />
            <FormGroup style={{ display: "flex" }}>
                <div style={{ flex: "0.90", marginRight: 10 }}>
                    <Label for="address">Address</Label>
                    <Input type="text" name="address" id="address" placeholder="1234 Main St" onChange={onChange} />
                </div>
                <div style={{ flex: "0.65", marginRight: "6%" }}>
                    <Label for="city">City</Label>
                    <Input type="text" name="city" id="city" placeholder="Anytown" onChange={onChange} />
                </div>
                <div style={{ flex: "0.25" }}>
                    <Label for="state">State</Label>
                    <Input type="text" name="state" id="state" placeholder="State" onChange={onChange} />
                </div>
            </FormGroup>
            <CardSection />
            <button onClick={submitOrder} className={styles.confirmOrderButton}>
                Confirm Order
            </button>
            <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)}>
                <ModalBody>
                    Order successful! Redirecting to homepage...
                </ModalBody>
            </Modal>
            {error && <div className="error">{error}</div>}
        </div>
    );
}

export default CheckoutForm;
