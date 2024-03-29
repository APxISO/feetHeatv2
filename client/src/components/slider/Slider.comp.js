import "./slider.comp.css"



const Slider = () => {
    return (
      <div className="sliderCont">
        <div className="slideShow">
          <div className="slide">
            <div className="slideInfo">
              <h1>SUMMER SALE</h1>
              <p>ALL THE LATEST TRENDS! GET 30% OFF NEW ARRIVALS.</p>
              <a href="/Products">
                <button className="shopButton">SHOP NOW</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Slider;