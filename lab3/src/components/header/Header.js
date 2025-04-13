import { Link } from 'react-router-dom';
import "./Header.css";

const Header = () => {
  return (
    <nav>
      <div className="title">
        <h1>УБМ</h1>
      </div>
      <ul className="nav-menu">
        <li><Link to="/myCity">Моє місто</Link></li> 
        <li><Link to="/myCity#construction">Будівництво</Link></li>
        <li><Link to="/resources">Ресурси міста</Link></li>
      </ul>
    </nav>
  );
};

export default Header;
