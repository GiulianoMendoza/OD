const BOOTSTRAP_CDN = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";

const CUSTOM_STYLES = `
  body { background-color: #f8f9fa; }
  .small-muted { font-size: .875rem; color: #6c757d; }
  input[type="number"] { max-width: 140px; }
  .wk-badge { min-width: 6.5rem; display: inline-block; text-align: center; }
  .sticky-col { position: sticky; top: 1rem; }
  @media (max-width: 991.98px) {
    .sticky-col { position: static; top: auto; }
  }
`;

export const injectStyles = () => {
  if (!document.querySelector(`link[href="${BOOTSTRAP_CDN}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = BOOTSTRAP_CDN;
    document.head.appendChild(link);
  }

  if (!document.getElementById("routine-custom-styles")) {
    const style = document.createElement("style");
    style.id = "routine-custom-styles";
    style.textContent = CUSTOM_STYLES;
    document.head.appendChild(style);
  }
};
