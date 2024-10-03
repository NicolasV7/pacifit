import React, { useEffect, useState } from 'react';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa'; // Asegúrate de instalar react-icons
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';



interface User {
    idNumber: string; // Cambiar a 'string' ya que es el número de identificación
    fullName: string;
    phoneNumber: string;
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

    // Función para eliminar un usuario por su número de identificación
    const handleDeleteUser = (idNumber: string) => {
        const updatedUsers = users.filter(user => user.idNumber !== idNumber);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

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
                            <th className="py-2 px-4 border-b text-left">Nombre de contacto</th>
                            <th className="py-2 px-4 border-b text-left">Teléfono del contacto</th>
                            <th className="py-2 px-4 border-b text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.idNumber} className="hover:bg-gray-100">
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
                                    <button 
                                        className="text-red-600 hover:text-red-800 ml-2" 
                                        onClick={() => handleDeleteUser(user.idNumber)} // Eliminar el usuario específico
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
        </div>
    );
};

export default UserList;
