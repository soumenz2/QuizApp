
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';
import Sidebar from './pages/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import Analytics from './pages/analytics/Analytics';
import CreateQuiz from './pages/quiz/CreateQuiz';
import LoginSignup from './pages/LoginSignUp/loginSignupPage';
import '../src/pages/style.css'; 
import { useSelector } from 'react-redux';





function AdminRouter() {
  

  const userIDfromREdux=useSelector((state)=>state.user.userId)



  return (
    <Router>
      { userIDfromREdux != null ? (
        <div className="container">
          <Sidebar   /> 
          <div className="main-content">
            <Routes>
            {/* <Route path="/" element={<Navigate to="/searchDashboard" replace={true} />} /> */}
            <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginSignup  />} />
        </Routes>
      )}
    </Router>
  );
}

export default AdminRouter;
