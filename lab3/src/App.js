import './App.css';
import './components/header/Header'
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MyCity from './components/myCity/MyCity';

function App() {
  return (
    <div className="App">
      <Header/>
      <MyCity/>
      <Footer/>
    </div>
  );
}

export default App;
