import React, { useState } from 'react';
import '../style.css';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete } from "react-icons/md";
import API_BASE_URL from '../../config/config';

const CreateQuizModal = ({ isOpen, onClose }) => {
  const [quizName,setQuizName]=useState('')
  const userId = localStorage.getItem('user');
   
    const [timer, setTimer] = useState(0);
  const [quizType, setQuizType] = useState('Q & A');
  const [step, setStep] = useState(1);
  const [selectedOptionType, setSelectedOptionType] = useState('Text');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isQuizCreated, setIsQuizCreated] = useState(false);
  const [quizLink, setQuizLink] = useState('');
  
  
  const [questions, setQuestions] = useState(
    [
      { 
        id: 1,
         questionName: '',
          questionType: '', 
          selectedOption:'',
          timer: 0,
           options: [{ id:1,text: '', imageURL: '', isCorrect: false }]
           }
          ]
        );   

  if (!isOpen) return null;

  const handleQuizTypeChange = (type) => {
    setQuizType(type);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContinueClick = () => {
    if (quizName.trim() === '') {
      toast.error('Quiz name cannot be empty')
      return;
    }
  
    // Optionally, you could check if quizType is selected
    if (quizType.trim() === '') {
      alert('Please select a quiz type');
      return;
    }
  
    if (step === 1) {
      setStep(2);
    }
    // You can add more steps as needed
  };
  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions(
        [...questions,
           { 
            id: questions.length + 1,
            questionName: '', 
            questionType: '', 
            selectedOption:'',
            timer: 0, 
            options: [
              { 
                text: '', 
                imageURL: '', 
                isCorrect: false 
              }
            ] 
          }
        ]
      );
      setCurrentQuestionIndex(questions.length);
    }
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = questions[currentQuestionIndex].options.filter((_, i) => i !== index);
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options = updatedOptions;
    setQuestions(updatedQuestions);
  };
  const handleQuestionNameChange = (e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].questionName = e.target.value;
    setQuestions(updatedQuestions);
    console.log(questions)
  };

  const handleOptionTextChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options[index].text = e.target.value;
    setQuestions(updatedQuestions);
  };
  const handleOptionImageChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options[index].imageURL = e.target.value;
    setQuestions(updatedQuestions);
  };
  const AddTimer = (value) => {
    const updatedQuestions = [...questions];
    setTimer(value)
    updatedQuestions[currentQuestionIndex].timer = value;
    setQuestions(updatedQuestions);
  };
  const setCorrectAnswer = (index, value) => {
    let updatedQuestions = [...questions];

    for(let i = 0 ; i < updatedQuestions[currentQuestionIndex]?.options?.length;i++){
      if(i === index){
        updatedQuestions[currentQuestionIndex].options[i].isCorrect = true;
      }else{
        updatedQuestions[currentQuestionIndex].options[i].isCorrect = false;

      }
    }
    
    console.log(updatedQuestions)
    
    setQuestions(updatedQuestions);
  };
  

  const handleAddOption = () => {
    const updatedQuestions = [...questions];
    if(updatedQuestions[currentQuestionIndex].options.length < 4 ){
      updatedQuestions[currentQuestionIndex].options.push({
        text: '',
        imageURL: '',
        isCorrect: false,
      });
    }
    
    setQuestions(updatedQuestions);
  };


  const transformQuestionsData = (questions) => {
    return questions.map((question) => ({
      questionName: question.questionName,
      selectedOption:selectedOptionType,
      timer: question.timer,
      options: question.options.map((option) => ({
        text: option.text || '',
        imageURL: option.imageURL || '', // Provide a default if not present
        isCorrect: option.isCorrect,
      })),
    }));
  };
  const handleCreateQuiz = async () => {
    const transformedQuestions = transformQuestionsData(questions);
  
    const quizData = {
      userID: userId, 
      quizName,
      quizType,
      questions: transformedQuestions,
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/setquestion`, quizData);
      console.log('Quiz created successfully:', response.data.data);
      // Handle success (e.g., close the modal, clear the form)
      if (step === 2) {
        setStep(3);
      }
      setIsQuizCreated(true);
      setQuizLink(`${window.location.origin}/quiz/${response.data.data.quiz.quizID}`);

    } catch (error) {
      console.error('Error creating quiz:', error);
      // Handle error
    }
  };
  const onshare=()=>{
    navigator.clipboard.writeText(quizLink);
    console.log(quizLink)
    toast.success("Link Copied to clipboard");
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
        <ToastContainer/>
      <div className="modal-content1">
        {step === 1 && (
          <>
            <h2>Create Quiz</h2>
            <div className="form-group">
              <label htmlFor="quiz-name">Quiz name</label>
              <input type="text" id="quiz-name" className="input-field" placeholder="Enter quiz name"   value={quizName}
                                onChange={(e) => setQuizName(e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Quiz Type</label>
              <div className="button-group">
                <button 
                  className={`quiz-type-button ${quizType === 'Q & A' ? 'selected' : ''}`} 
                  onClick={() => handleQuizTypeChange('Q & A')}
                >
                  Q & A
                </button>
                <button 
                  className={`quiz-type-button ${quizType === 'Poll Type' ? 'selected' : ''}`} 
                  onClick={() => handleQuizTypeChange('Poll Type')}
                >
                  Poll Type
                </button>
              </div>
            </div>
            <div className="button-row">
              <button className="cancel-button" onClick={onClose}>Cancel</button>
              <button className="continue-button" onClick={handleContinueClick}>Continue</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
                <div className="modal-overlay">
      <div className="modal-content2">
        <div className="question-navigation">
          {questions.map((question, index) => (
            <button key={question.id} className={`question-button ${currentQuestionIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </button>
          ))}
          {questions[currentQuestionIndex].options.length < 5 && (
            <button className="question-button add-question-button" onClick={handleAddQuestion}>
              +
            </button>
          )}
        </div>
        <div className="question-form">
          <input
            type="text"
            name="questionName"
            value={questions[currentQuestionIndex].questionName}
            placeholder="Poll Question"
            className="input-field-poll-question"
            onChange={handleQuestionNameChange}
          />
          <div className="form-group">
            
            <div className="option-type-group">
            <label>Option Type</label>
              <div className='question-type-options-container'>
                <input
                  type="radio"
                  value="Text"
                  checked={selectedOptionType === 'Text'}
                  onChange={() => setSelectedOptionType('Text')}
                />
                <span>Text</span>
              </div>
              <div className='question-type-options-container'>
                <input
                  type="radio"
                  value="Image URL"
                  checked={selectedOptionType === 'Image URL'}
                  onChange={() => setSelectedOptionType('Image URL')}
                />
                <span>Image URL</span>
              </div>
              <div className='question-type-options-container'>
                <input
                  type="radio"
                  value="Text & Image URL"
                  checked={selectedOptionType === 'Text & Image URL'}
                  onChange={() => setSelectedOptionType('Text & Image URL')}
                />
                <span>Text & Image URL</span>
              </div>
            </div>
          </div>
          <div className='option-box'>
            <div className='box1'>
            {selectedOptionType==='Text' && questions[currentQuestionIndex].options.map((option, index) => (
            <div className="input-field-option" key={index}>
              { quizType==='Q & A' &&
                <input
                type="radio"
                value={option.isCorrect}
                checked={option.isCorrect}
                onChange={(e) => setCorrectAnswer(index,e)}
              />
              }
              
              <input
                type="text"
                className="input-field-option-input"
                value={option.text}
                placeholder="Text"
                onChange={(e) => handleOptionTextChange(index, e)}
              />
              <button
                className="remove-option-button"
                onClick={() => handleRemoveOption(index)}
              >
                <MdDelete />
              </button>
            </div>
          ))}
             {selectedOptionType==='Image URL' && questions[currentQuestionIndex].options.map((option, index) => (
            <div className="input-field-option" key={index}>
                  { quizType==='Q & A' &&
                <input
                type="radio"
                value={option.isCorrect}
                checked={option.isCorrect}
                onChange={(e) => setCorrectAnswer(index,e)}
              />
              }
              
              <input
                type="text"
                className="input-field-option-input"
                value={option.imageURL}
                placeholder="Image URL"
                onChange={(e) => handleOptionImageChange(index, e)}
              />
              <button
                className="remove-option-button"
                onClick={() => handleRemoveOption(index)}
              >
                <MdDelete />
              </button>
            </div>
          ))}
             {selectedOptionType==='Text & Image URL' && questions[currentQuestionIndex].options.map((option, index) => (
            <div className="input-field-option" key={index}>
                  { quizType==='Q & A' &&
                <input
                type="radio"
                value={option.isCorrect}
                checked={option.isCorrect}
                onChange={(e) => setCorrectAnswer(index,e)}
              />
              }
              <input
                type="text"
                className="input-field-option-input"
                value={option.text}
                placeholder="Text"
                onChange={(e) => handleOptionTextChange(index, e)}
              />
               <input
                type="text"
                className="input-field-option-input"
                value={option.imageURL}
                placeholder="Image URL"
                onChange={(e) => handleOptionImageChange(index, e)}
              />
              <button
                className="remove-option-button"
                onClick={() => handleRemoveOption(index)}
              >
                <MdDelete />
              </button>
            </div>
          ))}
          <button className="add-option-button" onClick={handleAddOption}>
            Add option
          </button>
            </div>
           
              <div className='box2'>
              <div className="form-group timer-group">
              
              <div className="timer-options">
              <h4>Timer</h4>
                <button
                  className={`timer-option ${timer === 0 ? 'selected' : ''}`}
                  onClick={() => AddTimer(0)}
                >
                  OFF
                </button>
                <button
                  className={`timer-option ${timer === 5 ? 'selected' : ''}`}
                  onClick={() => AddTimer(5)}
                >
                  5 sec
                </button>
                <button
                  className={`timer-option ${timer === 10 ? 'selected' : ''}`}
                  onClick={() => AddTimer(10)}
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
            <button className="create-quiz-button" onClick={handleCreateQuiz}>
              Create Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
          </>
        )}
         {isQuizCreated  && (
          <div className="success-modal">
            <ToastContainer/>
            <button className="close-button" onClick={onClose}>✕</button>
            <h2>Congrats your Quiz is Published!</h2>
            <p>Quiz Link: <a href={quizLink}>{quizLink}</a></p>
            <button className="share-link-button" onClick={onshare}>Share</button>
      
          </div>
        )}


      </div>
    </div>
  );
};

export default CreateQuizModal;
