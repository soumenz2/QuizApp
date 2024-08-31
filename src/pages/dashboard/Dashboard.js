import React ,{useState,useEffect} from 'react';
import '../style.css';
import axios from 'axios';
import API_BASE_URL from '../../config/config';
import { useSelector } from 'react-redux';
import { FaEye } from "react-icons/fa";


const Dashboard = () => {
    const [quizData, setQuizData] = useState([]);
    const [totalQuizzes, setTotalQuizzes] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [totalImpressions, setTotalImpressions] = useState(0);
    
    const userIDfromREdux=useSelector((state)=>state.user.userId)
    const formatNumber=(num)=> {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
  
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const userID = localStorage.getItem('user');
                console.log(userID)
                const response = await axios.get(`${API_BASE_URL}/getQuizWithDetails?userID=${userIDfromREdux}`);
                
                if (response.data.message === "Success") {
                    setQuizData(response.data.data);
                    setTotalQuizzes(response.data.totalQuizzes);
                    setTotalQuestions(response.data.totalQuestions);
                    setTotalImpressions(response.data.totalImpressions);
                } else {
                    console.log('Error fetching data:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        };

        fetchQuizData();
    }, []);

    const metrics = [
        { title: 'Total Quizzes', value: totalQuizzes, color: 'blue' },
        { title: 'Total Questions', value: totalQuestions, color: 'green' },
        { title: 'Total Impressions', value: totalImpressions, color: 'red' },
    ];
    const quizzes = quizData.map((quiz) => ({
        title: quiz.quizName,
        impressions: quiz.NoOfImpression,
        createdOn: new Date(quiz.DateOfCreation).toLocaleDateString(),
    }));
    return (
        
        <div className="main-content">
            <div className="dashboard-metrics">
            {metrics.map((metric, index) => (
                <div key={index} className="metric-card">
                    <h2 className={`metric-value ${metric.color}`}>{formatNumber(metric.value)}</h2>
                    <p className="metric-title">{metric.title}</p>
                </div>
            ))}
        </div>
   
          
            <div className="trending-quizzes">
               {/* <h1>total Impression : {formatNumber(1300)} </h1> */}
            <div className="trending-quizzes-container">
            <h2 className="trending-quizzes-heading">Trending Quizzes</h2>
            <div className="trending-quizzes-grid">
                {quizzes.map((quiz, index) => (
                    quiz.impressions >10 && (    <div key={index} className="quiz-card">
                    <div className='quiz-header'>
                    <h3 className="quiz-title">{quiz.title}</h3>
                    <p className="quiz-impressions">{quiz.impressions} <span role="img" aria-label="eye"><FaEye /></span></p>

                    </div>
                    
                    <p className="quiz-date">Created on: {quiz.createdOn}</p>
                </div>
                    )
                    
                
                ))}
            </div>
        </div>
            </div>
        </div>
    );
};

export default Dashboard;
