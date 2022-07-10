// PAGE PRODUITS \\
let article;
let _id;
/** 
 * @returns product color 
*/
const couleurs = document.getElementById('colors');

/** 
* @returns the quantity of the product 
*/
const quantity = document.getElementById('quantity');

/* get id from url */
let url = new URL(window.location.href);
let search_params = new URLSearchParams(url.search);
if (search_params.has('id')) {
    _id = search_params.get('id');
}

/**
 * make a request to the api with the id present in the url ;
 * @param id - Identification of the product to be recovered 
 * @return article;
 */
export default async function Fetch_ID(id) {
    if (id !== undefined) {


        // request the api with the id present in the url
        return await fetch('http://localhost:3000/api/products/' + id)

            // if the response from the server has a status(200)
            .then(function (res) {

                if (res.ok) {
                    // pass the response in json format
                    return res.json();
                }
            })

            .then(async function (value) {
                // waits for the response from the server and stores it in a variable
                article = await value;

                // if the article variable is declared
                if (article) {
                    console.log(article);
                }
                return article

            })
            .catch(function (err) {

                // An error has occurred
                console.log("il y a une erreur " + err);
            });
    }
};



Fetch_ID(_id)
    .then(async function (article) { produit(await article) })
    .catch((err) => console.log(err));


/**
 * add the elements in the DOM
 * @param {*} article 
 */
async function produit(article) {
    console.log(article);
    if (article !== undefined) {
        /* get the "item__img" class and add an image to it  */
        const item__img = document.getElementsByClassName("item__img");
        item__img[0].innerHTML = "<img src=" + article.imageUrl + " alt=" + article.altTxt + "></img>";

        /* retrieves the element with the id title and adds the associated name  */
        const title = document.getElementById('title');
        title.innerText = article.name;

        /* retrieves the element with the id price and adds the associated price */
        const price = document.getElementById('price');
        price.innerText = article.price

        /* retrieves the element with the id description and adds the associated description */
        const description = document.getElementById('description');
        description.innerText = article.description;



        /* retrieves the element with the id colors and adds the associated color(s)*/
        for (let colors of article.colors) {
            let productColors = document.createElement("option");
            document.querySelector("#colors").appendChild(productColors);
            productColors.value = colors;
            productColors.innerHTML = colors;
        }

        panier(await article);
    }
}

/**
 * store products in localStorage 
 * @param {*} article 
 */
function panier(article) {

    const btn = document.querySelector("#addToCart");
    btn.addEventListener("click", () => {

        console.log(quantity.value);
        console.log("couleurs : " + couleurs.value.length);

        // check if color and quantity are not empty
        if (couleurs.value.length > 0 && quantity.value <= 100 && quantity.value != 0) {

            // get the selected color and quantity
            let Couleur = couleurs.value;
            let Quantity = Number(quantity.value);


            /**
             * new item to add to cart
             * @return Objet json 
             */
            let obj = {
                _id: _id,
                colors: Couleur,
                quantity: Number(Quantity),

            }
            /**
             * @return the products present in localStorage.getItem('obj');
             */

            let produitLocalStorage = JSON.parse(localStorage.getItem("obj"));
            console.log(produitLocalStorage);
            console.log(localStorage);


            /**
             * @return a confirmation box if yes redirection to the basket
             */
            const confirmation = () => {
                if (window.confirm(`${Quantity} ${article.name} ${Couleur} été ajouté à votre panier !` + `Pour consulter votre panier, cliquez sur OK`)) {
                    window.location.href = "cart.html";
                }
            }

            // if a product is present in localStorage \\
            if (produitLocalStorage !== null) {

                /**
                 * checks if the item is already in the cart
                 * @return the product(s) present in productLocalStorage
                 */
                const Find = produitLocalStorage.find((element) => element._id === _id && element.colors === Couleur);
                console.log(Find);
                // if the product is already in the basket
                if (Find) {
                    /**
                     * adjust the quantity of the product  
                     * @return obj.quantity + Find.quantity
                     */
                    let ChangeQuantity = parseInt(obj.quantity) + parseInt(Find.quantity);
                    Find.quantity = ChangeQuantity;
                    localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
                    console.log("la quantités du produit est maintenant de : " + Find.quantity);
                    confirmation();
                    // if it is already in the basket and the color is not the same, it adds it
                } else {
                    produitLocalStorage.push(obj);
                    localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
                    confirmation();

                }
                // if the product is not in the basket add it to the table
            } else {
                produitLocalStorage = [];
                produitLocalStorage.push(obj);
                localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
                confirmation()
            }
        }
    });
}

