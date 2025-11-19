// Test de importación de la función API
import { registrarEmpresa } from './client/lib/api.ts';

console.log('Función registrarEmpresa importada:', typeof registrarEmpresa);

// Test de FormData
const formData = new FormData();
formData.append("nombre_empresa", "Test Import");
formData.append("email_contacto", "test@import.com");

console.log('FormData creado correctamente');

// Solo mostramos que la función existe, no la ejecutamos aquí
console.log('✅ Importación exitosa');
