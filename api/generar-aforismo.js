// api/generar-aforismo.js
export default async function handler(request, response) {
  // Solo aceptamos peticiones POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  const { titulo, contenido } = request.body;

  // Lista de proveedores de IA en orden de prioridad
  const proveedores = [
    {
      nombre: 'groq',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile'
    },
    {
      nombre: 'openrouter',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: process.env.OPENROUTER_API_KEY,
      model: 'nvidia/nemotron-30b'
    },
    {
      nombre: 'gemini',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      // Para Gemini, el cuerpo y las cabeceras son ligeramente distintos
      // ... (se maneja más abajo)
    }
  ];

  const prompt = `Título: ${titulo}\n\nContenido: ${contenido}\n\nGenera un único aforismo que capture la esencia del texto.`;

  for (const p of proveedores) {
    if (!p.key) continue; // Si no hay clave configurada para este proveedor, saltar

    try {
      let respuesta;
      if (p.nombre === 'gemini') {
        // Lógica específica para Gemini
        respuesta = await fetch(p.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
      } else {
        // Lógica para Groq y OpenRouter (compatibles con OpenAI)
        respuesta = await fetch(p.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${p.key}`,
            'HTTP-Referer': 'https://tu-proyecto.vercel.app', // Opcional para OpenRouter
            'X-Title': 'Ecos del Interior' // Opcional para OpenRouter
          },
          body: JSON.stringify({
            model: p.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 80,
            temperature: 0.9
          })
        });
      }

      if (respuesta.ok) {
        const data = await respuesta.json();
        let aforismo = '';

        // Extraer el texto de la respuesta según el proveedor
        if (p.nombre === 'gemini') {
          aforismo = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else {
          aforismo = data.choices?.[0]?.message?.content || '';
        }

        // Limpiar el aforismo y devolverlo
        aforismo = aforismo.replace(/^["'«»]|["'«»]$/g, '').trim();
        if (aforismo) {
          return response.status(200).json({ aforismo, proveedor: p.nombre });
        }
      }
    } catch (error) {
      console.warn(`Error con ${p.nombre}:`, error.message);
      // Continuar con el siguiente proveedor
    }
  }

  // Si todos los proveedores fallan, devolver un error
  return response.status(500).json({ error: 'No se pudo generar el aforismo.' });
}