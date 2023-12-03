import React from "react";
import Newsletter from "../../components/newsletter/Newsletter.comp";
import Slider from "../../components/slider/Slider.comp";
import Navbar from "../../components/navbar/Navbar.comp";


const Home = ({ user }) => {
  if (!user) {
    return (
      <div>
        <Navbar/>
        <Slider/>
        <Newsletter/>
      </div>
    );
  }
  return (
    <div>
      <p>Welcome back, {user.username}!</p>
      <Navbar/>
      <Slider/>
      <Newsletter />
    </div>
  );
};

export default Home;