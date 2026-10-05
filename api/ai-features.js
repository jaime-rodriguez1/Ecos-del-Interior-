// api/ai-features.js
// Maneja todas las features de IA: socrático, junguiano, oráculo,
// contradicciones, traducción y debates.

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { mode, titulo, contenido, extra } = request.body || {};

  if (!mode || typeof mode !== 'string') {
    return response.status(400).json({ error: 'Falta el modo' });
  }

  const prompts = {
    socratico: {
      system: 'Eres un filósofo socrático. A partir del texto que recibes, formula exactamente 3 preguntas incisivas que inviten al autor a profundizar, cuestionar sus supuestos y explorar contradicciones. Devuelve SOLO un JSON: {"preguntas":["...","...","..."]}',
      user: `Título: ${titulo}\n\nTexto: ${contenido}\n\nFormula 3 preguntas socráticas en español.`
    },
    junguiano: {
      system: 'Eres un analista junguiano. Analiza el texto y devuelve SOLO un JSON: {"arquetipo":"El Sabio|El Huérfano|El Guerrero|El Mago|El Amante|El Bufón|El Gobernante|El Explorador","sombra":"...una frase describiendo la sombra proyectada...","integracion":"...una frase con una sugerencia de integración..."}',
      user: `Título: ${titulo}\n\nTexto: ${contenido}\n\nAnaliza arquetipo, sombra e integración.`
    },
    oraculo: {
      system: 'Eres un oráculo filosófico. El usuario te hace una pregunta personal. Responde con sabiduría poética y profunda, citando perspectivas filosóficas. Máximo 200 palabras. Sin comillas, sin prefijos.',
      user: `Pregunta del usuario: ${contenido}\n\nContexto adicional: ${extra || 'Ninguno'}`
    },
    contradicciones: {
      system: 'Recibes varios textos de un mismo autor. Identifica hasta 3 contradicciones o tensiones internas entre ellos. Devuelve SOLO un JSON: {"contradicciones":[{"frase":"...","explicacion":"..."}]}. Si no hay contradicciones, devuelve {"contradicciones":[]}.',
      user: `Textos:\n\n${contenido}\n\nDetecta contradicciones.`
    },
    traduccion: {
      system: 'Traduce el texto a los siguientes idiomas. Devuelve SOLO un JSON: {"en":"...","fr":"...","pt":"...","it":"...","de":"..."}',
      user: `Título: ${titulo}\n\nTexto: ${contenido}\n\nTraduce el título y el texto.`
    },
    debates: {
      system: 'Analiza el texto y detecta si genera debate o controversia. Devuelve SOLO un JSON: {"hayDebate":true|false,"tema":"...tema central del debate...","resumen":"...resumen en 2 frases..."}.',
      user: `Título: ${titulo}\n\nTexto: ${contenido}\n\nAnaliza si genera debate.`
    }
  };

  const prompt = prompts[mode];
  if (!prompt) {
    return response.status(400).json({ error: 'Modo no soportado: ' + mode });
  }

  // Proveedores en orden
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
    }
  ];

  for (const p of proveedores) {
    if (!p.key) continue;
    try {
      const texto = await llamarProveedor(p, prompt);
      if (texto) {
        return response.status(200).json({ resultado: texto, proveedor: p.nombre });
      }
    } catch (e) {
      console.warn(`Falló ${p.nombre}:`, e.message);
      continue;
    }
  }

  return response.status(500).json({ error: 'Ningún proveedor respondió' });
}

async function llamarProveedor(p, prompt) {
  let body, headers;

  if (p.tipo === 'openai') {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${p.key}`,
      ...(p.extraHeaders || {})
    };
    body = JSON.stringify({
      model: p.model,
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      max_tokens: 800,
      temperature: 0.85
    });
  } else if (p.tipo === 'gemini') {
    headers = { 'Content-Type': 'application/json' };
    body = JSON.stringify({
      contents: [{ parts: [{ text: prompt.system + '\n\n' + prompt.user }] }]
    });
  } else if (p.tipo === 'cohere') {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${p.key}`
    };
    body = JSON.stringify({
      model: p.model,
      message: prompt.system + '\n\n' + prompt.user,
      max_tokens: 800,
      temperature: 0.85
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
  }

  // Limpiar posibles bloques ```json```
  texto = texto.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  return texto;
}