import { Routes, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import CategorySelectionPage from './components/CategorySelectionPage';

const App = () => {
 

  return (
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/game" element={<CategorySelectionPage />} />
      </Routes>
  );
};

export default App;
