export const el = (tag, props = {}, children = []) => {
  const node = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "className") {
      node.className = value;
    } else if (key === "text") {
      node.textContent = value;
    } else if (key === "dataset") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        node.dataset[dataKey] = dataValue;
      });
    } else if (key in node) {
      node[key] = value;
    } else {
      node.setAttribute(key, value);
    }
  });

  const arr = Array.isArray(children) ? children : [children];
  arr.filter(Boolean).forEach((child) => node.appendChild(child));

  return node;
};

export const clear = (node) => {
  while (node.firstChild) node.removeChild(node.firstChild);
};
