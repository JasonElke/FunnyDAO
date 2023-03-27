import React from "react";
import "./loader.scss";

function Loader() {
    return (
        <div className="loader-wrap">
          <div className="la-line-scale la-3x">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
    );
}

export default Loader;
