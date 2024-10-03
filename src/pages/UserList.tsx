import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

interface User {
    id: number; 
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

    useEffect(() => {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers);
            setUsers(parsedUsers);
        }
    }, []);

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb pageName="Lista de usuarios" />
            <h1 className="text-2xl font-semibold mb-4">Usuarios disponibles</h1>

            {users.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 border-b">Nombre Completo</th>
                            <th className="py-2 px-4 border-b">Teléfono</th>
                            <th className="py-2 px-4 border-b">Número de ID</th>
                            <th className="py-2 px-4 border-b">EPS</th>
                            <th className="py-2 px-4 border-b">Tipo de Sangre</th>
                            <th className="py-2 px-4 border-b">Contacto de Emergencia</th>
                            <th className="py-2 px-4 border-b">Teléfono de Emergencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{user.fullName}</td>
                                <td className="py-2 px-4 border-b">{user.phoneNumber}</td>
                                <td className="py-2 px-4 border-b">{user.idNumber}</td>
                                <td className="py-2 px-4 border-b">{user.eps}</td>
                                <td className="py-2 px-4 border-b">{user.bloodType}</td>
                                <td className="py-2 px-4 border-b">{user.emergencyContactName}</td>
                                <td className="py-2 px-4 border-b">{user.emergencyContactPhone}</td>
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
