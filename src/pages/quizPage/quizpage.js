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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0); 
  
  const [quizCompleted, setQuizCompleted] = useState(false);// State to track current question index

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

          // Update quiz impressions
          await axios.post(`${API_BASE_URL}/incrementQuizImpression`, { quizID });

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

  useEffect(() => {
    if (quizData && quizData.questions.length > 0) {
      const currentQuestion = quizData.questions[currentIndex];

      // Increment question impression count when a question is opened
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
 const checkCorrectAnswer=async(optionID)=>{
  try {

    const response = await axios.post(`${API_BASE_URL}/checkOption`, {optionID} );

    if (response.status === 200 && response.data.message === 'Correct answer!') {
      // Increment the score if the answer is correct
      setScore(score + 1);
    }


    console.log(` selected option:`, optionID);
  } catch (error) {
    console.error('Error checking option:', error);
  }

 }
  const handleNextQuestion = async () => {
    const currentQuestion = quizData.questions[currentIndex];
    const selectedOptionID = selectedOptions[currentQuestion.questionID];

    // If an option is selected, validate it
     if (selectedOptionID) {
        await checkCorrectAnswer(selectedOptionID);
    }

    // Move to the next question if available
    setCurrentIndex(prevIndex => prevIndex < (quizData.questions.length - 1) ? prevIndex + 1 : prevIndex);
  };
  const handleSubmit = async () => {
    const currentQuestion = quizData.questions[currentIndex];
    
    // Check the selected answer for the current question
    const selectedOptionID = selectedOptions[currentQuestion.questionID];
    if (selectedOptionID) {
        await checkCorrectAnswer( selectedOptionID);
    }

    // Mark the quiz as completed
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
          {currentQuestion.questionType!=='Poll Type' ?(
            <>
               <h2>Congrats! Quiz is completed</h2>
             <img src="https://s3-alpha-sig.figma.com/img/f47f/6d98/a013b07f931834dfba3cd6ddc9130436?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hqgWGAHO1eoSVRrHiuP4GggRnoZT5~hNNRliyDBS~3Xsjz9uvHvcwBMIAkUjDOvR1X0Sz4IL17PmHvFPEojOw713O3YL~wR7KC6iwNtwC4RTZWwQRnbm10-GEqyFQ5S88k~2Ts6J8HekuikNXTRAQiCZUvQJv7hN19isOMyXlPY6SAp43wmE3a24Am~weZPVSs33iv3ADjGRVWxZdvkNSsu--LyWF4chWOYam18dgGqEjUE0~JoBOO5vraDdoe45YymaUwl88H13Oa-VN2OSR5m2RwrUPwJaHFv19cOgSUx1A2~Ma0SDfG4755t0SnAa69u2lp5RdRuHY1FtGfgToQ__" alt="Trophy" className="trophy-icon" />
             <p>Your Score is <span className="score">{score}/{quizData.questions.length}</span></p>
            </>
          
          ):(
            <>
              <h2>Thank you 
              for participating in the Poll</h2>
           
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
            <span className="question-number">{`${currentIndex + 1}/${
              quizData.questions.length
            }`}</span>
            {timers[currentQuestion.questionID] > 0 && (
              <span className="timer">
                00:
                {timers[currentQuestion.questionID] < 10
                  ? `0${timers[currentQuestion.questionID]}`
                  : timers[currentQuestion.questionID]}
                s
              </span>
            )}
          </div>
          <h3 className="question-text">{currentQuestion.questionName}</h3>
          <div className="options-container">
            {currentQuestion.option.map((opt) => (
              <div
                key={opt.optionID}
                className={`quiz-option-box ${
                  timers[currentQuestion.questionID] === 0 &&
                  currentQuestion.timer > 0
                    ? "disabled"
                    : ""
                } 
                            ${
                              selectedOptions[currentQuestion.questionID] ===
                              opt.optionID
                                ? "active"
                                : ""
                            }`}
                onClick={() =>
                  (timers[currentQuestion.questionID] !== 0 ||
                    currentQuestion.timer === 0) &&
                  handleAnswerSelection(
                    currentQuestion.questionID,
                    opt.optionID
                  )
                }
              >
                {opt.imageURL && opt.text ? (
                  <div className="option-content">
                    <img
                      src={opt.imageURL}
                      alt="option"
                      className="option-image"
                    />
                    <span className="option-text">{opt.text}</span>
                  </div>
                ) : opt.imageURL ? (
                  <div className="image-box">
                    <img
                      src={opt.imageURL}
                      alt="option"
                      className="option-image"
                    />
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
