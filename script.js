

document.addEventListener('DOMContentLoaded', function () {
    // Navbar toggle functionality
    const bar = document.getElementById('bar');
    const navbar = document.getElementById('navbar');
    const close = document.getElementById('close');

    if (bar) {
        bar.addEventListener('click', function () {
            navbar.classList.toggle('active');
        });
    }

    if (close) {
        close.addEventListener('click', function () {
            navbar.classList.remove('active');
        });
    }

    // Voice Search
    const voiceSearchBtn = document.getElementById('voice-search-btn');
    const searchInput = document.getElementById('search-input');

    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = function () {
            console.log('Voice recognition started. Try speaking into the microphone.');
        };

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            console.log('You said: ', transcript);
        };

        recognition.onerror = function (event) {
            console.error('Voice recognition error', event.error);
        };

        recognition.onend = function () {
            console.log('Voice recognition ended.');
        };

        voiceSearchBtn.addEventListener('click', function () {
            recognition.start();
        });
    } else {
        console.warn('Web Speech API is not supported in this browser.');
        voiceSearchBtn.disabled = true;
    }

    // Modal functionality
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];

    // Open the modal after 5 seconds
    setTimeout(function () {
        modal.style.display = "block";
    }, 5000);

    // Close modal when clicking on the close button
    if (span) {
        span.onclick = function () {
            modal.style.display = "none";
        };
    }

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Slider scroll indicator functionality
    const sliderContainer = document.querySelector('.slider-container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const scrollIndicatorContainer = document.querySelector('.scroll-indicator-container');

    function updateScrollIndicator() {
        const maxScrollLeft = sliderContainer.scrollWidth - sliderContainer.clientWidth;
        const scrollLeft = sliderContainer.scrollLeft;
        const maxIndicatorPosition = scrollIndicatorContainer.clientWidth - scrollIndicator.clientWidth;
        const steps = sliderContainer.children.length; // Number of items
        const stepSize = maxScrollLeft / (steps - 1); // Scroll step size
        const currentStep = Math.round(scrollLeft / stepSize);
        const indicatorPosition = (currentStep / (steps - 1)) * maxIndicatorPosition;
        scrollIndicator.style.transform = `translateX(${indicatorPosition}px)`;
    }

    if (sliderContainer && scrollIndicator && scrollIndicatorContainer) {
        sliderContainer.addEventListener('scroll', updateScrollIndicator);
        window.addEventListener('resize', updateScrollIndicator);
        updateScrollIndicator();
    }

    // Function to toggle like status and update liked items
    function toggleLike(event) {
        event.preventDefault(); // Prevent default link behavior

        const heartIcon = event.target;
        if (!heartIcon.classList.contains('fa-heart')) return; // Ensure we clicked on the heart icon

        heartIcon.classList.toggle('liked'); // Toggle liked class to change color

        const productCard = heartIcon.closest('.pro');
        if (!productCard) return;

        const productImage = productCard.querySelector('img').getAttribute('src');
        const productPrice = productCard.querySelector('.des h4').innerText; // Adjust selector as per your product details

        // Initialize liked items array if not already present
        let likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];

        if (heartIcon.classList.contains('liked')) {
            // Add item to liked items
            likedItems.push({ image: productImage, price: productPrice });
        } else {
            // Remove item from liked items
            likedItems = likedItems.filter(item => item.image !== productImage);
        }

        // Update local storage and liked count
        localStorage.setItem('likedItems', JSON.stringify(likedItems));
        updateWishlistCount(); // Update wishlist count in both desktop and mobile navbars
        displayLikedProducts(); // Update liked products display
    }

    // Function to update wishlist count in navbar
    function updateWishlistCount() {
        const likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];
        const wishlistCountDesktop = document.getElementById('wishlistCountDesktop');
        const wishlistCountMobile = document.getElementById('wishlistCountMobile');

        // Update count for both desktop and mobile navbars
        wishlistCountDesktop.innerText = likedItems.length;
        wishlistCountMobile.innerText = likedItems.length;

        // Show/hide count based on whether there are liked items
        wishlistCountDesktop.style.display = likedItems.length > 0 ? 'inline-block' : 'none';
        wishlistCountMobile.style.display = likedItems.length > 0 ? 'inline-block' : 'none';
    }

    // Function to display liked products
    function displayLikedProducts() {
        const likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];
        const likedProductsTable = document.getElementById('likedProductsTable');
        likedProductsTable.innerHTML = ''; // Clear previous content

        likedItems.forEach(item => {
            const row = document.createElement('tr');

            const imgCell = document.createElement('td');
            const imgElement = document.createElement('img');
            imgElement.src = item.image;
            imgElement.alt = 'Liked Product';
            imgElement.style.width = '100px'; // Set a fixed width for images
            imgCell.appendChild(imgElement);

            const priceCell = document.createElement('td');
            priceCell.innerText = item.price;

            row.appendChild(imgCell);
            row.appendChild(priceCell);

            likedProductsTable.appendChild(row);
        });
    }

    // Attach click event listeners to heart icons
    document.querySelectorAll('.pro .like').forEach(heartIcon => {
        heartIcon.addEventListener('click', toggleLike);
    });

    // Update wishlist count on page load
    updateWishlistCount();


});













