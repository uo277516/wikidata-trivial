import { Routes, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import CategorySelectionPage from './components/CategorySelectionPage';
import { I18nextProvider } from 'react-i18next'; // Importa I18nextProvider
import i18n from './i18n/index';

const App = () => {
 

  return (
      <I18nextProvider i18n={i18n}> {/* Provee i18n a través de I18nextProvider */}
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/game" element={<CategorySelectionPage />} />
      </Routes>
      </I18nextProvider>
  );
};

export default App;
