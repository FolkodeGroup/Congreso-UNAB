import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { inscribirIndividual, inscribirGrupal } from "../lib/api";
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
  groupMembers: z
    .array(groupMemberSchema)
    .min(1, "Debe haber al menos un integrante en el grupo"),
});

const visitorSchema = participantSchema.extend({
  profileType: z.literal("visitor"),
});

const pressSchema = participantSchema.extend({
  profileType: z.literal("PRESS"),
});

const formSchema = z
  .discriminatedUnion("profileType", [
    visitorSchema,
    studentSchema,
    teacherSchema,
    professionalSchema,
    pressSchema,
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
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [profileType, setProfileType] = useState<FormData["profileType"]>("visitor");

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
        const profileTypeMap: Record<string, string> = {
          visitor: "VISITOR",
          student: "STUDENT",
          teacher: "TEACHER",
          professional: "PROFESSIONAL",
          press: "PRESS",
          groupRepresentative: "GROUP_REPRESENTATIVE",
        };
        
        const asistenteData: any = {
          first_name: data.firstName,
          last_name: data.lastName,
          dni: data.dni,
          email: data.email,
          phone: data.phone,
          profile_type: profileTypeMap[data.profileType?.toLowerCase()] || data.profileType,
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
      } else {
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
    <div className="min-h-screen form-bg-gradient py-12 px-4 sm:px-6 lg:px-8">
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

        <FormCard 
          title="Inscripción para Participantes"
          description="Complete el formulario con sus datos para registrarse en el Congreso de Logística y Transporte UNaB 2025"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Tipo de Participante */}
            <FormSection title="Información del Participante" description="Seleccione el tipo de participante y complete sus datos personales">
              <FormSelect
                label="Tipo de Participante"
                icon={<Users className="h-4 w-4" />}
                options={[
                  { value: "visitor", label: "Visitante" },
                  { value: "student", label: "Estudiante" },
                  { value: "teacher", label: "Docente" },
                  { value: "professional", label: "Profesional" },
                  { value: "PRESS", label: "Prensa" },
                  { value: "groupRepresentative", label: "Representante de Grupo" }
                ]}
                {...register("profileType")}
                onChange={(e) => setProfileType(e.target.value as FormData["profileType"])}
                error={errors.profileType?.message}
              />
            </FormSection>

            {/* Datos Personales */}
            <FormSection title="Datos Personales">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Nombre"
                  icon={<User className="h-4 w-4" />}
                  placeholder="Ingrese su nombre"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                />
                <FormInput
                  label="Apellido"
                  icon={<User className="h-4 w-4" />}
                  placeholder="Ingrese su apellido"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="DNI"
                  icon={<IdCard className="h-4 w-4" />}
                  placeholder="12345678"
                  {...register("dni")}
                  error={errors.dni?.message}
                />
                <FormInput
                  label="Teléfono"
                  icon={<Phone className="h-4 w-4" />}
                  placeholder="11 1234-5678"
                  {...register("phone")}
                  error={errors.phone?.message}
                />
              </div>
              <FormInput
                type="email"
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                placeholder="correo@ejemplo.com"
                hint="Se enviará la confirmación de inscripción a este email"
                {...register("email")}
                error={errors.email?.message}
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Integrantes del Grupo</h3>
                    <FormButton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ firstName: "", lastName: "", dni: "", email: "" })}
                    >
                      + Agregar Integrante
                    </FormButton>
                  </div>

                  <div className="space-y-6">
                    {fields.map((item, index) => (
                      <div key={item.id} className="bg-slate-50 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-900">Integrante #{index + 1}</h4>
                          <FormButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remover
                          </FormButton>
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
                    ))}
                  </div>

                  {getErrorMessage("groupMembers") && (
                    <p className="text-xs text-red-600 font-medium mt-4">
                      {getErrorMessage("groupMembers")}
                    </p>
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
