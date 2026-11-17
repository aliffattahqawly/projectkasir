export function animateToCart(button) {
  if (!button || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cart = document.querySelector("[data-cart-target]");
  const image = button.closest("article, .group")?.querySelector("img");
  if (!cart) return;

  const start = (image ?? button).getBoundingClientRect();
  const end = cart.getBoundingClientRect();
  const size = Math.min(start.width, start.height, 72);
  const flyer = document.createElement("div");
  Object.assign(flyer.style, {
    position: "fixed",
    left: `${start.left + start.width / 2 - size / 2}px`,
    top: `${start.top + start.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    zIndex: "100",
    pointerEvents: "none",
    borderRadius: "16px",
    background: "white",
    boxShadow: "0 8px 24px rgba(30, 64, 175, 0.3)",
    overflow: "hidden",
  });
  if (image) {
    const thumbnail = image.cloneNode();
    Object.assign(thumbnail.style, { width: "100%", height: "100%", objectFit: "contain", padding: "4px" });
    flyer.appendChild(thumbnail);
  } else {
    flyer.style.background = "#2563eb";
  }
  document.body.appendChild(flyer);
  const dx = end.left + end.width / 2 - (start.left + start.width / 2);
  const dy = end.top + end.height / 2 - (start.top + start.height / 2);
  const animation = flyer.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(0.7)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.15)`, opacity: 0 },
    ],
    { duration: 700, easing: "ease-in-out" }
  );
  animation.onfinish = () => {
    flyer.remove();
    cart.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
      { duration: 300, easing: "ease-out" }
    );
  };
  animation.oncancel = () => flyer.remove();
}
