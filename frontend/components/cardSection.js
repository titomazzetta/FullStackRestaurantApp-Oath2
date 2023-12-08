import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
import styles from '../styles/Home.module.css'; // Ensure this is the correct path to your CSS module

function CardSection(props) {
  return (
    <div>
      <label htmlFor="card-element">Credit or debit card</label>
      <div>
        <fieldset style={{ border: "none", margin: "10px 0" }}>
          <div id="card-element" style={{ width: "100%", border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    "::placeholder": {
                      color: "#aab7c4"
                    },
                  },
                  invalid: {
                    color: "#fa755a",
                    iconColor: "#fa755a"
                  },
                },
              }}
            />
          </div>
          {props.stripeError ? (
            <div style={{ color: "red", marginTop: "10px" }}>{props.stripeError.toString()}</div>
          ) : null}
        </fieldset>
      </div>
     
      <style jsx>
        {`
          .order-button-wrapper {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: center;
            margin-top: 20px;
            margin-bottom: 20px;
          }
        `}
      </style>
    </div>
  );
}
export default CardSection;
