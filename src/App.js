import React,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import '../src/pages/style.css'; 
import AdminRouter from './route';
import UserRouter from './userRoute';


function App() {

  console.log(window.location.pathname)
  if(window.location.pathname.startsWith('/quiz')){
    return (<UserRouter />)
  }


  
  return (
    <AdminRouter />

  );
}

export default App;
