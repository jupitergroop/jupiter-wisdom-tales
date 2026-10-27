<?php
// International Order & Inquiry Endpoint for jupiter-wisdom-tales.com (Limited Liability Company "Jupiter Group")
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON payload']);
    exit;
}

if (!empty($data['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));

if (mb_strlen($name) < 2 || (mb_strlen($email) < 5 && mb_strlen($phone) < 6)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please provide your name and a valid email or phone number.']);
    exit;
}

echo json_encode([
    'ok' => true,
    'merchant' => 'Limited Liability Company Jupiter Group (TIN 01705202310085, Kyrgyz Republic)',
    'req_id' => $data['req_id'] ?? uniqid('jg_en_', true)
]);
