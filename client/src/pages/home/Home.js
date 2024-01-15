import React from "react";
import Newsletter from "../../components/newsletter/Newsletter.comp";
import Slider from "../../components/slider/Slider.comp";
import "./home.css"



const Home = ({ user }) => {
  if (!user) {
    return (
      <div >
        
        <Slider/>
        <Newsletter/>
      </div>
    );
  }
  return (
    <div >
      <p>Welcome back, {user.username}!</p>
      
      <Slider/>
      <Newsletter />
    </div>
  );
};

export default Home;