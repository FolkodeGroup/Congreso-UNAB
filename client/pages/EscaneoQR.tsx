import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import { registrarAsistencia } from '../lib/api';

export default function EscaneoQR() {
  const [valor, setValor] = useState('');
  const [mensaje, setMensaje] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [asistencia, setAsistencia] = useState<any>(null);
  const [certId, setCertId] = useState<number|null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);
    setAsistencia(null);
    let payload: any = {};
    let cleanValor = valor;
    // Si el valor viene en formato 'asistente:<id>:<email>', extraer solo el email
    if (cleanValor.startsWith('asistente:')) {
      const partes = cleanValor.split(':');
      if (partes.length === 3) {
        cleanValor = partes[2];
      } else if (partes.length === 2) {
        cleanValor = partes[1];
      }
    }
    if (/^\d+$/.test(cleanValor)) {
      payload.attendee_id = Number(cleanValor);
    } else if (cleanValor.includes('@')) {
      payload.email = cleanValor;
    } else {
      setError('Debes ingresar un email o ID válido.');
      return;
    }
    try {
      const resp = await registrarAsistencia(payload);
      if (resp.message) {
        setMensaje(resp.message);
        setAsistencia(resp);
        if (resp.certificate_id) {
          setCertId(resp.certificate_id);
        } else {
          setCertId(null);
        }
      } else if (resp.error) {
        setError(resp.error);
        setCertId(null);
      } else {
        setError('Error desconocido.');
        setCertId(null);
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
      setCertId(null);
    }
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      setValor(result.getText());
      setShowScanner(false);
    },
    onError() {
      setError('No se pudo acceder a la cámara.');
      setShowScanner(false);
    },
    paused: !showScanner,
    constraints: { video: { facingMode: 'environment' }, audio: false },
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Escaneo de QR / Registro de Asistencia</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Escanea el QR o ingresa email/ID"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                    required
                  />
                  <Button type="button" variant="outline" onClick={() => {
                    setError(null);
                    setShowScanner(true);
                  }}>
                    Usar cámara
                  </Button>
                </div>
                <Button type="submit" className="w-full">Registrar Asistencia</Button>
              </form>
              {showScanner && (
                <div className="mt-4 flex flex-col items-center">
                  <video ref={ref} style={{ width: '100%', maxWidth: 400 }} />
                  <Button className="mt-2" variant="outline" onClick={() => setShowScanner(false)}>Cerrar cámara</Button>
                </div>
              )}
              {mensaje && <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">{mensaje}</div>}
              {error && <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}
              {asistencia?.attended_at && (
                <div className="mt-2 text-sm text-gray-700">Asistió: {new Date(asistencia.attended_at).toLocaleString()}</div>
              )}
              {certId && (
                <Button
                  type="button"
                  className="mt-4 w-full"
                  onClick={() => {
                    const url = `/api/certificates/${certId}/download/`;
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `certificado_${certId}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Descargar certificado PDF
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
