import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MyCity from './components/myCity/MyCity';
import Building from './components/building/Building';
import Resources from './components/resources/Resources';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <main>
        <Routes>
          {/* Головна сторінка */}
          <Route
            path="/myCity"
            element={
              <>
                <MyCity />
                <Building />
              </>
            }
          />
          
          {/* Сторінка ресурсів */}
          <Route path="/resources" element={<Resources />} />
        </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
