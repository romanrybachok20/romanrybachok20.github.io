import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import "./Header.css";

const Header = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Вихід з Firebase
      navigate('/'); // Перенаправлення на головну сторінку
    } catch (error) {
      console.log('Sign out error:', error.message);
    }
  };

  return (
    <nav>
      <div className="title">
        <h1>УБМ</h1>
      </div>

      {userLoggedIn && ( // Показувати меню тільки якщо користувач авторизований
        <ul className="nav-menu">
          <li><Link to="/myCity">Моє місто</Link></li>
          <li><Link to="/myCity#construction">Будівництво</Link></li>
          <li><Link to="/resources">Ресурси міста</Link></li>
          <li><button className="sign-out-btn" onClick={handleSignOut}>Вихід</button></li>
        </ul>
      )}
    </nav>
  );
};

export default Header;
