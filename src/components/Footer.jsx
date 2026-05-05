import logoNotext from "/logo-no-text.png";

function Footer() {
  return (
    <footer className="mt-8 text-center text-gray-500 text-sm">
      <span className="flex flex-wrap items-end justify-center gap-2">
        BeeFocused - Build focus habits, one session at a time
        <img src={logoNotext} alt="BeeFocused Logo" className="h-8 w-auto object-contain" />
      </span>
    </footer>
  );
}

export default Footer;
