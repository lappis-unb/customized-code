const HEADER_SELECTORS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  ".wsite-headline",
  ".wsite-content-title",
  "div",
];
const SELECTORS = [
  ...HEADER_SELECTORS,
  "img",
  "p",
  "i",
  "svg",
  "a",
  "button:not(.asw-btn)",
  "label",
  "li",
  "ol",
  "div",
  "section",
  "footer",
  "header",
];

const FILTERS = {
  "dark-contrast": {
    styles: {
      color: "#FFF",
      fill: "#FFF",
      "background-color": "#000",
    },
    childrenSelector: SELECTORS,
  },
};
const STORAGE_KEY = "contrast";

let contrastSettings = {
  darkcontrast: false,
};

// ---------------- SETTINGS ----------------

function getSettings() {
  const savedSettings = localStorage.getItem(STORAGE_KEY);
  if (savedSettings) {
    contrastSettings = JSON.parse(savedSettings);
  } else {
    contrastSettings = {
      darkcontrast: false,
    };
  }
  return contrastSettings;
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contrastSettings));
}

// ---------------- MAIN ----------------
function renderFilter() {
  let { darkcontrast } = getSettings();

  let contrastCss = "";

  let contrastFilter = false;

  if (darkcontrast) {
    contrastFilter = FILTERS["dark-contrast"];
  }
  if (contrastFilter) {
    contrastCss = generateCSSFromConfig({
      ...contrastFilter,
      selector: `html.aws-filter`,
    });
  }

  addStylesheet({
    css: contrastCss,
    id: "asw-filter-style",
  });

  document.documentElement.classList.toggle(
    "aws-filter",
    Boolean(darkcontrast)
  );
}

// ---------------- CSSGENERATOR ----------------

function addStylesheet({ css, id }) {
  if (css) {
    let style =
      document.getElementById(id || "") || document.createElement("style");
    style.innerHTML = css;
    if (!style.id) {
      style.id = id;
      document.head.appendChild(style);
    }
  }
}

const browserPrefixes = ["-o-", "-ms-", "-moz-", "-webkit-", ""];
const propertiesNeedPrefix = ["filter"];

function generateCSS(styles) {
  let css = "";

  if (styles) {
    for (let key in styles) {
      let prefixes = propertiesNeedPrefix.includes(key)
        ? browserPrefixes
        : [""];
      prefixes.forEach((prefix) => {
        css += `${prefix}${key}:${styles[key]} !important;`;
      });
    }
  }

  return css;
}
function wrapCSSToSelector({ selector, childrenSelector = [""], css }) {
  let output = "";

  childrenSelector.forEach((childSelector) => {
    output += `${selector} ${childSelector}{${css}}`;
  });

  return output;
}

function generateCSSFromConfig(config) {
  let output = "";

  if (config) {
    output += config.css ?? "";
    output += generateCSS(config.styles);

    if (output.length && config.selector) {
      output = wrapCSSToSelector({
        selector: config.selector,
        childrenSelector: config.childrenSelector,
        css: output,
      });
    }
  }

  return output;
}

function injectToolCSS(config) {
  let { id = "", enable = false } = config;

  let toolId = `asw-${id}`;

  if (enable) {
    let css = generateCSSFromConfig(config);

    addStylesheet({
      css,
      id: toolId,
    });
  } else {
    document.getElementById(toolId)?.remove();
  }

  document.documentElement.classList.toggle(toolId, enable);
}

// ----------------
document.addEventListener("DOMContentLoaded", function () {
  var contrastButton = document.getElementById("contrast-button");
  if (contrastButton) {
    contrastButton.addEventListener("click", function () {
      contrastSettings.darkcontrast = !contrastSettings.darkcontrast;
      saveSettings();
      renderFilter();
    });
  }
});
