import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function SeleccionRegistro() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>¿Cómo deseas registrarte?</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <Link to="/registro/individual">
                <Button className="w-full" size="lg">Registro Individual</Button>
              </Link>
              <Link to="/registro-grupal">
                <Button className="w-full" size="lg" variant="outline">Registro Grupal (Empresa)</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
