import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/config';
import './QuizPage.css';

const QuizPage = () => {
  const [quizData, setQuizData] = useState(null);
  const { quizID } = useParams(); 
  const [timers, setTimers] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0); 
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (quizID) {
      const fetchQuizData = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/getquestionfoUser?quizID=${quizID}`);
          setQuizData(response.data);

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
          if (currentIndex === quizData.questions.findIndex(q => q.questionID === questionID) && prevTimers[questionID] > 0) {
            updatedTimers[questionID] = prevTimers[questionID] - 1;
          } else {
            updatedTimers[questionID] = prevTimers[questionID];
          }
        }
        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, quizData]);

  useEffect(() => {
    if (quizData && quizData.questions.length > 0) {
      const currentQuestion = quizData.questions[currentIndex];
      axios.post(`${API_BASE_URL}/incrementImpression`, { questionID: currentQuestion.questionID })
        .then(response => {
          console.log('Question impression incremented:', response.data);
        })
        .catch(error => {
          console.error('Failed to increment question impression:', error);
        });
    }
  }, [currentIndex, quizData]);

  const handleAnswerSelection = async (questionID, optionID) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [questionID]: optionID,
    }));
  };

  const checkCorrectAnswer = async (optionID) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/checkOption`, { optionID });
      if (response.status === 200 && response.data.message === 'Correct answer!') {
        setScore(prevScore => prevScore + 1);
      }
    } catch (error) {
      console.error('Error checking option:', error);
    }
  };

  const handleNextQuestion = async () => {
    const currentQuestion = quizData.questions[currentIndex];
    const selectedOptionID = selectedOptions[currentQuestion.questionID];
    if (selectedOptionID) {
      await checkCorrectAnswer(selectedOptionID);
    }
    setCurrentIndex(prevIndex => prevIndex < (quizData.questions.length - 1) ? prevIndex + 1 : prevIndex);
  };

  const handleSubmit = async () => {
    const currentQuestion = quizData.questions[currentIndex];
    const selectedOptionID = selectedOptions[currentQuestion.questionID];
    if (selectedOptionID) {
      await checkCorrectAnswer(selectedOptionID);
    }
    setQuizCompleted(true);
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  const currentQuestion = quizData.questions[currentIndex];
  const isLastQuestion = currentIndex === quizData.questions.length - 1;

  if (quizCompleted) {
    return (
      <div className="quiz-completion-modal">
        <div className="modal-content">
          {currentQuestion.questionType !== 'Poll Type' ? (
            <>
              <h2>Congrats! Quiz is completed</h2>
              <img src="https://plus.unsplash.com/premium_photo-1683141313974-34b132148f5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dHJvcGh5fGVufDB8fDB8fHww" alt="Trophy" className="trophy-icon" />
              <p>Your Score is <span className="score">{score}/{quizData.questions.length}</span></p>
            </>
          ) : (
            <>
              <h2>Thank you for participating in the Poll</h2>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {currentQuestion && (
        <div className="question-box">
          <div className="question-header">
            <span className="question-number">{`${currentIndex + 1}/${quizData.questions.length}`}</span>
            {timers[currentQuestion.questionID] > 0 && (
              <span className="timer">
                00:{timers[currentQuestion.questionID] < 10 ? `0${timers[currentQuestion.questionID]}` : timers[currentQuestion.questionID]}s
              </span>
            )}
          </div>
          <h3 className="question-text">{currentQuestion.questionName}</h3>
          <div className="options-container">
            {currentQuestion.option.map((opt) => (
              <div
                key={opt.optionID}
                className={`quiz-option-box ${
                  timers[currentQuestion.questionID] === 0 && currentQuestion.timer > 0 ? 'disabled' : ''} 
                  ${selectedOptions[currentQuestion.questionID] === opt.optionID ? 'active' : ''}`}
                onClick={() =>
                  (timers[currentQuestion.questionID] !== 0 || currentQuestion.timer === 0) &&
                  handleAnswerSelection(currentQuestion.questionID, opt.optionID)
                }
              >
                {opt.imageURL && opt.text ? (
                  <div className="option-content">
                    <img src={opt.imageURL} alt="option" className="option-image" />
                    <span className="option-text">{opt.text}</span>
                  </div>
                ) : opt.imageURL ? (
                  <div className="image-box">
                    <img src={opt.imageURL} alt="option" className="option-image" />
                  </div>
                ) : opt.text ? (
                  <span className="option-text">{opt.text}</span>
                ) : null}
              </div>
            ))}
          </div>
          {isLastQuestion ? (
            <button className="submit-button" onClick={handleSubmit}>
              SUBMIT
            </button>
          ) : (
            <button className="next-button" onClick={handleNextQuestion}>
              NEXT
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
