<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movie Signup - The Grand Casita Theater</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #111827; /* bg-gray-900 */
        }
        .font-playfair {
            font-family: 'Playfair Display', serif;
        }
        
        /* --- Custom styles for the VERTICAL slider --- */
        input[type=range].vertical-slider {
            -webkit-appearance: slider-vertical; /* WebKit */
            writing-mode: bt-lr; /* Bottom to top, left to right */
            width: 20px; /* Made slider thicker */
            height: 100%;
            padding: 0;
            margin: 0;
            border-radius: 10px;
        }

        /* Track styling for WebKit (Chrome, Safari) */
        input[type=range].vertical-slider::-webkit-slider-runnable-track {
            width: 20px; /* Made track thicker */
            height: 100%;
            cursor: pointer;
            background: linear-gradient(to top, #3B82F6, #FBBF24, #EF4444); /* Blue (cold) to Amber (mid) to Red (hot) */
            border-radius: 10px;
        }

        /* Thumb styling for WebKit */
        input[type=range].vertical-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            border: 3px solid #1f2937; /* gray-800 */
            height: 32px;
            width: 32px;
            border-radius: 50%;
            background: #ffffff; /* white */
            cursor: pointer;
            margin-left: -6px; /* Re-centered thumb on the thicker track */
        }
        
        /* Track styling for Firefox */
        input[type=range].vertical-slider::-moz-range-track {
            width: 20px; /* Made track thicker */
            height: 100%;
            cursor: pointer;
            background: linear-gradient(to top, #3B82F6, #FBBF24, #EF4444);
            border-radius: 10px;
        }
        
        /* Thumb styling for Firefox */
        input[type=range].vertical-slider::-moz-range-thumb {
            border: 3px solid #1f2937;
            height: 26px; /* Adjusted for Firefox */
            width: 26px; /* Adjusted for Firefox */
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
        }

    </style>
</head>
<body class="text-gray-200">

    <div class="container mx-auto px-4 py-8 md:py-16 max-w-3xl">

        <!-- Header -->
        <header class="text-center mb-12">
            <h1 class="font-playfair text-4xl md:text-6xl text-amber-400">The Grand Casita Theater</h1>
            <p class="text-xl text-gray-400 mt-2">Create Your Perfect Movie Night</p>
        </header>

        <!-- Signup Form -->
        <main class="bg-gray-800 p-8 rounded-2xl shadow-2xl shadow-black/50">
            <form id="signupForm">
                <div class="flex flex-col md:flex-row gap-8 md:gap-12">
                    
                    <!-- Left side: Main form fields -->
                    <div class="flex-1">
                        <div class="space-y-8">
                            <!-- Name -->
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                                <input type="text" name="name" id="name" required class="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition">
                            </div>

                            <!-- Movie Title -->
                            <div>
                                <label for="movie" class="block text-sm font-medium text-gray-300 mb-2">Movie Title</label>
                                <input type="text" name="movie" id="movie" required class="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition">
                            </div>

                            <!-- Audience Type -->
                            <fieldset>
                                <legend class="block text-sm font-medium text-gray-300 mb-3">Audience</legend>
                                <div class="flex items-center gap-x-6">
                                    <div class="flex items-center">
                                        <input id="kidsWelcome" name="audience" type="radio" value="Kids Welcome" checked class="h-4 w-4 text-amber-500 border-gray-600 focus:ring-amber-500">
                                        <label for="kidsWelcome" class="ml-3 block text-sm font-medium leading-6 text-gray-300">Kids Welcome</label>
                                    </div>
                                    <div class="flex items-center">
                                        <input id="adultsOnly" name="audience" type="radio" value="Adults Only" class="h-4 w-4 text-amber-500 border-gray-600 focus:ring-amber-500">
                                        <label for="adultsOnly" class="ml-3 block text-sm font-medium leading-6 text-gray-300">Adults Only</label>
                                    </div>
                                </div>
                            </fieldset>

                            <!-- Greeting Message -->
                            <div>
                                <label for="greeting" class="block text-sm font-medium text-gray-300 mb-2">Greeting for Your Guests</label>
                                <textarea name="greeting" id="greeting" rows="4" class="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" placeholder="e.g., 'Welcome movie lovers! Get ready for an epic night!'"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Right side: Vertical Temperature Slider -->
                    <div class="flex flex-col items-center justify-start pt-2 md:w-28">
                        <label for="temperature" class="block text-sm font-medium text-gray-300 mb-4 text-center">
                            Set Theater Temp
                            <span class="text-xs text-gray-400 block mt-1">(We'll do our best!)</span>
                            <!-- FIXED: Used &deg; instead of the literal ¡Æ symbol -->
                            <span id="tempValue" class="font-bold text-amber-400 text-2xl block mt-2">70&deg;F</span>
                        </label>
                        <div class="h-64 w-full flex justify-center">
                             <input type="range" name="temperature" id="temperature" min="60" max="80" value="70" class="vertical-slider">
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="mt-10">
                    <button type="submit" id="submitButton" class="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                        Submit Movie Night
                    </button>
                </div>
            </form>
            
            <!-- Response Message Area -->
            <div id="responseMessage" class="mt-6 text-center text-lg"></div>
        </main>

    </div>

    <script>
        // --- Script to handle temperature slider value display ---
        const tempSlider = document.getElementById('temperature');
        const tempValue = document.getElementById('tempValue');
        tempSlider.addEventListener('input', (event) => {
            // FIXED: Used &deg; instead of the literal ¡Æ symbol
            tempValue.innerHTML = `${event.target.value}&deg;F`;
        });

        // --- Script to handle form submission ---
        const form = document.getElementById('signupForm');
        const submitButton = document.getElementById('submitButton');
        const responseMessage = document.getElementById('responseMessage');
        
        // IMPORTANT: Replace this with your actual Google Apps Script Web App URL
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbwgcspU4XtMsslxxV8nQl9-sY7A7wRhAf9CqPV72ybzuG-Qh7aZ5U384IiUvUkpjUgJZw/exec';

        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            responseMessage.textContent = '';
            responseMessage.classList.remove('text-green-400', 'text-red-400');

            // 1. Collect the form data into a simple object.
            const signupData = {
                name: document.getElementById('name').value,
                movie: document.getElementById('movie').value,
                audience: document.querySelector('input[name="audience"]:checked').value,
                temperature: document.getElementById('temperature').value,
                greeting: document.getElementById('greeting').value,
            };

            // 2. Create the payload object that the Apps Script expects.
            const payload = {
                type: 'signup',
                data: signupData
            };

            // 3. Use FormData to send the payload.
            const formData = new FormData();
            formData.append('data', JSON.stringify(payload));

            fetch(webAppUrl, {
                method: 'POST',
                body: formData,
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    responseMessage.textContent = 'Success! Your movie night is on the list.';
                    responseMessage.classList.add('text-green-400');
                    form.reset(); 
                    tempValue.innerHTML = '70&deg;F'; // Reset slider display
                } else {
                    throw new Error(result.error || 'An unknown error occurred.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                responseMessage.textContent = 'Oops! Something went wrong. Please try again.';
                responseMessage.classList.add('text-red-400');
            })
            .finally(() => {
                // Restore button state
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Movie Night';
            });
        });
    </script>

</body>
</html>
