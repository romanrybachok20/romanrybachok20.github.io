import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="home-page">
      <div className="container">
        <h1>Управління будівництвом міста</h1>
        <p>Вас вітає <b className='UBM'>УБМ</b>! Тут ви зможете будувати власне місто та керувати ресурсами.</p>
        <p>Для початку роботи, будь ласка, увійдіть або зареєструйтесь.</p>
        <div className="buttons-container">
          <button onClick={handleLoginClick}>Авторизуватися</button>
          <button onClick={handleRegisterClick}>Зареєструватися</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
