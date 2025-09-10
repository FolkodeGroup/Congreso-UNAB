import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const CamposDocente: React.FC<Props> = ({ register, errors }) => {
  return (
    <>
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Institución</label>
        <input type="text" id="institution" {...register("institution")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution?.message?.toString()}</p>}
      </div>
      <div>
        <label htmlFor="careerTaught" className="block text-sm font-medium text-gray-700">Carrera que dicta</label>
        <input type="text" id="careerTaught" {...register("careerTaught")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.careerTaught && <p className="text-red-500 text-xs mt-1">{errors.careerTaught?.message?.toString()}</p>}
      </div>
    </>
  );
};

export default CamposDocente;
