
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import LoginSuccess from './LoginSuccess';  // 이 파일도 src에 추가할 예정

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/success" element={<LoginSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
