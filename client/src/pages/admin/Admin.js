import React from "react";
import "../admin/admin.css"
import { useState } from "react";
import { useEffect } from "react";

const Admin = ({ products, token, fetchProducts }) => {
  const [userss, setUserss] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgurl, setImgurl] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  // if (!products[0]) {
  //   return <div></div>;
  // }

  const fetchAllUsers = async () => {
    const response = await fetch("http://localhost:3001/api/user/all");
    const data = await response.json();
    setUserss(data);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:3001/api/products`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: currentProduct[0].id,
        title: title,
        description: description,
        imgurl: imgurl,
        stock: stock,
        price: price,
      }),
    });

    fetchProducts();
  };

  const setCurrent = async (id) => {
    const resp = await fetch(`http://localhost:3001/api/products/${id}`);
    const info = await resp.json();
    setCurrentProduct(info);
  };

  useEffect(() => {
    fetchAllUsers();
    if (!products[0]) {
      return;
    }
    setCurrent(products[0].id);
  }, [products]);

  return (
    <div className="adminCont">
      <div className="adminCard">
        <h2>WELCOME ADMIN</h2>
        <p>Select a product below, make changes, and Submit.</p>
        <form id="myForm" onSubmit={updateProduct}>
          <select
            onChange={(e) => setCurrent(e.target.value)}
            defaultValue={"Pick a Product"}
            name="test"
          >
            {products.map((p) => {
              return (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              );
            })}
          </select>
          <input
            placeholder="Change title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Change description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            placeholder="Change Image Url"
            value={imgurl}
            onChange={(e) => setImgurl(e.target.value)}
          />
          <input
            placeholder="Change Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <input
            placeholder="Change Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button type="submit">Submit Changes</button>
        </form>

        <div className="adminUsersCard">
          {userss.map((u) => {
            return (
              <>
                <div className="adminUsersCard" key={u.id}>
                  <h5>CURRENT USER</h5>
                  <div className="adminUsersId">
                    <div>{u.email}$</div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Admin;
