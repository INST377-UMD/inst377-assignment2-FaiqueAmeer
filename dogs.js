document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display random dog images
    fetchRandomDogImages();
    
    // Fetch and display dog breeds
    fetchDogBreeds();
    
    function fetchRandomDogImages() {
        fetch('https://dog.ceo/api/breeds/image/random/10')
            .then(response => response.json())
            .then(data => {
                if (data.message && data.message.length > 0) {
                    displayDogImages(data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching dog images:', error);
                // Use mock images if API fails
                const mockImages = [
                    'https://images.dog.ceo/breeds/labrador/n02099712_100.jpg',
                    'https://images.dog.ceo/breeds/pug/n02110958_14276.jpg',
                    'https://images.dog.ceo/breeds/germanshepherd/n02106662_17793.jpg',
                    'https://images.dog.ceo/breeds/beagle/n02088364_13442.jpg',
                    'https://images.dog.ceo/breeds/collie-border/n02106166_3555.jpg'
                ];
                displayDogImages(mockImages);
            });
    }
    
    function displayDogImages(imageUrls) {
        const slider = document.getElementById('dogImages');
        slider.innerHTML = '';
        
        imageUrls.forEach(url => {
            const imgDiv = document.createElement('div');
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Random dog';
            imgDiv.appendChild(img);
            slider.appendChild(imgDiv);
        });
        
        // Initialize the slider
        if (typeof SimpleSlider === 'function') {
            new SimpleSlider('.slider');
        }
    }
    
    function fetchDogBreeds() {
        fetch('https://dogapi.dog/api/v2/breeds')
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    displayDogBreeds(data.data);
                }
            })
            .catch(error => {
                console.error('Error fetching dog breeds:', error);
                // Use mock breeds if API fails
                const mockBreeds = [
                    { attributes: { name: 'Labrador Retriever' } },
                    { attributes: { name: 'German Shepherd' } },
                    { attributes: { name: 'Golden Retriever' } },
                    { attributes: { name: 'Bulldog' } },
                    { attributes: { name: 'Beagle' } },
                    { attributes: { name: 'Poodle' } },
                    { attributes: { name: 'Rottweiler' } }
                ];
                displayDogBreeds(mockBreeds);
            });
    }
    
    function displayDogBreeds(breeds) {
        const buttonsContainer = document.getElementById('breedButtons');
        buttonsContainer.innerHTML = '';
        
        breeds.forEach(breed => {
            const button = document.createElement('button');
            button.className = 'breed-button';
            button.textContent = breed.attributes.name;
            
            button.addEventListener('click', function() {
                fetchBreedInfo(breed);
            });
            
            buttonsContainer.appendChild(button);
        });
    }
    
    function fetchBreedInfo(breed) {
        // For this demo, we'll use mock data since the API doesn't provide all details
        // In a real app, you would make another API call to get breed details
        
        const breedInfo = {
            name: breed.attributes.name,
            description: getMockDescription(breed.attributes.name),
            minLife: Math.floor(Math.random() * 5) + 8, // Random between 8-12
            maxLife: Math.floor(Math.random() * 5) + 12 // Random between 12-16
        };
        
        displayBreedInfo(breedInfo);
    }
    
    function displayBreedInfo(breedInfo) {
        document.getElementById('breedName').textContent = breedInfo.name;
        document.getElementById('breedDescription').textContent = breedInfo.description;
        document.getElementById('breedMinLife').textContent = breedInfo.minLife;
        document.getElementById('breedMaxLife').textContent = breedInfo.maxLife;
        
        const breedInfoDiv = document.getElementById('breedInfo');
        breedInfoDiv.style.display = 'block';
    }
    
    function getMockDescription(breedName) {
        const descriptions = {
            'Labrador Retriever': 'Friendly, outgoing, and high-spirited companions who have more than enough affection to go around.',
            'German Shepherd': 'Intelligent, capable, and incredibly loyal working dogs that excel at almost anything they are trained to do.',
            'Golden Retriever': 'Intelligent, friendly, and devoted dogs that are easy to train and eager to please.',
            'Bulldog': 'Docile, willful, and friendly dogs that are known for their loose, wrinkled skin and distinctive pushed-in nose.',
            'Beagle': 'Merry, friendly, and curious dogs that are excellent with children and known for their incredible sense of smell.',
            'Poodle': 'Extremely intelligent, active, and proud dogs that come in three size varieties: Standard, Miniature, and Toy.',
            'Rottweiler': 'Loyal, loving, and confident guardians that are courageous but not overly aggressive.'
        };
        
        return descriptions[breedName] || 'A wonderful companion dog with a great personality.';
    }
});