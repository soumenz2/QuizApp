import React from 'react';
import '../style.css'; // Make sure to import your CSS file

const DashboardMetrics = () => {
    const metrics = [
        { title: 'Quiz Created', value: 12, color: 'text-orange-500' },
        { title: 'Questions Created', value: 110, color: 'text-green-500' },
        { title: 'Total Impressions', value: 989, color: 'text-blue-500' },
    ];

    return (
        <div className="dashboard-metrics">
            {metrics.map((metric, index) => (
                <div key={index} className="metric-card">
                    <h2 className={`metric-value ${metric.color}`}>{metric.value}</h2>
                    <p className="metric-title">{metric.title}</p>
                </div>
            ))}
        </div>
    );
};

export default DashboardMetrics;
