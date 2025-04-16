# CDAP Assignment – ClickHouse Integration with Spring Boot and Frontend

This project is a full-stack application for the CDAP assignment. It allows users to upload CSV files to ClickHouse, view and filter data, execute custom SQL queries, and delete rows, all through a clean frontend UI powered by HTML + JS and a Spring Boot backend.

---

## 🚀 Features

### ✅ Backend (Spring Boot)
- Upload CSV and insert into ClickHouse
- List all tables in a ClickHouse database
- View rows from a selected table
- Filter rows based on SQL-like conditions
- Execute any custom SQL query
- Delete rows by ID

### ✅ Frontend (HTML + JavaScript)
- Upload form with table and DB details
- Table listing button
- Table data viewer
- Filter rows with auto-filled table dropdown
- Execute SQL textarea
- Delete row by ID form

---

## 📁 Project Structure

```
cdap-assignment/
├── backend/                 # Spring Boot application
│   └── src/main/java/com/ingestion/backend/
│       ├── ClickHouseController.java
│       ├── ClickHouseService.java
│       └── BackendApplication.java
├── frontend/                # Static HTML/JS frontend
│   ├── index.html
│   └── script.js
```

---

## ⚙️ Prerequisites

- Java 17+
- Maven
- Docker
- Node.js (optional for UI dev)
- ClickHouse running on Docker:
  ```bash
  docker run -d --name clickhouse-server -p 8123:8123 -p 9000:9000 yandex/clickhouse-server
  ```

---

## 🛠️ How to Run

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Runs on: `http://localhost:8081`

### Frontend

Just open `index.html` in your browser.

Or use VSCode Live Server extension.

---

## 🧪 Sample SQL to Create Table

```sql
CREATE TABLE my_table (
    id UInt32,
    name String
) ENGINE = MergeTree()
ORDER BY id;

INSERT INTO my_table VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie');
```

---

## 📫 API Endpoints

- `/clickhouse/upload` - Upload CSV (form-data)
- `/clickhouse/tables` - List tables (POST JSON)
- `/clickhouse/rows` - View table rows (POST JSON)
- `/clickhouse/filtered-rows` - Filter rows (POST form)
- `/clickhouse/execute` - Run custom SQL
- `/clickhouse/delete` - Delete row by ID

---

## 🙌 Author

Built by Nisarga for the CDAP Software Engineer Intern Assignment.
