import React, { useEffect, useState } from 'react';
import { FaEdit, FaSearch } from 'react-icons/fa'; // Asegúrate de instalar react-icons
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

interface User {
    id: number; // Cambiar a 'string' si el ID se genera como string
    fullName: string;
    phoneNumber: string;
    idNumber: string;
    eps: string;
    bloodType: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers);
            setUsers(parsedUsers);
        }
    }, []);

    // Filtrar usuarios según el término de búsqueda
    const filteredUsers = users.filter(user => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            user.fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
            user.phoneNumber.includes(lowerCaseSearchTerm) ||
            user.idNumber.includes(lowerCaseSearchTerm)
        );
    });

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb pageName="Lista de usuarios" />
            <h1 className="text-2xl font-semibold mb-4">Lista de Usuarios</h1>
            
            {/* Campo de búsqueda con ícono */}
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
                            <th className="py-2 px-4 border-b text-left">Número de ID</th>
                            <th className="py-2 px-4 border-b text-left">EPS</th>
                            <th className="py-2 px-4 border-b text-left">Tipo de Sangre</th>
                            <th className="py-2 px-4 border-b text-left">Contacto de Emergencia</th>
                            <th className="py-2 px-4 border-b text-left">Teléfono de Emergencia</th>
                            <th className="py-2 px-4 border-b text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b text-left">{user.fullName}</td>
                                <td className="py-2 px-4 border-b text-left">{user.phoneNumber}</td>
                                <td className="py-2 px-4 border-b text-left">{user.idNumber}</td>
                                <td className="py-2 px-4 border-b text-left">{user.eps}</td>
                                <td className="py-2 px-4 border-b text-left">{user.bloodType}</td>
                                <td className="py-2 px-4 border-b text-left">{user.emergencyContactName}</td>
                                <td className="py-2 px-4 border-b text-left">{user.emergencyContactPhone}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button className="text-blue-600 hover:text-blue-800">
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No hay usuarios registrados.</p>
            )}
        </div>
    );
};

export default UserList;
