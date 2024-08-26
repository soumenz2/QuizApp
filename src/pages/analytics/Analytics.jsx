import React, { useState } from 'react';
import '../style.css';
import CreateQuizModal from '../modalPage/createquizModal';

const Analytics = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const quizzes = [
    { id: 1, name: 'Quiz 1', createdOn: '01 Sep, 2023', impressions: '345' },
    { id: 2, name: 'Quiz 2', createdOn: '04 Sep, 2023', impressions: '667' },
    { id: 3, name: 'Quiz 3', createdOn: '06 Sep, 2023', impressions: '1.6K' },
    { id: 4, name: 'Quiz 4', createdOn: '09 Sep, 2023', impressions: '789' },
    { id: 5, name: 'Quiz 5', createdOn: '11 Sep, 2023', impressions: '995' },
    { id: 6, name: 'Quiz 6', createdOn: '13 Sep, 2023', impressions: '2.5K' },
    { id: 7, name: 'Quiz 7', createdOn: '14 Sep, 2023', impressions: '231' },
    { id: 8, name: 'Quiz 8', createdOn: '17 Sep, 2023', impressions: '1.3K' },
  ];

  const handleAnalysisClick = (quiz) => {
    setSelectedQuiz(quiz);
  };

  return (
    <div className="content">
      <h1 className="page-title">Quiz Analysis</h1>
      <button onClick={openModal}>create quiz</button>

      {!selectedQuiz ? (
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
                  <button className="delete-button">🗑️</button>
                  <button className="share-button">🔗</button>
                </td>
                <td>
                  <button className="analysis-link" onClick={() => handleAnalysisClick(quiz)}>Question Wise Analysis</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="question-analysis">
          <h2>{selectedQuiz.name} Question Analysis</h2>
          <p className="quiz-meta">Created on: {selectedQuiz.createdOn} | Impressions: {selectedQuiz.impressions}</p>
          {/* Detailed question analysis content goes here */}
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
