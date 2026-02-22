/**
 * Glass Date Picker - custom styled date picker for glass theme.
 * Usage: add class "glass-date-picker" to an input[type="date"].
 * The input stays in DOM for form submission; we add a visual trigger + dropdown.
 */
(function () {
  const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function fmt(date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
  }

  function parse(str) {
    if (!str) return null;
    const [y, m, d] = str.split("-").map(Number);
    if (!y || !m || !d) return null;
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  }

  function toISO(d) {
    return d.toISOString().slice(0, 10);
  }

  function renderCalendar(year, month, selectedDate, today) {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = first.getDay();
    const days = last.getDate();
    const prevMonth = new Date(year, month, 0);
    const prevDays = prevMonth.getDate();
    let html = "";
    for (let i = 0; i < startPad; i++) {
      const d = prevDays - startPad + i + 1;
      html += `<button type="button" class="glass-date-day is-other-month" data-date="${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}">${d}</button>`;
    }
    for (let d = 1; d <= days; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const date = new Date(year, month, d);
      let cls = "glass-date-day";
      if (selectedDate && toISO(selectedDate) === iso) cls += " is-selected";
      if (today && toISO(today) === iso) cls += " is-today";
      html += `<button type="button" class="${cls}" data-date="${iso}">${d}</button>`;
    }
    const remaining = 42 - (startPad + days);
    const nextMonth = new Date(year, month + 1, 1);
    for (let i = 0; i < remaining; i++) {
      const d = i + 1;
      html += `<button type="button" class="glass-date-day is-other-month" data-date="${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}">${d}</button>`;
    }
    return html;
  }

  function initPicker(input) {
    if (input.dataset.glassDatePicker) return;
    input.dataset.glassDatePicker = "1";

    const wrapper = document.createElement("div");
    wrapper.className = "glass-date-picker-wrap";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "glass-date-trigger input";
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", "Choose date");
    trigger.innerHTML = `<span class="glass-date-value"></span><span class="glass-date-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>`;

    const dropdown = document.createElement("div");
    dropdown.className = "glass-date-dropdown";
    dropdown.setAttribute("role", "dialog");
    dropdown.setAttribute("aria-modal", "true");
    dropdown.setAttribute("aria-label", "Calendar");
    dropdown.hidden = true;

    let viewYear = new Date().getFullYear();
    let viewMonth = new Date().getMonth();

    function updateTrigger() {
      const val = input.value;
      const valueEl = trigger.querySelector(".glass-date-value");
      valueEl.textContent = val ? fmt(parse(val)) : "dd.mm.yyyy";
      trigger.classList.toggle("is-empty", !val);
    }

    function buildDropdown() {
      const selected = parse(input.value);
      const today = new Date();
      dropdown.innerHTML = `
        <div class="glass-date-header">
          <button type="button" class="glass-date-nav" data-dir="prev" aria-label="Previous month">&lsaquo;</button>
          <span class="glass-date-month">${MONTHS[viewMonth]} ${viewYear}</span>
          <button type="button" class="glass-date-nav" data-dir="next" aria-label="Next month">&rsaquo;</button>
        </div>
        <div class="glass-date-days-header">
          ${DAYS.map((d) => `<span class="glass-date-dow">${d}</span>`).join("")}
        </div>
        <div class="glass-date-grid">
          ${renderCalendar(viewYear, viewMonth, selected, today)}
        </div>
        <div class="glass-date-actions">
          <button type="button" class="glass-date-btn-clear">Clear</button>
          <button type="button" class="glass-date-btn-today">Today</button>
        </div>
      `;
    }

    function open() {
      viewYear = input.value ? parse(input.value).getFullYear() : new Date().getFullYear();
      viewMonth = input.value ? parse(input.value).getMonth() : new Date().getMonth();
      buildDropdown();
      document.body.appendChild(dropdown);
      const rect = trigger.getBoundingClientRect();
      dropdown.style.top = `${rect.bottom + 8}px`;
      dropdown.style.left = `${rect.left}px`;
      dropdown.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }

    function close() {
      dropdown.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      if (dropdown.parentNode) dropdown.parentNode.removeChild(dropdown);
      wrapper.appendChild(dropdown);
    }

    function setValue(iso) {
      input.value = iso || "";
      updateTrigger();
      input.dispatchEvent(new Event("change", { bubbles: true }));
      close();
    }

    input.addEventListener("focus", () => {
      trigger.focus();
      open();
    });

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      if (dropdown.hidden) open();
      else close();
    });

    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
      const day = e.target.closest(".glass-date-day");
      if (day) {
        e.preventDefault();
        setValue(day.dataset.date);
        return;
      }
      if (e.target.closest(".glass-date-nav")) {
        e.preventDefault();
        const dir = e.target.closest(".glass-date-nav").dataset.dir;
        if (dir === "prev") {
          viewMonth--;
          if (viewMonth < 0) {
            viewMonth = 11;
            viewYear--;
          }
        } else {
          viewMonth++;
          if (viewMonth > 11) {
            viewMonth = 0;
            viewYear++;
          }
        }
        buildDropdown();
        return;
      }
      if (e.target.closest(".glass-date-btn-today")) {
        e.preventDefault();
        setValue(toISO(new Date()));
        return;
      }
      if (e.target.closest(".glass-date-btn-clear")) {
        e.preventDefault();
        setValue("");
        return;
      }
    });

    document.addEventListener("click", function outside(e) {
      if (!dropdown.hidden && !wrapper.contains(e.target)) close();
    });

    window.addEventListener("scroll", function onScroll() {
      if (!dropdown.hidden) close();
    }, true);

    input.after(wrapper);
    wrapper.appendChild(input);
    wrapper.appendChild(trigger);
    wrapper.appendChild(dropdown);

    input.classList.add("glass-date-input-hidden");
    input.setAttribute("tabindex", "-1");
    updateTrigger();
  }

  function init() {
    document.querySelectorAll('input[type="date"].glass-date-picker').forEach(initPicker);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.GlassDatePicker = { init };
})();
