import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Esquema de validación con Zod, basado en los modelos de Django
const inscripcionSchema = z.object({
  nombre_completo: z.string().min(3, 'El nombre es requerido'),
  dni: z.string().regex(/^\d{7,8}$/, 'DNI inválido, debe tener 7 u 8 dígitos'),
  email: z.string().email('Email inválido'),
  tipo_inscripcion: z.enum(['INDIVIDUAL', 'EMPRESA', 'GRUPO'], { required_error: 'Debes seleccionar un tipo' }),
  // Campos opcionales que dependen del tipo
  empresa: z.string().optional(),
  nombre_grupo: z.string().optional(),
});

type InscripcionFormData = z.infer<typeof inscripcionSchema>;

export default function Registro() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InscripcionFormData>({
    resolver: zodResolver(inscripcionSchema),
    defaultValues: {
      tipo_inscripcion: 'INDIVIDUAL',
    },
  });

  const tipoInscripcion = watch('tipo_inscripcion');

  const onSubmit = async (data: InscripcionFormData) => {
    const payload = {
      tipo_inscripcion: data.tipo_inscripcion,
      asistente: {
        nombre_completo: data.nombre_completo,
        dni: data.dni,
        email: data.email,
      },
      empresa: data.empresa || null, // Enviar null si está vacío
      nombre_grupo: data.nombre_grupo || '',
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/inscripcion/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Si el error viene del backend (ej. email duplicado), lo mostramos
        throw new Error(result.message?.error || 'Ocurrió un error en el servidor.');
      }

      toast.success('¡Inscripción exitosa!', {
        description: 'Hemos enviado un correo de confirmación con tu código QR.',
      });
      // Aquí se podría resetear el formulario
    } catch (error) {
      toast.error('Error en la inscripción', {
        description: error instanceof Error ? error.message : 'No se pudo completar el registro.',
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Registro al Congreso
            </h1>
            <p className="text-xl text-gray-600">
              Completa el formulario para asegurar tu lugar.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Formulario de Inscripción</CardTitle>
              <CardDescription>
                Los campos marcados con * son obligatorios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="nombre_completo">Nombre Completo *</Label>
                  <Input id="nombre_completo" {...register('nombre_completo')} placeholder="Juan Pérez" />
                  {errors.nombre_completo && <p className="text-red-500 text-sm mt-1">{errors.nombre_completo.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dni">DNI *</Label>
                    <Input id="dni" {...register('dni')} placeholder="12345678" />
                    {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...register('email')} placeholder="tu@email.com" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="tipo_inscripcion">Tipo de Inscripción *</Label>
                  <Select onValueChange={(value) => setValue('tipo_inscripcion', value as any)} defaultValue={tipoInscripcion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                      <SelectItem value="EMPRESA">Empresa</SelectItem>
                      <SelectItem value="GRUPO">Grupo</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo_inscripcion && <p className="text-red-500 text-sm mt-1">{errors.tipo_inscripcion.message}</p>}
                </div>

                {tipoInscripcion === 'EMPRESA' && (
                  <div>
                    <Label htmlFor="empresa">Nombre de la Empresa</Label>
                    <Input id="empresa" {...register('empresa')} placeholder="Nombre de tu empresa" />
                  </div>
                )}

                {tipoInscripcion === 'GRUPO' && (
                  <div>
                    <Label htmlFor="nombre_grupo">Nombre del Grupo</Label>
                    <Input id="nombre_grupo" {...register('nombre_grupo')} placeholder="Nombre del grupo o institución" />
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full bg-congress-blue hover:bg-congress-blue-dark" size="lg">
                  {isSubmitting ? 'Enviando...' : 'Registrarme al Congreso'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
