/**
 * Decorative icons for the local-detail cards (shared by LocationPage.jsx and the
 * static shell in vite.config.js). Inner SVG markup for a 24x24 stroke icon;
 * picked by card position, cycling.
 */
export const LOCAL_DETAIL_ICONS = [
  // map pin
  '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  // house
  '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  // leaf
  '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19c3-4 6-7 10-9"/>',
  // checklist
  '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.5 1.5L7 5M3.5 12l1.5 1.5L7 11M3.5 18l1.5 1.5L7 17"/>',
]

export const localDetailIcon = (index) =>
  LOCAL_DETAIL_ICONS[index % LOCAL_DETAIL_ICONS.length]

export const LOCAL_DETAIL_SVG_ATTRS =
  'class="local-detail__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"'
