
<?php
require_once 'config/database.php';
$db = new Database();

// Get statistics
$db->query("SELECT COUNT(*) as total FROM prizes WHERE quantity > 0");
$totalPrizes = $db->single()['total'];

$db->query("SELECT COUNT(*) as total FROM participants");
$totalParticipants = $db->single()['total'];

$db->query("SELECT COUNT(*) as total FROM winners");
$totalWinners = $db->single()['total'];

// Get recent winners
$db->query("SELECT w.*, p.name as prize_name, pt.name as participant_name 
           FROM winners w 
           JOIN prizes p ON w.prize_id = p.id 
           JOIN participants pt ON w.participant_id = pt.id 
           ORDER BY w.draw_date DESC LIMIT 5");
$recentWinners = $db->resultset();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Giveaway Winner Picker</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <i class="fas fa-gift"></i>
                <span>Giveaway Picker</span>
            </div>
            <ul class="nav-menu">
                <li><a href="index.php" class="nav-link active">Dashboard</a></li>
                <li><a href="prizes.php" class="nav-link">Hadiah</a></li>
                <li><a href="participants.php" class="nav-link">Peserta</a></li>
                <li><a href="draw.php" class="nav-link">Undian</a></li>
                <li><a href="winners.php" class="nav-link">Pemenang</a></li>
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <main class="main-content">
        <div class="container">
            <div class="header">
                <h1>Dashboard Undian</h1>
                <p>Kelola hadiah, peserta, dan lakukan undian berhadiah</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?= $totalPrizes ?></h3>
                        <p>Total Hadiah</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?= $totalParticipants ?></h3>
                        <p>Total Peserta</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?= $totalWinners ?></h3>
                        <p>Total Pemenang</p>
                    </div>
                </div>
            </div>

            <div class="action-buttons">
                <a href="draw.php" class="btn btn-primary">
                    <i class="fas fa-random"></i>
                    Mulai Undian
                </a>
                <a href="prizes.php" class="btn btn-secondary">
                    <i class="fas fa-plus"></i>
                    Tambah Hadiah
                </a>
                <a href="participants.php" class="btn btn-secondary">
                    <i class="fas fa-user-plus"></i>
                    Tambah Peserta
                </a>
            </div>

            <?php if (!empty($recentWinners)): ?>
            <div class="recent-winners">
                <h2>Pemenang Terbaru</h2>
                <div class="winners-list">
                    <?php foreach ($recentWinners as $winner): ?>
                    <div class="winner-item">
                        <div class="winner-info">
                            <h4><?= htmlspecialchars($winner['participant_name']) ?></h4>
                            <p>Memenangkan: <?= htmlspecialchars($winner['prize_name']) ?></p>
                            <small><?= date('d/m/Y H:i', strtotime($winner['draw_date'])) ?></small>
                        </div>
                        <div class="winner-badge">
                            <i class="fas fa-medal"></i>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </main>

    <script src="assets/js/script.js"></script>
</body>
</html>
