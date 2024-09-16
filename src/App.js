import './App.css';
import React from 'react';
import ProductList from './components/ProductList';
import ProductGraphByStock from './components/ProductGraphByStock';  // Adjust the path if necessary
import ProductGraphByDate from './components/ProductGraphByDate';

function App() {
  return (
    <div className="App">
    <ProductList />
      <div className="graphs-container">
        <ProductGraphByStock />
        <ProductGraphByDate />
      </div>
    </div>
  );
}

export default App;
