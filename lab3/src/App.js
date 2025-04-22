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
        <CityProvider> 
          <Header />
          <main>
            <Routes>
              <Route path="/myCity" element={<MyCity />} />
              <Route path="/resources" element={<Resources />} />
            </Routes>
          </main>
          <Footer /> 
        </CityProvider>
      </Router>
    </div>
  );
}

export default App;
