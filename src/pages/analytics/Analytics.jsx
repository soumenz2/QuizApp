import React, { useState,useEffect } from 'react';
import '../style.css';
import CreateQuizModal from '../modalPage/createquizModal';
import API_BASE_URL from '../../config/config';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Analytics = () => {
  const [quizData, setQuizData] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const userIDfromREdux=useSelector((state)=>state.user.userId)

    
  useEffect(() => {
    const fetchQuizData = async () => {
        try {
            const userID = localStorage.getItem('user');
            console.log(userID)
            const response = await axios.get(`${API_BASE_URL}/getQuizWithDetails?userID=${userIDfromREdux}`);
            
            if (response.data.message === "Success") {
                setQuizData(response.data.data);
           
            } else {
                console.log('Error fetching data:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching quiz data:', error);
        }
    };

    fetchQuizData();
}, []);
const quizzes = quizData.map((quiz) => ({
  id:quiz.quizID,
  name: quiz.quizName,
  createdOn: new Date(quiz.DateOfCreation).toLocaleDateString(),
  impressions: quiz.NoOfImpression,
  type: quiz.quizType,
  questions: quiz.questions.map((question) => ({
    text: question.questionName,
    attempts: question.correctlyAnswered + question.wronglyAnswered,
    correct: question.correctlyAnswered,
    incorrect: question.wronglyAnswered,
    options: question.options.map((option) => ({
      text: option.text,
      opted: option.noOfOpted
    }))
  }))
}));


  const handleAnalysisClick = (quiz) => {
    setSelectedQuiz(quiz);
  };
  const handleDeleteClick = async (quizID) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/deleteQuiz/${quizID}`);
        if (response.data.message === 'Quiz and its corresponding questions and options were successfully deleted.') {
            // Update your state to remove the deleted quiz from the UI
            setQuizData(prevData => prevData.filter(quiz => quiz.quizID !== quizID));
        }
    } catch (error) {
        console.error('Error deleting quiz:', error);
    }
};


  return (
    <div className="content">
    

      {!selectedQuiz ? (
        <div className='content1'>
          <h1 className="page-title">Quiz Analysis</h1>
          <button onClick={openModal}>create quiz</button>
     
        <table className="analytics-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Quiz Name</th>
              <th>Created on</th>
              <th>Impression</th>
              <th>Actions</th>
              <th>Analysis</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={quiz.id} className={`table-row ${index % 2 === 0 ? 'odd-row' : 'even-row'}`}>
                <td>{index + 1}</td>
                <td>{quiz.name}</td>
                <td>{quiz.createdOn}</td>
                <td>{quiz.impressions}</td>
                <td className="actions">
                  <button className="edit-button">✏️</button>
                  <button className="delete-button" onClick={() => handleDeleteClick(quiz.id)}>🗑️</button>
                  <button className="share-button">🔗</button>
                </td>
                <td>
                  <button className="analysis-link" onClick={() => handleAnalysisClick(quiz)}>Question Wise Analysis</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <div className="question-analysis">
           <div className="analysis-container">
      <div className="quiz-header">
        <h1>{selectedQuiz.name} Question Analysis</h1>
        
        <div className="quiz-meta">
          <span>Created on: {selectedQuiz.createdOn}</span>
          <span>Impressions: {selectedQuiz.impressions}</span>
        </div>
      </div>
      
      <div className="question-list">
     
        {selectedQuiz.questions.map((question, index) => (
          <div key={index} className="question-item">
            <h2>Q.{index + 1} {question.text}</h2>
            
            { selectedQuiz.type === "Poll Type" ? (
                    <div className="poll-options">
                      {question.options.map((option, i) => (
                        <div key={i} className="option-box">
                          <span className="option-value">{option.opted}</span>
                          <span className="option-label">{option.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="metrics">
                    <div className="metric-box">
                      <span className="metric-value">{question.attempts}</span>
                      <span className="metric-label">people Attempted the question</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-value">{question.correct}</span>
                      <span className="metric-label">people Answered Correctly</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-value">{question.incorrect}</span>
                      <span className="metric-label">people Answered Incorrectly</span>
                    </div>
                  </div>

                  )

            }
         
          </div>
        ))}
      </div>
     
    </div>
          <button onClick={() => setSelectedQuiz(null)}>Back to Quiz List</button>
        </div>
      )}
      {
        isModalOpen?<CreateQuizModal isOpen={openModal} onClose={closeModal} />:<></>
      }
    
      
       

    </div>
  );
};

export default Analytics;
