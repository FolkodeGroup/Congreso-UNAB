import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  logo: z.any().optional(), // Will handle file input separately
  participationOptions: z.array(z.string()).optional(), // Example: ["stand", "sponsorship"]
});

type CompanyRegistrationFormData = z.infer<typeof companyRegistrationSchema>;

const RegistroEmpresas: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyRegistrationFormData>({
    resolver: zodResolver(companyRegistrationSchema),
  });

  // Simulación de API call y éxito
  const onSubmit = (data: CompanyRegistrationFormData) => {
    console.log("Formulario de Empresa Enviado:", data);
    // Aquí iría la llamada real a la API
    setShowModal(true);
    reset();
  };

  // Redirección tras cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = "/seleccion-registro";
    }, 300);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Modal de confirmación */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">¡Inscripción exitosa!</h2>
            <p className="mb-6">Se ha enviado un email de confirmación a la dirección registrada.</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700"
              onClick={handleCloseModal}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Inscripción para Empresas</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de la Empresa
          </label>
          <input
            type="text"
            id="companyName"
            {...register("companyName")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.companyName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="companyCUIT"
            className="block text-sm font-medium text-gray-700"
          >
            CUIT de la Empresa
          </label>
          <input
            type="text"
            id="companyCUIT"
            {...register("companyCUIT")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.companyCUIT && (
            <p className="text-red-500 text-xs mt-1">
              {errors.companyCUIT.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="companyAddress"
            className="block text-sm font-medium text-gray-700"
          >
            Dirección de la Empresa
          </label>
          <input
            type="text"
            id="companyAddress"
            {...register("companyAddress")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.companyAddress && (
            <p className="text-red-500 text-xs mt-1">
              {errors.companyAddress.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="companyPhone"
            className="block text-sm font-medium text-gray-700"
          >
            Teléfono de la Empresa
          </label>
          <input
            type="text"
            id="companyPhone"
            {...register("companyPhone")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.companyPhone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.companyPhone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="companyEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Email de la Empresa
          </label>
          <input
            type="email"
            id="companyEmail"
            {...register("companyEmail")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.companyEmail && (
            <p className="text-red-500 text-xs mt-1">
              {errors.companyEmail.message}
            </p>
          )}
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">Persona de Contacto</h2>
        <div>
          <label
            htmlFor="contactPersonName"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de la Persona de Contacto
          </label>
          <input
            type="text"
            id="contactPersonName"
            {...register("contactPersonName")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.contactPersonName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.contactPersonName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contactPersonEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Email de la Persona de Contacto
          </label>
          <input
            type="email"
            id="contactPersonEmail"
            {...register("contactPersonEmail")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.contactPersonEmail && (
            <p className="text-red-500 text-xs mt-1">
              {errors.contactPersonEmail.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contactPersonPhone"
            className="block text-sm font-medium text-gray-700"
          >
            Teléfono de la Persona de Contacto
          </label>
          <input
            type="text"
            id="contactPersonPhone"
            {...register("contactPersonPhone")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.contactPersonPhone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.contactPersonPhone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="logo"
            className="block text-sm font-medium text-gray-700"
          >
            Logo de la Empresa
          </label>
          <input
            type="file"
            id="logo"
            {...register("logo")}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {errors.logo && (
            <p className="text-red-500 text-xs mt-1">
              {errors.logo.message as string}
            </p>
          )}
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Opciones de Participación
        </h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="optionStand"
              value="stand"
              {...register("participationOptions")}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor="optionStand"
              className="ml-2 block text-sm text-gray-900"
            >
              Stand en el evento
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="optionSponsorship"
              value="sponsorship"
              {...register("participationOptions")}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor="optionSponsorship"
              className="ml-2 block text-sm text-gray-900"
            >
              Patrocinio
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="optionTalk"
              value="talk"
              {...register("participationOptions")}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor="optionTalk"
              className="ml-2 block text-sm text-gray-900"
            >
              Charla/Presentación
            </label>
          </div>
        </div>
        {errors.participationOptions && (
          <p className="text-red-500 text-xs mt-1">
            {errors.participationOptions.message}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Registrar Empresa
        </button>
      </form>
    </div>
  );
};

export default RegistroEmpresas;
