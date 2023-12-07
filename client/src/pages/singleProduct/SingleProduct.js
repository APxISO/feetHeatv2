import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../singleProduct/singleProduct.css";

const ProductSingleView = ({ products, fetchProducts, addItemToCart }) => {
  const [product, setProduct] = useState({});
  const [alert, setAlert] = useState("");
  const { id } = useParams();

  useEffect(() => {
    if (products) {
      const foundProduct = products.find((p) => p.id === parseInt(id));
      setProduct(foundProduct);
    }
  }, [products, id]);

  const handleAddToCart = (product) => {
    addItemToCart(product);
    setAlert("Your shoes have been added to your cart!");
  };

  return product ? (
    <div className="singleProdCont">
      <hr></hr>
      {alert && <div className="alert">{alert}</div>}
      <div className="singProdWrapper">
        <div className="singProdImgCont">
          <img src={product.imgurl} alt={product.title} />
        </div>
        <div className="singProdInfoCont">
          <h1>{product.title}</h1>
          <div className="singProdDesc">{product.description}</div>
          <div className="price">$ {product.price}</div>

          <div className="addCont">
            <button className="checkoutButton" onClick={() => handleAddToCart(product)}>
              ADD TO CART
            </button>
            <Link to="/Products" className="checkoutButton">
              CONTINUE SHOPPING
            </Link>
            <Link to="/Cart" className="checkoutButton">
              CHECKOUT
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <h1>Product Not found</h1>
  );
};

export default ProductSingleView;
