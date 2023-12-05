import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cart/cart.css"

const Cart = ({
  addItemToCart,
  user,
  token,
  fetchUser,
  cartItems,
  setCartItems,
}) => {
  const [userTotal, setUserTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const visitorCheckout = () => {
    navigate("/PurchaseSuccessful");
  };

  const handleCheckOut = async (orderId, creatorId) => {
    const response = await fetch(`/api/orders/checkoutOrder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId,
        creatorId,
      }),
    });
    const data = await response.json();
    console.log(data);
    fetchUser();
    navigate("/PurchaseSuccessful");
  };

  // FUNCTIONS WHEN A USER IS LOGGED IN
  const deleteCartItem = async (currentProduct) => {
    const response = await fetch(`/api/orders/deleteItem`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId: user.cart.id,
        productId: currentProduct.id,
      }),
    });
    const data = await response.json();
    await fetchUser();
    console.log(data);
  };

  const decreaseQuantity = async (currentProduct) => {
    if (currentProduct.quantity > 1) {
      const response = await fetch(`/api/orders/decreaseCartItem`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: user.cart.id,
          productId: currentProduct.id,
        }),
      });
      const data = await response.json();
      await fetchUser();
      console.log(data);
    } else {
      deleteCartItem(currentProduct);
    }
  };

  const getOrderPrice = async (orderId) => {
    const response = await fetch(`/api/orders/orderPrice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId,
      }),
    });
    const data = await response.json();
    console.log(data);
    let totalToAdd = 0;
    for (let i = 0; i < data.length; i++) {
      totalToAdd += data[i].price;
    }
    setUserTotal(totalToAdd);
  };
  //END OF FUNCTIONS WHEN USER IS LOGGED IN

  //FUNCTIONS WHEN USER IS NOT LOGGED IN
  const decreaseCartItemQuantity = (currentProduct) => {
    const exist = cartItems.find(
      (cartItem) => cartItem.id === currentProduct.id
    );
    if (exist.qty === 1) {
      setCartItems(
        cartItems.filter((cartItem) => cartItem.id !== currentProduct.id)
      );
    } else {
      setCartItems(
        cartItems.map((cartItem) => {
          const tempItem = { ...exist, qty: cartItem.qty - 1 };
          tempItem.displayPrice = tempItem.price * tempItem.qty;
          return cartItem.id === currentProduct.id ? tempItem : cartItem;
        })
      );
    }
  };

  const removeCartItem = (currentProduct) => {
    const exist = cartItems.find(
      (cartItem) => cartItem.id === currentProduct.id
    );

    setCartItems(
      cartItems.filter((cartItem) => cartItem.id !== currentProduct.id)
    );
  };
  //END OF FUNCTIONS WHEN USER IS NOT LOGGED IN

  useEffect(() => {
    if (user && user.cart) {
      getOrderPrice(user.cart.id);
    }
  }, [user]);

  useEffect(() => {
    let newTotal = 0;
    if (cartItems) {
      for (let i = 0; i < cartItems.length; i++) {
        newTotal += cartItems[i].displayPrice;
      }
    }
    setTotal(newTotal);
  }, [cartItems]);

  const renderCartForLoggedInUser = () => {
    return (
      <>
        <div>
          {user.cart.products.map((product) => (
            <div className="single-product-container" key={product.id}>
              <h1>{product.title}</h1>
              <h4>${product.price} for {product.quantity}</h4>
              <div className="img-buttons">
                <img src={product.imgurl} width="200" alt={product.title} />
                <button className="button2" onClick={() => addItemToCart(product)}>+</button>
                <button className="button2" onClick={() => decreaseQuantity(product)}>-</button>
                <button className="button2" onClick={() => deleteCartItem(product)}>Remove from cart</button>
              </div>
              <br></br>
            </div>
          ))}
        </div>
        <div className="checkout-container">
          <h3>Total: {userTotal}$ </h3>
          <button className="button2" onClick={() => handleCheckOut(user.cart.id, user.id)}>Purchase</button>
        </div>
      </>
    );
  };

  const renderCartForVisitor = () => {
    return (
      <>
        <div>
          {cartItems.map((product) => (
            <div className="single-product-container" key={product.id}>
              <h1>{product.title}</h1>
              <h4>${product.price} for {product.qty}</h4>
              <div className="img-buttons">
                <img src={product.imgurl} width="200" alt={product.title} />
                <button className="button2" onClick={() => addItemToCart(product)}>+</button>
                <button className="button2" onClick={() => decreaseCartItemQuantity(product)}>-</button>
                <button className="button2" onClick={() => removeCartItem(product)}>Remove from cart</button>
              </div>
              <br></br>
            </div>
          ))}
        </div>
        <div className="checkout-container">
          <h3>Total: {total}$ </h3>
          <button className="button2" onClick={visitorCheckout}>Proceed to Checkout</button>
        </div>
      </>
    );
  };

  // Conditional rendering
  if (user && user.cart) {
    return user.cart.products.length === 0 ? <h1>YOUR CART IS EMPTY</h1> : renderCartForLoggedInUser();
  } else {
    return (!cartItems || cartItems.length === 0) ? <h1>YOUR CART IS EMPTY</h1> : renderCartForVisitor();
  }
};

export default Cart;