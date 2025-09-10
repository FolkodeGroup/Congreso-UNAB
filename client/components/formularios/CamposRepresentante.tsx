import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import ManejoGrupos from './ManejoGrupos';

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: any;
}

const CamposRepresentante: React.FC<Props> = ({ register, errors, control }) => {
  return (
    <>
      <div>
        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">Nombre del Grupo</label>
        <input type="text" id="groupName" {...register("groupName")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.groupName && <p className="text-red-500 text-xs mt-1">{errors.groupName?.message?.toString()}</p>}
      </div>
      <div>
        <label htmlFor="groupMunicipality" className="block text-sm font-medium text-gray-700">¿A qué partido pertenece tu institución? (Si aplica)</label>
        <input type="text" id="groupMunicipality" {...register("groupMunicipality")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.groupMunicipality && <p className="text-red-500 text-xs mt-1">{errors.groupMunicipality?.message?.toString()}</p>}
      </div>
      <div>
        <label htmlFor="institutionOrWorkplace" className="block text-sm font-medium text-gray-700">¿En qué institución estudias o trabajas? (Si aplica)</label>
        <input type="text" id="institutionOrWorkplace" {...register("institutionOrWorkplace")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        {errors.institutionOrWorkplace && <p className="text-red-500 text-xs mt-1">{errors.institutionOrWorkplace?.message?.toString()}</p>}
      </div>
      <ManejoGrupos control={control} register={register} errors={errors} />
    </>
  );
};

export default CamposRepresentante;
