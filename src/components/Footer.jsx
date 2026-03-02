import logoNotext from "/logo-no-text.png";

function Footer() {
  return (
    <footer className="mt-4 text-center text-gray-500 text-sm">
      <span className="flex items-end justify-center">BeeFocused — Build focus habits, one session at a time<img src={logoNotext} alt="BeeFocused Logo" className="h-8 w-auto object-contain mx-auto" /></span>
    </footer>
  );
}

export default Footer;