import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const CamposProfesional: React.FC<Props> = ({ register, errors }) => {
  return (
    <>
      <div>
        <label htmlFor="workArea" className="block text-sm font-medium text-gray-700">Área de trabajo</label>
        <input type="text" id="workArea" {...register("workArea")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.workArea && <p className="text-red-500 text-xs mt-1">{errors.workArea?.message?.toString()}</p>}
      </div>
      <div>
        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Cargo</label>
        <input type="text" id="occupation" {...register("occupation")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation?.message?.toString()}</p>}
      </div>
    </>
  );
};

export default CamposProfesional;
