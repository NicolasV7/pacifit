import React, { useEffect, useState } from 'react';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

interface User {
  idNumber: string;
  fullName: string;
  phoneNumber: string;
  eps: string;
  bloodType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  gymPlan: string; // Campo para el plan de gimnasio
}

interface GymPlan {
  name: string;
  price: number;
  days: number;
}

interface Subscription {
  idNumber: string;
  days: number;
  endDate: string;
  daysRemaining: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [gymPlans, setGymPlans] = useState<GymPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    const storedPlans = localStorage.getItem('gymPlans');
    if (storedPlans) {
      setGymPlans(JSON.parse(storedPlans));
    }

    const storedSubscriptions = localStorage.getItem('subscriptions');
    if (storedSubscriptions) {
      const parsedSubscriptions = JSON.parse(storedSubscriptions);
      const updatedSubscriptions = parsedSubscriptions.map((subscription: Subscription) => {
        const updatedDaysRemaining = calculateDaysRemaining(subscription.endDate);
        return {
          ...subscription,
          daysRemaining: updatedDaysRemaining,
        };
      });
      setSubscriptions(updatedSubscriptions);
      localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
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
    setEditingUser(user);
  };

  const calculateEndDate = (startDate: Date, totalDays: number): string => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + totalDays);
    return endDate.toISOString().split('T')[0];
  };

  const calculateDaysRemaining = (endDate: string): number => {
    const today = new Date();
    const finalDate = new Date(endDate);
    const differenceInTime = finalDate.getTime() - today.getTime();
    const totalRemainingDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return totalRemainingDays > 0 ? totalRemainingDays : 0;
  };

  const handleUpdateUser = () => {
    const updatedUsers = users.map((user) =>
      user.idNumber === editingUser?.idNumber ? editingUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const selectedPlan = gymPlans.find(
      (plan) => plan.name === editingUser?.gymPlan
    );
    if (selectedPlan) {
      const today = new Date();
      let endDate: string;

      if (selectedPlan.days === 15) {
        endDate = calculateEndDate(today, 30); // Asigna 30 días para el plan de 15 días
      } else {
        endDate = calculateEndDate(today, selectedPlan.days);
      }
      const daysRemaining = calculateDaysRemaining(endDate);

      const subscription = {
        idNumber: editingUser?.idNumber,
        days: selectedPlan.days,
        endDate: endDate,
        daysRemaining: daysRemaining,
      };

      const existingSubscriptions = JSON.parse(
        localStorage.getItem('subscriptions') || '[]'
      );
      const updatedSubscriptions = existingSubscriptions.filter(
        (sub: { idNumber: string }) => sub.idNumber !== editingUser?.idNumber
      );
      updatedSubscriptions.push(subscription);

      localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
      setSubscriptions(updatedSubscriptions);
    }

    setEditingUser(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO').format(price);
  };

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb pageName="Lista de usuarios" />
      <h1 className="text-2xl font-semibold mb-4">Lista de Usuarios</h1>

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
        <p>No se encontraron usuarios.</p>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3">
            <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>
            <label className="block mb-2">Nombre Completo</label>
            <input
              type="text"
              value={editingUser.fullName}
              onChange={(e) =>
                setEditingUser({ ...editingUser, fullName: e.target.value })
              }
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <label className="block mb-2">Teléfono</label>
            <input
              type="text"
              value={editingUser.phoneNumber}
              onChange={(e) =>
                setEditingUser({ ...editingUser, phoneNumber: e.target.value })
              }
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />

            {/* Nuevo campo de selección para el plan de gimnasio */}
            <label className="block mb-2">Plan de Gimnasio</label>
            <select
              value={editingUser.gymPlan}
              onChange={(e) =>
                setEditingUser({ ...editingUser, gymPlan: e.target.value })
              }
              className="border border-gray-300 p-2 rounded w-full mb-4"
            >
              <option value="">Seleccionar plan</option>
              {gymPlans.map((plan) => (
                <option key={plan.name} value={plan.name}>
                  {plan.name} - {formatPrice(plan.price)} COP - {plan.days} días
                </option>
              ))}
            </select>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleUpdateUser}
            >
              Actualizar
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded ml-2"
              onClick={() => setEditingUser(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
