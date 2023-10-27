import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import {Container} from "react-bootstrap";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Navbar/>
            <Container className='navBar'>
                <Routes>
                    <Route to="/"/>
                    <Route to="/inscrit"/>
                    <Route path="/connect"/>
                </Routes>
            </Container>
        </BrowserRouter>
    </div>
  );
}

export default App;
