import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import UserList from './pages/UserList';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import ECommerce from './pages/Dashboard/ECommerce';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import AddUser from './pages/AddUser';
import GymPlans from './pages/GymPlan';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard | Pacifit - Admin Dashboard" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/plan"
          element={
            <>
              <PageTitle title="Planes | Pacifit - Admin Dashboard" />
              <GymPlans />
            </>
          }
        />
        <Route
          path="/configuraciones"
          element={
            <>
              <PageTitle title="Configuraciones | Pacifit - Admin Dashboard" />
              <Settings />
            </>
          }
        />
        <Route
          path="/registrar-usuario"
          element={
            <>
              <PageTitle title="Registrar Usuarios | Pacifit - Admin Dashboard" />
              <AddUser />
            </>
          }
        />
         <Route
          path="/lista-usuarios"
          element={
            <>
              <PageTitle title="Lista de Usuarios | Pacifit - Admin Dashboard" />
              <UserList />
            </>
          }
        />

      </Routes>
    </DefaultLayout>
  );
}

export default App;
