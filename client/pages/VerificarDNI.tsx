import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function VerificarDNI() {
  const [dni, setDni] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [asistente, setAsistente] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dni.trim()) {
      toast.error("Por favor ingresa tu DNI");
      return;
    }

    if (!/^\d{7,8}$/.test(dni)) {
      toast.error("DNI inválido. Debe tener 7 u 8 dígitos");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/verificar-dni/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni: dni.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Error desconocido en la verificación",
        );
      }

      setConfirmed(true);
      setAsistente(result.asistente);
      toast.success("¡Asistencia Confirmada!", {
        description: `Bienvenido/a ${result.asistente.nombre_completo}. Tu certificado ha sido enviado por email.`,
      });
    } catch (error) {
      toast.error("Error en la verificación", {
        description:
          error instanceof Error
            ? error.message
            : "No se pudo verificar el DNI.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (confirmed && asistente) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              ¡Asistencia Confirmada!
            </h1>
            <Card className="mt-8">
              <CardContent className="pt-6">
                <div className="space-y-4 text-left">
                  <div>
                    <strong>Nombre:</strong> {asistente.nombre_completo}
                  </div>
                  <div>
                    <strong>Email:</strong> {asistente.email}
                  </div>
                  <div>
                    <strong>DNI:</strong> {asistente.dni}
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-center">
                    Tu certificado de asistencia ha sido enviado a tu correo
                    electrónico.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Confirmar Asistencia
          </h1>
          <p className="text-xl text-gray-600">
            Ingresa tu DNI para confirmar tu asistencia al congreso y recibir tu
            certificado.
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Verificación de DNI</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dni">Número de DNI</Label>
                <Input
                  id="dni"
                  type="text"
                  placeholder="Ej: 12345678"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  maxLength={8}
                  pattern="[0-9]*"
                />
                <p className="text-sm text-gray-500">
                  Ingresa tu DNI sin puntos ni espacios
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verificando..." : "Confirmar Asistencia"}
              </Button>
            </form>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold">Importante:</p>
                  <p>
                    Solo puedes confirmar tu asistencia una vez. Tu certificado
                    será enviado automáticamente a tu email registrado.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
