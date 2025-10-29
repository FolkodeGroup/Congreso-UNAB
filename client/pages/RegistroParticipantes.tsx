import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollToTop } from "@/components/ScrollToTop";
import Layout from "@/components/Layout";
import { registerAsistente } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const profileTypeEnum = z.enum([
  "Estudiante",
  "Docente",
  "No docente",
  "Graduado/a",
  "Empresas y otras instituciones",
  "Público general",
  "Autoridades y funcionarios",
  "Disertante",
  "PRENSA",
]);

const formSchema = z
  .object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
    apellido: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres."),
    dni: z.string().min(7, "El DNI debe tener al menos 7 caracteres."),
    email: z.string().email("Email inválido."),
    telefono: z
      .string()
      .min(8, "El teléfono debe tener al menos 8 caracteres."),
    institucion: z
      .string()
      .min(2, "La institución debe tener al menos 2 caracteres."),
    profile_type: profileTypeEnum,
    rol_especifico: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.profile_type === "PRENSA") {
        return !!data.rol_especifico && data.rol_especifico.length > 0;
      }
      return true;
    },
    {
      message: "El campo 'Medio / Rol' es obligatorio si eres de PRENSA.",
      path: ["rol_especifico"],
    }
  );

const RegistroParticipantes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      telefono: "",
      institucion: "",
      rol_especifico: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const normalizedDNI = values.dni.replace(/\./g, "").replace(/\s/g, "");
      const dataToSend = {
        ...values,
        dni: normalizedDNI,
      };

      await registerAsistente(dataToSend);
      toast({
        title: "¡Inscripción exitosa!",
        description:
          "Te has registrado correctamente. Revisa tu email para ver el código QR.",
      });
      form.reset();
      navigate("/");
    } catch (error: any) {
      const errorData = await error.response.json();
      const errorMessage =
        Object.values(errorData).flat().join(" ") ||
        "Error en el registro. Por favor, intenta de nuevo.";
      toast({
        title: "Error en la inscripción",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <ScrollToTop />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Inscripción al Congreso
            </h1>
            <p className="text-lg text-gray-600">
              Completa el formulario para asegurar tu lugar en el evento.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu apellido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu DNI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="institucion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institución</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre de tu institución"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profile_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {profileTypeEnum.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("profile_type") === "PRENSA" && (
                <FormField
                  control={form.control}
                  name="rol_especifico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medio / Rol</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Periodista en 'La Nación'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Inscribirme"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default RegistroParticipantes;