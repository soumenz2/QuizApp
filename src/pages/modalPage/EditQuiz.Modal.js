import React, { useState, useEffect } from 'react';
import '../style.css';
import axios from 'axios';
import API_BASE_URL from '../../config/config';

const EditQuizModal = ({ isOpen, onClose, selectedQuizID }) => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (selectedQuizID) {
      // Fetch quiz data from the server using the quizId
      axios.get(`${API_BASE_URL}/getQuizDetails?quizID=${selectedQuizID}`)
        .then(response => {
          console.log(response.data)
          setQuizData(response.data.data);
          
        })
        .catch(error => {
          console.error('Error fetching quiz data:', error);
        });
    }
  }, [selectedQuizID]);

  if (!isOpen || !quizData) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleQuestionTextChange = (e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[currentQuestionIndex].questionName = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionTextChange = (index, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[currentQuestionIndex].options[index].text = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionImageChange = (index, e) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[currentQuestionIndex].options[index].imageURL = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleTimerChange = (value) => {
    const updatedQuestions = [...quizData.questions];
    setTimer(value);
    updatedQuestions[currentQuestionIndex].timer = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.post(`${API_BASE_URL}/updatequiz`, {quizData});
      console.log('Quiz updated successfully');
      onClose(); // Optionally close the modal after saving
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  return (
    <div
      className={`modal-overlay ${isOpen ? "open" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-content2">
        <h2>Edit Quiz</h2>

        <div className="question-navigation">
          {quizData.questions.map((question, index) => (
            <button
              key={question.id}
              className={`question-button ${
                currentQuestionIndex === index ? "active" : ""
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="question-form">
          <h3>Q.{currentQuestionIndex + 1}</h3>
          <input
            type="text"
            name="questionName"
            value={quizData.questions[currentQuestionIndex].questionName}
            placeholder="Question Text"
            className="input-field-question"
            onChange={handleQuestionTextChange}
          />

          <div className="option-group">
            <div className="box1">
              {quizData.questions[currentQuestionIndex].selectedOption ===
                "Text" &&
                quizData.questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div className="input-field-option" key={index}
                    style={{
                      backgroundColor: option.isCorrect ? "green" : "transparent",
                    }}>
                      <input
                        type="text"
                        className="input-field-option-input"
                        value={option.text}
                        placeholder="Text"
                        onChange={(e) => handleOptionTextChange(index, e)}
                        readOnly={option.isCorrect} // Prevent editing of correct option
                      />
                    </div>
                  )
                )}
              {quizData.questions[currentQuestionIndex].selectedOption ===
                "Image URL" &&
                quizData.questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div className="input-field-option" key={index}>
                      <input
                        type="text"
                        className="input-field-option-input"
                        value={option.imageURL}
                        placeholder="Image URL"
                        onChange={(e) => handleOptionImageChange(index, e)}
                        readOnly={option.isCorrect} // Prevent editing of correct option
                      />
                    </div>
                  )
                )}
              {quizData.questions[currentQuestionIndex].selectedOption ===
                "Text & Image URL" &&
                quizData.questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div className="input-field-option" key={index}>
                      <input
                        type="text"
                        className="input-field-option-input"
                        value={option.text}
                        placeholder="Text"
                        onChange={(e) => handleOptionTextChange(index, e)}
                        readOnly={option.isCorrect} // Prevent editing of correct option
                      />
                      <input
                        type="text"
                        className="input-field-option-input"
                        value={option.imageURL}
                        placeholder="Image URL"
                        onChange={(e) => handleOptionImageChange(index, e)}
                        readOnly={option.isCorrect} // Prevent editing of correct option
                      />
                    </div>
                  )
                )}
            </div>
            <div className='box2'>
            <div className="form-group timer-group">
            <h4>Timer {}</h4>
            
            <div className="timer-options">
              <button
                className={`timer-option ${quizData.questions[currentQuestionIndex].timer === 0 ? "selected" : ""}`}
                onClick={() => handleTimerChange(0)}
              >
                OFF
              </button>
              <button
                className={`timer-option ${quizData.questions[currentQuestionIndex].timer === 5 ? "selected" : ""}`}
                onClick={() => handleTimerChange(5)}
              >
                5 sec
              </button>
              <button
                className={`timer-option ${quizData.questions[currentQuestionIndex].timer === 10 ? "selected" : ""}`}
                onClick={() => handleTimerChange(10)}
              >
                10 sec
              </button>
            </div>
          </div>
            </div>
          </div>

      

          <div className="button-row">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="save-changes-button" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuizModal;
