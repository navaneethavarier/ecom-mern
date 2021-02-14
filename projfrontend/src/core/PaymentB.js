import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { getMeToken, processPayment } from "./helper/paymentbHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";

import DropIn from "braintree-web-drop-in-react";

const PaymentB = ({ products, setReload = (f) => f, reload = undefined }) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getToken = (userId, token) => {
    getMeToken(userId, token).then((data) => {
      if (data.error) {
        setInfo({ ...info, error: data.error });
      } else {
        const clientToken = data.clientToken;
        setInfo({ clientToken });
      }
    });
  };

  const onPurchase = (info) => {
    setInfo({ loading: true });
    let nonce;
    console.log(info.instance);
    let getNonce = info.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getAmount(),
        };
        processPayment(userId, token, paymentData)
          .then((res) => {
            setInfo({ ...info, loading: false, success: res.success });
            console.log("PAYMENT SUCCESSFUL");
            const orderData = {
              products: products,
              transaction_id: res.transaction.id,
              amount: res.transaction.amount,
            };
            createOrder(userId, token, orderData);
            cartEmpty(() => {});
            setReload(reload);
          })
          .catch((err) => {
            setInfo({ loading: false, success: false });
            console.log("PAYMENT FAILED");
          });
      })
      .catch();
  };

  const getAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  const showBraintreeDropIn = (info) => {
    console.log(info);
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button
              onClick={() => onPurchase(info)}
              className="btn btn-block btn-success"
            >
              Buy
            </button>
          </div>
        ) : (
          <h1>Please login or add sth to cart</h1>
        )}
      </div>
    );
  };

  return (
    <div>
      <h3>Your bill is Rs.{getAmount()}</h3>
      {showBraintreeDropIn(info)}
    </div>
  );
};
export default PaymentB;
