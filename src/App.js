import './App.css';
import {Routes, Route} from "react-router-dom"
import Header from './components/Header';
import Profile from './components/Profile';
import Home from './components/Home';
import AuthSignUp from './components/AuthSignUp';
import AuthLogin from './components/AuthLogin';
import UserContextProvider from './context/UserContext';

function App() {

  return (
    <UserContextProvider>
      <div className="App">
        <Header/>

        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/profile' element={<Profile/>}></Route>
          <Route path='/profile/:userid' element={<Profile/>}></Route>
          <Route path='/signup' element={<AuthSignUp/>}></Route>
          <Route path='/login' element={<AuthLogin/>}></Route>
        </Routes>
      </div>
    </UserContextProvider>

  );
}

export default App;
