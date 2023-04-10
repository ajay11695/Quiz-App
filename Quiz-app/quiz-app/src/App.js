import {BrowserRouter, Routes,Route} from 'react-router-dom'
import { useState } from 'react';
import Hedaer from './component/Header';
import Home from './component/Home';
import Quiz from './component/Quiz';

function App() {
   let [quesData,setQuizData]=useState({})

  function takeQuiz(id,difficulty){
      setQuizData({id:id,difficulty:difficulty})
  }
  return (
       <BrowserRouter>
        <Hedaer/>
       <Routes>
        <Route path='/' element={<Home takeQuiz={takeQuiz}/>} />
        <Route path='/quiz' element={<Quiz quesData={quesData}/>} />
       </Routes>
       </BrowserRouter>
  );
}

export default App;
