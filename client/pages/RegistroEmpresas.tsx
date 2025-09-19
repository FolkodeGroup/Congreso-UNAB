import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  FormInput, 
  FormButton, 
  FormCard, 
  FormSection,
  FormFileInput,
  FormTextArea
} from "@/components/ui/modern-form";
import { 
  Building2,
  Mail, 
  Phone, 
  MapPin, 
  User, 
  FileText,
  CheckCircle,
  Briefcase,
  Crown,
  Users
} from "lucide-react";

const companyRegistrationSchema = z.object({
  companyName: z.string().min(1, "El nombre de la empresa es requerido"),
  companyCUIT: z.string().min(1, "El CUIT de la empresa es requerido"),
  companyAddress: z.string().min(1, "La dirección de la empresa es requerida"),
  companyPhone: z.string().min(1, "El teléfono de la empresa es requerido"),
  companyEmail: z.string().email("Debe ser un correo electrónico válido"),
  contactPersonName: z.string().min(1, "El nombre de la persona de contacto es requerido"),
  contactPersonEmail: z.string().email("Debe ser un correo electrónico válido"),
  contactPersonPhone: z.string().min(1, "El teléfono de la persona de contacto es requerido"),
  cargoContacto: z.string().min(1, "El cargo en la empresa es requerido"),
  logo: z.any().optional(),
  participationOptions: z.array(z.string()).optional(),
  companyDescription: z.string().optional(),
  website: z.string().optional(),
});

type CompanyRegistrationFormData = z.infer<typeof companyRegistrationSchema>;

