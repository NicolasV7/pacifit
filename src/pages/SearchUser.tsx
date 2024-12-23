import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';

const UserSearch = () => {
  const [idNumber, setIdNumber] = useState('');
  const [userData, setUserData] = useState<{
    fullName: string;
    idNumber: string;
    phoneNumber: string;
    eps: string;
    bloodType: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    gymPlanName: string;
    gymPlanPrice: number;
    gymPlanDays: number;
    daysRemaining: number;
  } | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSearch = async () => {
    try {
      const userResponse = await fetch(
        `http://localhost:5000/api/users/${idNumber}`,
      );
      if (userResponse.ok) {
        const foundUser = await userResponse.json();
        console.log('Usuario encontrado:', foundUser);

        let daysRemainingValue = 0;
        let endDateValue = null;

        const subscriptionResponse = await fetch(
          `http://localhost:5000/api/subscriptions/${idNumber}`,
        );
        if (subscriptionResponse.ok) {
          const userSubscription = await subscriptionResponse.json();
          daysRemainingValue = userSubscription.days_remaining;
          endDateValue = userSubscription.end_date.split('T')[0];
          setDaysRemaining(daysRemainingValue);
          setEndDate(endDateValue);
        } else {
          setDaysRemaining(0);
          setEndDate(null);
        }

        // Actualiza userData usando los valores obtenidos
        setUserData({
          fullName: foundUser.full_name,
          idNumber: foundUser.id_number,
          phoneNumber: foundUser.phone_number,
          eps: foundUser.eps,
          bloodType: foundUser.blood_type,
          emergencyContactName: foundUser.emergency_contact_name,
          emergencyContactPhone: foundUser.emergency_contact_phone,
          gymPlanName: foundUser.gym_plan_name,
          gymPlanPrice: foundUser.gym_plan_price,
          gymPlanDays: foundUser.gym_plan_days,
          daysRemaining: daysRemainingValue, // Usa el valor obtenido de la suscripción
        });

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
    } catch (error) {
      console.error('Error al buscar el usuario:', error);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 2000);
      setUserData(null);
      setDaysRemaining(null);
      setEndDate(null);
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
    setIsEditing(false); // Resetear el modo de edición
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (userData) {
      // Construye updatedUserData, permitiendo actualizar también idNumber
      const updatedUserData = {
        fullName: userData.fullName.toUpperCase(),
        idNumber:
          typeof userData.idNumber === 'string'
            ? userData.idNumber.toUpperCase()
            : userData.idNumber, // Nuevo idNumber
        phoneNumber: userData.phoneNumber.toUpperCase(),
        eps: userData.eps.toUpperCase(),
        bloodType: userData.bloodType.toUpperCase(),
        emergencyContactName: userData.emergencyContactName.toUpperCase(),
        emergencyContactPhone: userData.emergencyContactPhone.toUpperCase(),
        daysRemaining: userData.daysRemaining,
      };

      try {
        // La solicitud se realiza usando el idNumber original como parámetro
        const response = await fetch(
          `http://localhost:5000/api/users/${idNumber}`, // Usa el idNumber actual para identificar al usuario
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUserData), // Envía el nuevo idNumber como parte del cuerpo
          },
        );

        const updatedSubscriptionData = await fetch(
          `http://localhost:5000/api/subscriptions/update-days/${idNumber}`, // Usa el idNumber actual para identificar la suscripción
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ daysRemaining: userData.daysRemaining }), // Actualiza solo los días restantes
          },
        );

        if (updatedSubscriptionData.ok) {
          console.log('Datos de suscripción actualizados');
        }

        if (response.ok) {
          const updatedData = await response.json(); // Recupera los datos actualizados desde el servidor
          setUserData(updatedData); // Actualiza userData con la respuesta del servidor
          setIsEditing(false);
          setShowModal(false);
          setShowSuccessModal(true); // Mostrar modal de éxito
          console.log('Datos actualizados:', updatedData);
        } else {
          console.error('Error al actualizar el usuario');
        }
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
      }
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      {showErrorAlert && (
        <div className="absolute right-15 top-80 z-10 flex w-full max-w-sm border-l-6 border-red-600 bg-red-600 bg-opacity-[15%] px-2 py-2 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-5">
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
                      <button
                        className="absolute top-2 right-10 text-gray-600 hover:text-gray-800"
                        onClick={handleEdit}
                      >
                        <AiOutlineEdit size={20} />
                      </button>
                      <h2 className="text-xl font-semibold mb-4">
                        Detalles del Usuario
                      </h2>
                      {userData && (
                        <div>
                          {isEditing ? (
                            <>
                              <label className="block mb-1">Nombre:</label>
                              <input
                                type="text"
                                value={userData.fullName}
                                onChange={(e) =>
                                  setUserData({
                                    ...userData,
                                    fullName: e.target.value,
                                  })
                                }
                                className="w-full mb-2 p-2 border rounded"
                              />

                              <label className="block mb-1">ID Number:</label>
                              <input
                                type="text"
                                value={userData.idNumber}
                                onChange={(e) =>
                                  setUserData({
                                    ...userData,
                                    idNumber: e.target.value,
                                  })
                                }
                                className="w-full mb-2 p-2 border rounded"
                              />

                              <label className="block mb-1">
                                Phone Number:
                              </label>
                              <input
                                type="text"
                                value={userData.phoneNumber}
                                onChange={(e) =>
                                  setUserData({
                                    ...userData,
                                    phoneNumber: e.target.value,
                                  })
                                }
                                className="w-full mb-2 p-2 border rounded"
                              />

                              <label className="block mb-1">EPS:</label>
                              <input
                                type="text"
                                value={userData.eps}
                                onChange={(e) =>
                                  setUserData({
                                    ...userData,
                                    eps: e.target.value,
                                  })
                                }
                                className="w-full mb-2 p-2 border rounded"
                              />

                              <label className="block mb-1">Blood Type:</label>
                              <input
                                type="text"
                                value={userData.bloodType}
                                onChange={(e) =>
                                  setUserData({
                                    ...userData,
                                    bloodType: e.target.value,
                                  })
                                }
                                className="w-full mb-2 p-2 border rounded"
                              />

                              <label className="block mb-1">
                                Emergency Contact Name:
                              </label>
                              <input
                                type="text"
                                value={userData.emergencyContactName}
                                onChange={(e) =>
                                  setUserData({
                                    ...userData,
                                    emergencyContactName: e.target.value,
                                  })
                                }
                                className="w-full mb-2 p-2 border rounded"
                              />

                              <label className="block mb-1">
                                Emergency Contact Phone:
                              </label>
                              <input
                                type="text"
                                value={userData.emergencyContactPhone}
                                onChange={(e) =>
                                  setUserData({
                                    ...userData,
                                    emergencyContactPhone: e.target.value,
                                  })
                                }
                                className="w-full mb-2 p-2 border rounded"
                              />

                              <label className="block mb-1">Dias:</label>
                              <input
                                type="text"
                                value={userData.daysRemaining}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setUserData({
                                    ...userData,
                                    daysRemaining:
                                      value === '' ? 0 : parseInt(value),
                                  });
                                }}
                                className="w-full mb-2 p-2 border rounded"
                              />

                              <button
                                className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
                                onClick={handleSave}
                              >
                                Guardar
                              </button>
                            </>
                          ) : (
                            <>
                              <p>
                                <strong>Nombre Completo:</strong>{' '}
                                {userData.fullName}
                              </p>
                              <p>
                                <strong>Teléfono:</strong>{' '}
                                {userData.phoneNumber}
                              </p>
                              <p>
                                <strong>EPS:</strong> {userData.eps}
                              </p>
                              <p>
                                <strong>Tipo de Sangre:</strong>{' '}
                                {userData.bloodType}
                              </p>
                              <p>
                                <strong>Contacto de Emergencia:</strong>{' '}
                                {userData.emergencyContactName}
                              </p>
                              <p>
                                <strong>Teléfono de Emergencia:</strong>{' '}
                                {userData.emergencyContactPhone}
                              </p>
                              {endDate && (
                                <p>
                                  <strong>Fecha de Fin del Plan:</strong>{' '}
                                  {endDate}
                                </p>
                              )}
                              {daysRemaining !== null && (
                                <p>
                                  <strong>Días Restantes del Plan:</strong>{' '}
                                  {daysRemaining} días
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {!isEditing && (
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
                          onClick={handleCloseModal}
                        >
                          Cerrar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg relative w-full max-w-lg">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={handleCloseSuccessModal}
            >
              <AiOutlineClose size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Actualización Exitosa
            </h2>
            <p>Los datos del usuario se han actualizado correctamente.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
              onClick={handleCloseSuccessModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSearch;
