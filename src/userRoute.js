import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import '../src/pages/style.css'; 

import QuizPage from './pages/quizPage/quizpage';



function UserRouter() {
 


  return (
    <Router>
     
        <Routes>
          <Route path="/quiz/:quizID" element={<QuizPage  />} />
        </Routes>
    
    </Router>
  );
}

export default UserRouter;
