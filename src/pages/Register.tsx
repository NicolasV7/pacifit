import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const UserSubscription = () => {
  const [idNumber, setIdNumber] = useState('');
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [days, setDays] = useState<number | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = () => {
    const storedSubscriptions = localStorage.getItem('subscriptions');
    if (storedSubscriptions) {
      let subscriptions = JSON.parse(storedSubscriptions);

      const foundSubscription = subscriptions.find(
        (subscription: { idNumber: string }) =>
          subscription.idNumber === idNumber,
      );

      if (foundSubscription) {
        if (foundSubscription.daysRemaining > 0 && foundSubscription.days > 0) {
          const updatedDaysRemaining = foundSubscription.daysRemaining - 1;
          const updatedDays = foundSubscription.days - 1;

          setDaysRemaining(updatedDaysRemaining);
          setDays(updatedDays);
          setEndDate(foundSubscription.endDate);

          if (updatedDays > 0) {
            subscriptions = subscriptions.map(
              (subscription: { idNumber: string }) => {
                if (subscription.idNumber === idNumber) {
                  return {
                    ...subscription,
                    daysRemaining: updatedDaysRemaining,
                    days: updatedDays,
                  };
                }
                return subscription;
              },
            );
          } else {
            subscriptions = subscriptions.filter(
              (subscription: { idNumber: string }) =>
                subscription.idNumber !== idNumber,
            );
          }

          localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
          setShowModal(true);
        } else {
          setDaysRemaining(0);
          setDays(0);
          setEndDate(foundSubscription.endDate);

          subscriptions = subscriptions.filter(
            (subscription: { idNumber: string }) =>
              subscription.idNumber !== idNumber,
          );

          localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
          setShowModal(true);
        }
      } else {
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 2000);
        setDaysRemaining(null);
        setDays(null);
        setEndDate(null);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showModal) {
        handleCloseModal();
      } else {
        handleSearch();
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIdNumber('');
  };

  return (
    <>
      {showErrorAlert && (
        <div className="absolute right-30 top-50 z-10 flex w-full max-w-md border-l-6 border-red-600 bg-red-600 bg-opacity-[15%] px-4 py-3 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
          <p className="text-red-600">Suscripción no encontrada.</p>
        </div>
      )}

      <div className="mx-auto max-w-270">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Buscar Suscripción por Cédula
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
                    Buscar Suscripción
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={handleCloseModal}
            >
              <AiOutlineClose size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">
              Detalles de la Suscripción
            </h2>

            <div className="flex flex-col items-center justify-center">
              <p className="text-8xl font-bold mb-2">{days}</p>
              <span className="text-sm">días restantes</span>
              {endDate && (
                <p className="mt-4 text-lg">
                  Fecha de Finalización: <strong>{endDate}</strong>
                </p>
              )}
            </div>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
              onClick={handleCloseModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSubscription;
