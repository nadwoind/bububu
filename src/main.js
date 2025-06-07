import './css/styles.css';
import { supabase } from './supabaseClient';

const articlesContainer = document.getElementById('articles');
const addBtn             = document.getElementById('add-article-btn');
const addDialog          = document.getElementById('add-dialog');
const editDialog         = document.getElementById('edit-dialog');
const deleteDialog       = document.getElementById('delete-dialog');

// Ustawienie widoczności przycisków w oparciu o sesję
async function setAuthState() {
  const { data: { session } } = await supabase.auth.getSession();
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const addBtn = document.getElementById('add-article-btn');
  const editBtns = document.querySelectorAll('.edit-btn');
  const deleteBtns = document.querySelectorAll('.delete-btn');

  if (session) {
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    addBtn.classList.remove('hidden');
    editBtns.forEach(b => b.classList.remove('hidden'));
    deleteBtns.forEach(b => b.classList.remove('hidden'));
  } else {
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    addBtn.classList.add('hidden');
    editBtns.forEach(b => b.classList.add('hidden'));
    deleteBtns.forEach(b => b.classList.add('hidden'));
  }
}

// Pobranie i wyrenderowanie artykułów
async function fetchArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Fetch error:', error);
    return;
  }

  articlesContainer.innerHTML = '';
  data.forEach(article => {
    const el = document.createElement('article');
    el.className = 'p-4 mb-4 bg-white rounded shadow';
    el.innerHTML = `
      <header class="mb-2">
        <h2 class="text-xl font-semibold">${article.title}</h2>
        <h3 class="text-sm text-gray-600">${article.subtitle || ''}</h3>
      </header>
      <p class="text-xs text-gray-500 mb-2">
        Autor: ${article.author} • ${new Date(article.created_at).toLocaleString()}
      </p>
      <section class="prose prose-sm">${article.content}</section>
      <footer class="mt-4 flex space-x-2">
        <button data-id="${article.id}" class="edit-btn px-3 py-1 rounded transition-transform duration-200 ease-in-out hover:scale-105">Edytuj</button>
        <button data-id="${article.id}" class="delete-btn px-3 py-1 rounded transition-transform duration-200 ease-in-out hover:scale-105">Usuń</button>
      </footer>
    `;
    articlesContainer.appendChild(el);
  });
  attachArticleButtons();
  await setAuthState();
}

// Podpięcie eventów do przycisków CRUD
function attachArticleButtons() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditDialog(btn.dataset.id));
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteDialog(btn.dataset.id));
  });
}

// Dodawanie
addBtn.addEventListener('click', () => addDialog.showModal());
addDialog.querySelector('form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const { title, subtitle, author, content } = form.elements;

  const { error } = await supabase
    .from('articles')
    .insert([{ title: title.value, subtitle: subtitle.value, author: author.value, content: content.value }], { returning: 'representation' });

  if (error) {
    alert('Błąd dodawania: ' + error.message);
    return;
  }

  form.reset();
  addDialog.close();
  fetchArticles();
});

// Edycja
let currentEditId = null;
function openEditDialog(id) {
  currentEditId = id;
  const articleEl = document.querySelector(`[data-id="${id}"]`).closest('article');
  editDialog.querySelector('[name=title]').value = articleEl.querySelector('h2').textContent;
  editDialog.querySelector('[name=subtitle]').value = articleEl.querySelector('h3').textContent;
  editDialog.querySelector('[name=author]').value = articleEl.querySelector('p').textContent.split('•')[0].replace('Autor: ', '').trim();
  editDialog.querySelector('[name=content]').value = articleEl.querySelector('section').innerHTML;
  editDialog.showModal();
}
editDialog.querySelector('form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const { title, subtitle, author, content } = form.elements;

  const { error } = await supabase
    .from('articles')
    .update({ title: title.value, subtitle: subtitle.value, author: author.value, content: content.value })
    .eq('id', currentEditId);

  if (error) {
    alert('Błąd edycji: ' + error.message);
    return;
  }

  editDialog.close();
  fetchArticles();
});

// Usuwanie
let currentDeleteId = null;
function openDeleteDialog(id) {
  currentDeleteId = id;
  deleteDialog.showModal();
}
deleteDialog.querySelector('#cancel-delete').addEventListener('click', () => deleteDialog.close());
deleteDialog.querySelector('form').addEventListener('submit', async e => {
  e.preventDefault();

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', currentDeleteId);

  if (error) {
    alert('Błąd usuwania: ' + error.message);
    return;
  }

  deleteDialog.close();
  fetchArticles();
});

// Wylogowanie
document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  await setAuthState();
  fetchArticles();
});

// Start
window.addEventListener('DOMContentLoaded', async () => {
  await setAuthState();
  fetchArticles();
});
