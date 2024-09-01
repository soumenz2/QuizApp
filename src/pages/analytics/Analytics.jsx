import React, { useState,useEffect } from 'react';
import '../style.css';
import CreateQuizModal from '../modalPage/createquizModal';
import EditQuizModal from '../modalPage/EditQuiz.Modal';
import API_BASE_URL from '../../config/config';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdOutlineShare } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { useLocation } from 'react-router-dom';

const Analytics = () => {
  const [quizData, setQuizData] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const userIDfromREdux=useSelector((state)=>state.user.userId)
  const [selectedQuizID,setSelectedQuizId]=useState('')
  const location = useLocation();

    
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

useEffect(() => {
  if (location.state?.openCreateQuizModal) {
      setIsModalOpen(true);
  }
}, [location.state]);
const quizzes = quizData.map((quiz) => ({
  id:quiz.quizID,
  name: quiz.quizName,
  createdOn: new Date(quiz.DateOfCreation).toLocaleDateString(),
  impressions: quiz.NoOfImpression,
  type: quiz.quizType,
  questions: quiz.questions.map((question) => ({
    text: question.questionName,
    attempts: question.NoOfImpression ,
    correct: question.correctlyAnswered,
    incorrect: question.wronglyAnswered ,
    options: question.options.map((option) => ({
      text: option.text,
      opted: option.noOfOpted
    }))
  }))
}));


  const handleAnalysisClick = (quiz) => {
    setSelectedQuiz(quiz);
  
  };
  const handleDeleteClick = (quizID) => {
    setQuizToDelete(quizID);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/deleteQuiz?quizID=${quizToDelete}`);
        if (response.status === 200) {
            // Update your state to remove the deleted quiz from the UI
            setQuizData(prevData => prevData.filter(quiz => quiz.quizID !== quizToDelete));
            closeDeleteModal()
        }
    } catch (error) {
        console.error('Error deleting quiz:', error);
    }
};
const onshare=(quizID)=>{
  let URL=`${window.location.origin}/quiz/${quizID}`
  navigator.clipboard.writeText(URL);
    toast.success("Link Copied to clipboard");
}
const EditQuiz=(quizID)=>{
  console.log("edit clicked!!!!!")
  setIsEditModalOpen(true);
  setSelectedQuizId(quizID)


}


  return (
    <div className="content">
      <ToastContainer />
    

      {!selectedQuiz ? (
        <div className='content1'>
          <h1 className="page-title">Quiz Analysis</h1>
     
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
                  <button className="edit-button" onClick={()=>EditQuiz(quiz.id)}><FaRegEdit /></button>
                  <button className="delete-button" onClick={() => handleDeleteClick(quiz.id)}><MdDelete /></button>
                  <button className="share-button" onClick={()=>onshare(quiz.id)}><MdOutlineShare /></button>
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
      <button onClick={() => setSelectedQuiz(null)} className='back-buttton'><IoArrowBack /> Back</button>
        <h1>{selectedQuiz.name} Question Analysis</h1>
        
        <div className="quiz-meta">
          <div>Created on: {selectedQuiz.createdOn}</div>
          <div>Impressions: {selectedQuiz.impressions}</div>
        </div>
      </div>
      
      <div className="question-list">
     
        {selectedQuiz.questions.map((question, index) => (
          <div key={index} className="question-item">
            <h2>Q.{index + 1} {question.text}</h2>
            
            { selectedQuiz.type === "Poll Type" ? (
                    <div className="poll-options">
                      {question.options.map((option, i) => (
                        <div key={i} className="metric-box">
                          <div className="option-value">{option.opted}</div>
                          <div className="option-label">Option {i+1}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="metrics">
                    <div className="metric-box">
                      <div className="metric-value">{question.attempts}</div>
                      <div className="metric-label">people Attempted the question</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-value">{question.correct}</div>
                      <div className="metric-label">people Answered Correctly</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-value">{question.incorrect}</div>
                      <div className="metric-label">people Answered Incorrectly</div>
                    </div>
                  </div>

                  )
            }
         
          </div>
        ))}
      </div>
     
    </div>
          
        </div>
      )
      }
      {
        isModalOpen?<CreateQuizModal isOpen={openModal} onClose={closeModal} />:<></>
      }
      {
        isEditModalOpen?<EditQuizModal isOpen={openEditModal} onClose={closeEditModal} selectedQuizID={selectedQuizID} />:<></>
      }
       {
        isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content1">
              <p>Are you sure you want to delete this quiz?</p>
              <div className="modal-actions">
                <button onClick={confirmDelete} className="confirm-delete">Confirm Delete</button>
                <button onClick={closeDeleteModal} className="cancel-delete">Cancel</button>
              </div>
            </div>
          </div>
        )
      }
    
      
       

    </div>
  );
};

export default Analytics;
