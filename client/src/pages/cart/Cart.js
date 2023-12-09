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
    // For logged-in users
    if (user && user.cart) {
      const response = await fetch(`/api/orders/deleteItem/${user.cart.id}/${currentProduct.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        await fetchUser(); // Update user state after deleting the item
      } else {
        console.error("Failed to delete item from cart");
      }
    }
  
    // For non-logged-in users (guests)
    if (!user) {
      setCartItems((prevItems) => 
        prevItems.filter((item) => item.id !== currentProduct.id)
      );
    }
  };

  const decreaseQuantity = async (currentProduct) => {
    // For logged-in users
    if (user && user.cart) {
      if (currentProduct.quantity > 1) {
        const response = await fetch(`/api/orders/decreaseCartItem/${user.cart.id}/${currentProduct.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          await fetchUser(); 
        } else {
          console.error("Failed to decrease item quantity");
        }
      } else {
        deleteCartItem(currentProduct);
      }
    }
  
    // For non-logged-in users (visitors)
    if (!user) {
      setCartItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.id === currentProduct.id && item.qty > 1) {
            return { ...item, qty: item.qty - 1, displayPrice: (item.qty - 1) * item.price };
          } else {
            return item;
          }
        });
      });
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
      cartItems.forEach((item) => {
        newTotal += item.displayPrice * item.qty;
      });
    }
    setTotal(newTotal);
  }, [cartItems]);

  const renderCartItem = (product, quantity) => (
    <div className="cartProduct">
      <div className="cartProductDetail">
        <img src={product.imgurl} alt={product.title} className="cartProductImage"/>
        <div className="productDetails">
          <span className="prodName">{product.title}</span>
          <div className="ProdAmntCont">
            <button onClick={() => decreaseQuantity(product)}>-</button>
            <span className="prodQuantity">{quantity}</span>
            <button onClick={() => addItemToCart(product)}>+</button>
          </div>
          <button className="removeButton" onClick={() => deleteCartItem(product)}>Remove</button>
        </div>
      </div>
      <div className="priceDetail">
        <span id="prodPrice">${product.price * quantity}</span>
      </div>
    </div>
  );

  const renderCartForLoggedInUser = () => (
    <>
      <div className="cartWrapper">
        <h1>Shopping Cart</h1>
        <hr/>
        {user.cart.products.map((product) => 
          renderCartItem(product, product.quantity)
        )}
      </div>
      <div className="checkout-container">
        <h3>Total: ${userTotal}</h3>
        <button className="button2" onClick={() => handleCheckOut(user.cart.id, user.id)}>Purchase</button>
      </div>
    </>
  );

  const renderCartForVisitor = () => (
    <>
      <div className="cartWrapper">
        <h1>Shopping Cart</h1>
        <hr/>
        {cartItems.map((product) => 
          renderCartItem(product, product.qty)
        )}
      </div>
      <div className="checkout-container">
        <h3>Total: ${total}</h3>
        <button className="button2" onClick={visitorCheckout}>Proceed to Checkout</button>
      </div>
    </>
  );


  if (user && user.cart) {
    return user.cart.products.length === 0 ? <h1>YOUR CART IS EMPTY</h1> : renderCartForLoggedInUser();
  } else {
    return (!cartItems || cartItems.length === 0) ? <h1>YOUR CART IS EMPTY</h1> : renderCartForVisitor();
  }
};

export default Cart;