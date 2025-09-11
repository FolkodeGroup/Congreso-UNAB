import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";
import { toast } from "sonner";

interface QRData {
  url: string;
  image_base64: string;
  description: string;
}

interface QRResponse {
  checkin_qr: QRData;
  registro_qr: QRData;
}

export default function GenerarQRs() {
  const [qrData, setQrData] = useState<QRResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQRs = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/generar-qrs/");
      const data = await response.json();

      if (response.ok) {
        setQrData(data);
        toast.success("QRs generados exitosamente");
      } else {
        toast.error("Error al generar los QRs");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = (imageBase64: string, filename: string) => {
    const link = document.createElement("a");
    link.href = imageBase64;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printQR = (imageBase64: string, title: string) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir ${title}</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .qr-container {
                text-align: center;
                page-break-inside: avoid;
              }
              .qr-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
              }
              .qr-image {
                max-width: 400px;
                max-height: 400px;
              }
              .qr-description {
                margin-top: 20px;
                font-size: 16px;
                color: #666;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="qr-title">${title}</div>
              <img src="${imageBase64}" class="qr-image" alt="${title}" />
              <div class="qr-description">Congreso UNAB</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  useEffect(() => {
    generateQRs();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Códigos QR del Evento
          </h1>
          <p className="text-xl text-gray-600">
            Genera e imprime los códigos QR para el congreso.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* <div className="mb-6 text-center">
            <Button onClick={generateQRs} disabled={loading} className='bg-congress-blue-dark hover:bg-congress-cyan-light text-white font-semibold px-8 py-3'>
              <QrCode className="mr-2 h-4 w-4" />
              {loading ? 'Generando...' : 'Generar QRs'}
            </Button>
          </div> */}

          {qrData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* QR para confirmar asistencia */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-blue-600">
                    QR para Confirmar Asistencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img
                      src={qrData.checkin_qr.image_base64}
                      alt="QR Confirmar Asistencia"
                      className="w-64 h-64 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {qrData.checkin_qr.description}
                  </p>
                  <p className="text-xs text-gray-500 font-mono break-all">
                    {qrData.checkin_qr.url}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      className="w-full bg-congress-blue-dark hover:bg-congress-cyan-light text-white font-bold px-10 py-4 text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      size="lg"
                      onClick={() =>
                        downloadQR(
                          qrData.checkin_qr.image_base64,
                          "QR-Confirmar-Asistencia.png",
                        )
                      }
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Descargar
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-congress-cyan hover:bg-congress-blue-dark text-white font-bold px-10 py-4 text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      size="lg"
                      onClick={() =>
                        printQR(
                          qrData.checkin_qr.image_base64,
                          "QR para Confirmar Asistencia",
                        )
                      }
                    >
                      Imprimir
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* QR para registro in-situ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-blue-600">
                    QR para Registro in-situ
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img
                      src={qrData.registro_qr.image_base64}
                      alt="QR Registro Rápido"
                      className="w-64 h-64 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {qrData.registro_qr.description}
                  </p>
                  <p className="text-xs text-gray-500 font-mono break-all">
                    {qrData.registro_qr.url}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      className="w-full bg-congress-blue-dark hover:bg-congress-cyan-light text-white font-bold px-10 py-4 text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      size="lg"
                      onClick={() =>
                        downloadQR(
                          qrData.registro_qr.image_base64,
                          "QR-Registro-Rapido.png",
                        )
                      }
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Descargar
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full bg-congress-cyan hover:bg-congress-blue-dark text-white font-bold px-10 py-4 text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      onClick={() =>
                        printQR(
                          qrData.registro_qr.image_base64,
                          "QR para Registro in-situ",
                        )
                      }
                    >
                      Imprimir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Instrucciones de uso:
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li><strong>QR Azul (Confirmar Asistencia):</strong> Para personas ya registradas que necesitan confirmar su asistencia y recibir el certificado.</li>
              <li><strong>QR Verde (Registro in-situ):</strong> Para personas que no se registraron previamente y quieren hacerlo en el evento.</li>
              <li>Imprime ambos QRs en tamaño grande y colócalos en ubicaciones visibles del evento.</li>
              <li>Los asistentes pueden escanear con cualquier app de QR de su teléfono.</li>
            </ul>
          </div> */}
        </div>
      </div>
    </Layout>
  );
}
