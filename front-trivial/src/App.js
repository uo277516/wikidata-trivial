// App.js
import React from 'react';
import PrincipalScreen from './components/PrincipalScreen';
import CategorySelectionPage from './components/CategorySelectionPage';
import { Routes, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';



const App = () => {
  return (

    <div>
        <Routes>
          <Route path="/" element={<LoginComponent />} ></Route>
        </Routes>
    </div>
      
  );
};

export default App;
