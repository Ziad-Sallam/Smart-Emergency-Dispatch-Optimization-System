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
import ResponderPage from './pages/reporter/ResponderPage.jsx';
import { NotificationProvider } from './components/Notificatoions/NotificationContext';

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
      {
        path: '/responder',
        element: <ResponderPage />,
      },
    ]
  );
  return (
    <div className="App">
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </div>
  );
}


export default App;
