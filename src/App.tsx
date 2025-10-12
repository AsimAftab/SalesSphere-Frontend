import Navbar from './Components/layout/Navbar/Navbar';
import Footer from './Components/layout/Footer/Footer';
import Homepage from './Pages/HomePage/Homepage';
import './index.css';

function App() {
  return (
    <div className="bg-slate-900 text-white">
      <Navbar />
      <Homepage />
      <Footer /> {/* <-- Make sure this line is here */}
    </div>
  );
}

export default App;