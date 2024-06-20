import { Routes, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import CategorySelectionPage from './components/CategorySelectionPage';
import { I18nextProvider } from 'react-i18next'; 
import i18n from './i18n/index';

/**
 * Main component representing the entire application.
 * @function App
 * @returns {React.JSX.Element} 
 */
const App = () => {

  return (
      <I18nextProvider i18n={i18n}> 
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/game" element={<CategorySelectionPage />} />
        </Routes>
      </I18nextProvider>
  );
};

export default App;
