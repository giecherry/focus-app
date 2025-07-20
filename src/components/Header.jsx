import React from "react";
import logoBig from "../assets/logo-big.png";

function Header() {
  return (
    <header className="mb-8 text-center">
      <img src={logoBig} alt="BeeFocused Logo" />
    </header>
  );
}

export default Header;