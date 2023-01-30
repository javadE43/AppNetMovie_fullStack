import { useState, useEffect } from "react";
//
import MenuDesktop from "../subcomponents/MenuDestop";
//component
const Header: React.FC = () => {
  const [isScrolled, setIscrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIscrolled(true);
      } else {
        setIscrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [window.scrollY]);
  return (
    <header className={`${isScrolled && "bg-nav-scroll"}`}>
      <MenuDesktop isScrolled={isScrolled}/>
    </header>
  );
};

export default Header;
