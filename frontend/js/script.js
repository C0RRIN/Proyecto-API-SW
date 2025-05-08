const apiUrl = '/api/auth';

// Función de inicio de sesión
async function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Por favor, ingresa tu correo y contraseña.');
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log('Login response:', data);

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      alert('Inicio de sesión exitoso');
      window.location.href = 'consentimiento.html';
    } else {
      alert(data.message || 'Credenciales inválidas o token no recibido.');
    }
  } catch (err) {
    console.error('Error de conexión (login):', err);
    alert('No se pudo conectar con el servidor.');
  }
}

// Función de registro
async function register() {
  const firstName = document.getElementById('register-firstName').value.trim();
  const lastName  = document.getElementById('register-lastName').value.trim();
  const email     = document.getElementById('register-email').value.trim();
  const password  = document.getElementById('register-password').value;

  if (!firstName || !lastName || !email || !password) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password })
    });
    const data = await res.json();
    console.log('Register response:', data);

    if (res.ok) {
      alert('Registro exitoso, ahora puedes iniciar sesión.');
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Error en el registro.');
    }
  } catch (err) {
    console.error('Error de conexión (register):', err);
    alert('No se pudo conectar con el servidor.');
  }
}

// Registrar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-button');
  if (loginBtn) {
    loginBtn.addEventListener('click', login);
  }

  const registerBtn = document.getElementById('register-button');
  if (registerBtn) {
    registerBtn.addEventListener('click', register);
  }
});
