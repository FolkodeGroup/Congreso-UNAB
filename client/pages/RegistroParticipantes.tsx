import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { inscribirIndividual, inscribirGrupal } from "../lib/api"; // Importar funciones de la API

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
  careerTaught: z
    .string()
    .min(1, "La carrera que dicta es requerida para docentes."),
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
  groupMembers: z
    .array(groupMemberSchema)
    .min(1, "Debe haber al menos un integrante en el grupo"),
});

const visitorSchema = participantSchema.extend({
  profileType: z.literal("visitor"),
});

const formSchema = z
  .discriminatedUnion("profileType", [
    visitorSchema,
    studentSchema,
    teacherSchema,
    professionalSchema,
    groupRepresentativeSchema,
  ])
  .superRefine((data, ctx) => {
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
  const [profileType, setProfileType] =
    useState<FormData["profileType"]>("visitor");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { profileType: "visitor" },
  });

  // Cargar instituciones desde JSON
  const [instituciones, setInstituciones] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    import("../data/instituciones-argentina.json").then((data) => {
      setInstituciones(
        (data.default || data).map((nombre: string) => ({ label: nombre, value: nombre }))
      );
    });
  }, []);

  // Watch for profileType changes to conditionally reset fields
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "groupMembers" as const,
  });

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
        // Estructura esperada por el backend
        // Traducción de profile_type a los valores esperados por el backend
        const profileTypeMap: Record<string, string> = {
          visitor: "VISITOR",
          student: "STUDENT",
          teacher: "TEACHER",
          professional: "PROFESSIONAL",
          groupRepresentative: "GROUP_REPRESENTATIVE",
        };
        
        // Preparar datos base del asistente
        const asistenteData: any = {
          first_name: data.firstName,
          last_name: data.lastName,
          dni: data.dni,
          email: data.email,
          phone: data.phone,
          profile_type: profileTypeMap[data.profileType] || data.profileType,
        };

        // Agregar campos específicos según el tipo de participante
        if (data.profileType === "student") {
          asistenteData.is_unab_student = data.isUnabStudent || false;
          if (data.institution) asistenteData.institution = data.institution;
          if (data.career) asistenteData.career = data.career;
          if (data.yearOfStudy) asistenteData.year_of_study = data.yearOfStudy;
        } else if (data.profileType === "teacher") {
          if (data.institution) asistenteData.institution = data.institution;
          if (data.careerTaught) asistenteData.career_taught = data.careerTaught;
        } else if (data.profileType === "professional") {
          if (data.workArea) asistenteData.work_area = data.workArea;
          if (data.occupation) asistenteData.occupation = data.occupation;
        }

        const dataToSend = {
          asistente: asistenteData,
        };
        response = await inscribirIndividual(dataToSend);
      }

      if (response && response.status === "success") {
        alert("¡Inscripción exitosa!");
        reset();
      } else {
        // Mostrar el error real del backend
        let errorMsg = "";
        if (response && typeof response === "object") {
          errorMsg = JSON.stringify(response);
        } else {
          errorMsg = response?.message || "No se pudo inscribir.";
        }
        alert("Error: " + errorMsg);
      }
    } catch (error) {
      console.error("Error en la inscripción:", error);
      alert(
        "Hubo un error al procesar la inscripción. Por favor, inténtalo de nuevo.",
      );
    }
  };

  // Helper function to safely access error messages
  const getErrorMessage = (fieldPath: string): string | undefined => {
    const pathArray = fieldPath.split(".");
    let current: any = errors;

    for (const key of pathArray) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current?.message;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Inscripción para Participantes
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="profileType"
            className="block text-sm font-medium text-gray-700"
          >
            Tipo de Participante
          </label>
          <select
            id="profileType"
            {...register("profileType")}
            onChange={(e) =>
              setProfileType(e.target.value as FormData["profileType"])
            }
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
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName?.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Apellido
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName?.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="dni"
            className="block text-sm font-medium text-gray-700"
          >
            DNI
          </label>
          <input
            type="text"
            id="dni"
            {...register("dni")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.dni && (
            <p className="text-red-500 text-xs mt-1">{errors.dni?.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Teléfono
          </label>
          <input
            type="text"
            id="phone"
            {...register("phone")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone?.message}</p>
          )}
        </div>

        {/* Conditional Fields */}
        {profileType === "student" && (
          <>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isUnabStudent"
                {...register("isUnabStudent")}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor="isUnabStudent"
                className="ml-2 block text-sm text-gray-900"
              >
                ¿Perteneces a la Universidad Nacional Guillermo Brown (UNaB)?
              </label>
            </div>
            {!watch("isUnabStudent") && (
              <div>
                <label
                  htmlFor="institution"
                  className="block text-sm font-medium text-gray-700"
                >
                  ¿En qué institución estudias?
                </label>
                <Select
                  id="institution"
                  options={instituciones}
                  placeholder="Buscar institución..."
                  onChange={(option) => setValue("institution", option?.value || "")}
                  className="mt-1"
                  isClearable
                />
                {getErrorMessage("institution") && (
                  <p className="text-red-500 text-xs mt-1">
                    {getErrorMessage("institution")}
                  </p>
                )}
              </div>
            )}
            <div>
              <label
                htmlFor="career"
                className="block text-sm font-medium text-gray-700"
              >
                ¿En qué carrera estás cursando actualmente?
              </label>
              <input
                type="text"
                id="career"
                {...register("career")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {getErrorMessage("career") && (
                <p className="text-red-500 text-xs mt-1">
                  {getErrorMessage("career")}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="yearOfStudy"
                className="block text-sm font-medium text-gray-700"
              >
                ¿En qué año te encuentras?
              </label>
              <input
                type="number"
                id="yearOfStudy"
                {...register("yearOfStudy", { valueAsNumber: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {getErrorMessage("yearOfStudy") && (
                <p className="text-red-500 text-xs mt-1">
                  {getErrorMessage("yearOfStudy")}
                </p>
              )}
            </div>
          </>
        )}

        {profileType === "teacher" && (
          <>
            <div>
              <label
                htmlFor="institution"
                className="block text-sm font-medium text-gray-700"
              >
                Institución
              </label>
              <input
                type="text"
                id="institution"
                {...register("institution")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {getErrorMessage("institution") && (
                <p className="text-red-500 text-xs mt-1">
                  {getErrorMessage("institution")}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="careerTaught"
                className="block text-sm font-medium text-gray-700"
              >
                Carrera que dicta
              </label>
              <input
                type="text"
                id="careerTaught"
                {...register("careerTaught")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {getErrorMessage("careerTaught") && (
                <p className="text-red-500 text-xs mt-1">
                  {getErrorMessage("careerTaught")}
                </p>
              )}
            </div>
          </>
        )}

        {profileType === "professional" && (
          <>
            <div>
              <label
                htmlFor="workArea"
                className="block text-sm font-medium text-gray-700"
              >
                Área de trabajo
              </label>
              <input
                type="text"
                id="workArea"
                {...register("workArea")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {getErrorMessage("workArea") && (
                <p className="text-red-500 text-xs mt-1">
                  {getErrorMessage("workArea")}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium text-gray-700"
              >
                Cargo
              </label>
              <input
                type="text"
                id="occupation"
                {...register("occupation")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {getErrorMessage("occupation") && (
                <p className="text-red-500 text-xs mt-1">
                  {getErrorMessage("occupation")}
                </p>
              )}
            </div>
          </>
        )}

        {profileType === "groupRepresentative" && (
          <>
            <div>
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre del Grupo
              </label>
              <input
                type="text"
                id="groupName"
                {...register("groupName")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {getErrorMessage("groupName") && (
                <p className="text-red-500 text-xs mt-1">
                  {getErrorMessage("groupName")}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="groupMunicipality"
                className="block text-sm font-medium text-gray-700"
              >
                ¿A qué partido pertenece tu institución? (Si aplica)
              </label>
              <input
                type="text"
                id="groupMunicipality"
                {...register("groupMunicipality")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {getErrorMessage("groupMunicipality") && (
                <p className="text-red-500 text-xs mt-1">
                  {getErrorMessage("groupMunicipality")}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="institutionOrWorkplace"
                className="block text-sm font-medium text-gray-700"
              >
                ¿En qué institución estudias o trabajas? (Si aplica)
              </label>
              <input
                type="text"
                id="institutionOrWorkplace"
                {...register("institutionOrWorkplace")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {getErrorMessage("institutionOrWorkplace") && (
                <p className="text-red-500 text-xs mt-1">
                  {getErrorMessage("institutionOrWorkplace")}
                </p>
              )}
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-2">
              Integrantes del Grupo
            </h2>
            {fields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md space-y-2">
                <h3 className="font-medium">Integrante #{index + 1}</h3>
                <div>
                  <label
                    htmlFor={`groupMembers.${index}.firstName`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id={`groupMembers.${index}.firstName`}
                    {...register(`groupMembers.${index}.firstName`)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  {getErrorMessage(`groupMembers.${index}.firstName`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getErrorMessage(`groupMembers.${index}.firstName`)}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor={`groupMembers.${index}.lastName`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    id={`groupMembers.${index}.lastName`}
                    {...register(`groupMembers.${index}.lastName`)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  {getErrorMessage(`groupMembers.${index}.lastName`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getErrorMessage(`groupMembers.${index}.lastName`)}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor={`groupMembers.${index}.dni`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    DNI
                  </label>
                  <input
                    type="text"
                    id={`groupMembers.${index}.dni`}
                    {...register(`groupMembers.${index}.dni`)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  {getErrorMessage(`groupMembers.${index}.dni`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getErrorMessage(`groupMembers.${index}.dni`)}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor={`groupMembers.${index}.email`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id={`groupMembers.${index}.email`}
                    {...register(`groupMembers.${index}.email`)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  {getErrorMessage(`groupMembers.${index}.email`) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getErrorMessage(`groupMembers.${index}.email`)}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                >
                  Eliminar Integrante
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                append({ firstName: "", lastName: "", dni: "", email: "" })
              }
              className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
            >
              Agregar Integrante
            </button>
            {getErrorMessage("groupMembers") && (
              <p className="text-red-500 text-xs mt-1">
                {getErrorMessage("groupMembers")}
              </p>
            )}
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
