import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/config';
import './QuizPage.css'; // Import a CSS file for styling

const QuizPage = () => {
  const [quizData, setQuizData] = useState(null);
  const { quizID } = useParams(); 
  const [timers, setTimers] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0); // State to track current question index

  useEffect(() => {
    console.log("params Data", quizID);

    if (quizID) {
      const fetchQuizData = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/getquestionfoUser?quizID=${quizID}`);
          console.log(response.data);
          setQuizData(response.data);

          // Initialize timers for each question
          const initialTimers = {};
          response.data.questions.forEach(question => {
            initialTimers[question.questionID] = question.timer;
          });
          setTimers(initialTimers);

        } catch (error) {
          console.error('Failed to fetch quiz data:', error);
        }
      };

      fetchQuizData();
    }
  }, [quizID]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const updatedTimers = {};
        for (let questionID in prevTimers) {
          if (prevTimers[questionID] > 0) {
            updatedTimers[questionID] = prevTimers[questionID] - 1;
          } else {
            updatedTimers[questionID] = prevTimers[questionID]; // Keep the timer as is (could be 0 or non-zero)
          }
        }
        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);

  const handleAnswerSelection = (questionId, optionID) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [questionId]: optionID, // Track the selected option by its ID
    }));
    console.log(`Question ${questionId} selected option:`, optionID);
  };

  const handleNextQuestion = () => {
    setCurrentIndex(prevIndex => {
      // Move to the next question if available
      return prevIndex < (quizData.questions.length - 1) ? prevIndex + 1 : prevIndex;
    });
  };
  const handleSubmit = () => {
    // Handle the submission of the quiz
    // You might want to send selectedOptions to the backend for validation
    console.log('Submitting quiz with selected options:', selectedOptions);
  };
  if (!quizData) {
    return <div>Loading...</div>;
  }

  const currentQuestion = quizData.questions[currentIndex];
  const isLastQuestion = currentIndex === quizData.questions.length - 1;

  return (
    <div className="quiz-container">
      {currentQuestion && (
        <div className="question-box">
          <div className="question-header">
            <span className="question-number">{`${currentIndex + 1}/${quizData.questions.length}`}</span>
            {timers[currentQuestion.questionID] > 0 && (
              <span className="timer">00:{timers[currentQuestion.questionID] < 10 ? `0${timers[currentQuestion.questionID]}` : timers[currentQuestion.questionID]}s</span>
            )}
          </div>
          <h3 className="question-text">{currentQuestion.questionName}</h3>
          <div className="options-container">
            {currentQuestion.option.map(opt => (
              <div 
                key={opt.optionID} 
                className={`option-box ${timers[currentQuestion.questionID] === 0 && currentQuestion.timer > 0 ? 'disabled' : ''} 
                            ${selectedOptions[currentQuestion.questionID] === opt.optionID ? 'active' : ''}`} 
                onClick={() => (timers[currentQuestion.questionID] !== 0 || currentQuestion.timer === 0) && handleAnswerSelection(currentQuestion.questionID, opt.optionID)}>
                {opt.text}
              </div>
            ))}
          </div>
          {isLastQuestion ? (
            <button className="submit-button" onClick={handleSubmit}>SUBMIT</button>
          ) : (
            <button className="next-button" onClick={handleNextQuestion}>NEXT</button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
