import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { AiOutlineClose } from 'react-icons/ai';

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
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = () => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);

      const foundUser = users.find((user: { idNumber: string }) => user.idNumber === idNumber);

      if (foundUser) {
        console.log('Usuario encontrado:', foundUser);

        const storedSubscriptions = localStorage.getItem('subscriptions');
        if (storedSubscriptions) {
          const subscriptions = JSON.parse(storedSubscriptions);
          const userSubscription = subscriptions.find(
            (subscription: { idNumber: string }) => subscription.idNumber === foundUser.idNumber
          );

          if (userSubscription) {
            setDaysRemaining(userSubscription.days);
            setEndDate(userSubscription.endDate);
          } else {
            setDaysRemaining(0);
            setEndDate(null);
          }
        }
        setUserData(foundUser);
        setShowModal(true); // Mostrar modal al encontrar el usuario
      } else {
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 2000);
        setUserData(null);
        setDaysRemaining(null);
        setEndDate(null);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showModal) {
        // Si el modal está abierto, cerrarlo y limpiar el input
        handleCloseModal();
      } else {
        // Si el modal no está abierto, realizar la búsqueda
        handleSearch();
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIdNumber(''); // Limpiar el input al cerrar el modal
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

                {/* Modal para mostrar los detalles del usuario */}
                {showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg relative w-full max-w-lg">
                      <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        onClick={handleCloseModal}
                      >
                        <AiOutlineClose size={20} />
                      </button>
                      <h2 className="text-xl font-semibold mb-4">Detalles del Usuario</h2>
                      {userData && (
                        <div>
                          <p><strong>Nombre Completo:</strong> {userData.fullName}</p>
                          <p><strong>Teléfono:</strong> {userData.phoneNumber}</p>
                          <p><strong>EPS:</strong> {userData.eps}</p>
                          <p><strong>Tipo de Sangre:</strong> {userData.bloodType}</p>
                          <p><strong>Contacto de Emergencia:</strong> {userData.emergencyContactName}</p>
                          <p><strong>Teléfono de Emergencia:</strong> {userData.emergencyContactPhone}</p>
                          <p><strong>Plan de Gimnasio:</strong> {userData.gymPlan}</p>
                          {endDate && <p><strong>Fecha de Fin del Plan:</strong> {endDate}</p>}
                          {daysRemaining !== null && (
                            <p><strong>Días Restantes del Plan:</strong> {daysRemaining} días</p>
                          )}
                        </div>
                      )}
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
                        onClick={handleCloseModal}
                      >
                        Cerrar
                      </button>
                    </div>
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
