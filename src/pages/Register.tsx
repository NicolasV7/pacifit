import React, { useState } from 'react';

const UserSubscription = () => {
  const [idNumber, setIdNumber] = useState('');
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleSearch = () => {
    const storedSubscriptions = localStorage.getItem('subscriptions');
    if (storedSubscriptions) {
      const subscriptions = JSON.parse(storedSubscriptions);

      // Buscar la suscripción del usuario por su idNumber
      const foundSubscription = subscriptions.find(
        (subscription: { idNumber: string }) => subscription.idNumber === idNumber
      );

      if (foundSubscription) {
        // Descontar un día de daysRemaining si es mayor que 0
        if (foundSubscription.daysRemaining > 0) {
          const updatedDaysRemaining = foundSubscription.daysRemaining - 1;
          setDaysRemaining(updatedDaysRemaining);
          setEndDate(foundSubscription.endDate);

          // Actualizar la suscripción en el localStorage
          const updatedSubscriptions = subscriptions.map((subscription: { idNumber: string }) => {
            if (subscription.idNumber === idNumber) {
              return {
                ...subscription,
                daysRemaining: updatedDaysRemaining,
              };
            }
            return subscription;
          });

          localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
        } else {
          setDaysRemaining(0); // Si no quedan días restantes
          setEndDate(foundSubscription.endDate);
        }
      } else {
        // Si no se encuentra la suscripción
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 2000);
        setDaysRemaining(null);
        setEndDate(null);
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

                {daysRemaining !== null && (
                  <div className="mt-6">
                    <p><strong>Días Restantes del Plan:</strong> {daysRemaining} días</p>
                    {endDate && (
                      <p><strong>Fecha de Fin del Plan:</strong> {endDate}</p>
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

export default UserSubscription;
