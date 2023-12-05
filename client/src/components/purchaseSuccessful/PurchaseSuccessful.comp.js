import React from "react";
import "../purchaseSuccessful/purchaseSuccessful.css"

const PurchaseSuccessful = () => {
  return (
    <div className="purchasedCont">
      <div className="dialog">
        <h3 className="dialog-title">Your Order is Being Processed!</h3>
        <div className="dialog-content">
          <svg
            id="m-check-mark"
            width="245px"
            height="173px"
            viewBox="0 0 245 173"
            version="1.1"
          >
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
              strokeOpacity="0.4"
            >
              <polyline
                id="checkmark"
                stroke="#000000"
                strokeWidth="15"
                points="5.640625 83.7607422 83.2539062 161.663086 238.97168 6.11328125"
              ></polyline>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessful;
