document.getElementById("uploadForm").addEventListener("submit", async function(e) {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData(form);
  
    try {
      const response = await fetch("http://localhost:8081/clickhouse/upload", {
        method: "POST",
        body: formData
      });
  
      const result = await response.text();
      document.getElementById("uploadResult").innerText = result;
    } catch (err) {
      document.getElementById("uploadResult").innerText = "Error: " + err.message;
    }
  });
  document.getElementById("listTablesForm").addEventListener("submit", async function(e) {
    e.preventDefault();
  
    const form = e.target;
    const requestData = {
      host: form.host.value,
      port: form.port.value,
      database: form.database.value,
      user: form.user.value,
      token: form.token.value
    };
  
    try {
      const response = await fetch("http://localhost:8081/clickhouse/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
  
      const result = await response.json();
      document.getElementById("tableListResult").innerHTML = "<b>Tables:</b><br>" + result.join("<br>");
    } catch (err) {
      document.getElementById("tableListResult").innerText = "Error: " + err.message;
    }
  });
  document.getElementById("viewRowsForm").addEventListener("submit", async function(e) {
    e.preventDefault();
  
    const form = e.target;
    const requestData = {
      host: form.host.value,
      port: form.port.value,
      database: form.database.value,
      user: form.user.value,
      token: form.token.value,
      table: form.table.value
    };
  
    try {
      const response = await fetch("http://localhost:8081/clickhouse/rows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
  
      const rows = await response.json();
      const outputDiv = document.getElementById("tableRowsResult");
  
      if (Array.isArray(rows)) {
        outputDiv.innerHTML = "<b>Rows:</b><br>" + rows.map(row => JSON.stringify(row)).join("<br>");
      } else {
        outputDiv.innerHTML = "<b>Error:</b><br>" + JSON.stringify(rows);
      }
  
    } catch (err) {
      document.getElementById("tableRowsResult").innerText = "Error: " + err.message;
    }
  });
  
  document.getElementById("filterForm").addEventListener("submit", async function(e) {
    e.preventDefault();
  
    const form = e.target;
    const formData = new URLSearchParams();
    formData.append("host", form.host.value);
    formData.append("port", form.port.value);
    formData.append("database", form.database.value);
    formData.append("user", form.user.value);
    formData.append("token", form.token.value);
    formData.append("filters", form.filters.value);
    formData.append("table", form.table.value); // include table name
  
    try {
      const response = await fetch("http://localhost:8081/clickhouse/filtered-rows", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });
  
      const rows = await response.json();
      const resultDiv = document.getElementById("filterResult");
  
      if (!Array.isArray(rows)) {
        resultDiv.innerText = "Error: Unexpected response.";
        return;
      }
  
      if (rows.length === 0) {
        resultDiv.innerText = "No results found.";
        return;
      }
  
      // Build a nice HTML table
      let html = "<table border='1' cellpadding='5'><tr>";
      const keys = Object.keys(rows[0]);
      keys.forEach(key => {
        html += `<th>${key}</th>`;
      });
      html += "</tr>";
  
      rows.forEach(row => {
        html += "<tr>";
        keys.forEach(key => {
          html += `<td>${row[key]}</td>`;
        });
        html += "</tr>";
      });
  
      html += "</table>";
      resultDiv.innerHTML = html;
  
    } catch (err) {
      document.getElementById("filterResult").innerText = "Error: " + err.message;
    }
  });
  document.getElementById("tableSelect").addEventListener("change", async function(e) {
    const table = e.target.value;
    const outputDiv = document.getElementById("tableRowsResult");
  
    const host = "localhost";
    const port = 8123;
    const database = "default";
    const user = "default";
    const token = "";
  
    try {
      const response = await fetch("http://localhost:8081/clickhouse/rows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ host, port, database, user, token, table })
      });
  
      const rows = await response.json();
  
      if (!Array.isArray(rows)) {
        outputDiv.innerText = "Error: Unexpected response.";
        return;
      }
  
      if (rows.length === 0) {
        outputDiv.innerText = "No rows found.";
        return;
      }
  
      // Build a nice HTML table (like filterResult)
      let html = "<table border='1' cellpadding='5'><tr>";
      const keys = Object.keys(rows[0]);
      keys.forEach(key => {
        html += `<th>${key}</th>`;
      });
      html += "</tr>";
  
      rows.forEach(row => {
        html += "<tr>";
        keys.forEach(key => {
          html += `<td>${row[key]}</td>`;
        });
        html += "</tr>";
      });
  
      html += "</table>";
      outputDiv.innerHTML = html;
  
    } catch (err) {
      outputDiv.innerText = "Error: " + err.message;
    }
  });
  
  document.getElementById("executeSqlForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new URLSearchParams();
    formData.append("host", form.host.value);
    formData.append("port", form.port.value);
    formData.append("database", form.database.value);
    formData.append("user", form.user.value);
    formData.append("token", form.token.value);
    formData.append("query", form.query.value);
  
    try {
      const response = await fetch("http://localhost:8081/clickhouse/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });
  
      const result = await response.text();
      document.getElementById("sqlResult").innerText = result;
    } catch (err) {
      document.getElementById("sqlResult").innerText = "Error: " + err.message;
    }
  });
