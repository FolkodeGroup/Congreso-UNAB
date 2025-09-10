import React, { useState } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { inscribirIndividual, inscribirGrupal } from '../lib/api';
import CamposEstudiante from '../components/formularios/CamposEstudiante';
import CamposDocente from '../components/formularios/CamposDocente';
import CamposProfesional from '../components/formularios/CamposProfesional';
import CamposRepresentante from '../components/formularios/CamposRepresentante';

const participantSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  dni: z.string().min(1, "El DNI es requerido"),
  email: z.string().email("Debe ser un correo electrónico válido"),
  phone: z.string().min(1, "El teléfono es requerido"),
});

const studentSchema = participantSchema.extend({
  profileType: z.literal("student"),
  isUnabStudent: z.boolean().optional(),
  institution: z.string().optional(),
  career: z.string().optional(),
  yearOfStudy: z.number().optional(),
});

const teacherSchema = participantSchema.extend({
  profileType: z.literal("teacher"),
  institution: z.string().min(1, "La institución es requerida"),
  careerTaught: z.string().min(1, "La carrera que dicta es requerida para docentes."),
});

const professionalSchema = participantSchema.extend({
  profileType: z.literal("professional"),
  workArea: z.string().min(1, "El área de trabajo es requerida"),
  occupation: z.string().min(1, "El cargo es requerido"),
});

const groupMemberSchema = z.object({
  firstName: z.string().min(1, "El nombre del integrante es requerido"),
  lastName: z.string().min(1, "El apellido del integrante es requerido"),
  dni: z.string().min(1, "El DNI del integrante es requerido"),
  email: z.string().email("Debe ser un correo electrónico válido"),
});

const groupRepresentativeSchema = participantSchema.extend({
  profileType: z.literal("groupRepresentative"),
  groupName: z.string().min(1, "El nombre del grupo es requerido"),
  groupMunicipality: z.string().optional(),
  institutionOrWorkplace: z.string().optional(),
  groupMembers: z.array(groupMemberSchema).min(1, "Debe haber al menos un integrante en el grupo"),
});

const visitorSchema = participantSchema.extend({
  profileType: z.literal("visitor"),
});

const formSchema = z.discriminatedUnion("profileType", [
  visitorSchema,
  studentSchema,
  teacherSchema,
  professionalSchema,
  groupRepresentativeSchema,
]).superRefine((data, ctx) => {
  if (data.profileType === "student") {
    if (data.isUnabStudent === false && !data.institution) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La institución es requerida si no perteneces a la UNaB.",
        path: ["institution"],
      });
    }
    if (!data.career) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La carrera es requerida para estudiantes.",
        path: ["career"],
      });
    }
    if (!data.yearOfStudy) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El año de cursada es requerido para estudiantes.",
        path: ["yearOfStudy"],
      });
    }
  }
});

type FormData = z.infer<typeof formSchema>;

const RegistroParticipantes: React.FC = () => {
  const [profileType, setProfileType] = useState<FormData["profileType"]>("visitor");

  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { profileType: "visitor" },
  });

  React.useEffect(() => {
    const currentValues = watch();
    
    if (profileType === "groupRepresentative") {
      reset({
        ...currentValues,
        profileType,
        groupMembers: [{ firstName: "", lastName: "", dni: "", email: "" }],
      } as FormData);
    } else if (profileType === "student") {
      reset({
        ...currentValues,
        profileType,
        isUnabStudent: false,
      } as FormData);
    } else {
      reset({
        firstName: currentValues.firstName || "",
        lastName: currentValues.lastName || "",
        dni: currentValues.dni || "",
        email: currentValues.email || "",
        phone: currentValues.phone || "",
        profileType,
      } as FormData);
    }
  }, [profileType, reset, watch]);

  const onSubmit = async (data: FormData) => {
    try {
      let response;
      if (data.profileType === "groupRepresentative") {
        const dataToSend = {
          ...data,
          group_size: data.groupMembers ? data.groupMembers.length : 0,
        };
        response = await inscribirGrupal(dataToSend);
      } else {
        response = await inscribirIndividual(data);
      }

      console.log("Respuesta del servidor:", response);
      alert("¡Inscripción exitosa!");
      reset();
    } catch (error) {
      console.error("Error en la inscripción:", error);
      alert("Hubo un error al procesar la inscripción. Por favor, inténtalo de nuevo.");
    }
  };

  const renderConditionalFields = () => {
    switch (profileType) {
      case 'student':
        return <CamposEstudiante register={register} errors={errors} control={control} />;
      case 'teacher':
        return <CamposDocente register={register} errors={errors} />;
      case 'professional':
        return <CamposProfesional register={register} errors={errors} />;
      case 'groupRepresentative':
        return <CamposRepresentante register={register} errors={errors} control={control} />;
      default:
        return null;
    }
  };

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
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName?.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
          <input type="text" id="lastName" {...register("lastName")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName?.message}</p>}
        </div>
        <div>
          <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
          <input type="text" id="dni" {...register("dni")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni?.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" {...register("email")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input type="text" id="phone" {...register("phone")} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone?.message}</p>}
        </div>

        {renderConditionalFields()}

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
