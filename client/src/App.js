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
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);

  
    const handleUserLogin = (userData, userToken) => {
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
    };

    const fetchProducts = async () => {
      const response = await fetch(`/api/products`);
      const info = await response.json();
      setProducts(info);
    };
  
    const fetchUser = async () => {
      const lsToken = localStorage.getItem("token");
  
      if (!lsToken) {
        console.log("No token found, user is not logged in.");
        return; // Exit the function if there's no token
      }

      setToken(lsToken);

      try {
        const response = await fetch(`/api/users/me`, {
          headers: {
            Authorization: `Bearer ${lsToken}`,
          },
        });

        const data = await response.json();
        console.log(data);

        if (!data.error) {
          setUser(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
      } else if (user && user.cart) {
        // For logged-in users
        try {
          let response;
          const orderId = parseInt(user.cart.id, 10); // Parse to integer
          const productId = parseInt(currentProduct.id, 10); // Parse to integer
    
          const productInCart = user.cart.products.find(product => product.id === productId);
    
          if (productInCart) {
            // Update the quantity of existing item
            response = await fetch(`/api/orders/updateCartItem`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderId, // Use parsed integer
                productId, // Use parsed integer
                change: 1,
              }),
            });
          } else {
            // Add new product to cart
            response = await fetch(`/api/orders/cart`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderId: user.cart.id, // Ensure orderId is an integer
                productId: currentProduct.id, // Ensure productId is an integer
                price: currentProduct.price, // Ensure price is a number
                quantity: 1,
              }),
            });
          }
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update cart: ${errorData.error}`);
          }
    
          // Fetch updated user cart data
          await fetchUser();
    
          // Update state to trigger re-render
          setUser({ ...user, cart: { ...user.cart } });
        } catch (error) {
          console.error(error.message);
          throw error; // Propagate the error so it can be caught and handled where this function is called
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
          <Route path="/" element={<Home user={user} />} />
          <Route path="/Login" element={<Login handleUserLogin={handleUserLogin} />} />
          <Route path="/Register" element={<Register setToken={setToken} setError={setError} fetchUser={fetchUser} />} />
          <Route path="/Products" element={<AllProducts products={products} fetchProducts={fetchProducts} addItemToCart={addItemToCart} />} />
          <Route path="/Products/:id" element={<ProductSingleView fetchProducts={fetchProducts} addItemToCart={addItemToCart} products={products} />} />
          <Route path="/PurchaseSuccessful" element={<PurchaseSuccessful />} />
          <Route path="/admin" element={<Admin fetchUser={fetchUser} products={products} user={user} token={token} fetchProducts={fetchProducts} />} />
          <Route path="/Cart" element={
   <Cart 
     setCartItems={setCartItems} 
     cartItems={user && user.cart ? user.cart.products : cartItems} 
     addItemToCart={addItemToCart} 
     user={user} 
     token={token} 
     products={products} 
     fetchUser={fetchUser} 
   />
} />
        </Routes>
      </div>
      <Footer />
    </div>
    );
  };
  
  export default App;
  