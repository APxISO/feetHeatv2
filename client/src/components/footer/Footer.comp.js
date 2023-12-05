import React from "react";
import "../footer/footer.css"
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import PhoneIcon from '@mui/icons-material/Phone';
import RoomIcon from '@mui/icons-material/Room';
import TwitterIcon from '@mui/icons-material/Twitter';

function Footer() {
  return (
    <div className="footerCont">
      <div className="footerLeft">
        <a href="/">
          <h1>Feet Heat</h1>
        </a>

        <div className="footerDesc">
          <p>
            Serving the latest and hottest shoe brands on the market Copyright ©
            2022 Feat Heat LTD. All Rights Reserved.
          </p>
          <p>Designed by Team Feet Heat</p>
        </div>
        <div className="socialCont">
          <div className="socialIcon">
            <FacebookIcon />
          </div>
          <div className="socialIcon">
            <TwitterIcon />
          </div>
          <div className="socialIcon">
            <InstagramIcon />
          </div>
        </div>
      </div>
      <div className="footerCenter">
        <div id="title">Useful Links</div>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/Cart">Cart</a>
          </li>
          <li>
            <a href="/">Categories</a>
          </li>
          <li>
            <a href="/Login">My Account</a>
          </li>
          <li>
            <a href="/">Terms</a>
          </li>
        </ul>
      </div>
      <div className="footerRight">
        <div id="title">Connect With Us</div>
        <div className="contactItem">
          <RoomIcon style={{ marginRight: "10px" }} />
          Address
        </div>
        <div className="contactItem">
          <PhoneIcon style={{ marginRight: "10px" }} />
          904-123-456
        </div>
        <div className="contactItem">
          <MailOutlineOutlinedIcon style={{ marginRight: "10px" }} />
          ContactUs@FeetHeat.com
        </div>
        <div className="contactItem">
          <PaymentIcon style={{ marginRight: "10px" }} />
          <img src="https://i.ibb.co/Qfvn4z6/payment.png" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
