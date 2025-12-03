import logo from './logo.svg';
import './App.css';
import DispatchDashboard from './Dispatchdashboard.jsx';
import { RouterProvider,createBrowserRouter } from 'react-router-dom';
import LogIn from './pages/signIn/LogIn.jsx';
import EmergencyMap from './components/map/EmergencyMap.jsx';
import Dispatcher from './pages/dispatcher/Dispatcher.jsx';
import Adduser from './components/add user/Adduser.jsx';

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
      },
      {
        path:'/map',
        element:<Dispatcher/>
      },
      {
        path:'/adduser',
        element:<Adduser/>
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
