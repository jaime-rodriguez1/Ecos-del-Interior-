// api/verificar-admin.js
import crypto from 'crypto';

const intentosFallidos = new Map();
const MAX_INTENTOS = 5;
const VENTANA_MS = 5 * 60 * 1000;

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ valid: false, error: 'Método no permitido' });
  }

  const ip = (request.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
             request.headers['x-real-ip'] || 'desconocida';

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

  const { password } = request.body || {};
  if (!password || typeof password !== 'string') {
    return response.status(400).json({ valid: false, error: 'Contraseña no válida' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return response.status(500).json({ valid: false, error: 'Configuración incompleta' });
  }

  await new Promise(r => setTimeout(r, 400));

  if (compararSeguro(password, adminPassword)) {
    intentosFallidos.delete(ip);
    const expira = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 días
    const token = generarToken(expira, adminPassword);
    return response.status(200).json({ valid: true, token, expira });
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

function compararSeguro(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) { b = a; }
  let resultado = 0;
  for (let i = 0; i < a.length; i++) {
    resultado |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return resultado === 0 && a.length === b.length;
}

function generarToken(expira, secret) {
  const payload = `admin:${expira}`;
  const firma = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${firma}`).toString('base64');
}