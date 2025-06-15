
<?php
header('Content-Type: application/json');
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$prize_id = $input['prize_id'] ?? 0;
$winner_count = $input['winner_count'] ?? 1;

if (!$prize_id || !$winner_count) {
    echo json_encode(['success' => false, 'message' => 'Invalid parameters']);
    exit;
}

$db = new Database();

try {
    // Get prize details
    $db->query("SELECT * FROM prizes WHERE id = :prize_id AND quantity >= :winner_count");
    $db->bind(':prize_id', $prize_id);
    $db->bind(':winner_count', $winner_count);
    $prize = $db->single();
    
    if (!$prize) {
        echo json_encode(['success' => false, 'message' => 'Hadiah tidak tersedia atau kuantitas tidak mencukupi']);
        exit;
    }
    
    // Get available participants (not already won this prize)
    $db->query("SELECT p.* FROM participants p 
                WHERE p.id NOT IN (
                    SELECT w.participant_id FROM winners w WHERE w.prize_id = :prize_id
                )
                ORDER BY RAND() 
                LIMIT :winner_count");
    $db->bind(':prize_id', $prize_id);
    $db->bind(':winner_count', $winner_count);
    $participants = $db->resultset();
    
    if (count($participants) < $winner_count) {
        echo json_encode(['success' => false, 'message' => 'Tidak cukup peserta yang tersedia']);
        exit;
    }
    
    // Insert winners
    $winners = [];
    foreach ($participants as $participant) {
        $db->query("INSERT INTO winners (prize_id, participant_id, draw_date, notes) VALUES (:prize_id, :participant_id, NOW(), :notes)");
        $db->bind(':prize_id', $prize_id);
        $db->bind(':participant_id', $participant['id']);
        $db->bind(':notes', 'Undian otomatis');
        $db->execute();
        
        $winners[] = [
            'name' => $participant['name'],
            'email' => $participant['email'],
            'prize' => $prize['name']
        ];
    }
    
    // Update prize quantity
    $db->query("UPDATE prizes SET quantity = quantity - :winner_count WHERE id = :prize_id");
    $db->bind(':winner_count', $winner_count);
    $db->bind(':prize_id', $prize_id);
    $db->execute();
    
    echo json_encode([
        'success' => true, 
        'winners' => $winners,
        'message' => 'Undian berhasil!'
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
