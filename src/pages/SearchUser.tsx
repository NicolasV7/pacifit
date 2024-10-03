import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const UserSearch = () => {
  const [idNumber, setIdNumber] = useState('');
  const [userData, setUserData] = useState<{
    fullName: string;
    phoneNumber: string;
    eps: string;
    bloodType: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    gymPlan: string;
  } | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null); // Para mostrar los días restantes
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleSearch = () => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);

      const foundUser = users.find((user: { idNumber: string }) => user.idNumber === idNumber);

      if (foundUser) {
        console.log('Usuario encontrado:', foundUser);

        // Verificar los días restantes en el arreglo "subscriptions"
        const storedSubscriptions = localStorage.getItem('subscriptions');
        if (storedSubscriptions) {
          const subscriptions = JSON.parse(storedSubscriptions);
          console.log('Suscripciones en localStorage:', subscriptions);

          // Buscar los días restantes del usuario por su idNumber
          const userSubscription = subscriptions.find((subscription: { idNumber: string }) => subscription.idNumber === foundUser.idNumber);
          console.log('Suscripción encontrada para el usuario:', userSubscription);

          if (userSubscription) {
            setDaysRemaining(userSubscription.days); // Establece los días restantes
          } else {
            setDaysRemaining(0); // Si no se encuentra la suscripción, muestra 0 días
          }
        }
        setUserData(foundUser);
      } else {
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 2000);
        setUserData(null);
        setDaysRemaining(null);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {showErrorAlert && (
        <div className="absolute right-30 top-50 z-10 flex w-full max-w-md border-l-6 border-red-600 bg-red-600 bg-opacity-[15%] px-4 py-3 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
          <p className="text-red-600">Cédula no encontrada.</p>
        </div>
      )}

      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Buscar Usuario" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Buscar Usuario por Cédula
                </h3>
              </div>
              <div className="p-7">
                <div className="mb-4 w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="idNumber"
                  >
                    Cédula
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    placeholder="Ingresa la cédula"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={handleSearch}
                    className="rounded bg-primary px-6 py-2.5 text-white transition duration-200 hover:bg-opacity-80"
                  >
                    Buscar Usuario
                  </button>
                </div>

                {userData && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold">Datos del Usuario</h4>
                    <ul>
                      <li><strong>Nombre Completo:</strong> {userData.fullName}</li>
                      <li><strong>Teléfono:</strong> {userData.phoneNumber}</li>
                      <li><strong>EPS:</strong> {userData.eps}</li>
                      <li><strong>Tipo de Sangre:</strong> {userData.bloodType}</li>
                      <li><strong>Contacto de Emergencia:</strong> {userData.emergencyContactName}</li>
                      <li><strong>Teléfono de Emergencia:</strong> {userData.emergencyContactPhone}</li>
                    </ul>
                    <p><strong>Plan de Gimnasio:</strong> {userData.gymPlan}</p>
                    {daysRemaining !== null && (
                      <p><strong>Días Restantes del Plan:</strong> {daysRemaining} días</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSearch;
