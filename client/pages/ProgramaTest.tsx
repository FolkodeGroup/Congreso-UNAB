import { useState, useEffect } from "react";

export default function ProgramaTest() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función getRowSpan corregida para pruebas
  function getRowSpan(inicio: string, fin: string) {
    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fin.split(":").map(Number);
    
    // Convertir a minutos totales desde medianoche
    const inicioMinutos = h1 * 60 + m1;
    const finMinutos = h2 * 60 + m2;
    
    // Calcular la diferencia en minutos y dividir por 30 (cada fila = 30 min)
    const duracionMinutos = finMinutos - inicioMinutos;
    return Math.ceil(duracionMinutos / 30); // Usar ceil para asegurar que cubra todo el tiempo
  }

  // Pruebas de la función getRowSpan
  const testCases = [
    { inicio: "10:00", fin: "10:30", esperado: 1, descripcion: "30 minutos" },
    { inicio: "10:00", fin: "11:00", esperado: 2, descripcion: "1 hora" },
    { inicio: "10:00", fin: "11:30", esperado: 3, descripcion: "1.5 horas" },
    { inicio: "10:30", fin: "12:00", esperado: 3, descripcion: "1.5 horas (desde :30)" },
    { inicio: "14:00", fin: "16:00", esperado: 4, descripcion: "2 horas" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching from API...");
        const response = await fetch("http://127.0.0.1:8000/api/programa/");
        console.log("Response:", response.status, response.ok);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log("Data received:", result.length, "items");
        setData(result);
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Test API Programa</h1>

      {/* Pruebas de la función getRowSpan */}
      <div style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "15px" }}>
        <h2>Test getRowSpan Function</h2>
        {testCases.map((test, idx) => {
          const resultado = getRowSpan(test.inicio, test.fin);
          const isCorrect = resultado === test.esperado;
          return (
            <div key={idx} style={{ 
              margin: "10px 0", 
              padding: "10px", 
              backgroundColor: isCorrect ? "#d4edda" : "#f8d7da",
              border: `1px solid ${isCorrect ? "#c3e6cb" : "#f5c6cb"}`,
              borderRadius: "4px"
            }}>
              <strong>{test.descripcion}:</strong> {test.inicio} → {test.fin}
              <br />
              Esperado: {test.esperado} filas, Obtenido: {resultado} filas
              {isCorrect ? " ✅" : " ❌"}
            </div>
          );
        })}
      </div>

      {loading && <p style={{ color: "blue" }}>Cargando...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && (
        <div>
          <p style={{ color: "green" }}>
            ✅ Éxito! {data.length} programas cargados
          </p>
          <h3>Primer programa:</h3>
          <pre
            style={{ background: "#f5f5f5", padding: "10px", overflow: "auto" }}
          >
            {JSON.stringify(data[0], null, 2)}
          </pre>
        </div>
      )}

      <button
        onClick={async () => {
          try {
            const res = await fetch("http://127.0.0.1:8000/api/programa/");
            const result = await res.json();
            alert(`Test manual exitoso: ${result.length} programas`);
          } catch (e) {
            alert(`Test manual fallido: ${e}`);
          }
        }}
        style={{
          background: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          marginTop: "10px",
        }}
      >
        Test Manual
      </button>
    </div>
  );
}
