import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Circle from "./components/Circle";
import Edit from "./components/Edit";
import Profile from "./components/Profile";
import Login from "./components/Login";
import SignUp from "./components/SignUp";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='/circle' element={<Circle />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/edit' element={<Edit />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
