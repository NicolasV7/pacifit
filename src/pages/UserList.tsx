import React, { useEffect, useState } from 'react';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

interface User {
  idNumber: string;
  fullName: string;
  phoneNumber: string;
  eps: string;
  bloodType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  gymPlan: string;
  completionDate?: string;
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
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch('http://localhost:5055/api/users');
        const usersData = await usersResponse.json();
        const formattedUsers = usersData.map((user: any) => ({
          idNumber: user.id_number,
          fullName: user.full_name,
          phoneNumber: user.phone_number,
          eps: user.eps,
          bloodType: user.blood_type,
          emergencyContactName: user.emergency_contact_name,
          emergencyContactPhone: user.emergency_contact_phone,
          gymPlan: user.gym_plan,
          completionDate: user.completion_date,
        }));
        setUsers(formattedUsers);

        const plansResponse = await fetch('http://localhost:5055/api/plans');
        const plansData = await plansResponse.json();
        setGymPlans(plansData);

        const subscriptionsResponse = await fetch('http://localhost:5055/api/subscriptions');
        const subscriptionsData = await subscriptionsResponse.json();
        const updatedSubscriptions = subscriptionsData.map((subscription: Subscription) => {
          const updatedDaysRemaining = calculateDaysRemaining(subscription.endDate);
          return { ...subscription, daysRemaining: updatedDaysRemaining };
        });
        setSubscriptions(updatedSubscriptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      (user.fullName && user.fullName.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (user.phoneNumber && user.phoneNumber.includes(lowerCaseSearchTerm)) ||
      (user.idNumber && user.idNumber.includes(lowerCaseSearchTerm))
    );
  });

  const handleDeleteUser = async (idNumber: string) => {
    try {
      await fetch(`http://localhost:5055/api/users/${idNumber}`, { method: 'DELETE' });
      const updatedUsers = users.filter((user) => user.idNumber !== idNumber);
      setUsers(updatedUsers);
      setDeletingUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    const subscription = subscriptions.find((sub) => sub.idNumber === user.idNumber);
    if (subscription) {
      setSelectedEndDate(subscription.endDate);
    } else {
      const today = new Date();
      const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
      setSelectedEndDate(nextMonth.toISOString().split('T')[0]);
    }
  };

  const calculateDaysRemaining = (endDate: string): number => {
    const today = new Date();
    const finalDate = new Date(endDate);
    const differenceInTime = finalDate.getTime() - today.getTime();
    const totalRemainingDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return totalRemainingDays > 0 ? totalRemainingDays : 0;
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    const formattedUser = {
      ...editingUser,
      fullName: editingUser.fullName.toUpperCase(),
      completionDate: selectedEndDate || new Date().toISOString(),
    };

    try {
      // Check if the user exists
      const userResponse = await fetch(`http://localhost:5055/api/users/${formattedUser.idNumber}`);
      if (userResponse.ok) {
        // User exists, perform PUT request
        await fetch(`http://localhost:5055/api/users/${formattedUser.idNumber}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedUser),
        });
      } else {
        // User does not exist, perform POST request
        await fetch('http://localhost:5055/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedUser),
        });
      }

      const updatedUsers = users.map((user) =>
        user.idNumber === formattedUser.idNumber ? formattedUser : user,
      );
      setUsers(updatedUsers);

      const selectedPlan = gymPlans.find((plan) => plan.name === formattedUser.gymPlan);

      let endDate: string;

      if (selectedPlan) {
        const existingSubscription = subscriptions.find((sub) => sub.idNumber === formattedUser.idNumber);

        if (existingSubscription) {
          endDate = selectedEndDate || existingSubscription.endDate;
        } else {
          endDate = calculateEndDateAsOneMonth(new Date());
        }

        const newSubscription: Subscription = {
          idNumber: formattedUser.idNumber,
          days: selectedPlan.days,
          endDate: endDate,
          daysRemaining: selectedPlan.days,
        };

        await fetch('http://localhost:5055/api/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSubscription),
        });

        const updatedSubscriptions = subscriptions.filter((sub) => sub.idNumber !== formattedUser.idNumber);
        updatedSubscriptions.push(newSubscription);
        setSubscriptions(updatedSubscriptions);
      } else {
        // If no plan is selected, still update the end date
        const existingSubscription = subscriptions.find((sub) => sub.idNumber === formattedUser.idNumber);

        if (existingSubscription) {
          const updatedSubscription: Subscription = {
            ...existingSubscription,
            endDate: selectedEndDate || existingSubscription.endDate,
          };

          await fetch(`http://localhost:5055/api/subscriptions/${formattedUser.idNumber}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSubscription),
          });

          const updatedSubscriptions = subscriptions.map((sub) =>
            sub.idNumber === formattedUser.idNumber ? updatedSubscription : sub,
          );
          setSubscriptions(updatedSubscriptions);
        } else {
          // If no existing subscription, create a new one with the selected end date
          const newSubscription: Subscription = {
            idNumber: formattedUser.idNumber,
            days: 0, // Default value if no plan is selected
            endDate: selectedEndDate || calculateEndDateAsOneMonth(new Date()),
            daysRemaining: 0, // Default value if no plan is selected
          };

          await fetch('http://localhost:5055/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSubscription),
          });

          const updatedSubscriptions = subscriptions.filter((sub) => sub.idNumber !== formattedUser.idNumber);
          updatedSubscriptions.push(newSubscription);
          setSubscriptions(updatedSubscriptions);
        }
      }

      setEditingUser(null);
      setSelectedEndDate(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const calculateEndDateAsOneMonth = (startDate: Date): string => {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    return endDate.toISOString().split('T')[0];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO').format(price);
  };

  const handleCloseEditModal = () => {
    setEditingUser(null);
  };

  const handleCloseDeleteModal = () => {
    setDeletingUser(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb pageName="Usuarios" />
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
                    onClick={() => setDeletingUser(user)} // Mostrar el modal de confirmación al hacer clic
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron usuarios</p>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            {/* Botón de "X" para cerrar el modal */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={handleCloseEditModal}
            >
              <AiOutlineClose size={20} />
            </button>

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
              value={editingUser.gymPlan || ''}
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

            {/* Nuevo campo para seleccionar la fecha de finalización (endDate) */}
            <label className="block mb-2">Fecha de Finalización</label>
            <input
              type="date"
              value={selectedEndDate || ''}
              onChange={(e) => setSelectedEndDate(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleUpdateUser}
            >
              Actualizar
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded ml-2"
              onClick={handleCloseEditModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {deletingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            {/* Botón de "X" para cerrar el modal */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={handleCloseDeleteModal}
            >
              <AiOutlineClose size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Confirmar Eliminación</h2>
            <p>
              ¿Estás seguro de que deseas eliminar a{' '}
              <strong>{deletingUser.fullName}</strong>?
            </p>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteUser(deletingUser.idNumber)}
              >
                Eliminar
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded ml-2"
                onClick={handleCloseDeleteModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;