import React, {
  // useState,
  useEffect,
} from 'react';
// import { Link } from 'react-router-dom';

export default function WaterColumnView() {
  useEffect(() => { document.title = `Water Column`; }, []);

  return (
    <div className="WaterColumnView">
      <h1>Water Column</h1>
    </div>
  );
}
