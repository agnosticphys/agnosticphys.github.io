const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab, focus = false) {
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    item.classList.toggle('active', active);
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
  document.dispatchEvent(new CustomEvent('site-content-change', { detail: { elements: [document.getElementById(tab.getAttribute('aria-controls'))] } }));
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
  });
});

const filters = [...document.querySelectorAll('.publication-filter')];
const papers = [...document.querySelectorAll('.publication-entry')];
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  papers.forEach(paper => {
    const show = selected === 'all' || paper.dataset.kind === selected;
    paper.hidden = !show;
    if (show) count++;
  });
  document.dispatchEvent(new CustomEvent('site-content-change', { detail: { elements: papers.filter(paper => !paper.hidden) } }));
  document.getElementById('publication-count').textContent = `${count} ${count === 1 ? 'work' : 'works'} shown`;
}));
