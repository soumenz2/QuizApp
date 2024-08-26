import React from 'react';
import '../style.css';
import TrendingQuizzes from './TrendingQuizzes';
import DashboardMetrics from './DashboardMetrics';

const Dashboard = () => {
    return (
        <div className="main-content">
            <div >
               <DashboardMetrics />
            </div>

          
            <div className="trending-quizzes">
               
                    <div c>
                        <TrendingQuizzes />
                    </div>
               
            </div>
        </div>
    );
};

export default Dashboard;
