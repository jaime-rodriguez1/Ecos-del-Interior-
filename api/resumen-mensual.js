// api/resumen-mensual.js
// Genera y envía (o previsualiza) el resumen mensual.
// Requiere RESEND_API_KEY para envío real por email.

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { accion, destinatarios, datos } = request.body || {};

  // Modo 1: generar el contenido del resumen (HTML)
  if (accion === 'generar') {
    if (!datos) return response.status(400).json({ error: 'Faltan datos' });
    const html = generarHTMLResumen(datos);
    return response.status(200).json({ html: html });
  }

  // Modo 2: enviar por email (necesita RESEND_API_KEY)
  if (accion === 'enviar') {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return response.status(500).json({ error: 'Falta RESEND_API_KEY en Vercel' });
    }
    if (!destinatarios || !Array.isArray(destinatarios) || destinatarios.length === 0) {
      return response.status(400).json({ error: 'Sin destinatarios' });
    }
    if (!datos) return response.status(400).json({ error: 'Faltan datos' });

    const html = generarHTMLResumen(datos);
    const resultados = [];

    for (const email of destinatarios.slice(0, 50)) { // máximo 50 por llamada
      try {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            from: 'Ecos del Interior <onboarding@resend.dev>',
            to: [email],
            subject: '✦ Ecos del Interior — Resumen del mes',
            html: html
          })
        });
        if (r.ok) {
          resultados.push({ email: email, ok: true });
        } else {
          const err = await r.text();
          resultados.push({ email: email, ok: false, error: err.slice(0, 200) });
        }
      } catch (e) {
        resultados.push({ email: email, ok: false, error: e.message });
      }
      // Pequeña pausa para no saturar
      await new Promise(r => setTimeout(r, 200));
    }

    return response.status(200).json({ enviados: resultados });
  }

  return response.status(400).json({ error: 'Acción no soportada' });
}

function generarHTMLResumen(datos) {
  const { mes, anio, ecosDestacados, totalEcos, totalComentarios, autoresActivos, debates, aforismoTop } = datos;

  let ecosHtml = '';
  (ecosDestacados || []).forEach(function(e, i) {
    ecosHtml += `
      <div style="background:#17171c;border:1px solid #2a2a33;border-radius:12px;padding:16px 18px;margin-bottom:12px;">
        <div style="color:#c9a227;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">#${i+1} · ${e.tag || ''}</div>
        <div style="color:#e8e6e1;font-family:Georgia,serif;font-size:18px;margin-bottom:8px;">${e.title}</div>
        <div style="color:#9a968e;font-size:14px;line-height:1.6;">${(e.content||'').slice(0,180)}…</div>
        <div style="color:#6b6760;font-size:12px;margin-top:8px;">— ${e.author || 'Anónimo'} · 👁 ${e.views || 0} · ❤ ${e.likes || 0} · 💬 ${(e.comments||[]).length}</div>
      </div>`;
  });

  let debatesHtml = '';
  if (debates && debates.length) {
    debatesHtml = '<h2 style="color:#c9a227;font-family:Georgia,serif;font-size:22px;margin:28px 0 12px;">🔥 Debates del mes</h2>';
    debates.forEach(function(d) {
      debatesHtml += `<div style="background:#1e1e25;border-left:3px solid #c9a227;padding:12px 16px;border-radius:6px;margin-bottom:10px;color:#e8e6e1;"><strong style="color:#c9a227;">${d.tema}</strong><br><span style="color:#9a968e;font-size:14px;">${d.resumen || ''}</span></div>`;
    });
  }

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e0b84a,#c9a227 55%,#6b5410);line-height:64px;font-size:28px;color:#0a0a0c;">◉</div>
    <h1 style="color:#e8e6e1;font-family:Georgia,serif;font-size:28px;font-weight:400;margin:16px 0 8px;">Ecos <em style="color:#c9a227;">del</em> Interior</h1>
    <div style="color:#6b6760;font-size:14px;font-style:italic;">Resumen de ${mes} ${anio}</div>
  </div>

  <div style="background:#17171c;border:1px solid #2a2a33;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
    <div style="color:#c9a227;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">El mes en números</div>
    <div style="display:flex;justify-content:space-around;gap:12px;flex-wrap:wrap;">
      <div><div style="color:#e8e6e1;font-size:28px;font-family:Georgia,serif;">${totalEcos || 0}</div><div style="color:#6b6760;font-size:12px;">ecos</div></div>
      <div><div style="color:#e8e6e1;font-size:28px;font-family:Georgia,serif;">${totalComentarios || 0}</div><div style="color:#6b6760;font-size:12px;">comentarios</div></div>
      <div><div style="color:#e8e6e1;font-size:28px;font-family:Georgia,serif;">${autoresActivos || 0}</div><div style="color:#6b6760;font-size:12px;">voces activas</div></div>
    </div>
  </div>

  ${aforismoTop ? `<div style="background:linear-gradient(135deg,rgba(201,162,39,.15),rgba(201,162,39,.05));border:1px solid #c9a227;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;font-family:Georgia,serif;font-style:italic;color:#e8e6e1;font-size:16px;line-height:1.7;">"${aforismoTop}"</div>` : ''}

  <h2 style="color:#c9a227;font-family:Georgia,serif;font-size:22px;margin:28px 0 16px;">✦ Ecos destacados</h2>
  ${ecosHtml || '<p style="color:#9a968e;">Sin ecos este mes.</p>'}

  ${debatesHtml}

  <div style="text-align:center;margin-top:40px;padding-top:24px;border-top:1px solid #2a2a33;">
    <a href="https://ecosdelinterior.vercel.app" style="display:inline-block;background:linear-gradient(135deg,#c9a227,#9d7d14);color:#0a0a0c;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">Volver a Ecos del Interior</a>
    <p style="color:#6b6760;font-size:11px;margin-top:20px;">Recibes este correo porque activaste el resumen mensual. Puedes desactivarlo desde tu perfil.</p>
  </div>
</div>
</body></html>`;
}