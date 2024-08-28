import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUserId } from '../redux/userslices';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch=useDispatch()
    const logout = () => {
      
        localStorage.removeItem('user');
        dispatch(clearUserId());
        navigate('/')
    
    };
    return (
        <div className="sidebar">
            <h1>QUIZZIE</h1>
            <ul>
                <li>
                    <Link to="/" className="sidebar-link">Dashboard</Link>
                </li>
                <li>
                    <Link to="/analytics" className="sidebar-link">Analytics</Link>
                </li>
                <li>
                    {/* <Link to="/create-quiz" className="sidebar-link">Create Quiz</Link> */}
                    <button onClick={(e) => { 
                        e.preventDefault(); 
                        
                    }}>
                        Create Quiz
                    </button>
                </li>
            </ul>
            
            <div className="logout-button" onClick={logout}>LOGOUT</div>
          
            
        </div>
    );
};

export default Sidebar;
