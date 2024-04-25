// App.js
import React from 'react';
import PrincipalScreen from './components/PrincipalScreen';
import CategorySelectionPage from './components/CategorySelectionPage';
import { Routes, Route } from 'react-router-dom';



const App = () => {
  return (

    <div>
        <Routes>
          <Route path="/" element={<CategorySelectionPage />} ></Route>
          <Route path="/game/:category" element={<PrincipalScreen />} ></Route>
        </Routes>
    </div>
      
  );
};

export default App;
