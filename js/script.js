const Base_url = 'https://fakestoreapi.com';
const product_api = `${Base_url}/products`;

let products = [];
let favorites = [];

disabelinks();
fav();

start = async () => {
    try {
        const res = await fetch(product_api);
        products = await res.json() ?? [];
        console.log(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Something went wrong while fetching products.');
        products = [];
    }

    favorites = getFavoritesFromCookies();

    const product_list = document.querySelector('section.all_pro .product_list:nth-child(1)');
    if (!product_list) {
        console.error('Product list container not found.');
        return;
    }

    product_list.innerHTML = '';

    products.forEach(element => {
        product_list.innerHTML += product_element(element.image, element.title, element.id);
    });

    attachFavButtons(); 
    updateFavoritesView(); 
    updateFavoriteCount(); 
}

document.addEventListener('DOMContentLoaded', () => {
    start();
});

function product_element(imag, title, id) {
    const isFavorite = favorites.some(fav => fav.id == id);
    const buttonText = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';

    return `
     <div class="prudects_item" data-id="${id}">
        <div class="card">
            <img class="img1" src="${imag}" alt="${title}">
            <div class='textdesign'>
                <p>${title}</p>
                <button class='fav_btn' data-id="${id}">${buttonText}</button>
            </div>
        </div>
     </div>
    `;
}

function disabelinks() {
    const elements = document.getElementsByClassName('links');
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', event => {
            event.preventDefault();
        });
    }
}

function fav() {
    const elements = document.getElementsByClassName('links');

    if (elements[0] && elements[1]) {
        elements[0].addEventListener('click', () => {
            elements[0].style.display = 'none';
            elements[1].style.display = 'block';
            document.querySelector('.all_pro .product_list:nth-child(1)').style.display = 'none';
            document.querySelector('.all_pro .product_list:nth-child(2)').style.display = 'flex';
            document.getElementById('pru').innerHTML="Favorite prudent"
        });

        elements[1].addEventListener('click', () => {
            elements[1].style.display = 'none';
            elements[0].style.display = 'block';
            document.querySelector('.all_pro .product_list:nth-child(1)').style.display = 'flex';
            document.querySelector('.all_pro .product_list:nth-child(2)').style.display = 'none';
            document.getElementById('pru').innerHTML="Our prudent"

        });
    }
}

function attachFavButtons() {
    const favButtons = document.querySelectorAll('.fav_btn');
    favButtons.forEach(button => {
        button.removeEventListener('click', handleFavButtonClick); 
        button.addEventListener('click', handleFavButtonClick);   
    });
}

function handleFavButtonClick(event) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    toggleFavorite(id, button);
}

function toggleFavorite(id, button) {
    const product = products.find(p => p.id == id);

    if (!product) {
        console.error(`Product with ID ${id} not found.`);
        return;
    }

    if (!favorites.some(fav => fav.id == id)) {
        favorites.push(product);
        button.textContent = 'Remove from Favorites';
        alert(`${product.title} added to favorites!`);
    } else {
        favorites = favorites.filter(fav => fav.id != id);
        button.textContent = 'Add to Favorites';
        alert(`${product.title} removed from favorites!`);
    }

    setFavoritesToCookies();
    updateFavoritesView(); 
    updateFavoriteCount(); 
}

function updateFavoritesView() {
    const favorite_list = document.querySelector('section.all_pro .product_list:nth-child(2)');
    if (!favorite_list) {
        console.error('Favorite list container not found.');
        return;
    }

    favorite_list.innerHTML = '';

    favorites.forEach(element => {
        favorite_list.innerHTML += product_element(element.image, element.title, element.id);
    });

    attachFavButtons();
}

function updateFavoriteCount() {
    const countElement = document.querySelector('.menu .count');
    if (countElement) {
        countElement.textContent = favorites.length; 
    }
}

function setFavoritesToCookies() {
    document.cookie = `favorites=${JSON.stringify(favorites)}; path=/; max-age=31536000`; 
}

function getFavoritesFromCookies() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('favorites='));
    if (!cookie) return []; 
    try {
        return JSON.parse(cookie.split('=')[1]); 
    } catch (e) {
        console.error('Error parsing favorites from cookies:', e);
        return [];
    }
}
