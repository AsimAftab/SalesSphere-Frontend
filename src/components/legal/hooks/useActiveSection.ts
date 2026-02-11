import { useEffect, useState, useCallback } from 'react';

const NAVBAR_OFFSET = 100;

export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '');

  const findActive = useCallback(() => {
    if (sectionIds.length === 0) return;

    let currentId = sectionIds[0];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= NAVBAR_OFFSET + 20) {
        currentId = id;
      } else {
        break;
      }
    }

    setActiveId(currentId);
  }, [sectionIds]);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    findActive();

    window.addEventListener('scroll', findActive, { passive: true });
    return () => window.removeEventListener('scroll', findActive);
  }, [sectionIds, findActive]);

  return activeId;
}
