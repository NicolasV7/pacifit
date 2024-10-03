import React, { useEffect, useState } from 'react';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa'; // Asegúrate de instalar react-icons
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

interface User {
  idNumber: string;
  fullName: string;
  phoneNumber: string;
  eps: string;
  bloodType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  gymPlan: string; // Nuevo campo para el plan de gimnasio
}

interface GymPlan {
  name: string;
  price: number;
  days: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null); // Usuario que se está editando
  const [gymPlans, setGymPlans] = useState<GymPlan[]>([]); // Planes disponibles del gimnasio

  useEffect(() => {
    // Recupera los usuarios almacenados en el localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
    }

    // Recupera los planes de gimnasio almacenados en localStorage
    const storedPlans = localStorage.getItem('gymPlans');
    if (storedPlans) {
      const parsedPlans = JSON.parse(storedPlans);
      setGymPlans(parsedPlans);
    }
  }, []);

  const filteredUsers = users.filter((user) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.phoneNumber.includes(lowerCaseSearchTerm) ||
      user.idNumber.includes(lowerCaseSearchTerm)
    );
  });

  const handleDeleteUser = (idNumber: string) => {
    const updatedUsers = users.filter((user) => user.idNumber !== idNumber);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user); // Establece el usuario que se está editando
  };

  const handleUpdateUser = () => {
    const updatedUsers = users.map((user) =>
      user.idNumber === editingUser?.idNumber ? editingUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Encuentra el plan seleccionado
    const selectedPlan = gymPlans.find(
      (plan) => plan.name === editingUser?.gymPlan
    );
    if (selectedPlan) {
      // Guarda los días del plan y el ID de la persona en el localStorage bajo "subscriptions"
      const subscription = {
        idNumber: editingUser?.idNumber,
        days: selectedPlan.days,
      };

      // Si ya hay suscripciones almacenadas en localStorage, agregamos la nueva
      const existingSubscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');

      // Agregar o actualizar la suscripción del usuario
      const updatedSubscriptions = existingSubscriptions.filter(
        (sub: { idNumber: string }) => sub.idNumber !== editingUser?.idNumber
      );
      updatedSubscriptions.push(subscription);

      // Guardar las suscripciones actualizadas en localStorage
      localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
    }

    setEditingUser(null); // Limpia el estado de edición
  };


  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO').format(price); // Formato de Colombia
  };

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb pageName="Lista de usuarios" />
      <h1 className="text-2xl font-semibold mb-4">Lista de Usuarios</h1>

      {/* Campo de búsqueda */}
      <div className="mb-4 flex items-center border border-gray-300 rounded">
        <FaSearch className="text-gray-400 ml-2" />
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o cédula"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-full rounded focus:outline-none"
        />
      </div>

      {filteredUsers.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left">Nombre Completo</th>
              <th className="py-2 px-4 border-b text-left">Teléfono</th>
              <th className="py-2 px-4 border-b text-left">Cédula</th>
              <th className="py-2 px-4 border-b text-left">EPS</th>
              <th className="py-2 px-4 border-b text-left">Tipo de Sangre</th>
              <th className="py-2 px-4 border-b text-left">
                Nombre de contacto
              </th>
              <th className="py-2 px-4 border-b text-left">
                Teléfono del contacto
              </th>
              <th className="py-2 px-4 border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.idNumber} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-left">
                  {user.fullName}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {user.phoneNumber}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {user.idNumber}
                </td>
                <td className="py-2 px-4 border-b text-left">{user.eps}</td>
                <td className="py-2 px-4 border-b text-left">
                  {user.bloodType}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {user.emergencyContactName}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {user.emergencyContactPhone}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditUser(user)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 ml-2"
                    onClick={() => handleDeleteUser(user.idNumber)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No hay usuarios registrados.</p>
      )}

      {editingUser && (
        <div className="mt-6 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              type="text"
              value={editingUser.fullName}
              onChange={(e) =>
                setEditingUser({ ...editingUser, fullName: e.target.value })
              }
              className="p-2 w-full border rounded focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              value={editingUser.phoneNumber}
              onChange={(e) =>
                setEditingUser({ ...editingUser, phoneNumber: e.target.value })
              }
              className="p-2 w-full border rounded focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Plan de Gimnasio
            </label>
            <select
              value={editingUser?.gymPlan || ''} // Si no hay plan, se asigna un valor vacío
              onChange={(e) =>
                setEditingUser({ ...editingUser, gymPlan: e.target.value })
              }
              className="p-2 w-full border rounded focus:outline-none"
            >
              <option value="">Selecciona un plan</option>{' '}
              {/* La opción predeterminada */}
              {gymPlans.map((plan) => (
                <option key={plan.name} value={plan.name}>
                  {plan.name} - {formatPrice(plan.price)} COP ({plan.days} días)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUpdateUser}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;
