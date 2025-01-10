<?php
// src/models/Table.php

require_once __DIR__ . '/../config/database.php';

class Table {
    private $conn;
    private $table_name = "tables";

    public $table_id;
    public $table_number;
    public $qr_code;
    public $status;

    public function __construct() {
        $this->conn = Database::getInstance()->getConnection();
    }

    public function verifyQRCode($qrCode) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE qr_code = :qr_code";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":qr_code", $qrCode);
        $stmt->execute();

        return $stmt->fetch();
    }

    public function updateStatus($tableId, $status) {
        $query = "UPDATE " . $this->table_name . " 
                 SET status = :status 
                 WHERE table_id = :table_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":table_id", $tableId);

        return $stmt->execute();
    }
}
