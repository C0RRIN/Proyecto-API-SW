document.addEventListener('DOMContentLoaded', () => {
  const video          = document.getElementById('video');
  const canvas         = document.getElementById('snap');
  const ctx            = canvas.getContext('2d');
  const emotionDisplay = document.getElementById('emotionDisplay');
  const sections       = Array.from(document.querySelectorAll('.section'));
  let samplingInterval = null;
  let emotionCounts    = {};

  // URL de tu backend Flask 
  const BACKEND = 'http://localhost:5000';

  // Arranca la cámara
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; })
    .catch(err => { console.error("No se puede abrir la cámara:", err); });

  // Captura un frame y pide al backend la emoción
  function detectEmotion() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/jpeg');
    return fetch(`${BACKEND}/predict`, {
      method: 'POST',
      mode: 'cors',   // habilita CORS si tu front y back están en puertos distintos
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataURL })
    })
    .then(res => {
      if (!res.ok) throw new Error(`Servidor respondió ${res.status}`);
      return res.json();
    })
    .then(json => {
      if (json.error) throw json.error;
      return json.emotion;
    });
  }

  // Inicia el muestreo continuo
  function startSampling() {
    emotionCounts = {};
    samplingInterval = setInterval(() => {
      detectEmotion()
        .then(e => { emotionCounts[e] = (emotionCounts[e] || 0) + 1; })
        .catch(() => { /* ignorar fallos puntuales */ });
    }, 500);
  }

  // Detiene el muestreo y devuelve la emoción mayoritaria
  function stopSampling() {
    clearInterval(samplingInterval);
    let majority = 'neutral', max = 0;
    for (const [emo, cnt] of Object.entries(emotionCounts)) {
      if (cnt > max) { max = cnt; majority = emo; }
    }
    return majority;
  }

  // Mostrar solo la sección con el índice dado
  function showSection(idx) {
    sections.forEach((sec, i) => sec.classList.toggle('active', i === idx));
  }

  // Avanza a la siguiente sección
  function nextSection(currentIdx) {
    showSection(currentIdx + 1);
    if (currentIdx + 1 < sections.length) {
      startSampling();
    } else {
      emotionDisplay.textContent = "¡Gracias por completar la encuesta!";
      video.srcObject.getTracks().forEach(t => t.stop());
    }
  }

  // Asigna eventos a los botones "Enviar"
  sections.forEach(section => {
    const btn = section.querySelector('button');
    btn.addEventListener('click', () => {
      const idx   = +section.dataset.index;
      const score = document.getElementById(`select-${idx}`).value;

      // Para muestreo y calcula emoción predominante
      const emotion = stopSampling();
      emotionDisplay.textContent = `Emoción predominante: ${emotion} (calificación: ${score})`;

      nextSection(idx);
    });
  });

  // Inicializar
  showSection(0);
  startSampling();
});
