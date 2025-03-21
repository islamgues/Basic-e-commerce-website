$(document).ready(function () {
  var currentPage = 1;
  var productsPerPage = 10; // Adjust as needed
  var searchTerm = new URLSearchParams(window.location.search).get('q');

  if (searchTerm) {
    loadProducts(searchTerm, currentPage);
  }

  $('.load-more').on('click', function () {
    currentPage++;
    loadProducts(searchTerm, currentPage);
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

  function displayProducts(products) {
    var productList = $('.post-list');

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
});

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  var matrix = [];
  var i, j;

  // Initialize the matrix
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
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