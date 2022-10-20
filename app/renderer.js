// const { shell } = require(["electron"]);

const linksSection = document.querySelector(".links");
const errorMessage = document.querySelector(".error-message");
const newLinkForm = document.querySelector(".new-link-form");
const newLinkUrl = document.querySelector(".new-link-url");
const newLinkButton = document.querySelector(".new-link-button");
const clearStorage = document.querySelector(".clear-storage");

const parser = new DOMParser();


const parserResponse = (text) => {
  return parser.parseFromString(text, "text/html");
};

const findTitle = (nodes) => {
  return nodes.querySelector("title").innerText;
};

const storeLink = (title, url) => {
  localStorage.setItem(url, JSON.stringify({ title, url }));
};
const getLinks = () => {
  return Object.keys(localStorage).map((key) =>
    JSON.parse(localStorage.getItem(key))
  );
};
const createLinkElement = (link) => {
  return `
        <div class="link">
            <h3>${link.title}</h3>
            <p>
                <a href="${link.url}">${link.url}</a>
            </p>
        </div>
    `;
};
const renderLinks = () => {
  const linkElements = getLinks().map(createLinkElement).join("");
  linksSection.innerHTML = linkElements;
};
const clearForm = () => {
  newLinkUrl.value = null;
};
const handleError = (error, url) => {
  errorMessage.innerHTML = `
        There was an issue adding "${url}": ${error.message}
    `.trim();
  setTimeout(() => (errorMessage.innerText = null), 5000);
};
// EVENTS
renderLinks();

newLinkUrl.addEventListener("keyup", () => {
  newLinkButton.disabled = !newLinkUrl.validity.valid;
});

clearStorage.addEventListener("click", () => {
  localStorage.clear();
  linksSection.innerHTML = "";
});

newLinkForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = newLinkUrl.value;
  try {
    const response = await fetch(url);
    const text = await response.text();
    const html = parserResponse(text);
    const title = findTitle(html);
    storeLink(title, url);
    renderLinks();
    clearForm();
  } catch (error) {
    handleError(error, url);
  }
});
linksSection.addEventListener("click", (event) => {
    if (event.target.href) {
        event.preventDefault();
        // shell.openExternal(event.target.href);
    }
});