const RegistroEmpresas: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [participationTypes, setParticipationTypes] = useState<string[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CompanyRegistrationFormData>({
    resolver: zodResolver(companyRegistrationSchema),
  });

  const participationOptions = [
    { id: "stand", label: "Stand/Exhibición", description: "Espacio para mostrar productos y servicios" },
    { id: "sponsorship", label: "Patrocinio", description: "Apoyo financiero con beneficios de marca" },
    { id: "speaking", label: "Ponencia/Charla", description: "Presentación técnica o caso de éxito" },
    { id: "visitor", label: "Visitante", description: "Participación como asistente al evento" },
  ];



  const onSubmit = async (data: CompanyRegistrationFormData) => {
    // Crear FormData para enviar datos y archivo
    const formData = new FormData();
    formData.append("nombre_empresa", data.companyName);
    formData.append("cuit", data.companyCUIT);
    formData.append("direccion", data.companyAddress);
    formData.append("telefono_empresa", data.companyPhone);
    formData.append("email_empresa", data.companyEmail);
    // Normaliza el sitio web: agrega https:// si falta
    let sitioWeb = data.website || "";
    if (sitioWeb && !/^https?:\/\//i.test(sitioWeb)) {
      sitioWeb = "https://" + sitioWeb;
    }
    formData.append("sitio_web", sitioWeb);
    formData.append("descripcion", data.companyDescription || "");
    formData.append("nombre_contacto", data.contactPersonName);
    formData.append("email_contacto", data.contactPersonEmail);
    formData.append("celular_contacto", data.contactPersonPhone);
    formData.append("cargo_contacto", data.cargoContacto);
    
    // Usar participationTypes directamente - es un array simple
    const opciones = participationTypes || [];
    console.log("Opciones de participación:", opciones);
    formData.append("participacion_opciones", JSON.stringify(opciones));
    formData.append("participacion_otra", "");
    if (data.logo && data.logo[0]) {
      formData.append("logo", data.logo[0]);
    }
    try {
      const response = await import("@/lib/api").then(api => api.registrarEmpresa(formData));
      if (response.status === "success") {
        setShowModal(true);
        reset();
        setParticipationTypes([]);
      } else {
        let errorMsg = "Intente nuevamente.";
        if (response.message) {
          if (typeof response.message === "object") {
            errorMsg = JSON.stringify(response.message, null, 2);
          } else {
            errorMsg = response.message;
          }
        }
        alert("Error al registrar la empresa: " + errorMsg);
      }
    } catch (err) {
      alert("Error de conexión al registrar la empresa. " + (err?.message || ""));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      window.location.href = "/seleccion-registro";
    }, 300);
  };

  return (
    <div className="min-h-screen form-bg-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Modal de confirmación modernizado */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center transform animate-in slide-in-from-bottom-4 duration-300"
              onClick={e => e.stopPropagation()}
            >
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">¡Inscripción Exitosa!</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Su empresa ha sido registrada exitosamente. Nos contactaremos pronto para coordinar los detalles de su participación.
              </p>
              <FormButton onClick={handleCloseModal} fullWidth>
                Continuar
              </FormButton>
            </div>
          </div>
        )}

        <FormCard 
          title="Registro Empresarial"
          description="Registre su empresa para participar como expositor, patrocinador o ponente en el Congreso de Logística y Transporte UNaB 2025"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Información de la Empresa */}
            <FormSection 
              title="Información de la Empresa" 
              description="Complete los datos principales de su organización"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormInput
                  label="Nombre de la Empresa"
                  icon={<Building2 className="h-4 w-4" />}
                  placeholder="Ej: Logística Integral S.A."
                  {...register("companyName")}
                  error={errors.companyName?.message}
                />
                <FormInput
                  label="CUIT"
                  icon={<FileText className="h-4 w-4" />}
                  placeholder="20-12345678-9"
                  {...register("companyCUIT")}
                  error={errors.companyCUIT?.message}
                />
              </div>
              
              <FormInput
                label="Dirección"
                icon={<MapPin className="h-4 w-4" />}
                placeholder="Av. Corrientes 1234, CABA"
                {...register("companyAddress")}
                error={errors.companyAddress?.message}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  type="email"
                  label="Email Corporativo"
                  icon={<Mail className="h-4 w-4" />}
                  placeholder="contacto@empresa.com"
                  {...register("companyEmail")}
                  error={errors.companyEmail?.message}
                />
                <FormInput
                  type="tel"
                  label="Teléfono"
                  icon={<Phone className="h-4 w-4" />}
                  placeholder="11 1234-5678"
                  {...register("companyPhone")}
                  error={errors.companyPhone?.message}
                />
              </div>

              <FormInput
                label="Sitio Web"
                icon={<Building2 className="h-4 w-4" />}
                placeholder="https://www.empresa.com (opcional)"
                {...register("website")}
                error={errors.website?.message}
              />

              <FormTextArea
                label="Descripción de la Empresa"
                placeholder="Breve descripción de la empresa, productos y servicios (opcional)"
                {...register("companyDescription")}
                error={errors.companyDescription?.message}
              />
            </FormSection>

            {/* Persona de Contacto */}
            <FormSection 
              title="Persona de Contacto" 
              description="Datos del responsable para coordinar la participación"
            >
              <FormInput
                label="Nombre y Apellido"
                icon={<User className="h-4 w-4" />}
                placeholder="Juan Pérez"
                {...register("contactPersonName")}
                error={errors.contactPersonName?.message}
              />
              <FormInput
                label="Cargo en la Empresa"
                icon={<Briefcase className="h-4 w-4" />}
                placeholder="Ej: Gerente de RRHH"
                {...register("cargoContacto")}
                error={errors.cargoContacto?.message}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  type="email"
                  label="Email"
                  icon={<Mail className="h-4 w-4" />}
                  placeholder="juan.perez@empresa.com"
                  {...register("contactPersonEmail")}
                  error={errors.contactPersonEmail?.message}
                />
                <FormInput
                  type="tel"
                  label="Teléfono"
                  icon={<Phone className="h-4 w-4" />}
                  placeholder="11 1234-5678"
                  {...register("contactPersonPhone")}
                  error={errors.contactPersonPhone?.message}
                />
              </div>
            </FormSection>

            {/* Logo de la Empresa */}
            <FormSection 
              title="Logo de la Empresa" 
              description="Suba el logo para usar en materiales del congreso"
            >
              <FormFileInput
                label="Logo"
                accept="image/*"
                hint="Formatos aceptados: PNG, JPG, SVG. Tamaño máximo: 5MB"
                error={errors.logo?.message as string}
                onChange={e => {
                  setValue("logo", e.target.files);
                }}
              />
            </FormSection>

            {/* Tipo de Participación */}
            <FormSection 
              title="Tipo de Participación" 
              description="Seleccione las modalidades de participación de su interés (puede elegir múltiples opciones)"
            >
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-800 tracking-wide">
                  Modalidades de Participación
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {participationOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        const isSelected = participationTypes.includes(option.id);
                        let newSelection;
                        if (isSelected) {
                          newSelection = participationTypes.filter(id => id !== option.id);
                        } else {
                          newSelection = [...participationTypes, option.id];
                        }
                        setParticipationTypes(newSelection);
                        setValue("participationOptions", newSelection);
                      }}
                      className={`
                        relative p-4 rounded-xl border-2 text-left transition-all duration-200 
                        ${participationTypes.includes(option.id)
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`
                          flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5
                          ${participationTypes.includes(option.id)
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-slate-300'
                          }
                        `}>
                          {participationTypes.includes(option.id) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-sm ${participationTypes.includes(option.id) ? 'text-blue-700' : 'text-slate-800'}`}>
                            {option.label}
                          </h3>
                          <p className={`text-xs mt-1 ${participationTypes.includes(option.id) ? 'text-blue-600' : 'text-slate-600'}`}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Mostrar selecciones actuales */}
                {participationTypes.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      ✓ Modalidades seleccionadas: {participationTypes.length}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {participationTypes.map((typeId) => {
                        const option = participationOptions.find(opt => opt.id === typeId);
                        return (
                          <span key={typeId} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                            {option?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {participationTypes.length === 0 && (
                  <p className="text-sm text-slate-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    💡 Seleccione al menos una modalidad de participación para que podamos contactarnos con la propuesta más adecuada.
                  </p>
                )}
              </div>
            </FormSection>

            {/* Botón de envío */}
            <div className="pt-6 border-t border-slate-200">
              <FormButton
                type="submit"
                fullWidth
                size="lg"
                isLoading={isSubmitting}
                icon={<Building2 className="h-5 w-5" />}
              >
                {isSubmitting ? "Registrando Empresa..." : "Registrar Empresa"}
              </FormButton>
            </div>
          </form>
        </FormCard>
      </div>
    </div>
  );
};

export default RegistroEmpresas;
