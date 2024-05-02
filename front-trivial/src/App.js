// App.js
import React from 'react';
import CategorySelectionPage from './components/CategorySelectionPage';
import { Routes, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';



const App = () => {
  return (

    <div>
        <Routes>
          <Route path="/game" element={<CategorySelectionPage />} ></Route>
          <Route path="/" element={<LoginComponent />} ></Route>
        </Routes>
    </div>
      
  );
};

export default App;
