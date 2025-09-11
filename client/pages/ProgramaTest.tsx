import { useState, useEffect } from 'react';

export default function ProgramaTest() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching from API...');
        const response = await fetch('http://127.0.0.1:8000/api/programa/');
        console.log('Response:', response.status, response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Data received:', result.length, 'items');
        setData(result);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Test API Programa</h1>
      
      {loading && <p style={{ color: 'blue' }}>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div>
          <p style={{ color: 'green' }}>✅ Éxito! {data.length} programas cargados</p>
          <h3>Primer programa:</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(data[0], null, 2)}
          </pre>
        </div>
      )}
      
      <button
        onClick={async () => {
          try {
            const res = await fetch('http://127.0.0.1:8000/api/programa/');
            const result = await res.json();
            alert(`Test manual exitoso: ${result.length} programas`);
          } catch (e) {
            alert(`Test manual fallido: ${e}`);
          }
        }}
        style={{ 
          background: 'blue', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px',
          marginTop: '10px'
        }}
      >
        Test Manual
      </button>
    </div>
  );
}
