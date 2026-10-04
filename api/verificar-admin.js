// api/verificar-admin.js
// =============================================
// Verifica la contraseña del administrador de
// forma segura. La contraseña vive SOLO en
// las variables de entorno de Vercel.
// =============================================

// Almacén de intentos por IP (en memoria, se resetea al redesplegar)
const intentosFallidos = new Map();
const MAX_INTENTOS = 5;
const VENTANA_MS = 5 * 60 * 1000; // 5 minutos

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ valid: false, error: 'Método no permitido' });
  }

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // IP del cliente
  const ip = (request.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
             request.headers['x-real-ip'] ||
             'desconocida';

  // Rate limiting
  const ahora = Date.now();
  const registro = intentosFallidos.get(ip) || { count: 0, firstAttempt: ahora };

  if (ahora - registro.firstAttempt > VENTANA_MS) {
    registro.count = 0;
    registro.firstAttempt = ahora;
  }

  if (registro.count >= MAX_INTENTOS) {
    const esperaSeg = Math.ceil((VENTANA_MS - (ahora - registro.firstAttempt)) / 1000);
    return response.status(429).json({
      valid: false,
      error: `Demasiados intentos. Espera ${esperaSeg} segundos.`,
      rateLimited: true
    });
  }

  // Contraseña recibida
  const { password } = request.body || {};
  if (!password || typeof password !== 'string') {
    return response.status(400).json({ valid: false, error: 'Contraseña no válida' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return response.status(500).json({ valid: false, error: 'Configuración incompleta del servidor' });
  }

  // Delay para dificultar fuerza bruta
  await new Promise(r => setTimeout(r, 400));

  // Comparación en tiempo constante
  if (compararSeguro(password, adminPassword)) {
    intentosFallidos.delete(ip);
    return response.status(200).json({ valid: true });
  } else {
    registro.count += 1;
    intentosFallidos.set(ip, registro);
    const restantes = Math.max(0, MAX_INTENTOS - registro.count);
    return response.status(200).json({
      valid: false,
      error: 'Contraseña incorrecta',
      intentosRestantes: restantes
    });
  }
}

// Comparación de strings en tiempo constante (evita timing attacks)
function compararSeguro(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) {
    // Aun así comparamos para no revelar la longitud real
    b = a;
  }
  let resultado = 0;
  for (let i = 0; i < a.length; i++) {
    resultado |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return resultado === 0 && a.length === b.length;
}