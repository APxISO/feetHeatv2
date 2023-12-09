import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import React from "react";
import { Link } from "react-router-dom";
import "../allProducts/allProducts.css"


const AllProducts = ({ products }) => {
  console.log(products);
  return (
    <>
      <hr></hr>
      <div className="popProductsHead">
        <h1>ALL SHOES</h1>
      </div>
      <div className="popProductsCont">
        {products.map((item) => (
          <div className="singleProductCont" key={item.id}>
            <h3>{item.title}</h3>
            <div className="circle" />
            <img src={item.imgurl} />
            <Link to={`./${item.id}`}>
              <div className="infoCont">
                <div className="prodIcon">
                  <SearchOutlinedIcon/>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default AllProducts;