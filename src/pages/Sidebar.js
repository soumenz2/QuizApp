import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h1>QUIZZIE</h1>
            <ul>
                <li>
                    <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
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
            <div className="logout-button">LOGOUT</div>
        </div>
    );
};

export default Sidebar;
