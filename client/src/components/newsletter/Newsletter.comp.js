import React from "react";
import "./newsletter.comp.css"


const Newsletter = () => {
  return (
    <div className="newsLetterCont">
      <h1>Love Fresh Kix?</h1>
      <p id="newsDesc">Get weekly updates from all the latest shoe trends</p>
      <div className="newsLetterInput">
        <input placeholder="Your email" value={""} />
        <button>Submit</button>
      </div>
    </div>
  );
};

export default Newsletter;
