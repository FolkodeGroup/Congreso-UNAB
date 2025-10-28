import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

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
      const response = await fetch(
        "http://127.0.0.1:8000/api/registro-rapido/",
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
        toast.success("¡Registro Completado!", {
          description:
            "Tu registro ha sido exitoso y tu asistencia confirmada.",
        });
      } else {
        toast.error("Error en el registro", {
          description: result.message || "No se pudo completar el registro.",
        });
      }
    } catch (error) {
      toast.error("Error de conexión", {
        description: "No se pudo conectar con el servidor.",
      });
    }
  };

  // Modal de confirmación y redirección
  if (showModal && asistente) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-4">¡Registro Completado!</h2>
            <div className="space-y-2 mb-4 text-left">
              <div><strong>Nombre:</strong> {asistente.nombre_completo}</div>
              <div><strong>Email:</strong> {asistente.email}</div>
              <div><strong>DNI:</strong> {asistente.dni}</div>
              <div><strong>Tipo:</strong> {asistente.tipo_inscripcion}</div>
            </div>
            <p className="mb-6 text-green-800">Tu asistencia ha sido confirmada automáticamente y tu certificado será enviado a tu correo electrónico.</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700"
              onClick={() => {
                setShowModal(false);
                navigate("/seleccion-registro");
              }}
            >
              OK
            </button>
          </div>
        </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Registro Rápido en el Evento
          </h1>
          <p className="text-xl text-gray-600">
            Regístrate directamente en el congreso y confirma tu asistencia al
            mismo tiempo.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Registro de Asistente</CardTitle>
            <CardDescription>
              Completa tus datos para registrarte y confirmar tu asistencia
              automáticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_completo">Nombre Completo *</Label>
                  <Input
                    id="nombre_completo"
                    {...register("nombre_completo")}
                    placeholder="Ingresa tu nombre completo"
                  />
                  {errors.nombre_completo && (
                    <p className="text-sm text-red-600">
                      {errors.nombre_completo.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dni">DNI *</Label>
                  <Input
                    id="dni"
                    {...register("dni")}
                    placeholder="Ej: 12345678"
                    maxLength={8}
                  />
                  {errors.dni && (
                    <p className="text-sm text-red-600">{errors.dni.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_inscripcion">Tipo de Inscripción *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("tipo_inscripcion", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de inscripción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="EMPRESA">Empresa</SelectItem>
                    <SelectItem value="GRUPO">Grupo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo_inscripcion && (
                  <p className="text-sm text-red-600">
                    {errors.tipo_inscripcion.message}
                  </p>
                )}
              </div>

              {tipoInscripcion === "EMPRESA" && (
                <div className="space-y-2">
                  <Label htmlFor="empresa">Nombre de la Empresa</Label>
                  <Input
                    id="empresa"
                    {...register("empresa")}
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              )}

              {tipoInscripcion === "GRUPO" && (
                <div className="space-y-2">
                  <Label htmlFor="nombre_grupo">Nombre del Grupo</Label>
                  <Input
                    id="nombre_grupo"
                    {...register("nombre_grupo")}
                    placeholder="Nombre de tu grupo"
                  />
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Al completar este registro, tu
                  asistencia será confirmada automáticamente y recibirás tu
                  certificado por email inmediatamente.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? "Registrando..."
                  : "Registrarse y Confirmar Asistencia"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
