import "./Header.css";

const Header = () => {
  return (
<nav>
    <div className="title">
        <h1>УБМ</h1>
    </div>
    <ul className="nav-menu">
        <li><a href="#city">Моє місто</a></li>
        <li><a href="#construction">Будівництво</a></li>
        <li><a href="#resources">Ресурси міста</a></li>
    </ul>
</nav>
  );
};

export default Header;