import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, Building2, ArrowRight, Users, Briefcase } from "lucide-react";

export default function SeleccionRegistro() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 min-h-[calc(100vh-200px)] bg-professional-gradient relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-congress-cyan/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-congress-blue/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 w-2 h-2 bg-congress-cyan/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-congress-blue/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-congress-cyan/20 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10 animate-float-up">
        {/* Header elegante */}
        <div className="text-center mb-10 animate-fade-in-delay">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-congress-cyan to-congress-blue rounded-2xl mb-6 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Únete al Congreso
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Selecciona el tipo de registro que mejor se adapte a tu perfil profesional
          </p>
        </div>

        {/* Cards de opciones mejoradas */}
        <div className="grid gap-6 md:gap-8 animate-fade-in-delay-2">
          <Link to="/registro-participantes" className="group block">
            <Card className="selection-card form-glass border-0 form-shadow-soft hover:form-shadow-hover transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="icon-container-elegant w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gradient-professional transition-all duration-300">
                      Registro de Participantes
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      Para estudiantes, profesores y profesionales interesados en participar del congreso
                    </p>
                    <div className="flex items-center mt-3 text-xs text-congress-blue font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span>Registro individual</span>
                      <div className="w-1 h-1 bg-congress-blue rounded-full mx-2"></div>
                      <span>Acceso completo</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-congress-blue/10 transition-all duration-300">
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-congress-blue group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
                
                {/* Efecto de gradiente sutil en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-congress-blue/5 to-congress-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </CardContent>
            </Card>
          </Link>

          {/* REGISTRO DE EMPRESAS TEMPORALMENTE OCULTO */}
          {/* <Link to="/registro-empresas" className="group block">
            <Card className="selection-card form-glass border-0 form-shadow-soft hover:form-shadow-hover transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="icon-container-elegant w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gradient-professional transition-all duration-300">
                      Registro de Empresas
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      Para empresas que deseen participar como sponsors, expositores o colaboradores
                    </p>
                    <div className="flex items-center mt-3 text-xs text-congress-blue font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span>Registro corporativo</span>
                      <div className="w-1 h-1 bg-congress-blue rounded-full mx-2"></div>
                      <span>Oportunidades de sponsorship</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-congress-cyan/10 transition-all duration-300">
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-congress-cyan group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-congress-cyan/5 to-congress-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </CardContent>
            </Card>
          </Link> */}
        </div>

        {/* Footer informativo elegante */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-3 text-sm text-gray-600 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Sistema seguro</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-congress-blue" />
              <span>Confirmación inmediata</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span className="text-congress-blue font-medium">Proceso en 3 minutos</span>
          </div>
          
          {/* Indicadores de confianza */}
          <div className="flex justify-center items-center space-x-8 mt-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span>SSL Seguro</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span>Datos Protegidos</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
