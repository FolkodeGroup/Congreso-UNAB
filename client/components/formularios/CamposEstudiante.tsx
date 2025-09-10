import React from 'react';
import { UseFormRegister, FieldErrors, useWatch } from 'react-hook-form';

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: any;
}

const CamposEstudiante: React.FC<Props> = ({ register, errors, control }) => {
  const isUnabStudent = useWatch({
    control,
    name: "isUnabStudent",
  });

  return (
    <>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isUnabStudent"
          {...register("isUnabStudent")}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="isUnabStudent" className="ml-2 block text-sm text-gray-900">
          ¿Perteneces a la Universidad Nacional Guillermo Brown (UNaB)?
        </label>
      </div>
      {!isUnabStudent && (
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700">¿En qué institución estudias?</label>
          <input type="text" id="institution" {...register("institution")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution?.message?.toString()}</p>}
        </div>
      )}
      <div>
        <label htmlFor="career" className="block text-sm font-medium text-gray-700">¿En qué carrera estás cursando actualmente?</label>
        <input type="text" id="career" {...register("career")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.career && <p className="text-red-500 text-xs mt-1">{errors.career?.message?.toString()}</p>}
      </div>
      <div>
        <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700">¿En qué año te encuentras?</label>
        <input type="number" id="yearOfStudy" {...register("yearOfStudy", { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.yearOfStudy && <p className="text-red-500 text-xs mt-1">{errors.yearOfStudy?.message?.toString()}</p>}
      </div>
    </>
  );
};

export default CamposEstudiante;
