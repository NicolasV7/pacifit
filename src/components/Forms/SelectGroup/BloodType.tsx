import React, { useEffect, useState } from 'react';
import waterDropIcon from '../../../images/icon/icon-gota.svg';

interface BloodTypeProps {
  onChange: (selectedBloodType: string) => void;
  reset?: boolean; // Propiedad opcional para reiniciar el componente
}

const BloodType: React.FC<BloodTypeProps> = ({ onChange, reset }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    if (reset) {
      setSelectedOption(''); // Reiniciar el valor seleccionado
      onChange(''); // Notificar al componente padre que se ha reiniciado
    }
  }, [reset, onChange]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div>
      <label className="mb-3 block text-black dark:text-white">
        Tipo de Sangre
      </label>
      <div className="relative z-20 bg-white dark:bg-form-input">
        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
          <img 
            src={waterDropIcon} 
            alt="Gota de agua" 
            width="20" 
            height="20" 
          />
        </span>
        <select
          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          value={selectedOption}
          onChange={handleSelectChange}
        >
          <option value="" disabled>Selecciona tu tipo de sangre</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>
    </div>
  );
};

export default BloodType;
