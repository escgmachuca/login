import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Logear from './routes/Logear.tsx';
import Registrarse from './routes/Registrarse.tsx';
import Panel from './routes/Panel.js';
import RutaProtegida from './routes/RutaProtegida.tsx';
import { AuthProvider } from './Auth/AuthProvider.tsx';



const router = createBrowserRouter([
  { 
    path: "/Logear",
    element: <Logear />
  },
  { 
    path: "/Registrarse",
    element: <Registrarse />
  },
  { 
    path: "/",
    element: <RutaProtegida />,
    children: [
      { 
      path: "/Panel",
      element: <Panel />
      }
    ]
  },
 ]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<React.StrictMode>
<AuthProvider>
<RouterProvider router={router} />
</AuthProvider>
</React.StrictMode>
);
