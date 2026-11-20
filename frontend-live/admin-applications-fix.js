(function () {
  "use strict";

  function fixApplicationsTable() {
    var tables = document.querySelectorAll("table");

    tables.forEach(function (table) {
      var headers = Array.from(
        table.querySelectorAll("thead th")
      ).map(function (th) {
        return (th.textContent || "").trim().toLowerCase();
      });

      if (
        headers.includes("candidate") &&
        headers.includes("email") &&
        headers.includes("phone") &&
        headers.includes("course") &&
        headers.includes("status") &&
        headers.includes("resume")
      ) {
        var wrapper = table.parentElement;

        if (wrapper) {
          wrapper.classList.add("applications-fit-wrapper");
        }

        table.classList.add("applications-fit-table");
      }
    });
  }

  fixApplicationsTable();

  var observer = new MutationObserver(function () {
    fixApplicationsTable();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  setInterval(fixApplicationsTable, 1500);
})();
