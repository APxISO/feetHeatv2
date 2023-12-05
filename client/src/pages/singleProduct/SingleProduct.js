import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";

const ProductSingleView = ({ products, fetchProducts, addItemToCart }) => {
  const [product, setProduct] = useState({});
  const [alert, setAlert] = useState("");
  const { id } = useParams();

  useEffect(() => {
    setProduct(products.find((product) => product.id === +id));
  }, [products]);

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
          <img src={product.imgurl} />
        </div>
        <div className="singProdInfoCont">
          <h1>{product.title}</h1>
          <div className="singProdDesc">{product.description}</div>
          <div id="price">$ {product.price}</div>

          <div className="addCont">
            <button onClick={() => handleAddToCart(product)}>
              ADD TO CART
            </button>
            <Link to="/Products">
              <button>CONTINUE SHOPING</button>
            </Link>
            <Link to="/Cart" className="menuItem">
              <button>CHECKOUT</button>
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
