import { auth } from './firebaseConfig.js';
import { login, register } from './auth.js';
import { onAuthStateChanged } from 'firebase/auth';

// ตรวจสอบสถานะล็อกอิน
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = 'game.html'; // ถ้าล็อกอินแล้วไปหน้าเกม
  }
});

// จัดการฟอร์มล็อกอิน
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await login(email, password);
    // redirect จะเกิดขึ้นโดย onAuthStateChanged
  } catch (error) {
    document.getElementById('login-message').textContent = error.message;
  }
});

// จัดการฟอร์มสมัคร
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  try {
    await register(email, password, username);
  } catch (error) {
    document.getElementById('login-message').textContent = error.message;
  }
});
