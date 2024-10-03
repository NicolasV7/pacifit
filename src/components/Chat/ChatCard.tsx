import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ChatCard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [gymPlans, setGymPlans] = useState<{ name: string; price: number }[]>([]);

  useEffect(() => {
    // Recupera los usuarios almacenados en el localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers.slice(-5).reverse()); // Invertir para mostrar los más recientes primero
    }
    const storedPlans = localStorage.getItem('gymPlans');
    if (storedPlans) {
      const parsedPlans = JSON.parse(storedPlans);
      setGymPlans(parsedPlans);
    }
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Últimos usuarios
      </h4>

      <div>
        {users.map((user) => {
          // Busca el plan correspondiente al usuario
          const userPlan = gymPlans.find(plan => plan.name === user.gymPlan);
          const planPrice = userPlan ? userPlan.price : null;

          return (
            <Link
              to="/"
              className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
              key={user.idNumber}
            >
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-medium text-black dark:text-white">
                    {user.fullName}
                  </h5>
                  <p>
                    <span className="text-sm text-black dark:text-white">
                      {user.gymPlan || "Sin plan"} - {planPrice !== null ? `${new Intl.NumberFormat('es-CO').format(planPrice)} COP` : "Precio no disponible"}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ChatCard;
