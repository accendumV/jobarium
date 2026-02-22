/**
 * Glass Select - enhances native selects with custom glass-styled dropdown.
 * Targets: .field-confirm-card select, .glass-card select
 */
(function () {
  function init() {
    const selects = Array.from(document.querySelectorAll(".field-confirm-card select, .glass-card select"));
    if (!selects.length) return;

    const instances = [];

    function closeAll(except) {
      instances.forEach(({ shell, trigger, menu }) => {
        if (shell === except) return;
        shell.classList.remove("is-open");
        menu.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      });
    }

    function positionMenu(instance) {
      const { shell, trigger, menu } = instance;
      if (!shell.classList.contains("is-open")) return;
      const rect = trigger.getBoundingClientRect();
      menu.style.left = `${rect.left}px`;
      menu.style.top = `${rect.bottom + 8}px`;
      menu.style.width = `${rect.width}px`;
    }

    function positionOpenMenus() {
      instances.forEach((instance) => positionMenu(instance));
    }

    selects.forEach((select, idx) => {
      if (select.classList.contains("glass-select-native")) return;

      const shell = document.createElement("div");
      shell.className = "glass-select";
      shell.dataset.selectId = `glassSelect${idx}`;

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "glass-select-trigger";
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-controls", `${shell.dataset.selectId}-menu`);

      const valueText = document.createElement("span");
      valueText.className = "glass-select-value";
      trigger.appendChild(valueText);

      const menu = document.createElement("div");
      menu.className = "glass-select-menu is-portal";
      menu.id = `${shell.dataset.selectId}-menu`;
      menu.setAttribute("role", "listbox");
      menu.setAttribute("aria-label", select.getAttribute("aria-label") || select.id || "Select option");
      document.body.appendChild(menu);

      Array.from(select.options).forEach((opt) => {
        const optionBtn = document.createElement("button");
        optionBtn.type = "button";
        optionBtn.className = "glass-select-option";
        optionBtn.dataset.value = opt.value;
        optionBtn.textContent = opt.textContent;
        optionBtn.setAttribute("role", "option");
        optionBtn.disabled = opt.disabled;
        optionBtn.addEventListener("click", () => {
          if (opt.disabled) return;
          select.value = opt.value;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          closeAll();
        });
        menu.appendChild(optionBtn);
      });

      function syncUi() {
        const selectedOption = select.options[select.selectedIndex] || select.options[0];
        valueText.textContent = selectedOption ? selectedOption.textContent : "Select...";
        menu.querySelectorAll(".glass-select-option").forEach((btn) => {
          const isActive = btn.dataset.value === select.value;
          btn.classList.toggle("is-active", isActive);
          btn.setAttribute("aria-selected", isActive ? "true" : "false");
        });
      }

      trigger.addEventListener("click", () => {
        const opening = !shell.classList.contains("is-open");
        closeAll(shell);
        shell.classList.toggle("is-open", opening);
        menu.classList.toggle("is-open", opening);
        trigger.setAttribute("aria-expanded", opening ? "true" : "false");
        if (opening) positionMenu({ shell, trigger, menu });
      });

      select.classList.add("glass-select-native");
      select.insertAdjacentElement("afterend", shell);
      shell.appendChild(trigger);
      select.addEventListener("change", syncUi);
      syncUi();
      instances.push({ shell, trigger, menu });
    });

    document.addEventListener("click", (event) => {
      const isInside = event.target.closest(".glass-select, .glass-select-menu");
      if (!isInside) closeAll();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAll();
    });

    window.addEventListener("resize", positionOpenMenus);
    window.addEventListener("scroll", positionOpenMenus, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
