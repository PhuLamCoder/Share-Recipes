import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';

import Login from './pages/LoginPage';
import SignUp from './pages/SignUpPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,

        children: [
            { index: true, element: <HomePage /> },
            {
                path: 'recipes/:id',
                element: <DetailPage />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'signup',
                element: <SignUp />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
