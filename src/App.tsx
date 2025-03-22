import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ImageGrid from './components/ImageGrid/ImageGrid';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="product/:brand/:pattern/:color" element={<ImageGrid />} />
      </Routes>
    </Router>
  );
}

export default App;
