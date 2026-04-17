
// import { auth } from './firebase-config.js';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut
// } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const
  loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Handle login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('log-username').value;
    const password = document.getElementById('log-password').value;

      try{
          const response = await fetch("http://127.0.0.1:8000/login",{
              method: "POST",
              headers: {
                      'Content-Type': 'application/json'
                  },
              body: JSON.stringify({username: username, password: password})
          
        })
          const data = await response.json();
          console.log(data);
          
          if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            alert('Inicio de sesion exitoso! Bienvenido a la pagina.');
            window.location.href = 'index.html';
          } else {
            alert(`Error: ${data.detail || 'Error al registrar'}`);
          }

        } catch(error) {
            const errorMessage = error.message;
            alert(`Error al registrarse: ${errorMessage}`);
        };      
  });
}

// Handle registration
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }
      try{
          const response = await fetch("http://127.0.0.1:8000/register",{
              method: "POST",
              headers: {
                      'Content-Type': 'application/json'
                  },
              body: JSON.stringify({username: username, email: email, password: password})
          
        })
          const data = await response.json();
          console.log(data);
          
          if (response.ok) {
            alert('¡Registro exitoso! Serás redirigido a la página de login.');
            window.location.href = 'login.html';
          } else {
            alert(`Error: ${data.detail || 'Error al registrar'}`);
          }

        } catch(error) {
            const errorMessage = error.message;
            alert(`Error al registrarse: ${errorMessage}`);
          };

      });
    



    // createUserWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     // Signed in
    //     const user = userCredential.user;
    //     console.log('User registered:', user);
    //     alert('¡Registro exitoso! Serás redirigido a la página principal.');
    //     window.location.href = 'index.html';
    //   })
      // .catch((error) => {
      //   const errorCode = error.code;
      //   const errorMessage = error.message;
      //   alert(`Error al registrarse: ${errorMessage}`);
      // });
  // });
}

// Check auth state for pages that require login
async function verifyAuthentication() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const response = await fetch('http://127.0.0.1:8000/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = 'login.html';
      alert("Sesion expirada, usuario y contraseña para ingresar nuevamente. ")
    }
  } catch(error) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
}


// Handle logout
function logout() {
  try{
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = 'login.html';
  }
  catch{
    console.error('Sign out error:', error)
  }
}
// Export functions to be used in other modules
export { verifyAuthentication, logout };
