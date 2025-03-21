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
        
          window.location.href = `search.html?q=${encodeURIComponent(query)}`;
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
    dropdownList.empty(); 

    words.forEach(function (word) {
        var dropdownItem = `<li><a href="search.html?q=${word}" onclick="searchProducts('${word}')">${word}</a></li>`;
        dropdownList.append(dropdownItem);
    });
}

  function searchProducts(query) {
      $.ajax({
          url: 'search.php',
          method: 'GET',
          data: { q: query },
          dataType: 'json',
          success: function (response) {
            
              displayDropdown(response.results);
          },
          error: function (xhr, status, error) {
              console.error('Error searching products:', status, error);
          }
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
  var currentPage = 1;
  var productsPerPage = 10; // Adjust as needed
  var searchTerm = new URLSearchParams(window.location.search).get('q');

  if (searchTerm) {
      compareWords(searchTerm.toLowerCase()); // Compare the original search term to get the corrected word
  }

  $('.load-more').on('click', function () {
      currentPage++;
      loadProducts(searchTerm, currentPage); // Use the original search term for pagination
  });

  function loadProducts(searchTerm, page) {
      $.ajax({
          url: 'search.php',
          method: 'GET',
          dataType: 'json',
          data: {
              q: searchTerm,
              page: page,
              per_page: productsPerPage
          },
          success: function (response) {
              displayProducts(response.results);
          },
          error: function (xhr, status, error) {
              console.error('Error loading search results:', status, error);
          }
      });
  }

  function compareWords(query) {
      $.ajax({
          url: 'load_words.php',
          method: 'GET',
          dataType: 'json',
          success: function (wordsArray) {
              var closestWord = '';
              var minDistance = Infinity;

              wordsArray.forEach(function (word) {
                  var distance = levenshteinDistance(query, word.toLowerCase());
                  if (distance < minDistance) {
                      minDistance = distance;
                      closestWord = word;
                  }
              });

              loadProducts(closestWord, currentPage); // Load products using the corrected word
          },
          error: function (xhr, status, error) {
              console.error('Error loading words:', status, error);
          }
      });
  }

  function displayProducts(products) {
      var productList = $('.post-list');
      productList.empty(); // Clear existing products

      products.forEach(function (product) {
          var productImg = JSON.parse(product.productImg);
          var productHTML = `
              <div class="post">
                  <img src="${productImg.image_url}" alt="Image of ${product.productName}" class="product-image">
                  <div class="product-info">
                      <h2 class="product-name">${product.productName}</h2>
                      <p class="product-price">${product.price}$</p>
                  </div>
              </div>
          `;
          productList.append(productHTML);
      });

      // Enable or disable "Show More" button based on total results and current page
      if (products.length < productsPerPage) {
          $('.load-more').prop('disabled', true).text('No more results');
      } else {
          $('.load-more').prop('disabled', false).text('Show More');
      }
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
