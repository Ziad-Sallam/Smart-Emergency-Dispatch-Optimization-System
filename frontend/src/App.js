import logo from './logo.svg';
import './App.css';
import DispatchDashboard from './Dispatchdashboard.jsx';
import { RouterProvider,createBrowserRouter } from 'react-router-dom';
import LogIn from './pages/signIn/LogIn.jsx';

function App() {
  const router= createBrowserRouter(
    [
      {
        path:'/',
        element:<DispatchDashboard/>
      },
      {
        path:'/login',
        element:<LogIn/>
      }
    ]
  );
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}


export default App;
