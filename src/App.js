import React,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './pages/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import Analytics from './pages/analytics/Analytics';
import CreateQuiz from './pages/quiz/CreateQuiz';
import LoginSignup from './pages/LoginSignUp/loginSignupPage';
import '../src/pages/style.css'; 
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const swithToDashboard = () => {
    setIsAuthenticated(false);
  };
  const openCreateQuizModal = () => {
    setIsQuizModalOpen(true);
  };

  useEffect(() => {
    // Check if userId is present in localStorage
    const userId = localStorage.getItem('user');
    console.log(userId)
    if (userId) {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <Router>
      {isAuthenticated ? (
        <div className="container">
          <Sidebar  openCreateQuizModal={openCreateQuizModal} /> 
          <div className="main-content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginSignup swithToDashboard={swithToDashboard} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
