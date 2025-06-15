
// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
});

// Draw function
function startDraw() {
    const drawWheel = document.querySelector('.draw-wheel');
    const winnerAnnouncement = document.querySelector('.winner-announcement');
    const drawButton = document.querySelector('#drawButton');
    
    if (!drawWheel || !drawButton) return;
    
    // Disable button and show spinning
    drawButton.disabled = true;
    drawButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengundi...';
    drawWheel.classList.add('spinning');
    drawWheel.innerHTML = 'Mengundi...';
    
    // Hide previous winner announcement
    if (winnerAnnouncement) {
        winnerAnnouncement.classList.remove('show');
    }
    
    // Simulate drawing process
    setTimeout(() => {
        drawWheel.classList.remove('spinning');
        
        // Make AJAX request to perform actual draw
        fetch('ajax/draw.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prize_id: document.querySelector('#prize_id').value,
                winner_count: document.querySelector('#winner_count').value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let winnersHtml = '';
                data.winners.forEach(winner => {
                    winnersHtml += `<div class="winner-item">
                        <h3><i class="fas fa-trophy"></i> ${winner.name}</h3>
                        <p>Memenangkan: ${winner.prize}</p>
                    </div>`;
                });
                
                drawWheel.innerHTML = `<i class="fas fa-trophy"></i><br>Selesai!`;
                
                if (winnerAnnouncement) {
                    winnerAnnouncement.innerHTML = `
                        <h2><i class="fas fa-trophy"></i> Selamat Kepada Pemenang!</h2>
                        ${winnersHtml}
                        <button class="btn btn-primary" onclick="location.reload()">
                            <i class="fas fa-redo"></i> Undian Lagi
                        </button>
                    `;
                    winnerAnnouncement.classList.add('show');
                }
            } else {
                drawWheel.innerHTML = '<i class="fas fa-exclamation-triangle"></i><br>Error!';
                alert('Error: ' + data.message);
            }
            
            // Re-enable button
            drawButton.disabled = false;
            drawButton.innerHTML = '<i class="fas fa-random"></i> Mulai Undian';
        })
        .catch(error => {
            console.error('Error:', error);
            drawWheel.innerHTML = '<i class="fas fa-exclamation-triangle"></i><br>Error!';
            drawButton.disabled = false;
            drawButton.innerHTML = '<i class="fas fa-random"></i> Mulai Undian';
        });
    }, 3000);
}

// Confirm delete
function confirmDelete(url, name) {
    if (confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
        window.location.href = url;
    }
}

// Auto-hide alerts
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    });
});
