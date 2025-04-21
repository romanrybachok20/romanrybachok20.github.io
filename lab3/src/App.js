import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MyCity from './components/myCity/MyCity';
import Resources from './components/resources/Resources';
import { CityProvider } from './context/cityContext';

function App() {
  return (
    <div className="App">
      <Router>
        {/* Переміщаємо CityProvider навколо компонентів, щоб він охоплював всю частину додатку */}
        <CityProvider> 
          <Header /> {/* Завжди буде відображатися */}
          <main>
            <Routes>
              {/* Маршрути для сторінок */}
              <Route path="/myCity" element={<MyCity />} />
              <Route path="/resources" element={<Resources />} />
            </Routes>
          </main>
          <Footer /> {/* Завжди буде відображатися */}
        </CityProvider>
      </Router>
    </div>
  );
}

export default App;
