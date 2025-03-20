import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 mb-4 text-white flex space-x-4">
      <NavLink to="/" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : ""}>🏠 Dashboard</NavLink>
      <NavLink to="/missions" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : ""}>📋 Missions</NavLink>
      <NavLink to="/finance" className={({ isActive }) => isActive ? "text-yellow-400 font-bold" : ""}>💰 Finance</NavLink>
    </nav>
  );
}

export default Navbar;
