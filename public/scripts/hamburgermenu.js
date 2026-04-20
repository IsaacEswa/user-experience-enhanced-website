const sidebar = document.getElementById("sidebar");
const openBtn = document.getElementById("hamburger-icon");
const closeBtn = document.getElementById("close-icon");

const focusableSelectors = 'a, button, [tabindex]:not([tabindex="-1"])';

openBtn.addEventListener("click", showSidebar);
closeBtn.addEventListener("click", hideSidebar);

function showSidebar() {
    sidebar.classList.add("open");
    sidebar.setAttribute("aria-hidden", "false");

    const focusable = sidebar.querySelectorAll(focusableSelectors);
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    firstFocusable.focus();

    sidebar.onkeydown = function (e) {

        if (e.key === "Tab") {
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }

            if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }

        if (e.key === "Escape") {
            hideSidebar();
        }
    };
}

function hideSidebar() {
    sidebar.classList.remove("open");
    sidebar.setAttribute("aria-hidden", "true");

    openBtn.focus(); // focus terug naar hamburger
}