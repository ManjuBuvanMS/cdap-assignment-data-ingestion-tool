package com.ingestion.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.DriverManager;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.Collections;

@RestController
@RequestMapping("/clickhouse")
@CrossOrigin(origins = "*") // allow frontend access (optional)
public class ClickHouseController {

    @Autowired
    private ClickHouseService clickHouseService;

    @PostMapping("/tables")
    public List<String> getClickHouseTables(@RequestBody Map<String, String> request) {
        try {
            String host = request.get("host");
            int port = Integer.parseInt(request.get("port"));
            String database = request.get("database");
            String user = request.get("user");
            String token = request.get("token");

            return clickHouseService.getTables(host, port, database, user, token);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of("Error: " + e.getMessage());
        }
    }

    @PostMapping("/upload")
    public String uploadCsv(
            @RequestParam("file") MultipartFile file,
            @RequestParam("host") String host,
            @RequestParam("port") int port,
            @RequestParam("database") String database,
            @RequestParam("user") String user,
            @RequestParam(value = "token", required = false) String token,
            @RequestParam("table") String table) {
        try {
            clickHouseService.insertCsvData(host, port, database, user, token != null ? token : "", file, table);
            return "CSV uploaded and inserted successfully.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/filtered-rows")
    public List<Map<String, Object>> getFilteredRows(
            @RequestParam String host,
            @RequestParam int port,
            @RequestParam String database,
            @RequestParam String user,
            @RequestParam(required = false) String token,
            @RequestParam(required = false) String filters) throws Exception {

        return clickHouseService.getFilteredRows(host, port, database, user, token != null ? token : "", filters);
    }

    @PostMapping("/execute")
    public String executeQuery(
            @RequestParam String host,
            @RequestParam int port,
            @RequestParam String database,
            @RequestParam String user,
            @RequestParam(required = false) String token,
            @RequestParam String query) {
        try {
            String url = String.format("jdbc:clickhouse://%s:%d/%s?compress=0", host, port, database);
            Properties properties = new Properties();
            properties.setProperty("user", user);
            properties.setProperty("ssl", "false");
            properties.setProperty("access_token", token != null ? token : "");

            try (Connection connection = DriverManager.getConnection(url, properties);
                    Statement statement = connection.createStatement()) {
                statement.execute(query);
            }

            return "Query executed successfully.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/rows")
    public List<Map<String, Object>> getTableRows(@RequestBody Map<String, String> request) {
        try {
            String host = request.get("host");
            int port = Integer.parseInt(request.get("port"));
            String database = request.get("database");
            String user = request.get("user");
            String token = request.getOrDefault("token", "");
            String table = request.get("table");

            return clickHouseService.getTableRows(host, port, database, user, token, table);
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

}