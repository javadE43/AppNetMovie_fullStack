import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <div className="flex flex-wrap">
      <div className="flex">
        <ul>
          <li>
            <Link to="/">
              <span>درباره ما</span>
            </Link>
          </li>
          <li>
            {" "}
            <Link to="/">
              <span> اپلیکیشن ها</span>
            </Link>
          </li>
          <li>
            {" "}
            <Link to="/">
              <span>خرید اشتراک</span>
            </Link>
          </li>
          <li>
            {" "}
            <Link to="/">
              <span>تماس با ما</span>
            </Link>
          </li>
          <li>
            {" "}
            <Link to="/">
              <span>نماوا مگا</span>
            </Link>
          </li>
          <li>
            {" "}
            <Link to="/">
              <span>کارت هدیه</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
