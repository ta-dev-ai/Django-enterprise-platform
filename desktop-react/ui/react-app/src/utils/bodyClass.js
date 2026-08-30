const PAGE_BODY_CLASSES = [
  'home-body',
  'about-page',
  'login-body',
  'error-body',
  'swiss-vitrine',
  'py-12',
  'bg-slate-50',
];

export function setPageBodyClasses(...classes) {
  PAGE_BODY_CLASSES.forEach((className) => document.body.classList.remove(className));
  classes
    .filter(Boolean)
    .flatMap((entry) => entry.split(/\s+/))
    .forEach((className) => document.body.classList.add(className));
}

export function clearPageBodyClasses() {
  PAGE_BODY_CLASSES.forEach((className) => document.body.classList.remove(className));
}
