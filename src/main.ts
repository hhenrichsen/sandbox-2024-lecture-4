// Styles
import 'reveal.js/dist/reveal.css';
import '@catppuccin/highlightjs/css/catppuccin-mocha.css';
import '@catppuccin/palette/css/catppuccin.css';
import './styles/catppuccin.css';
import './styles/index.css';
import '../fonts/fonts.css';

// WebComponents
import 'iconify-icon';
import '@motion-canvas/player';

// Actual packages
import Markdown from 'reveal.js/plugin/markdown/markdown.esm';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm';
import Reveal from 'reveal.js';

const deck = new Reveal({
  plugins: [Markdown, Highlight],
  hash: true,
  slideNumber: true,
});
deck.initialize();

(function prependBase() {
  const base = import.meta.env.BASE_URL;
  if (!base) {
    return;
  }
  document.querySelectorAll('motion-canvas-player').forEach(player => {
    let url = player.getAttribute('src');
    if (url?.startsWith('/')) {
      url = base + url.slice(1);
      const newElement = document.createElement('motion-canvas-player');
      newElement.setAttribute('auto', player.getAttribute('auto') ?? 'true');
      newElement.setAttribute('src', url);
      player.replaceWith(newElement);
    }
  });
})();
