import React from 'react';
import { useFieldArray, UseFormRegister, FieldErrors } from 'react-hook-form';

interface Props {
  control: any;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const ManejoGrupos: React.FC<Props> = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "groupMembers",
  });

  return (
    <>
      <h2 className="text-xl font-semibold mt-6 mb-2">Integrantes del Grupo</h2>
      {fields.map((item, index) => (
        <div key={item.id} className="border p-4 rounded-md space-y-2">
          <h3 className="font-medium">Integrante #{index + 1}</h3>
          <div>
            <label htmlFor={`groupMembers.${index}.firstName`} className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" id={`groupMembers.${index}.firstName`} {...register(`groupMembers.${index}.firstName`)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            {errors.groupMembers?.[index]?.firstName && <p className="text-red-500 text-xs mt-1">{errors.groupMembers[index].firstName.message}</p>}
          </div>
          <div>
            <label htmlFor={`groupMembers.${index}.lastName`} className="block text-sm font-medium text-gray-700">Apellido</label>
            <input type="text" id={`groupMembers.${index}.lastName`} {...register(`groupMembers.${index}.lastName`)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            {errors.groupMembers?.[index]?.lastName && <p className="text-red-500 text-xs mt-1">{errors.groupMembers[index].lastName.message}</p>}
          </div>
          <div>
            <label htmlFor={`groupMembers.${index}.dni`} className="block text-sm font-medium text-gray-700">DNI</label>
            <input type="text" id={`groupMembers.${index}.dni`} {...register(`groupMembers.${index}.dni`)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            {errors.groupMembers?.[index]?.dni && <p className="text-red-500 text-xs mt-1">{errors.groupMembers[index].dni.message}</p>}
          </div>
          <div>
            <label htmlFor={`groupMembers.${index}.email`} className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id={`groupMembers.${index}.email`} {...register(`groupMembers.${index}.email`)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            {errors.groupMembers?.[index]?.email && <p className="text-red-500 text-xs mt-1">{errors.groupMembers[index].email.message}</p>}
          </div>
          <button type="button" onClick={() => remove(index)} className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md text-sm">Eliminar Integrante</button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ firstName: "", lastName: "", dni: "", email: "" })}
        className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
      >
        Agregar Integrante
      </button>
      {errors.groupMembers && <p className="text-red-500 text-xs mt-1">{errors.groupMembers.message}</p>}
    </>
  );
};

export default ManejoGrupos;
