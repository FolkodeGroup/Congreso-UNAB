import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function SeleccionRegistro() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>¿Cómo deseas registrarte?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link to="/registro-participantes">
              <Button
                className="w-full bg-congress-blue-dark hover:bg-congress-cyan-light text-white font-semibold px-8 py-4 text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                Registro de Participantes
              </Button>
            </Link>
            <Link to="/registro-empresas">
              <Button
                className="w-full bg-congress-blue-dark hover:bg-congress-cyan-light text-white font-semibold px-8 py-4 text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                Registro de Empresas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
