const timerStyles = new CSSStyleSheet();
timerStyles.replaceSync(`
  :root {
    font-family: 'Ellograph CF', monospace;
  }`);

class TimerElement extends HTMLElement {
  static observedAttributes = ['minutes', 'seconds', 'started'];

  static define(tag = 'presentation-timer') {
    customElements.define(tag, TimerElement);
  }

  constructor() {
    super();
  }

  shadowRoot: ShadowRoot = this.attachShadow({mode: 'open'});

  #seconds = 0;

  #running = false;

  #start = 0;

  #toggle() {
    if (this.#running) {
      this.#running = false;
    } else {
      this.#running = true;
      this.#start = performance.now();
      this.#animate();
    }
  }

  #animate() {
    const now = performance.now();
    const dt = now - (this.#start ?? now);
    this.#seconds -= dt / 1000;
    if (this.#seconds <= 0) {
      this.#seconds = 0;
      this.#running = false;
    }
    this.#update();
    this.#start = performance.now();
    if (this.#running) {
      requestAnimationFrame(this.#animate.bind(this));
    }
  }

  #readAttributes() {
    const minutes = this.getAttribute('minutes');
    if (minutes) {
      this.#seconds = parseFloat(minutes) * 60;
    }
    const seconds = this.getAttribute('seconds');
    if (seconds) {
      this.#seconds = parseFloat(seconds);
    }
    const started = this.getAttribute('started');
    if (started === 'true') {
      this.#running = true;
      this.#start = performance.now();
      this.#animate();
    }
  }

  #update() {
    this.shadowRoot.innerHTML = `<span>${Math.floor(this.#seconds / 60)
      .toFixed(0)
      .padStart(2, '0')}:${Math.floor(this.#seconds % 60)
      .toFixed(0)
      .padStart(2, '0')}</span>`;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.#readAttributes();
    this.#update();
  }

  connectedCallback() {
    this.shadowRoot.adoptedStyleSheets = [timerStyles];

    this.#update();
    this.getAttributeNames().forEach(name => {
      const attr = this.getAttribute(name);
      if (attr) {
        this.attributeChangedCallback(name, '', attr);
      }
    });

    window.addEventListener('keypress', e => {
      if (e.key === 't') {
        this.#toggle();
      }
      if (e.key === 'r') {
        this.#readAttributes();
        this.#update();
      }
      if (e.key === '+') {
        this.#seconds += 60;
        this.#update();
      }
      if (e.key === '-') {
        this.#seconds -= 60;
        this.#update();
      }
    });
  }
}

TimerElement.define();
