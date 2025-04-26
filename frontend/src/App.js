
import AppRouter from "./Router/AppRouter";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

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