document.getElementById("deleteRowForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new URLSearchParams();
  formData.append("id", form.id.value);
  formData.append("host", form.host.value);
  formData.append("port", form.port.value);
  formData.append("database", form.database.value);
  formData.append("user", form.user.value);
  formData.append("token", form.token.value);
  formData.append("table", form.table.value);

  try {
    const response = await fetch("http://localhost:8081/clickhouse/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    const result = await response.text();
    document.getElementById("deleteResult").innerText = result;
  } catch (err) {
    document.getElementById("deleteResult").innerText = "Error: " + err.message;
  }
});
    
// Auto-populate table dropdown when page loads
window.addEventListener("DOMContentLoaded", async function() {
    const tableDropdown = document.getElementById("tableSelect");
  
    // Fill host/port/database/user/token with defaults (you can adjust)
    const host = "localhost";
    const port = 8123;
    const database = "default";
    const user = "default";
    const token = "";
  
    try {
      const response = await fetch("http://localhost:8081/clickhouse/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ host, port, database, user, token })
      });
  
      const tables = await response.json();
      tableDropdown.innerHTML = "";
  
      tables.forEach(table => {
        const option = document.createElement("option");
        option.value = table;
        option.textContent = table;
        tableDropdown.appendChild(option);
      });
    } catch (err) {
      console.error("Failed to load tables:", err.message);
      tableDropdown.innerHTML = "<option value=''>Error loading tables</option>";
    }
  });
  window.addEventListener("DOMContentLoaded", function () {
    const tableDropdown = document.getElementById("tableSelect");
  
    const host = "localhost";
    const port = 8123;
    const database = "default";
    const user = "default";
    const token = "";
  
    // Populate table dropdown
    fetch("http://localhost:8081/clickhouse/tables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ host, port, database, user, token })
    })
      .then((res) => res.json())
      .then((tables) => {
        tableDropdown.innerHTML = "";
        tables.forEach((table) => {
          const option = document.createElement("option");
          option.value = table;
          option.textContent = table;
          tableDropdown.appendChild(option);
        });
      });
  
    // When table is selected, fetch rows and render table
    tableDropdown.addEventListener("change", async function (e) {
      const table = e.target.value;
      const outputDiv = document.getElementById("tableRowsResult");
  
      try {
        const response = await fetch("http://localhost:8081/clickhouse/rows", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ host, port, database, user, token, table })
        });
  
        const rows = await response.json();
  
        if (!Array.isArray(rows)) {
          outputDiv.innerText = "Error: Unexpected response.";
          return;
        }
  
        if (rows.length === 0) {
          outputDiv.innerText = "No rows found.";
          return;
        }
  
        let html = "<table border='1' cellpadding='5'><tr>";
        const keys = Object.keys(rows[0]);
        keys.forEach((key) => {
          html += `<th>${key}</th>`;
        });
        html += "</tr>";
  
        rows.forEach((row) => {
          html += "<tr>";
          keys.forEach((key) => {
            html += `<td>${row[key]}</td>`;
          });
          html += "</tr>";
        });
  
        html += "</table>";
        outputDiv.innerHTML = html;
  
      } catch (err) {
        outputDiv.innerText = "Error: " + err.message;
      }
    });
  });
  