/**
 * ChatPanel — KM-only chat with suggested question chips.
 */

const datasetId = window.DATASET_ID;
const messagesEl = document.getElementById('chat-messages');
const chipsEl = document.getElementById('chat-chips');

async function loadChips() {
  const res = await fetch(`/api/datasets/${datasetId}/knowledge`);
  const { manifest } = await res.json();
  chipsEl.innerHTML = '';
  for (const q of manifest.insights?.suggested_questions || []) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'text-xs px-2 py-1 rounded bg-white/10';
    btn.textContent = q;
    btn.addEventListener('click', () => sendMessage(q));
    chipsEl.appendChild(btn);
  }
}

function appendMessage(text, role = 'assistant') {
  const div = document.createElement('div');
  div.className = role === 'user' ? 'text-right opacity-90' : '';
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage(message) {
  appendMessage(message, 'user');
  const res = await fetch(`/api/datasets/${datasetId}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  appendMessage(data.answer || data.error || 'Erreur');
  if (data.chart_spec) {
    window.dispatchEvent(new CustomEvent('chat:chart', { detail: data.chart_spec }));
  }
}

document.getElementById('chat-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  sendMessage(msg);
});

loadChips();
