// PAGE PRODUITS \\
let article;
let _id;
/** 
 * @returns couleur du produit  
*/
const couleurs = document.getElementById('colors');

/** 
* @returns la quantité du produit  
*/
const quantity = document.getElementById('quantity');

/* récupère l'id présent dans l'url */
let url = new URL(window.location.href);
console.log(url);
let search_params = new URLSearchParams(url.search);
// vérifie si le paramètre existe dans l'url  si oui @return true;
if (search_params.has('id')) {
    // récupère l'id dans les paramètre de l'url 
    _id = search_params.get('id');
}

/**
 * requête l'api pour récupéré le produit associer a l'id présent dans l'url;
 * @param id - identifient du produit  
 * @return article - contient les informations du produit  
 */
export default async function Fetch_ID(id) {

    if (id !== undefined) {

        // requête l'api avec l'id présent dans l'url 
        return await fetch('http://localhost:3000/api/products/' + id)
            // passe la réponse au format json 
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
            })

            .then(async function (value) {
                // attend la réponse du serveur et la stocke dans une variable 
                article = await value;

                if (article) {
                    console.log(article);
                }
                return article

            })
            .catch(function (err) {

                // si une erreur survient 
                console.log("il y a une erreur " + err);
            });
    }

};


/**
 * appelle de la function Fetch_ID()
 * récupère le résultat de la requête dans une variable 
 * et appelle la function produit avec l'article récupéré 
 */

Fetch_ID(_id)
    .then((article) => { produit(article) })
    .catch((err) => console.log(err));


/**
 * ajout les élément au DOM
 * @param {*} article 
 */
async function produit(article) {
    console.log(article);
    if (article !== undefined) {
        /** récupère la balise avec la classe 'item_img' et lui ajoute l'image du produit */
        const item__img = document.getElementsByClassName("item__img");
        item__img[0].innerHTML = "<img src=" + article.imageUrl + " alt=" + article.altTxt + "></img>";

        /**
         * récupère la balise qui contient l'id 'title' et ajoute le nom de l'article
         */
        const title = document.getElementById('title');
        title.innerText = article.name;

        /**
         * récupère la balise qui contient la classe 'price' et ajoute le prix de l'article 
         */
        const price = document.getElementById('price');
        price.innerText = article.price;

        /**
         * récupère la balise qui contient l'id 'description' et ajoute la description de l'article 
         */
        const description = document.getElementById('description');
        description.innerText = article.description;

        /**
         * récupère les couleurs dans le tableau des couleurs du produit 
         * récupère la balise qui contient l'id colors et ajoute les couleurs
         */
        for (let colors of article.colors) {
            let productColors = document.createElement("option");
            document.querySelector("#colors").appendChild(productColors);
            productColors.value = colors;
            productColors.innerHTML = colors;
        }
        // appelle de la function panier 
        panier(await article);
    }
}
/**
 * ajoute les produit dans le panier 
 * @param {*} article 
 */
function panier(article) {

    const btn = document.querySelector("#addToCart");
    // écoute si un évènement de type click se produit 
    btn.addEventListener("click", () => {

        console.log(quantity.value);
        console.log("couleurs : " + couleurs.value.length);

        // vérifie la déclaration de la couleur 
        if (couleurs.value.length > 0 && quantity.value <= 100 && quantity.value != 0) {

            // récupère la couleur et la quantité
            let Couleur = couleurs.value;
            let Quantity = Number(quantity.value);


            /**
             * crée un objet contenant l'id, la couleur et la quantité du produit 
             * @return Objet json 
             */
            let obj = {
                _id: _id,
                colors: Couleur,
                quantity: Number(Quantity),

            }
            /**
             * @return les produit présent dans le panier;
             */
            let produitLocalStorage = JSON.parse(localStorage.getItem("obj"));
            console.log(produitLocalStorage);
            console.log(localStorage);


            /**
             * @return une boite de confirmation si true redirige l'utilisateur sur la page panier
             */
            const confirmation = () => {
                if (window.confirm(`${Quantity} ${article.name} ${Couleur} été ajouté à votre panier !` + `Pour consulter votre panier, cliquez sur OK`)) {
                    window.location.href = "cart.html";
                }
            }

            // si le panier n'est pas vide \\
            if (produitLocalStorage !== null) {

                /**
                 * vérifie si un produit avec le meme id et la meme couleur est present dans le panier 
                 */
                const Find = produitLocalStorage.find((element) => element._id === _id && element.colors === Couleur);
                console.log(Find);
                // si le produit est déjà dans le panier 
                if (Find) {
                    /**
                     * ajuste la quantité du produit  
                     */
                    let ChangeQuantity = parseInt(obj.quantity) + parseInt(Find.quantity);
                    Find.quantity = ChangeQuantity;
                    // ajoute le produit modifier au panier 
                    localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
                    console.log("la quantités du produit est maintenant de : " + Find.quantity);

                    confirmation();
                    // si le produit n'est pas présent dans le panier ajoute le produit au panier 
                } else {
                    produitLocalStorage.push(obj);
                    localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
                    confirmation();

                }
                // si le panier est vide ajoute le produit au panier 
            } else {
                produitLocalStorage = [];
                produitLocalStorage.push(obj);
                localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
                confirmation()
            }
        }
    });
}
