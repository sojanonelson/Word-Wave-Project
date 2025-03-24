
import AppRouter from "./Router/AppRouter";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

function App() {

  return (
    <div className="App">
        <ToastContainer />
      <AppRouter />
    </div>
  );
}

export default App;
