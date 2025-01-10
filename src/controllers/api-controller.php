<?php
// src/controllers/APIController.php

require_once __DIR__ . '/../models/Table.php';
require_once __DIR__ . '/../models/MenuItem.php';
require_once __DIR__ . '/../models/Order.php';

class APIController {
    public function handleRequest() {
        header('Content-Type: application/json');
        
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $method = $_SERVER['REQUEST_METHOD'];
        
        $routes = [
            '/api/tables/verify' => [
                'GET' => 'verifyTable'
            ],
            '/api/categories' => [
                'GET' => 'getCategories'
            ],
            '/api/menu-items' => [
                'GET' => 'getMenuItems'
            ],
            '/api/orders' => [
                'POST' => 'createOrder'
            ],
            '/api/orders/status' => [
                'GET' => 'getOrderStatus'
            ]
        ];

        foreach ($routes as $route => $handlers) {
            if (strpos($uri, $route) === 0) {
                if (isset($handlers[$method])) {
                    $handler = $handlers[$method];
                    return $this->$handler();
                }
                http_response_code(405);
                return ['error' => 'Method not allowed'];
            }
        }

        http_response_code(404);
        return ['error' => 'Not found'];
    }

    private function verifyTable() {
        $qrCode = $_GET['code'] ?? null;
        if (!$qrCode) {
            http_response_code(400);
            return ['error' => 'QR code is required'];
        }

        $table = new Table();
        $result = $table->verifyQRCode($qrCode);

        if (!$result) {
            http_response_code(404);
            return ['error' => 'Invalid QR code'];
        }

        return $result;
    }

    private function getCategories() {
        $query = "SELECT * FROM categories";
        $db = Database::getInstance()->getConnection();
        $stmt = $db->query($query);
        return $stmt->fetchAll();
    }

    private function getMenuItems() {
        $categoryId = $_GET['category'] ?? null;
        $menuItem = new MenuItem();
        return $menuItem->getAll($categoryId);
    }

    private function createOrder() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['table_id']) || !isset($data['items']) || empty($data['items'])) {
            http_response_code(400);
            return ['error' => 'Invalid order data'];
        }

        try {
            $order = new Order();
            $orderId = $order->create(
                $data['table_id'],
                $data['items'],
                $data['special_instructions'] ?? ''
            );

            return [
                'success' => true,
                'order_id' => $orderId
            ];
        } catch (Exception $e) {
            http_response_code(500);
            return ['error' => 'Failed to create order'];
        }
    }

    private function getOrderStatus() {
        $orderId = $_GET['id'] ?? null;
        if (!$orderId) {
            http_response_code(400);
            return ['error' => 'Order ID is required'];
        }

        $order = new Order();
        $status = $order->getStatus($orderId);

        if (!$status) {
            http_response_code(404);
            return ['error' => 'Order not found'];
        }

        return $status;
    }
}
