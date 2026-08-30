import { useEffect, useId, useRef, useState } from 'react';

/**
 * Bouton pill avec menu déroulant (toolbar dashboard)
 */
export default function ToolbarDropdown({
  icon,
  label,
  items,
  align = 'left',
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={`toolbar-dropdown${open ? ' is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="toolbar-pill-btn"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {icon && (
          <span className="material-symbols-outlined text-cyan-500 text-[17px]">{icon}</span>
        )}
        <span>{label}</span>
        <span className="material-symbols-outlined text-slate-400 text-[15px]">expand_more</span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className={`toolbar-dropdown-menu toolbar-dropdown-menu--${align}`}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className={`toolbar-dropdown-item${item.active ? ' is-active' : ''}${item.disabled ? ' is-disabled' : ''}`}
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                item.onSelect?.();
                setOpen(false);
              }}
            >
              {item.icon && (
                <span className="material-symbols-outlined toolbar-dropdown-item-icon">
                  {item.icon}
                </span>
              )}
              <span className="toolbar-dropdown-item-label">{item.label}</span>
              {item.hint && <span className="toolbar-dropdown-item-hint">{item.hint}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
