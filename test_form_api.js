// Script para probar la API desde la consola del navegador
const API_BASE = "http://127.0.0.1:8000/api";

async function testFormData() {
    const formData = new FormData();
    formData.append("nombre_empresa", "Empresa Formulario Test");
    formData.append("cuit", "20-11111111-1");
    formData.append("direccion", "Calle Formulario 789");
    formData.append("telefono_empresa", "11-2222-3333");
    formData.append("email_empresa", "form@test.com");
    formData.append("sitio_web", "https://form-test.com");
    formData.append("descripcion", "Empresa de prueba desde formulario");
    formData.append("nombre_contacto", "Carlos López");
    formData.append("email_contacto", "carlos@form-test.com");
    formData.append("celular_contacto", "11-4444-5555");
    formData.append("cargo_contacto", "Director");
    
    // Simular las opciones de participación como lo hace el formulario
    let opciones = ["stand", "sponsorship"];
    if (!opciones || typeof opciones !== "object") {
        opciones = [];
    }
    formData.append("participacion_opciones", JSON.stringify(opciones));
    formData.append("participacion_otra", "");

    try {
        console.log("Enviando datos a:", `${API_BASE}/registro-empresas/`);
        const response = await fetch(`${API_BASE}/registro-empresas/`, {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        console.log("Respuesta:", result);
        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Ejecutar la prueba
testFormData();
