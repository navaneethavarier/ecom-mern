import React, { useState, useEffect } from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import PaymentB from "./PaymentB";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadProducts = (products) => {
    return (
      <div>
        <h2>This section is to load products</h2>
        {products &&
          products.map((product, index) => {
            return (
              //   <div key={index} className="col-4 mb-4">
              <Card
                key={index}
                product={product}
                removeFromCart={true}
                addToCart={false}
                reload={reload}
                setReload={setReload}
              />
              //   </div>
            );
          })}
      </div>
    );
  };

  const loadCheckout = () => {
    return (
      <div>
        <h2>This section is for checkout</h2>
      </div>
    );
  };
  return (
    <Base title="Cart Page" description="Ready to Checkout?">
      <div className="row text-center">
        <div className="col-6">
          {products.length > 0 ? (
            loadProducts(products)
          ) : (
            <h3>No Products in Cart</h3>
          )}
        </div>
        <div className="col-6">
          <PaymentB products={products} setReload={setReload} />
        </div>
      </div>
    </Base>
  );
};

export default Cart;
