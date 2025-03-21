$(document).ready(function () {
    var productsPerPage = 10; // Adjust as needed
  
    $('#searchQuery').on('keyup', function () {
        var query = $(this).val().trim();
        if (query !== '') {
            compareWords(query.toLowerCase()); // Convert query to lowercase for consistency
        } else {
            // Clear the dropdown if search query is empty
            $('#searchResults').empty();
        }
    });
  
    $('#searchButton').on('click', function () {
        var query = $('#searchQuery').val().trim();
        if (query !== '') {
            // Redirect to search.html with the corrected query
            window.location.href = `search.html?q=${encodeURIComponent(compareWords(query.toLowerCase()))}`;
        }
    });
    
    function compareWords(query) {
        $.getJSON('unique_words.json', function (wordsArray) {
            var closestWord = '';
            var minDistance = Infinity;
    
            wordsArray.forEach(function (word) {
                var distance = levenshteinDistance(query, word.toLowerCase());
                if (distance < minDistance) {
                    minDistance = distance;
                    closestWord = word;
                }
            });
    
            // You can perform further actions with closestWord if needed
        }).fail(function (jqxhr, textStatus, error) {
            console.error('Error loading words:', textStatus, error);
        });
    }
    
  
    
  
    function levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
  
        var matrix = [];
  
        // Initialize the matrix
        for (var i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (var j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
  
        // Fill in the matrix
        for (var i = 1; i <= b.length; i++) {
            for (var j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
  
        return matrix[b.length][a.length];
    }
  });


  $(document).ready(function () {
    var productsPerPage = 5; // Adjust as needed

    $('#searchQuery').on('input', function () {
        var query = $(this).val().trim();
        if (query !== '') {
            compareWords(query.toLowerCase()); // Convert query to lowercase for consistency
        } else {
            // Clear the dropdown if search query is empty
            $('#searchResults').empty();
        }
    });

    function compareWords(query) {
        $.getJSON('unique_words.json', function (wordsArray) {
            var filteredWords = wordsArray.filter(function (word) {
                return word.toLowerCase().startsWith(query);
            });
            displayDropdown(filteredWords);
        }).fail(function (jqxhr, textStatus, error) {
            console.error('Error loading words:', textStatus, error);
        });
    }

    function displayDropdown(words) {
        var dropdownList = $('#searchResults');
        dropdownList.empty(); // Clear existing dropdown items

        words.forEach(function (word) {
            var dropdownItem = `<li><a href="search.html?q=${word}" onclick="searchProducts('${word}')">${word}</a></li>`;
            dropdownList.append(dropdownItem);
        });
    }

    function searchProducts(query) {
        $('#searchQuery').val(query); // Set the search query in the search bar
        $('#searchResults').empty(); // Clear the dropdown
        // Redirect to search.html with the corrected query
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
});

$(document).ready(function() {
    var currentPage = 1; // Current page number
    var productsPerPage = 25; // Number of products to load per page

    // Function to load products
    function loadProducts(page) {
        $.ajax({
            url: 'load_products.php',
            method: 'GET',
            dataType: 'json',
            data: {
                page: page,
                per_page: productsPerPage
            },
            success: function(response) {
                // Display products in HTML
                displayProducts(response);
            },
            error: function(xhr, status, error) {
                console.error('Error loading products:', status, error);
            }
        });
    }

    // Function to display products in HTML
    function displayProducts(products) {
        var productList = $('.post-list');

        // Loop through products and create HTML elements
        products.forEach(function(product) {
            var productHTML = `
                <div class="post">
                    <img id="hover-img-${product.price}" src="${product.image_url}" alt="Image of ${product.productName}">
                    <div class="post-details">
                        <a href="#">${product.productName}</a>
                    </div>
                    <p>${product.price}$</p>
                    <button type="submit">Buy</button>
                </div>
            `;

            // Append product HTML to product list
            productList.append(productHTML);
        });
    }

    // Load initial products when the page is ready
    loadProducts(currentPage);

    // Load more products when "Load More" button is clicked
    $('.load-more').on('click', function() {
        currentPage++; // Increment current page number
        loadProducts(currentPage); // Load products for the next page
    });
});

