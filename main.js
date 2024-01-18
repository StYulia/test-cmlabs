$(document).ready(function () {
    // Fetch and display categories
    axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(response => {
        const categories = response.data.categories;
        const categoryGrid = $('#categoryGrid');

        categories.forEach(category => {
            const categoryCard = $(`
                <div class="category-card">
                    <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                    <p>${category.strCategory}</p>
                </div>
            `);
            categoryCard.click(() => showCategoryDetail(category.strCategory));
            categoryGrid.append(categoryCard);
        });
    })
    .catch(error => console.error('Error fetching categories:', error));
    // Function to show category detail
    function showCategoryDetail(categoryName) {
        // Save the selected category in sessionStorage
        sessionStorage.setItem('selectedCategory', categoryName);
        // Redirect to category.html with the selected category
        window.location.href = `category.html?category=${encodeURIComponent(categoryName)}`;
    }

    // Fetch and display meals for a specific category
    function loadMeals(categoryName) {
        axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`)
            .then(response => {
                const meals = response.data.meals;
                const mealGrid = $('#mealGrid');

                mealGrid.empty();
                meals.forEach(meal => {
                    const mealCard = $(`
                        <div class="meal-card">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <p>${meal.strMeal}</p>
                        </div>
                    `);
                    mealCard.click(() => showMealDetail(meal.idMeal));
                    mealGrid.append(mealCard);
                });
            })
            .catch(error => console.error('Error fetching meals:', error));
    }

    
      // Function to show meal detail
      function showMealDetail(mealId) {
        // Save the selected category in sessionStorage
        const urlParams = new URLSearchParams(window.location.search);
        const categoryName = urlParams.get('category');
        sessionStorage.setItem('selectedCategory', categoryName);

        // Redirect to meal.html with the selected meal ID
        window.location.href = `meal.html?mealId=${encodeURIComponent(mealId)}`;
    }

    // Function to go back to the previous category detail
    function goBackToCategory() {
        const selectedCategory = sessionStorage.getItem('selectedCategory');
        if (selectedCategory) {
            window.location.href = `category.html?category=${encodeURIComponent(selectedCategory)}`;
        } else {
            // If no selected category, go back to the index.html
            window.location.href = 'index.html';
        }
    }

    // Attach click event to the Back button
    $('#backButton').click(goBackToCategory);

    // Check if the page is category.html
    if (window.location.pathname.includes('category.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryName = urlParams.get('category');
        if (categoryName) {
            $('#categoryTitle').text(categoryName);
            loadMeals(categoryName);
        }
    }

     // Check if the page is meal.html
     if (window.location.pathname.includes('meal.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const mealId = urlParams.get('mealId');
        if (mealId) {
            loadMealDetail(mealId);
        }
    }

    // Fetch and display meal details
    function loadMealDetail(mealId) {
        axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => {
                const meal = response.data.meals[0];
                const mealDetail = $('#mealDetail');
                const youtubeLink = meal.strYoutube;

                mealDetail.html(`
                    <h2>${meal.strMeal}</h2>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>Recipe:</h3>
                    <p>${meal.strInstructions}</p>
                    <h3>Youtube Tutorial:</h3>
                    <div class="youtube-embed">${embedYoutubeLink(youtubeLink)}</div>
                `);
            })
            .catch(error => console.error('Error fetching meal detail:', error));
    }

    // Function to embed YouTube link
    function embedYoutubeLink(link) {
        const videoId = link.split('v=')[1];
        return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }


});
