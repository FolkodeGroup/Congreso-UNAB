import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { inscribirIndividual, inscribirGrupal } from '../lib/api'; // Importar funciones de la API

const participantSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  dni: z.string().min(1, "El DNI es requerido"),
  email: z.string().email("Debe ser un correo electrónico válido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  // Common fields for all profiles
});

const studentSchema = participantSchema.extend({
  university: z.string().min(1, "La universidad es requerida"),
  studentId: z.string().min(1, "El número de estudiante es requerido"),
});

const teacherSchema = participantSchema.extend({
  institution: z.string().min(1, "La institución es requerida"),
});

const professionalSchema = participantSchema.extend({
  occupation: z.string().min(1, "La ocupación es requerida"),
  company: z.string().min(1, "La empresa es requerida"),
});

const groupMemberSchema = z.object({
  firstName: z.string().min(1, "El nombre del integrante es requerido"),
  lastName: z.string().min(1, "El apellido del integrante es requerido"),
  dni: z.string().min(1, "El DNI del integrante es requerido"),
  email: z.string().email("Debe ser un correo electrónico válido"),
});

const groupRepresentativeSchema = participantSchema.extend({
  groupName: z.string().min(1, "El nombre del grupo es requerido"),
  groupMembers: z.array(groupMemberSchema).min(1, "Debe haber al menos un integrante en el grupo"),
});

const formSchema = z.discriminatedUnion("profileType", [
  z.object({ profileType: z.literal("visitor") }).merge(participantSchema),
  z.object({ profileType: z.literal("student") }).merge(studentSchema),
  z.object({ profileType: z.literal("teacher") }).merge(teacherSchema),
  z.object({ profileType: z.literal("professional") }).merge(professionalSchema),
  z.object({ profileType: z.literal("groupRepresentative") }).merge(groupRepresentativeSchema),
]);

type FormData = z.infer<typeof formSchema>;

const RegistroParticipantes: React.FC = () => {
  const [profileType, setProfileType] = useState<FormData["profileType"]>("visitor");

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { profileType: "visitor", groupMembers: [{ firstName: "", lastName: "", dni: "", email: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "groupMembers",
  });

  const onSubmit = async (data: FormData) => {
    try {
      let response;
      if (data.profileType === "groupRepresentative") {
        response = await inscribirGrupal(data);
      } else {
        response = await inscribirIndividual(data);
      }

      console.log("Respuesta del servidor:", response);
      alert("¡Inscripción exitosa!");
      reset(); // Limpia el formulario después de un envío exitoso
    } catch (error) {
      console.error("Error en la inscripción:", error);
      alert("Hubo un error al procesar la inscripción. Por favor, inténtalo de nuevo.");
    }
  };

  console.log("Rendering with profileType:", profileType); // Linea de depuración

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inscripción para Participantes</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="profileType" className="block text-sm font-medium text-gray-700">Tipo de Participante</label>
          <select
            id="profileType"
            {...register("profileType")}
            onChange={(e) => setProfileType(e.target.value as FormData["profileType"]) }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="visitor">Visitante</option>
            <option value="student">Estudiante</option>
            <option value="teacher">Docente</option>
            <option value="professional">Profesional</option>
            <option value="groupRepresentative">Representante de Grupo</option>
          </select>
        </div>

        {/* Common Fields */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" id="firstName" {...register("firstName")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
          <input type="text" id="lastName" {...register("lastName")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
        </div>
        <div>
          <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
          <input type="text" id="dni" {...register("dni")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" {...register("email")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input type="text" id="phone" {...register("phone")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Conditional Fields */}
        {profileType === "student" && (
          <>
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">Universidad</label>
              <input type="text" id="university" {...register("university")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university.message}</p>}
            </div>
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Número de Estudiante</label>
              <input type="text" id="studentId" {...register("studentId")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>}
            </div>
          </>
        )}

        {profileType === "teacher" && (
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Institución</label>
            <input type="text" id="institution" {...register("institution")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution.message}</p>}
          </div>
        )}

        {profileType === "professional" && (
          <>
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Ocupación</label>
              <input type="text" id="occupation" {...register("occupation")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation.message}</p>}
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">Empresa</label>
              <input type="text" id="company" {...register("company")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
            </div>
          </>
        )}

        {profileType === "groupRepresentative" && (
          <>
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">Nombre del Grupo</label>
              <input type="text" id="groupName" {...register("groupName")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              {errors.groupName && <p className="text-red-500 text-xs mt-1">{errors.groupName.message}</p>}
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-2">Integrantes del Grupo</h2>
            {fields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md space-y-2">
                <h3 className="font-medium">Integrante #{index + 1}</h3>
                <div>
                  <label htmlFor={`groupMembers.${index}.firstName`} className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input type="text" id={`groupMembers.${index}.firstName`} {...register(`groupMembers.${index}.firstName`)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                  {errors.groupMembers?.[index]?.firstName && <p className="text-red-500 text-xs mt-1">{errors.groupMembers[index]?.firstName?.message}</p>}
                </div>
                <div>
                  <label htmlFor={`groupMembers.${index}.lastName`} className="block text-sm font-medium text-gray-700">Apellido</label>
                  <input type="text" id={`groupMembers.${index}.lastName`} {...register(`groupMembers.${index}.lastName`)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                  {errors.groupMembers?.[index]?.lastName && <p className="text-red-500 text-xs mt-1">{errors.groupMembers[index]?.lastName?.message}</p>}
                </div>
                <div>
                  <label htmlFor={`groupMembers.${index}.dni`} className="block text-sm font-medium text-gray-700">DNI</label>
                  <input type="text" id={`groupMembers.${index}.dni`} {...register(`groupMembers.${index}.dni`)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                  {errors.groupMembers?.[index]?.dni && <p className="text-red-500 text-xs mt-1">{errors.groupMembers[index]?.dni?.message}</p>}
                </div>
                <div>
                  <label htmlFor={`groupMembers.${index}.email`} className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id={`groupMembers.${index}.email`} {...register(`groupMembers.${index}.email`)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                  {errors.groupMembers?.[index]?.email && <p className="text-red-500 text-xs mt-1">{errors.groupMembers[index]?.email?.message}</p>}
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
        )}

        <button
          type="submit"
          className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Registrar Participante
        </button>
      </form>
    </div>
  );
};

export default RegistroParticipantes;
