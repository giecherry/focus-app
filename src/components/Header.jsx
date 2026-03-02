import logoBig from "/logo-big.png";
import logo1x1 from "/logo-1x1.png";


function Header() {
  return (
    <header className="mb-12 text-center">
      <img
        className="hidden sm:block h-20 w-auto object-contain mx-auto"
        src={logoBig}
        alt="BeeFocused Logo"
      />
      <img
        className="block sm:hidden h-60 w-auto object-contain mx-auto"
        src={logo1x1}
        alt="BeeFocused Logo"
      />
    </header>
  );
}

export default Header;