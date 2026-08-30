export function scrollToHomeSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  const headerOffset = 96;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, behavior: 'smooth' });
}
