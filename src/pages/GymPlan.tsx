import React, { useState, useEffect } from 'react';
import TrashIcon from '../images/icon/TrashIcon.svg';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const GymPlans = () => {
  const [plans, setPlans] = useState<{ name: string; price: number; days: number }[]>([]);
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planDays, setPlanDays] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    const storedPlans = localStorage.getItem('gymPlans');
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    }
  }, []);

  const addPlan = () => {
    if (
      planName.trim() === '' ||
      planPrice.trim() === '' ||
      planDays.trim() === '' ||
      parseFloat(planPrice) <= 0 ||
      parseInt(planDays, 10) <= 0
    ) {
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 2000);
      return;
    }

    const newPlan = {
      name: planName,
      price: parseFloat(planPrice.replace(/\./g, '').replace(',', '.')),
      days: parseInt(planDays, 10),
    };

    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
    setPlanName('');
    setPlanPrice('');
    setPlanDays('');
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 2000);

    localStorage.setItem('gymPlans', JSON.stringify(updatedPlans));
  };

  const deletePlan = (index: number) => {
    const updatedPlans = plans.filter((_, i) => i !== index);
    setPlans(updatedPlans);

    localStorage.setItem('gymPlans', JSON.stringify(updatedPlans));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO').format(price);
  };

  // Función que maneja la tecla Enter para enviar el formulario
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addPlan();
    }
  };

  // Convertir el valor a mayúsculas al escribir en el campo de nombre
  const handlePlanNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercasedName = e.target.value.toUpperCase();
    setPlanName(uppercasedName);
  };

  return (
    <>
      {showSuccessAlert && (
        <div className="absolute right-5 top-80 z-10 flex w-full max-w-md border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-4 py-3 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
          <span className="text-green-600">¡Plan agregado con éxito!</span>
          {/* Success Alert */}

        </div>
      )}

      {showErrorAlert && (
        <div className="absolute right-5 top-80 z-10 flex w-full max-w-md border-l-6 border-red-600 bg-red-600 bg-opacity-[15%] px-4 py-3 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9 ml-10">
          <span className="text-red-600">Error: Todos los campos son obligatorios y deben ser válidos.</span>
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
                <div className="mb-4 w-full sm:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="planName">
                    Nombre del Plan
                  </label>
                  <input
                    type="text"
                    id="planName"
                    placeholder="Escribe el nombre del plan"
                    value={planName}
                    onChange={handlePlanNameChange}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4 w-full sm:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="planPrice">
                    Precio del Plan (COP)
                  </label>
                  <input
                    type="text"
                    id="planPrice"
                    placeholder="Escribe el precio del plan"
                    value={planPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\./g, '');
                      setPlanPrice(value);
                    }}
                    onBlur={() => {
                      if (planPrice) {
                        const formattedPrice = formatPrice(parseFloat(planPrice));
                        setPlanPrice(formattedPrice);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4 w-full sm:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="planDays">
                    Días del Plan
                  </label>
                  <input
                    type="text"
                    id="planDays"
                    placeholder="Escribe los días del plan"
                    value={planDays}
                    onChange={(e) => setPlanDays(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
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
                          <span>{plan.name}</span> - <span>${formatPrice(plan.price)}</span> - <span>{plan.days} días</span>
                        </div>
                        <button
                          onClick={() => deletePlan(index)}
                          className="ml-4 text-red-600 hover:underline"
                        >
                          <img src={TrashIcon} alt="Eliminar" className="w-6 h-6" />
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
