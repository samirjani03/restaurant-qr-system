<?php
// src/models/MenuItem.php

require_once __DIR__ . '/../config/database.php';

class MenuItem {
    private $conn;
    private $table_name = "menu_items";

    public $item_id;
    public $category_id;
    public $name;
    public $description;
    public $price;
    public $image_url;
    public $dietary_info;
    public $is_available;

    public function __construct() {
        $this->conn = Database::getInstance()->getConnection();
    }

    public function getAll($categoryId = null) {
        $query = "SELECT * FROM " . $this->table_name;
        if ($categoryId) {
            $query .= " WHERE category_id = :category_id AND is_available = true";
        } else {
            $query .= " WHERE is_available = true";
        }

        $stmt = $this->conn->prepare($query);
        
        if ($categoryId) {
            $stmt->bindParam(":category_id", $categoryId);
        }

        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getById($itemId) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE item_id = :item_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":item_id", $itemId);
        $stmt->execute();

        return $stmt->fetch();
    }
}
