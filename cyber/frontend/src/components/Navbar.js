import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">My App</Link>
        <div>
          <Link to="/" className="nav-link">Items</Link>
          <Link to="/add" className="nav-link">Add Item</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
