document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }
    const success = document.getElementById("contactSuccess");
    if (success) success.classList.remove("d-none");
    form.reset();
    form.classList.remove("was-validated");
  });
});
