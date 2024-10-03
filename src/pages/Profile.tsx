import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const GymPlans = () => {
  const [plans, setPlans] = useState<{ name: string; price: number }[]>([]);
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Cargar planes desde localStorage al iniciar
  useEffect(() => {
    const storedPlans = localStorage.getItem('gymPlans');
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    }
  }, []);

  const addPlan = () => {
    if (planName.trim() === '' || planPrice.trim() === '') {
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 2000);
      return;
    }

    const newPlan = {
      name: planName,
      price: parseFloat(planPrice.replace(/\./g, '').replace(',', '.')), // Asegúrate de que el precio se interprete correctamente
    };

    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
    setPlanName('');
    setPlanPrice('');
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 2000);

    // Guardar planes en localStorage
    localStorage.setItem('gymPlans', JSON.stringify(updatedPlans));
  };

  // Función para eliminar un plan
  const deletePlan = (index: number) => {
    const updatedPlans = plans.filter((_, i) => i !== index);
    setPlans(updatedPlans);

    // Actualizar localStorage
    localStorage.setItem('gymPlans', JSON.stringify(updatedPlans));
  };

  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO').format(price);
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
              Operación Exitosa
            </h5>
            <p className="text-base leading-relaxed text-body">
              El plan se ha agregado correctamente.
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
        <Breadcrumb pageName="Planes de Gimnasio" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Ingresar un plan
                </h3>
              </div>
              <div className="p-7">
                <div className="mb-4">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">Nombre del Plan</label>
                  <input
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">Precio del Plan (COP)</label>
                  <input
                    type="text"
                    value={planPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\./g, ''); // Quitar puntos
                      setPlanPrice(value); // Actualizar el estado
                    }}
                    onBlur={() => {
                      if (planPrice) {
                        const formattedPrice = formatPrice(parseFloat(planPrice));
                        setPlanPrice(formattedPrice); // Formatear el precio al perder el foco
                      }
                    }}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={addPlan}
                    className="rounded bg-primary px-6 py-2.5 text-white transition duration-200 hover:bg-opacity-80"
                  >
                    Agregar Plan
                  </button>
                </div>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold">Planes Agregados</h4>
                  <ul>
                    {plans.map((plan, index) => (
                      <li key={index} className="flex justify-between border-b py-2">
                        <div>
                          <span>{plan.name}</span> - <span>${formatPrice(plan.price)}</span>
                        </div>
                        <button
                          onClick={() => deletePlan(index)}
                          className="ml-4 text-red-600 hover:underline"
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GymPlans;
