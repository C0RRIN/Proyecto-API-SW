document.addEventListener('DOMContentLoaded', () => {
    const sections = Array.from(document.querySelectorAll('.section'));
    let current = 0;
  
    function showSection(index) {
      sections.forEach((sec, i) => sec.classList.toggle('active', i === index));
    }
  
    // Inicialmente mostrar la primera sección
    showSection(current);
  
    // Asignar evento a cada botón "Enviar"
    sections.forEach((section) => {
      const btn = section.querySelector('button');
      btn.addEventListener('click', () => {
        current++;
        if (current < sections.length) {
          showSection(current);
        } else {
          alert('Gracias por completar la encuesta');
        }
      });
    });
  });
  