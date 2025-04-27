import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Context Providers
import { AuthProvider } from './context/authContext';
import { CityProvider } from './context/cityContext';

// Components
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MyCity from './components/myCity/MyCity';
import Resources from './components/resources/Resources';
import Building from './components/building/Building';
import HomePage from './components/home/HomePage';
import Login from './auth/log';
import Register from './auth/reg';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <CityProvider>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/myCity" element={<MyCity />} />
                <Route path="/construction" element={<Building />} />
                <Route path="/resources" element={<Resources />} />
              </Routes>
            </main>
            <Footer />
          </CityProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
