import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { 
  FormInput, 
  FormSelect, 
  FormButton, 
  FormCard, 
  FormSection
} from "@/components/ui/modern-form";
import { API_HOST } from "@/lib/api";
import { 
  User, 
  Mail, 
  IdCard, 
  Building2, 
  Users, 
  CheckCircle,
  Zap
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Esquema de validación para registro rápido
const registroRapidoSchema = z.object({
  nombre_completo: z.string().min(3, "El nombre es requerido"),
  dni: z.string().regex(/^\d{7,8}$/, "DNI inválido, debe tener 8 dígitos"),
  email: z.string().email("Email inválido"),
  tipo_inscripcion: z.enum(["INDIVIDUAL", "EMPRESA", "GRUPO"], {
    required_error: "Debes seleccionar un tipo",
  }),
  empresa: z.string().optional(),
  nombre_grupo: z.string().optional(),
});

type RegistroRapidoFormData = z.infer<typeof registroRapidoSchema>;

export default function RegistroRapido() {
  const [showModal, setShowModal] = useState(false);
  const [asistente, setAsistente] = useState<any>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistroRapidoFormData>({
    resolver: zodResolver(registroRapidoSchema),
    defaultValues: {
      tipo_inscripcion: "INDIVIDUAL",
    },
  });

  const tipoInscripcion = watch("tipo_inscripcion");

  const onSubmit = async (data: RegistroRapidoFormData) => {
    const payload = {
      tipo_inscripcion: data.tipo_inscripcion,
      asistente: {
        nombre_completo: data.nombre_completo,
        dni: data.dni,
        email: data.email,
      },
      empresa: data.empresa || null,
      nombre_grupo: data.nombre_grupo || "",
    };

    try {
      const response = await fetch(`${API_HOST}/api/registro-rapido/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setShowModal(true);
        setAsistente(data);
        toast.success("Registro exitoso", {
          description: "Tu asistencia ha sido confirmada correctamente",
        });
      } else {
        toast.error("Error en el registro", {
          description: result.message || "No se pudo completar el registro. Por favor, verifica los datos e intenta nuevamente.",
        });
      }
    } catch (error) {
      toast.error("Error de conexión", {
        description: "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.",
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="form-bg-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Modal de confirmación modernizado */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center transform animate-in slide-in-from-bottom-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">¡Registro Completado!</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {asistente?.nombre_completo}, tu asistencia ha sido confirmada exitosamente.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Email:</strong> {asistente?.email}<br/>
                  <strong>Tipo:</strong> {asistente?.tipo_inscripcion}
                </p>
              </div>
              <FormButton onClick={handleCloseModal} fullWidth>
                Continuar
              </FormButton>
            </div>
          </div>
        )}

        <FormCard 
          title="Registro Rápido"
          description="Complete sus datos básicos para confirmar su asistencia al congreso de forma inmediata"
        >
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800 font-medium">
                Registro Express - Confirmación inmediata sin validación adicional
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Información Personal */}
            <FormSection 
              title="Información Personal" 
              description="Complete sus datos básicos para el registro"
            >
              <FormInput
                label="Nombre Completo"
                icon={<User className="h-4 w-4" />}
                placeholder="Juan Pérez"
                {...register("nombre_completo")}
                error={errors.nombre_completo?.message}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="DNI"
                  icon={<IdCard className="h-4 w-4" />}
                  placeholder="12345678"
                  {...register("dni")}
                  error={errors.dni?.message}
                />
                <FormInput
                  type="email"
                  label="Email"
                  icon={<Mail className="h-4 w-4" />}
                  placeholder="correo@ejemplo.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
            </FormSection>

            {/* Tipo de Inscripción */}
            <FormSection 
              title="Tipo de Inscripción" 
              description="Seleccione cómo desea registrarse"
            >
              <FormSelect
                label="Modalidad de Participación"
                icon={<Users className="h-4 w-4" />}
                options={[
                  { value: "INDIVIDUAL", label: "Individual" },
                  { value: "EMPRESA", label: "Representante de Empresa" },
                  { value: "GRUPO", label: "Grupo/Organización" }
                ]}
                {...register("tipo_inscripcion")}
                onChange={(e) => setValue("tipo_inscripcion", e.target.value as any)}
                error={errors.tipo_inscripcion?.message}
              />

              {/* Campos condicionales */}
              {tipoInscripcion === "EMPRESA" && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <FormInput
                    label="Nombre de la Empresa"
                    icon={<Building2 className="h-4 w-4" />}
                    placeholder="Logística Integral S.A."
                    {...register("empresa")}
                    error={errors.empresa?.message}
                  />
                </div>
              )}

              {tipoInscripcion === "GRUPO" && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <FormInput
                    label="Nombre del Grupo/Organización"
                    icon={<Users className="h-4 w-4" />}
                    placeholder="Asociación de Transportistas"
                    {...register("nombre_grupo")}
                    error={errors.nombre_grupo?.message}
                  />
                </div>
              )}
            </FormSection>

            {/* Información adicional */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">¿Necesita más opciones?</h3>
              <p className="text-slate-600 mb-4">
                Si requiere registrar múltiples personas, campos adicionales o participar como expositor, 
                puede usar nuestros formularios completos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <FormButton
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/registro-participantes")}
                >
                  Registro Completo de Participantes
                </FormButton>
                <FormButton
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/registro-empresas")}
                >
                  Registro para Empresas
                </FormButton>
              </div>
            </div>

            {/* Botón de envío */}
            <div className="pt-6 border-t border-slate-200">
              <FormButton
                type="submit"
                fullWidth
                size="lg"
                isLoading={isSubmitting}
                icon={<Zap className="h-5 w-5" />}
              >
                {isSubmitting ? "Procesando Registro..." : "Confirmar Asistencia"}
              </FormButton>
            </div>
          </form>
        </FormCard>
      </div>
    </div>
  );
}
