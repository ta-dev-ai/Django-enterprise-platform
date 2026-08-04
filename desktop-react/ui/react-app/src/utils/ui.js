export function clearContainer(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '';
}

export function renderList(containerId, data) {
  if (!data || !data.length) return;
  const container = document.getElementById(containerId);
  if (!container) return; 

  clearContainer(containerId);
  const mid = Math.ceil(data.length / 2);
  const col1 = data.slice(0, mid);
  const col2 = data.slice(mid); 

  const createCol = (items) => {
    const col = document.createElement('div');
    col.className = 'list-column';
    items.forEach((item) => {
      col.innerHTML += `
                  <div class="list-row">
                      <div class="dot" style="background-color: ${item.color};"></div>
                      <div class="row-content">
                          <span class="row-name">${item.name}</span>
                          <span class="row-percent">${item.percent}%</span>
                      </div>
                  </div>
              `;
    });
    return col;
  };

  container.appendChild(createCol(col1));
  container.appendChild(createCol(col2));
}
