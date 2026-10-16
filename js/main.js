/* StoryCast: progressive enhancement only.
   Every page works without this file; it adds the mobile menu, the library
   filter, and transcript ↔ media syncing. */
(() => {
  'use strict';

  /* 1. Mobile menu ------------------------------------------------------- */
  const toggle = document.querySelector('.site-header__toggle');
  const nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    // Escape closes the menu and returns focus to the button
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* 2. Library filter ---------------------------------------------------- */
  const filter = document.querySelector('[data-filter]');

  if (filter) {
    filter.hidden = false; // revealed only when JS is running
    const buttons = filter.querySelectorAll('[data-filter-value]');
    const items = document.querySelectorAll('[data-category]');
    const status = document.querySelector('[data-filter-status]');

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.filterValue;
        let shown = 0;

        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));

        items.forEach((item) => {
          const match = value === 'all' || item.dataset.category === value;
          item.hidden = !match;
          if (match) shown += 1;
        });

        // role="status" announces this politely to screen readers
        if (status) {
          status.textContent = `${shown} ${shown === 1 ? 'story' : 'stories'} shown`;
        }
      });
    });
  }

  /* 3. Transcript sync + live captions for audio ------------------------- */
  const media = document.getElementById('story-media');

  if (media) {
    const cues = Array.from(document.querySelectorAll('.transcript__cue'));
    const liveCaption = document.querySelector('[data-live-caption]');

    // Click a timestamp → jump to that moment
    document.querySelectorAll('[data-seek]').forEach((button) => {
      button.addEventListener('click', () => {
        media.currentTime = Number(button.dataset.seek);
        media.play();
      });
    });

    // Highlight the current cue (marked for assistive tech with aria-current)
    media.addEventListener('timeupdate', () => {
      let current = -1;
      cues.forEach((cue, index) => {
        if (media.currentTime >= Number(cue.dataset.start)) current = index;
      });
      cues.forEach((cue, index) => {
        const active = index === current;
        cue.classList.toggle('is-active', active);
        if (active) cue.setAttribute('aria-current', 'true');
        else cue.removeAttribute('aria-current');
      });
    });

    // <audio> cannot draw captions itself, so render the <track> text ourselves.
    // (<video> shows its captions natively, so this only runs for audio.)
    if (liveCaption && media.textTracks.length) {
      const track = media.textTracks[0];
      track.mode = 'hidden'; // load cues without browser rendering
      track.addEventListener('cuechange', () => {
        const cue = track.activeCues && track.activeCues[0];
        liveCaption.textContent = cue ? cue.text : '';
      });
    }
  }
})();
