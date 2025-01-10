<?php
// src/models/Order.php

require_once __DIR__ . '/../config/database.php';

class Order {
    private $conn;
    private $table_name = "orders";

    public $order_id;
    public $table_id;
    public $status;
    public $created_at;
    public $updated_at;
    public $special_instructions;

    public function __construct() {
        $this->conn = Database::getInstance()->getConnection();
    }

    public function create($tableId, $items, $specialInstructions = '') {
        try {
            $this->conn->beginTransaction();

            // Create order
            $query = "INSERT INTO " . $this->table_name . " 
                     (table_id, special_instructions) 
                     VALUES (:table_id, :special_instructions)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":table_id", $tableId);
            $stmt->bindParam(":special_instructions", $specialInstructions);
            $stmt->execute();

            $orderId = $this->conn->lastInsertId();

            // Insert order items
            foreach ($items as $item) {
                $query = "INSERT INTO order_items 
                         (order_id, item_id, quantity, special_instructions) 
                         VALUES (:order_id, :item_id, :quantity, :special_instructions)";

                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":order_id", $orderId);
                $stmt->bindParam(":item_id", $item['item_id']);
                $stmt->bindParam(":quantity", $item['quantity']);
                $stmt->bindParam(":special_instructions", $item['special_instructions'] ?? null);
                $stmt->execute();
            }

            $this->conn->commit();
            return $orderId;

        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function getStatus($orderId) {
        $query = "SELECT status, created_at, updated_at 
                 FROM " . $this->table_name . " 
                 WHERE order_id = :order_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":order_id", $orderId);
        $stmt->execute();

        return $stmt->fetch();
    }

    public function updateStatus($orderId, $status) {
        $query = "UPDATE " . $this->table_name . " 
                 SET status = :status 
                 WHERE order_id = :order_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":order_id", $orderId);

        return $stmt->execute();
    }
}
