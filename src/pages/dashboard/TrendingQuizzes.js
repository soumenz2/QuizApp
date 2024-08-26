import React from 'react';
import '../style.css'; // Make sure to import your CSS file

const TrendingQuizzes = () => {
    const quizzes = Array(50).fill({ title: 'Quiz 1', impressions: 667, createdOn: '04 Sep, 2023' });

    return (
        <div className="trending-quizzes-container">
            <h2 className="trending-quizzes-heading">Trending Quizzes</h2>
            <div className="trending-quizzes-grid">
                {quizzes.map((quiz, index) => (
                    <div key={index} className="quiz-card">
                        <div className='quiz-header'>
                        <h3 className="quiz-title">{quiz.title}</h3>
                        <p className="quiz-impressions">{quiz.impressions} <span role="img" aria-label="eye">👁️</span></p>

                        </div>
                        
                        <p className="quiz-date">Created on: {quiz.createdOn}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingQuizzes;
