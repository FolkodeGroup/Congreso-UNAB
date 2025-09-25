import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { inscribirIndividual, inscribirGrupal, inscribirParticipante } from "../lib/api";
import { 
  FormInput, 
  FormSelect, 
  FormButton, 
  FormCheckbox, 
  FormCard, 
  FormSection 
} from "@/components/ui/modern-form";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Users, 
  IdCard,
  CheckCircle
} from "lucide-react";

// Schemas de validación (mantenidos igual)
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
  groupSize: z.number().min(1, "Debe especificar al menos 1 integrante"),
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

    if (data.profileType === "groupRepresentative") {
      // Asegurar que la cantidad de miembros coincida con groupSize
      if (!Array.isArray(data.groupMembers) || data.groupMembers.length !== data.groupSize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La cantidad de integrantes debe coincidir con el número especificado",
          path: ["groupMembers"],
        });
      }
    }
  });

type FormData = z.infer<typeof formSchema>;

const RegistroParticipantes: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [profileType, setProfileType] = useState<FormData["profileType"]>("visitor");
  const [groupSize, setGroupSize] = useState<number>(0);
  const [hasDeclaredGroupSize, setHasDeclaredGroupSize] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
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
      setGroupSize(0);
      setHasDeclaredGroupSize(false);
      reset({
        ...currentValues,
        profileType,
        groupSize: 0,
        groupMembers: [],
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

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "groupMembers" as const,
  });

  // Función para actualizar la cantidad de miembros
  const handleGroupSizeChange = (newSize: number) => {
    setGroupSize(newSize);
    setValue("groupSize", newSize);
    
    // Crear array de miembros vacíos según la cantidad especificada
    const emptyMembers = Array(newSize).fill(null).map(() => ({
      firstName: "",
      lastName: "",
      dni: "",
      email: ""
    }));
    
    replace(emptyMembers);
    setHasDeclaredGroupSize(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      let response;
      if (data.profileType === "groupRepresentative") {
        // Validación adicional en el frontend
        const membersWithData = data.groupMembers.filter(member => 
          member.firstName && member.lastName && member.dni && member.email
        );
        
        if (membersWithData.length !== data.groupSize) {
          alert(`Error: Has especificado ${data.groupSize} integrantes, pero solo has completado los datos de ${membersWithData.length} integrantes. Por favor completa todos los campos de todos los integrantes.`);
          return;
        }
        // Estructura para el nuevo sistema de inscripción grupal
        // Enviamos directamente al endpoint de participantes
        const dataToSend = {
          first_name: data.firstName,
          last_name: data.lastName,
          dni: data.dni,
          email: data.email,
          phone: data.phone,
          profile_type: "GROUP_REPRESENTATIVE",
          group_name: data.groupName,
          group_municipality: data.groupMunicipality || "",
          group_size: data.groupSize,
          miembros_grupo_nuevos: data.groupMembers.map(member => ({
            first_name: member.firstName,
            last_name: member.lastName,
            dni: member.dni,
            email: member.email
          }))
        };

        // Usar la nueva función de API para inscripción con participantes
        response = await inscribirParticipante(dataToSend);
      } else {
        // Estructura esperada por el backend
        const profileTypeMap: Record<string, string> = {
          visitor: "VISITOR",
          student: "STUDENT",
          teacher: "TEACHER",
          professional: "PROFESSIONAL",
          groupRepresentative: "GROUP_REPRESENTATIVE",
        };
        
        const asistenteData: any = {
          first_name: data.firstName,
          last_name: data.lastName,
          dni: data.dni,
          email: data.email,
          phone: data.phone,
          profile_type: profileTypeMap[data.profileType as string] || data.profileType,
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
        setShowModal(true);
        reset();
        setGroupSize(0);
        setHasDeclaredGroupSize(false);
      } else {
        let errorMsg = "";
        if (response && response.message && typeof response.message === "object") {
          // Formatear errores de validación de manera más legible
          const errors = response.message;
          const errorList = Object.entries(errors).map(([field, msgs]: [string, any]) => {
            const fieldName = field === 'group_size' ? 'Cantidad de miembros' : 
                            field === 'miembros_grupo_nuevos' ? 'Datos de miembros' : field;
            const message = Array.isArray(msgs) ? msgs[0] : msgs;
            return `${fieldName}: ${message}`;
          });
          errorMsg = errorList.join('\n');
        } else if (response && typeof response === "object") {
          errorMsg = JSON.stringify(response);
        } else {
          errorMsg = response?.message || "No se pudo inscribir.";
        }
        alert("Error en la inscripción:\n\n" + errorMsg);
      }
    } catch (error) {
      console.error("Error en la inscripción:", error);
      alert("Hubo un error al procesar la inscripción. Por favor, inténtalo de nuevo.");
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
    <div className="form-bg-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Modal de confirmación modernizado */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => {
              setShowModal(false);
              navigate("/seleccion-registro");
            }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center transform animate-in slide-in-from-bottom-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">¡Inscripción Exitosa!</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Se ha enviado un email de confirmación a la dirección registrada con todos los detalles del congreso.
              </p>
              <FormButton
                onClick={() => {
                  setShowModal(false);
                  navigate("/seleccion-registro");
                }}
                fullWidth
              >
                Continuar
              </FormButton>
            </div>
          </div>
        )}

        <FormCard>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormSection title="Información Personal" description="Complete sus datos personales">
                <FormSelect
                label="Tipo de Participante"
                icon={<Users className="h-4 w-4" />}
                options={[
                  { value: "visitor", label: "Visitante" },
                  { value: "student", label: "Estudiante" },
                  { value: "teacher", label: "Docente" },
                  { value: "professional", label: "Profesional" },
                  { value: "groupRepresentative", label: "Representante de Grupo" }
                ]}
                {...register("profileType")}
                onChange={(e) => setProfileType(e.target.value as FormData["profileType"])}
                error={getErrorMessage("profileType")}
              />
                <FormInput
                  label="Nombre"
                  icon={<User className="h-4 w-4" />}
                  placeholder="Ingrese su nombre"
                  {...register("firstName")}
                  error={getErrorMessage("firstName")}
                />
                <FormInput
                  label="Apellido"
                  icon={<User className="h-4 w-4" />}
                  placeholder="Ingrese su apellido"
                  {...register("lastName")}
                  error={getErrorMessage("lastName")}
                />
                <FormInput
                  label="DNI"
                  icon={<IdCard className="h-4 w-4" />}
                  placeholder="12345678"
                  {...register("dni")}
                  error={getErrorMessage("dni")}
                />
                <FormInput
                  label="Teléfono"
                  icon={<Phone className="h-4 w-4" />}
                  placeholder="11 1234-5678"
                  {...register("phone")}
                  error={getErrorMessage("phone")}
                />
                <FormInput
                  type="email"
                  label="Email"
                  icon={<Mail className="h-4 w-4" />}
                  placeholder="correo@ejemplo.com"
                  hint="Se enviará la confirmación de inscripción a este email"
                  {...register("email")}
                  error={getErrorMessage("email")}
                />
            </FormSection>

            {/* Campos condicionales por tipo de participante */}
            {profileType === "student" && (
              <FormSection title="Información Académica" description="Complete los datos sobre su formación académica">
                <FormCheckbox
                  label="¿Perteneces a la Universidad Nacional Guillermo Brown (UNaB)?"
                  description="Marque si es estudiante de UNaB"
                  {...register("isUnabStudent")}
                  error={getErrorMessage("isUnabStudent")}
                />
                
                {!watch("isUnabStudent") && (
                  <div>
                    <label className="text-sm font-semibold text-slate-800 tracking-wide mb-2 block">
                      ¿En qué institución estudias?
                    </label>
                    <Select
                      options={instituciones}
                      placeholder="Buscar institución..."
                      onChange={(option) => setValue("institution", option?.value || "")}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      isClearable
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          height: '48px',
                          borderRadius: '12px',
                          border: state.isFocused ? '2px solid hsl(197, 88%, 44%)' : '1px solid hsl(214, 32%, 91%)',
                          boxShadow: state.isFocused ? '0 0 0 4px rgba(14, 165, 233, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            border: '1px solid hsl(214, 32%, 85%)'
                          }
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: 'hsl(215, 16%, 47%)'
                        })
                      }}
                    />
                    {getErrorMessage("institution") && (
                      <p className="text-xs text-red-600 font-medium mt-1">
                        {getErrorMessage("institution")}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="¿En qué carrera estás cursando actualmente?"
                    icon={<GraduationCap className="h-4 w-4" />}
                    placeholder="Ej: Ingeniería en Logística"
                    {...register("career")}
                    error={getErrorMessage("career")}
                  />
                  <FormInput
                    type="number"
                    label="¿En qué año te encuentras?"
                    icon={<GraduationCap className="h-4 w-4" />}
                    placeholder="1"
                    min="1"
                    max="6"
                    {...register("yearOfStudy", { valueAsNumber: true })}
                    error={getErrorMessage("yearOfStudy")}
                  />
                </div>
              </FormSection>
            )}

            {profileType === "teacher" && (
              <FormSection title="Información Profesional" description="Complete los datos sobre su actividad docente">
                <div>
                  <label className="text-sm font-semibold text-slate-800 tracking-wide mb-2 block">
                    Institución donde dicta clases
                  </label>
                  <Select
                    options={instituciones}
                    placeholder="Buscar institución..."
                    onChange={(option) => setValue("institution", option?.value || "")}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isClearable
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        height: '48px',
                        borderRadius: '12px',
                        border: state.isFocused ? '2px solid hsl(197, 88%, 44%)' : '1px solid hsl(214, 32%, 91%)',
                        boxShadow: state.isFocused ? '0 0 0 4px rgba(14, 165, 233, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          border: '1px solid hsl(214, 32%, 85%)'
                        }
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: 'hsl(215, 16%, 47%)'
                      })
                    }}
                  />
                  {getErrorMessage("institution") && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      {getErrorMessage("institution")}
                    </p>
                  )}
                </div>
                <FormInput
                  label="Carrera que dicta"
                  icon={<Building2 className="h-4 w-4" />}
                  placeholder="Ej: Ingeniería en Transporte"
                  {...register("careerTaught")}
                  error={getErrorMessage("careerTaught")}
                />
              </FormSection>
            )}

            {profileType === "professional" && (
              <FormSection title="Información Laboral" description="Complete los datos sobre su actividad profesional">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Área de trabajo"
                    icon={<Briefcase className="h-4 w-4" />}
                    placeholder="Ej: Logística, Supply Chain, Transporte"
                    {...register("workArea")}
                    error={getErrorMessage("workArea")}
                  />
                  <FormInput
                    label="Cargo"
                    icon={<Briefcase className="h-4 w-4" />}
                    placeholder="Ej: Gerente de Logística"
                    {...register("occupation")}
                    error={getErrorMessage("occupation")}
                  />
                </div>
              </FormSection>
            )}

            {profileType === "groupRepresentative" && (
              <FormSection title="Información del Grupo" description="Complete los datos del grupo que representa">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Nombre del grupo"
                    icon={<Users className="h-4 w-4" />}
                    placeholder="Ej: Asociación de Transportistas"
                    {...register("groupName")}
                    error={getErrorMessage("groupName")}
                  />
                  <FormInput
                    label="Municipio del grupo"
                    icon={<Building2 className="h-4 w-4" />}
                    placeholder="Opcional"
                    {...register("groupMunicipality")}
                    error={getErrorMessage("groupMunicipality")}
                  />
                </div>
                <FormInput
                  label="Institución o lugar de trabajo"
                  icon={<Building2 className="h-4 w-4" />}
                  placeholder="Opcional"
                  {...register("institutionOrWorkplace")}
                  error={getErrorMessage("institutionOrWorkplace")}
                />

                <div className="border-t border-slate-200 pt-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Cantidad de Integrantes</h3>
                    <div className="mb-4">
                      <label htmlFor="groupSize" className="block text-sm font-medium text-slate-700 mb-2">
                        ¿Cuántos integrantes tiene el grupo? (sin incluirse usted)
                      </label>
                      <input
                        id="groupSize"
                        type="number"
                        min="1"
                        max="50"
                        value={groupSize || ""}
                        onChange={(e) => {
                          const newSize = parseInt(e.target.value) || 0;
                          if (newSize > 0) {
                            handleGroupSizeChange(newSize);
                          }
                        }}
                        className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                    {getErrorMessage("groupSize") && (
                      <p className="text-xs text-red-600 font-medium">
                        {getErrorMessage("groupSize")}
                      </p>
                    )}
                  </div>

                  {hasDeclaredGroupSize && groupSize > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Datos de los {groupSize} Integrantes
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Complete los datos de cada integrante. Cada uno recibirá su QR y certificado individual.
                      </p>
                    </div>
                  )}

                  {hasDeclaredGroupSize && groupSize > 0 && (
                    <div className="space-y-6">
                      {fields.map((item, index) => {
                        const member = watch(`groupMembers.${index}`);
                        const completedFields = [member?.firstName, member?.lastName, member?.dni, member?.email].filter(Boolean).length;
                        const isComplete = completedFields === 4;
                        
                        return (
                        <div key={item.id} className={`rounded-xl p-6 space-y-4 ${isComplete ? 'bg-green-50 border-2 border-green-200' : 'bg-slate-50'}`}>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-900">
                              Integrante #{index + 1}
                              {isComplete && <span className="ml-2 text-green-600">✓</span>}
                            </h4>
                            <span className="text-sm text-slate-500">
                              {completedFields}/4 campos completos
                            </span>
                          </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            label="Nombre"
                            icon={<User className="h-4 w-4" />}
                            {...register(`groupMembers.${index}.firstName`)}
                            error={getErrorMessage(`groupMembers.${index}.firstName`)}
                          />
                          <FormInput
                            label="Apellido"
                            icon={<User className="h-4 w-4" />}
                            {...register(`groupMembers.${index}.lastName`)}
                            error={getErrorMessage(`groupMembers.${index}.lastName`)}
                          />
                          <FormInput
                            label="DNI"
                            icon={<IdCard className="h-4 w-4" />}
                            {...register(`groupMembers.${index}.dni`)}
                            error={getErrorMessage(`groupMembers.${index}.dni`)}
                          />
                          <FormInput
                            type="email"
                            label="Email"
                            icon={<Mail className="h-4 w-4" />}
                            {...register(`groupMembers.${index}.email`)}
                            error={getErrorMessage(`groupMembers.${index}.email`)}
                          />
                        </div>
                      </div>
                      );
                      })}
                    
                    {getErrorMessage("groupMembers") && (
                      <p className="text-xs text-red-600 font-medium mt-4">
                        {getErrorMessage("groupMembers")}
                      </p>
                    )}
                  </div>
                )}
                </div>
              </FormSection>
            )}

            {/* Botón de envío */}
            <div className="pt-6 border-t border-slate-200">
              <FormButton
                type="submit"
                fullWidth
                size="lg"
                isLoading={isSubmitting}
                icon={<CheckCircle className="h-5 w-5" />}
              >
                {isSubmitting ? "Registrando..." : "Registrar Participante"}
              </FormButton>
            </div>
          </form>
        </FormCard>
      </div>
    </div>
  );
};

export default RegistroParticipantes;
