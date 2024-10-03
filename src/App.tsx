import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import UserList from './pages/UserList';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import AddUser from './pages/AddUser';
import GymPlans from './pages/Profile';

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
          path="/profile"
          element={
            <>
              <PageTitle title="Planes | Pacifit - Admin Dashboard" />
              <GymPlans />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | Pacifit - Admin Dashboard" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | Pacifit - Admin Dashboard" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Configuraciones | Pacifit - Admin Dashboard" />
              <Settings />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Registrar Usuarios | Pacifit - Admin Dashboard" />
              <AddUser />
            </>
          }
        />
         <Route
          path="/users"
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
