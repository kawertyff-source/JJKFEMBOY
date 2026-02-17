import { auth } from './firebaseConfig.js';
import { login, register } from './auth.js';
import { onAuthStateChanged } from 'firebase/auth';

// ตรวจสอบสถานะล็อกอิน
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'game.html';
    }
});

// สลับระหว่างฟอร์ม Login/Register
document.getElementById('show-login').addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('show-login').classList.add('active');
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('login-form-container').classList.add('active');
    document.getElementById('auth-message').textContent = ''; // ล้างข้อความเก่า
});

document.getElementById('show-register').addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('show-register').classList.add('active');
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('register-form-container').classList.add('active');
    document.getElementById('auth-message').textContent = '';
});

// จัดการฟอร์มล็อกอิน
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageDiv = document.getElementById('auth-message');
    
    try {
        await login(email, password);
        // เมื่อสำเร็จ onAuthStateChanged จะพาไป game.html
    } catch (error) {
        messageDiv.textContent = '❌ ' + error.message;
    }
});

// จัดการฟอร์มสมัครสมาชิก
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const messageDiv = document.getElementById('auth-message');
    
    if (password.length < 6) {
        messageDiv.textContent = '❌ รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
        return;
    }
    
    try {
        await register(email, password, username);
        messageDiv.textContent = '✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ';
        // สลับไปหน้า login อัตโนมัติ
        document.getElementById('show-login').click();
        // เคลียร์ฟอร์มสมัคร
        document.getElementById('register-form').reset();
    } catch (error) {
        messageDiv.textContent = '❌ ' + error.message;
    }
});
