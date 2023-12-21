// src/App.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './component/login/LoginPage';
import TaskPage from './component/task/TaskPage';


const App = () => {
    return (
       
            <Routes>
                <Route path="/login" element={<LoginPage />} />
            
                <Route path="/tasks" element={<TaskPage />} />
                
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
       
    );
};

export default App;
