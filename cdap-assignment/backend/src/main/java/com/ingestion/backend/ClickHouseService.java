package com.ingestion.backend;

import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.web.multipart.MultipartFile;
import java.sql.*;
import java.util.*;

import java.io.InputStreamReader;

@Service
public class ClickHouseService {

    public List<String> getTables(String host, int port, String database, String user, String jwtToken)
            throws Exception {
        String url = String.format("jdbc:clickhouse://%s:%d/%s?compress=0", host, port, database);

        Properties properties = new Properties();
        properties.setProperty("user", user);
        properties.setProperty("ssl", "false"); // use "false" for http, "true" for https
        properties.setProperty("access_token", jwtToken); // your JWT token

        try (Connection connection = DriverManager.getConnection(url, properties);
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery("SHOW TABLES")) {

            List<String> tables = new ArrayList<>();
            while (resultSet.next()) {
                tables.add(resultSet.getString(1));
            }
            return tables;
        }
    }

    public List<Map<String, Object>> getAllRows(String host, int port, String database, String user, String jwtToken)
            throws Exception {
        String url = String.format("jdbc:clickhouse://%s:%d/%s?compress=0", host, port, database);

        Properties properties = new Properties();
        properties.setProperty("user", user);
        properties.setProperty("ssl", "false");
        properties.setProperty("access_token", jwtToken);

        List<Map<String, Object>> rows = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(url, properties);
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery("SELECT * FROM my_table")) {

            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("id", resultSet.getInt("id"));
                row.put("name", resultSet.getString("name"));
                rows.add(row);
            }
        }

        return rows;
    }

    public void insertCsvData(String host, int port, String database, String user, String jwtToken,
            MultipartFile file, String tableName) throws Exception {
        String url = String.format("jdbc:clickhouse://%s:%d/%s?compress=0", host, port, database);
        Properties properties = new Properties();
        properties.setProperty("user", user);
        properties.setProperty("ssl", "false");
        properties.setProperty("access_token", jwtToken);

        try (Connection connection = DriverManager.getConnection(url, properties);
                Statement statement = connection.createStatement()) {

            CSVFormat csvFormat = CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .withIgnoreHeaderCase()
                    .withTrim();

            Iterable<CSVRecord> records = csvFormat.parse(new InputStreamReader(file.getInputStream()));

            for (CSVRecord record : records) {
                int id = Integer.parseInt(record.get("id"));
                String name = record.get("name");

                String query = String.format("INSERT INTO my_table VALUES (%d, '%s')", tableName, id,
                        name.replace("'", "''"));
                statement.executeUpdate(query);
            }
        }
    }

    public List<Map<String, Object>> getFilteredRows(String host, int port, String database, String user,
            String jwtToken, String condition) throws Exception {
        String url = String.format("jdbc:clickhouse://%s:%d/%s?compress=0", host, port, database);
        Properties properties = new Properties();
        properties.setProperty("user", user);
        properties.setProperty("ssl", "false");
        properties.setProperty("access_token", jwtToken);

        List<Map<String, Object>> rows = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(url, properties);
                Statement statement = connection.createStatement()) {

            String query = "SELECT * FROM my_table";

            if (condition != null && !condition.trim().isEmpty()) {
                query += " WHERE " + condition;
            }

            ResultSet resultSet = statement.executeQuery(query);
            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();

            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    row.put(metaData.getColumnName(i), resultSet.getObject(i));
                }
                rows.add(row);
            }
        }

        return rows;
    }

    public List<Map<String, Object>> getTableRows(String host, int port, String database, String user, String jwtToken,
            String table) throws Exception {
        String url = String.format("jdbc:clickhouse://%s:%d/%s?compress=0", host, port, database);
        Properties properties = new Properties();
        properties.setProperty("user", user);
        properties.setProperty("ssl", "false");
        properties.setProperty("access_token", jwtToken);

        List<Map<String, Object>> rows = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(url, properties);
                Statement statement = connection.createStatement()) {

            String query = "SELECT * FROM " + table;
            ResultSet resultSet = statement.executeQuery(query);
            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();

            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    row.put(metaData.getColumnName(i), resultSet.getObject(i));
                }
                rows.add(row);
            }
        }

        return rows;
    }

}
