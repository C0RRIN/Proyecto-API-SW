document.addEventListener('DOMContentLoaded', () => {
    const acceptBtn = document.getElementById('accept-button');
    const rejectBtn = document.getElementById('reject-button');
  
    acceptBtn.addEventListener('click', async () => {
      alert('Intentando acceder a la cámara...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        alert('Acceso a la cámara concedido.');
        stream.getTracks().forEach(t => t.stop());
        window.location.href = 'formulario.html';
      } catch (err) {
        alert('No se pudo acceder a la cámara: ' + err.message);
      }
    });
  
    rejectBtn.addEventListener('click', () => {
      alert('Has rechazado el acceso a la cámara.');
      window.location.href = 'login.html';
    });
  });
  