import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  FormInput, 
  FormButton, 
  FormCheckbox, 
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
  contactPersonName: z
    .string()
    .min(1, "El nombre de la persona de contacto es requerido"),
  contactPersonEmail: z.string().email("Debe ser un correo electrónico válido"),
  contactPersonPhone: z
    .string()
    .min(1, "El teléfono de la persona de contacto es requerido"),
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
    { id: "workshop", label: "Taller", description: "Sesión práctica interactiva" },
  ];

  const handleParticipationChange = (optionId: string, checked: boolean) => {
    let updatedOptions;
    if (checked) {
      updatedOptions = [...participationTypes, optionId];
    } else {
      updatedOptions = participationTypes.filter(id => id !== optionId);
    }
    setParticipationTypes(updatedOptions);
    setValue("participationOptions", updatedOptions);
  };

  const onSubmit = async (data: CompanyRegistrationFormData) => {
    console.log("Formulario de Empresa Enviado:", data);
    // Aquí iría la llamada real a la API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de delay
    setShowModal(true);
    reset();
    setParticipationTypes([]);
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
                {...register("logo")}
                error={errors.logo?.message as string}
              />
            </FormSection>

            {/* Tipo de Participación */}
            <FormSection 
              title="Tipo de Participación" 
              description="Seleccione las modalidades de participación de su interés"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {participationOptions.map((option) => (
                  <div 
                    key={option.id} 
                    className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors duration-200"
                  >
                    <FormCheckbox
                      label={option.label}
                      description={option.description}
                      checked={participationTypes.includes(option.id)}
                      onChange={(e) => handleParticipationChange(option.id, e.target.checked)}
                    />
                  </div>
                ))}
              </div>
              
              {participationTypes.length === 0 && (
                <p className="text-sm text-slate-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  💡 Seleccione al menos una modalidad de participación para que podamos contactarnos con la propuesta más adecuada.
                </p>
              )}
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
