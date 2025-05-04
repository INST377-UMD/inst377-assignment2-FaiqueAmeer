// Initialize annyang
function initializeVoiceCommands() {
    if (annyang) {
        // Define the commands
        const commands = {
            'hello': function() {
                alert('Hello World!');
            },
            'change the color to *color': function(color) {
                document.body.style.backgroundColor = color;
            },
            'navigate to *page': function(page) {
                const normalizedPage = page.toLowerCase().trim();
                if (normalizedPage === 'home') {
                    window.location.href = 'index.html';
                } else if (normalizedPage === 'stocks') {
                    window.location.href = 'stocks.html';
                } else if (normalizedPage === 'dogs') {
                    window.location.href = 'dogs.html';
                }
            }
        };

        // Add page-specific commands
        if (window.location.pathname.includes('stocks.html')) {
            commands['lookup *stock'] = function(stock) {
                document.getElementById('stockTicker').value = stock.toUpperCase();
                document.getElementById('fetchStock').click();
            };
        } else if (window.location.pathname.includes('dogs.html')) {
            commands['load dog breed *breed'] = function(breed) {
                const breedButtons = document.querySelectorAll('.breed-button');
                const foundButton = Array.from(breedButtons).find(button => 
                    button.textContent.toLowerCase().includes(breed.toLowerCase())
                );
                
                if (foundButton) {
                    foundButton.click();
                } else {
                    alert(`Breed "${breed}" not found. Try another breed.`);
                }
            };
        }

        // Add the commands
        annyang.addCommands(commands);

        // Start listening
        annyang.start({ autoRestart: true, continuous: false });
    }
}

// Set up audio control buttons
document.addEventListener('DOMContentLoaded', function() {
    const turnOnAudio = document.getElementById('turnOnAudio');
    const turnOffAudio = document.getElementById('turnOffAudio');
    
    if (turnOnAudio && turnOffAudio) {
        turnOnAudio.addEventListener('click', function() {
            initializeVoiceCommands();
            alert('Voice commands activated!');
        });
        
        turnOffAudio.addEventListener('click', function() {
            if (annyang) {
                annyang.abort();
                alert('Voice commands deactivated.');
            }
        });
    }
    
    // Initialize voice commands if the page loads with them enabled
    initializeVoiceCommands();
});