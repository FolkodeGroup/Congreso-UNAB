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
  const [showScanner, setShowScanner] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);
    setAsistencia(null);
    let payload: any = {};
    if (/^\d+$/.test(valor)) {
      payload.attendee_id = Number(valor);
    } else if (valor.includes('@')) {
      payload.email = valor;
    } else {
      setError('Debes ingresar un email o ID válido.');
      return;
    }
    try {
      const resp = await registrarAsistencia(payload);
      if (resp.message) {
        setMensaje(resp.message);
        setAsistencia(resp);
      } else if (resp.error) {
        setError(resp.error);
      } else {
        setError('Error desconocido.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
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
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
