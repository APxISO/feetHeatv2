import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.comp";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Cart from "./pages/cart/Cart";
import ProductSingleView from "./pages/singleProduct/SingleProduct";
import PurchaseSuccessful from "./components/purchaseSuccessful/PurchaseSuccessful.comp";
import Announcement from "./components/announcement/Announcement.comp";
import Footer from "./components/footer/Footer.comp";
import AllProducts from "./components/allProducts/AllProducts.comp";
import Admin from "./pages/admin/Admin";


const App = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState("");
  
    const fetchProducts = async () => {
      const response = await fetch(`/api/products`);
      const info = await response.json();
      setProducts(info);
    };
  
    const fetchUser = async () => {
      const lsToken = localStorage.getItem("token");
  
      if (lsToken) {
        setToken(lsToken);
      }
      const response = await fetch(`/api/users/me`, {
        headers: {
          Authorization: `Bearer ${lsToken}`,
        },
      });
  
      const data = await response.json();
      console.log(data);
      if (!data.error) {
        setUser(data);
      }
    };
  
    const addItemToCart = async (currentProduct) => {
      if (!user) {
        // For visitors (non-logged-in users)
        setCartItems((prevItems) => {
          const productInCart = prevItems.find(item => item.id === currentProduct.id);
    
          if (productInCart) {
            // If the item is already in the cart, update its quantity and display price
            return prevItems.map(item =>
              item.id === currentProduct.id
                ? { ...item, qty: item.qty + 1, displayPrice: (item.qty + 1) * item.price }
                : item
            );
          } else {
            // If the item is not in the cart, add it with a quantity of 1
            return [
              ...prevItems,
              {
                ...currentProduct,
                qty: 1,
                displayPrice: currentProduct.price,
              },
            ];
          }
        });
      } else {
        // For logged-in users
        if (!user.cart) {
          console.error("User cart not initialized.");
          return;
        }
    
        const productInCart = user.cart.products.find(product => product.id === currentProduct.id);
    
        if (productInCart) {
          const response = await fetch(`/api/orders/updateCartItem`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId: user.cart.id,
              productId: currentProduct.id,
              change: 1,
            }),
          });
    
          if (response.ok) {
            await fetchUser(); // Fetch updated user cart data, including updated total
          } else {
            console.error("Failed to update item quantity in cart");
          }
        } else {
          const response = await fetch(`/api/orders/cart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId: user.cart.id,
              productId: currentProduct.id,
              price: currentProduct.price,
              quantity: 1,
            }),
          });
    
          if (response.ok) {
            await fetchUser(); // Fetch updated user cart data, including updated total
          } else {
            console.error("Failed to add item to cart");
          }
        }
      }
    };
    
  
    useEffect(() => {
      fetchProducts();
      fetchUser();
    }, [token]);
  
    return (
      <div id="container">
        <Announcement />
        <Navbar user={user} setUser={setUser} setToken={setToken} token={token} />
  
        <div id="main">
          <Routes>
            <Route element={<Home user={user} />} path="/" />
            <Route
              element={
                <Login
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                  user={user}
                  setUser={setUser}
                  setToken={setToken}
                  error={error}
                  setError={setError}
                  fetchUser={fetchUser}
                />
              }
              path="/Login"
            />
  
            <Route
              element={
                <Register
                  setUsername={setUsername}
                  username={username}
                  password={password}
                  setPassword={setPassword}
                  setConfirm={setConfirm}
                  confirm={confirm}
                  setToken={setToken}
                  setError={setError}
                  fetchUser={fetchUser}
                />
              }
              path="/Register"
            />
  
            <Route
              element={
                <AllProducts
                  products={products}
                  fetchProducts={fetchProducts}
                  addItemToCart={addItemToCart}
                />
              }
              path="/Products"
            />
  
            <Route
              element={
                <ProductSingleView
                  fetchProducts={fetchProducts}
                  addItemToCart={addItemToCart}
                  products={products}
                />
              }
              path="/Products/:id"
            />
            <Route element={<PurchaseSuccessful />} path="/PurchaseSuccessful" />
  
            <Route
              element={
                <Admin
                  fetchUser={fetchUser}
                  products={products}
                  user={user}
                  token={token}
                  fetchProducts={fetchProducts}
                />
              }
              path="/admin"
            />
            <Route
              element={
                <Cart
                  setCartItems={setCartItems}
                  cartItems={cartItems}
                  addItemToCart={addItemToCart}
                  user={user}
                  token={token}
                  products={products}
                  fetchUser={fetchUser}
                />
              }
              path="/Cart"
            ></Route>
          </Routes>
        </div>
        <Footer />
      </div>
    );
  };
  
  export default App;
  