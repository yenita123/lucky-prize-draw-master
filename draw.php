
<?php
require_once 'config/database.php';
$db = new Database();

// Get available prizes
$db->query("SELECT * FROM prizes WHERE quantity > 0 ORDER BY name");
$prizes = $db->resultset();

// Get total participants
$db->query("SELECT COUNT(*) as total FROM participants");
$totalParticipants = $db->single()['total'];
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Undian - Giveaway Winner Picker</title>
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
                <li><a href="index.php" class="nav-link">Dashboard</a></li>
                <li><a href="prizes.php" class="nav-link">Hadiah</a></li>
                <li><a href="participants.php" class="nav-link">Peserta</a></li>
                <li><a href="draw.php" class="nav-link active">Undian</a></li>
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
                <h1><i class="fas fa-random"></i> Undian Berhadiah</h1>
                <p>Pilih hadiah dan mulai undian untuk menentukan pemenang</p>
            </div>

            <?php if (empty($prizes)): ?>
            <div class="alert alert-error">
                <i class="fas fa-exclamation-triangle"></i>
                Tidak ada hadiah yang tersedia untuk diundi. 
                <a href="prizes.php">Tambahkan hadiah</a> terlebih dahulu.
            </div>
            <?php elseif ($totalParticipants == 0): ?>
            <div class="alert alert-error">
                <i class="fas fa-exclamation-triangle"></i>
                Tidak ada peserta yang terdaftar. 
                <a href="participants.php">Tambahkan peserta</a> terlebih dahulu.
            </div>
            <?php else: ?>
            <div class="draw-container">
                <div class="form-group">
                    <label for="prize_id">Pilih Hadiah:</label>
                    <select id="prize_id" class="form-control" required>
                        <option value="">-- Pilih Hadiah --</option>
                        <?php foreach ($prizes as $prize): ?>
                        <option value="<?= $prize['id'] ?>" data-quantity="<?= $prize['quantity'] ?>">
                            <?= htmlspecialchars($prize['name']) ?> (Tersedia: <?= $prize['quantity'] ?>)
                        </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="winner_count">Jumlah Pemenang:</label>
                    <input type="number" id="winner_count" class="form-control" min="1" max="<?= $totalParticipants ?>" value="1" required>
                </div>

                <div class="draw-wheel">
                    <i class="fas fa-trophy"></i><br>
                    Siap Undian!
                </div>

                <button id="drawButton" class="btn btn-primary" onclick="startDraw()">
                    <i class="fas fa-random"></i> Mulai Undian
                </button>

                <div class="winner-announcement">
                    <!-- Winners will be displayed here -->
                </div>
            </div>
            <?php endif; ?>
        </div>
    </main>

    <script src="assets/js/script.js"></script>
    <script>
        // Update max winners based on selected prize quantity
        document.getElementById('prize_id').addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const quantity = selectedOption.dataset.quantity || 1;
            const totalParticipants = <?= $totalParticipants ?>;
            
            const winnerCountInput = document.getElementById('winner_count');
            winnerCountInput.max = Math.min(quantity, totalParticipants);
            
            if (winnerCountInput.value > winnerCountInput.max) {
                winnerCountInput.value = winnerCountInput.max;
            }
        });
    </script>
</body>
</html>
