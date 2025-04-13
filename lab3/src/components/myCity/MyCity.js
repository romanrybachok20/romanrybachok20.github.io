import React, { useEffect, useState } from "react";
import "./MyCity.css";
import { useLocation } from 'react-router-dom';
import Building from "../building/Building";


const MyCity = () => {
  
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#construction') {
      const el = document.getElementById('construction');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div id="city">
      <h1 className="zagolovki">Моє місто</h1>
      <div className="wrapper">
        <div className="map-container"></div>
      </div>
    </div>
  );
};

export default MyCity;
