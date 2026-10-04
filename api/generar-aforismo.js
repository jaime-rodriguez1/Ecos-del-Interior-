// api/generar-aforismo.js
// =============================================
// Genera aforismos usando múltiples APIs de IA
// con sistema de respaldo automático.
// =============================================

export default async function handler(request, response) {
  // Solo aceptamos POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  // CORS (por si acaso)
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { titulo, contenido } = request.body || {};
  if (!titulo || !contenido) {
    return response.status(400).json({ error: 'Faltan título o contenido' });
  }

  const prompt = `Título: ${titulo}\n\nContenido: ${contenido}\n\nGenera un único aforismo que capture la esencia del texto. Máximo 140 caracteres. Sin comillas, sin prefijos, solo la frase.`;

  // Orden de prioridad: del más rápido/generoso al más lento
  const proveedores = [
    {
      nombre: 'groq',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
      tipo: 'openai'
    },
    {
      nombre: 'openrouter',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: process.env.OPENROUTER_API_KEY,
      model: 'nvidia/nemotron-30b',
      tipo: 'openai',
      extraHeaders: {
        'HTTP-Referer': 'https://ecosdelinterior.vercel.app',
        'X-Title': 'Ecos del Interior'
      }
    },
    {
      nombre: 'gemini',
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      key: process.env.GEMINI_API_KEY,
      model: 'gemini-2.0-flash',
      tipo: 'gemini'
    },
    {
      nombre: 'cohere',
      url: 'https://api.cohere.com/v1/chat',
      key: process.env.COHERE_API_KEY,
      model: 'command-r-plus-08-2024',
      tipo: 'cohere'
    },
    {
      nombre: 'huggingface',
      url: 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct',
      key: process.env.HUGGINGFACE_API_KEY,
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      tipo: 'huggingface'
    }
  ];

  for (const p of proveedores) {
    if (!p.key) continue; // Sin clave, saltar

    try {
      const aforismo = await llamarProveedor(p, prompt);
      if (aforismo) {
        return response.status(200).json({ aforismo, proveedor: p.nombre });
      }
    } catch (error) {
      console.warn(`Falló ${p.nombre}:`, error.message);
      continue;
    }
  }

  // Si todos fallan
  return response.status(500).json({ error: 'No se pudo generar el aforismo' });
}

// =============================================
// Función auxiliar: llama a cada proveedor
// =============================================
async function llamarProveedor(p, prompt) {
  let body, headers;

  if (p.tipo === 'openai') {
    // Groq y OpenRouter usan el formato OpenAI
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${p.key}`,
      ...(p.extraHeaders || {})
    };
    body = JSON.stringify({
      model: p.model,
      messages: [
        { role: 'system', content: 'Eres un filósofo. Devuelve solo la frase aforística, sin comillas ni prefijos.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 80,
      temperature: 0.9
    });
  } else if (p.tipo === 'gemini') {
    headers = { 'Content-Type': 'application/json' };
    body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    });
  } else if (p.tipo === 'cohere') {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${p.key}`
    };
    body = JSON.stringify({
      model: p.model,
      message: prompt,
      max_tokens: 80,
      temperature: 0.9
    });
  } else if (p.tipo === 'huggingface') {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${p.key}`
    };
    body = JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 80, temperature: 0.9 }
    });
  }

  const url = p.tipo === 'gemini' ? `${p.url}?key=${p.key}` : p.url;
  const resp = await fetch(url, { method: 'POST', headers, body });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Status ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const data = await resp.json();
  let texto = '';

  if (p.tipo === 'openai') {
    texto = data.choices?.[0]?.message?.content || '';
  } else if (p.tipo === 'gemini') {
    texto = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } else if (p.tipo === 'cohere') {
    texto = data.text || '';
  } else if (p.tipo === 'huggingface') {
    texto = Array.isArray(data) ? (data[0]?.generated_text || '') : (data.generated_text || '');
  }

  // Limpiar
  texto = texto.replace(/^["'«»\s]+|["'«»\s]+$/g, '').trim();
  if (texto.length > 140) texto = texto.slice(0, 140) + '…';

  return texto;
}