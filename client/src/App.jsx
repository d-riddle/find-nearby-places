import Home from "./pages/home/Home";
import {BrowserRouter as Router, Routes , Route} from "react-router-dom";
import Topbar from "./components/topbar/Topbar";


function App() {
  return (
    <Router>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </Router>
  );
}

export default App;