import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const ChartOne: React.FC = () => {
  const [customValue, setCustomValue] = useState<string>('0');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [entryAmount, setEntryAmount] = useState<number>(0);
  const [entryType, setEntryType] = useState<string>(''); // New state for entry type
  const [buttonValues, setButtonValues] = useState<number[]>([10000, 50000, 100000]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const handleRegisterEntry = async (amount: number, type: string) => {
    try {
      const response = await fetch('http://localhost:5055/api/suma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo: type, monto: amount }),
      });
      if (!response.ok) {
        throw new Error('Error al registrar la entrada');
      }
      setShowSuccessModal(true);
      setCustomValue(''); // Clear the input field after successful registration
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar la entrada');
    }
  };

  const formatNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleCustomValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumber(event.target.value);
    setCustomValue(formattedValue);
  };

  const handleCustomValueSubmit = () => {
    const numericValue = Number(customValue.replace(/\./g, ''));
    if (numericValue > 0) {
      setEntryAmount(numericValue);
      setShowConfirmModal(true);
    } else {
      setShowErrorModal(true);
    }
  };

  const handleConfirmEntry = (type: string) => {
    handleRegisterEntry(entryAmount, type);
    setShowConfirmModal(false);
  };

  const handleEditButtonValue = (index: number) => {
    setEditingIndex(index);
    setEditingValue(buttonValues[index].toString());
  };

  const handleSaveButtonValue = () => {
    if (editingIndex !== null) {
      const newValues = [...buttonValues];
      newValues[editingIndex] = Number(editingValue.replace(/\./g, ''));
      setButtonValues(newValues);
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Registrar Entradas/Gastos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center">
        {buttonValues.map((value, index) => (
          <div key={index} className="flex items-center mb-3">
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(formatNumber(e.target.value))}
                  className="mr-3 rounded border border-gray-300 p-2"
                />
                <button
                  className="mr-3 rounded bg-green-500 py-2 px-4 text-white"
                  onClick={handleSaveButtonValue}
                >
                  Guardar
                </button>
              </>
            ) : (
              <>
                <button
                  className="mr-3 rounded bg-blue-500 py-2 px-4 text-white"
                  onClick={() => {
                    setEntryAmount(value);
                    setShowConfirmModal(true);
                  }}
                >
                  {value.toLocaleString()}
                </button>
                <button
                  className="rounded bg-yellow-500 py-2 px-4 text-white"
                  onClick={() => handleEditButtonValue(index)}
                >
                  Editar
                </button>
              </>
            )}
          </div>
        ))}
        <div className="mt-5 flex items-center">
          <input
            type="text"
            value={customValue}
            onChange={handleCustomValueChange}
            className="mr-3 rounded border border-gray-300 p-2"
          />
          <button
            className="rounded bg-green-500 py-2 px-4 text-white"
            onClick={handleCustomValueSubmit}
          >
            Registrar otro valor
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowConfirmModal(false)}
            >
              <AiOutlineClose size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Confirmar Entrada</h2>
            <p>¿Estás seguro de que deseas registrar {entryAmount.toLocaleString()}?</p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => handleConfirmEntry('Entrada')}
              >
                Entrada
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => handleConfirmEntry('Gasto')}
              >
                Gasto
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowSuccessModal(false)}
            >
              <AiOutlineClose size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Entrada Registrada</h2>
            <p>La entrada por {entryAmount.toLocaleString()} ha sido registrada con éxito.</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setShowSuccessModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowErrorModal(false)}
            >
              <AiOutlineClose size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p>El valor debe ser mayor que 0.</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setShowErrorModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartOne;