import './css/styles.css';
import { supabase } from './supabaseClient';

const loginForm = document.getElementById('login-form');
const errorBox  = document.getElementById('error-box');

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const { email, password } = e.target.elements;

  // Wywołanie logowania
  const { error } = await supabase.auth.signInWithPassword({
    email:    email.value,
    password: password.value
  });

  if (error) {
    const messagesPL = {
      'Invalid login credentials': 'Nieprawidłowy email lub hasło.',
      'User not found':             'Użytkownik nie istnieje.',
      'Email not confirmed':        'Konto nie zostało potwierdzone. Sprawdź email.',
      'Invalid login credentials for email provider': 'Błędne dane logowania.',
    };
    const msgPL = messagesPL[error.message] || ('Wystąpił błąd: ' + error.message);
    errorBox.textContent = msgPL;
    errorBox.classList.remove('hidden');
  } else {
  
    window.location.href = '/index.html';
  }
});
