import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cart/cart.css"

const Cart = ({ addItemToCart, user, token, fetchUser, cartItems, setCartItems }) => {
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
        if (response.ok) {
            await fetchUser();
            navigate("/PurchaseSuccessful");
        } else {
            console.error("Failed to checkout:", data.error);
        }
    };

    // FUNCTIONS WHEN A USER IS LOGGED IN
    const deleteCartItem = async (currentProduct) => {
        if (user && user.cart) {
            const response = await fetch(`/api/orders/deleteItem/${user.cart.id}/${currentProduct.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
      
            if (response.ok) {
                await fetchUser();
            } else {
                console.error("Failed to delete item from cart");
            }
        }
    };

    const decreaseQuantity = async (currentProduct) => {
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
    };

    useEffect(() => {
        if (user && user.cart) {
            const totalForLoggedInUser = user.cart.products.reduce((acc, product) => {
                return acc + (product.price * product.quantity);
            }, 0);
            setUserTotal(totalForLoggedInUser);
        }
    }, [user?.cart?.products]);

    useEffect(() => {
        let newTotal = 0;
        if (cartItems) {
            cartItems.forEach((item) => {
                newTotal += item.price * item.qty;
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