import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import BloodType from '../components/Forms/SelectGroup/BloodType';
import React, { useState } from 'react';

const AddUser = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [eps, setEps] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [bloodType, setBloodType] = useState(''); // Valor inicial vacío
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Estado para mostrar la alerta de éxito
  const [showErrorAlert, setShowErrorAlert] = useState(false); // Estado para mostrar la alerta de error

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar si hay campos vacíos
    if (!fullName || !phoneNumber || !idNumber || !eps || !bloodType || !emergencyContactName || !emergencyContactPhone) {
      setShowErrorAlert(true); // Mostrar alerta de error
      setTimeout(() => {
        setShowErrorAlert(false); // Ocultar alerta de error después de 2 segundos
      }, 2000);
      return;
    }

    // Obtener los datos del formulario
    const userData = {
      fullName,
      phoneNumber,
      idNumber,
      eps,
      bloodType,
      emergencyContactName,
      emergencyContactPhone,
    };

    // Guardar en localStorage
    const existingData = JSON.parse(localStorage.getItem('users') || '[]');
    existingData.push(userData);
    localStorage.setItem('users', JSON.stringify(existingData));

    // Limpiar los campos
    setFullName('');
    setPhoneNumber('');
    setIdNumber('');
    setEps('');
    setBloodType(''); // Limpiar el estado de bloodType
    setEmergencyContactName('');
    setEmergencyContactPhone('');

    // Mostrar alerta de éxito
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 2000); // Desaparecer después de 2 segundos
  };

  const downloadData = () => {
    const data = localStorage.getItem('users');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      {showSuccessAlert && (
        <div className="absolute right-30 top-50 z-10 flex w-full max-w-md border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-4 py-3 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                fill="white"
                stroke="white"
              ></path>
            </svg>
          </div>
          <div className="w-full">
            <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399] ">
              ¡Registro exitoso!
            </h5>
            <p className="text-base leading-relaxed text-body">
              Los datos se han guardado correctamente.
            </p>
          </div>
        </div>
      )}

      {showErrorAlert && (
        <div className="absolute right-30 top-50 z-10 flex w-full max-w-md border-l-6 border-red-600 bg-red-600 bg-opacity-[15%] px-4 py-3 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-red-600">
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-3.58-8-8-8zm0 15c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"
                fill="white"
              />
              <path
                d="M8.5 4h-1v5h1V4zm-1 7h1v-1h-1v1z"
                fill="white"
              />
            </svg>
          </div>
          <div className="w-full">
            <h5 className="mb-3 text-lg font-semibold text-black dark:text-white ">
              Error
            </h5>
            <p className="text-base leading-relaxed text-body">
              Por favor, completa todos los campos.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Configuración" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Información Personal
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  {/* Sección Información Personal */}
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Nombre Completo
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Escribe tu nombre"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Teléfono
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="Escribe tu número de teléfono"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="idNumber"
                      >
                        Número de Identificación
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="idNumber"
                        id="idNumber"
                        placeholder="Escribe tu número de identificación"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="eps"
                      >
                        EPS
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="eps"
                        id="eps"
                        placeholder="Escribe tu EPS"
                        value={eps}
                        onChange={(e) => setEps(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <BloodType onChange={(selectedBloodType) => setBloodType(selectedBloodType)} />
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emergencyContactName"
                    >
                      Nombre del Contacto
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="emergencyContactName"
                      id="emergencyContactName"
                      placeholder="Escribe el nombre del contacto"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                    />
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emergencyContactPhone"
                    >
                      Teléfono del Contacto
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="emergencyContactPhone"
                      id="emergencyContactPhone"
                      placeholder="Escribe el teléfono del contacto"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    />
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="mr-4 rounded bg-primary px-6 py-2.5 text-white transition duration-200 hover:bg-opacity-80"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUser;
