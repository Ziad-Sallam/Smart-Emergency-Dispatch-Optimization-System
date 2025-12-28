import logo from './logo.svg';
import './App.css';
import DispatchDashboard from './Dispatchdashboard.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LogIn from './pages/signIn/LogIn.jsx';
import EmergencyMap from './components/map/EmergencyMap.jsx';
import Dispatcher from './pages/dispatcher/Dispatcher.jsx';
import Adduser from './components/add user/Adduser.jsx';
import Analytics from './pages/Analytics/Analytics.jsx';
import ReporterPage from './pages/reporter/ReporterPage.jsx';

function App() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <LogIn />
      },
      {
        path: '/map',
        element: <Dispatcher />
      },
      {
        path: '/adduser',
        element: <Adduser />
      },
      {
        path: '/analytics',
        element: <Analytics />,
      },
      {
        path: '/reporter',
        element: <ReporterPage />,
      },
    ]
  );
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}


export default App;
