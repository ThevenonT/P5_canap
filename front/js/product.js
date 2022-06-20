// PAGE PRODUITS \\
let article = "";
let _id;
/**
 * @return la couleur du produit;
 */
const couleurs = document.getElementById('colors');

/**
 * @return la quantité du produit; 
 */
const quantity = document.getElementById('quantity');

/* récupère l'id dans l'url */
let url = new URL(window.location.href);
let search_params = new URLSearchParams(url.search);
if (search_params.has('id')) {
    _id = search_params.get('id');
}
Fetch();
/**
 * fait une requête a l'api avec l'id présent dans l'url ;
 * @return la function produit() si le produit est présent dans l'api;
 */

function Fetch() {
    // requête l'api avec l'id présent dans l'url
    fetch('http://localhost:3000/api/products/' + _id)
        // si la réponse du server a un status(200)
        .then(function (res) {
            // si la réponse est ok 
            if (res.ok) {
                // passe la réponse en format json 
                return res.json();
            }
        })

        .then(async function (value) {
            // attend la réponse du server et la stock dans une variable 
            article = await value;
            // si la variable article est déclaré 
            if (article) {
                // renvoie la function produit
                produit(article);
            }

        })

        .catch(function (err) {

            // Une erreur est survenue
            console.log("il y a une erreur " + err);
        });

}


/**
 * ajoute les element dans le DOM
 * @param {*} article 
 */
function produit(article) {

    /* récupère la classe "item__img" et lui ajoute une image avec l'url  */
    const item__img = document.getElementsByClassName("item__img");
    item__img[0].innerHTML = "<img src=" + article.imageUrl + " alt=" + article.altTxt + "></img>";

    /* récupère l'element avec l'id title et lui a ajoute le nom associer  */
    const title = document.getElementById('title');
    title.innerText = article.name;

    /* récupère l'element avec l'id price et lui ajoute le prix associer */
    const price = document.getElementById('price');
    price.innerText = article.price

    /* récupère l'element avec l'id description et lui ajoute la description associer */
    const description = document.getElementById('description');
    description.innerText = article.description;



    /* récupère l'element avec l'id colors et lui ajoute la/les couleur/s associer */
    for (let colors of article.colors) {
        let productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = colors;
        productColors.innerHTML = colors;
    }

    panier(article);
}

function panier(article) {

    const btn = document.querySelector("#addToCart");
    btn.addEventListener("click", () => {

        console.log(quantity.value);
        console.log("couleurs : " + couleurs.value.length);

        // vérifie si la couleur et la quantité ne sont pas vide
        if (couleurs.value.length > 0 && quantity.value <= 100 && quantity.value != 0) {

            // récupères les couleur et la quantité sélectionnée
            let Couleur = couleurs.value;
            let Quantity = Number(quantity.value);


            /**
             * objet à ajouter au panier
             * @return Objet json 
             */
            let obj = {
                _id: _id,
                colors: Couleur,
                quantity: Number(Quantity),
                name: article.name,
                price: article.price,
                description: article.description,
                img: article.imageUrl,
                altImg: article.altTxt
            }
            /**
             * @return les produits présents dans localStorage.getItem('obj');
             */
            let produitLocalStorage = JSON.parse(localStorage.getItem("obj"));
            console.log(produitLocalStorage);


            /**
             * @return une boite de confirmation si oui redirection vers le panier
             */
            const confirmation = () => {
                if (window.confirm(`${Quantity} ${article.name} ${Couleur} été ajouté à votre panier !` + `Pour consulter votre panier, cliquez sur OK`)) {
                    window.location.href = "cart.html";
                }
            }

            // si un produit est present dans localStorage \\
            if (produitLocalStorage) {

                /**
                 * vérifie si l'objet est deja dans le panier
                 * @return le(s) produit(s) présent dans produitLocalStorage
                 */
                const Find = produitLocalStorage.find((element) => element._id === _id && element.colors === Couleur);
                console.log(Find);
                // si il est deja dans le panier 
                if (Find) {
                    /**
                     * ajuste la quantité du produit  
                     * @return obj.quantity + Find.quantity
                     */
                    let ChangeQuantity = parseInt(obj.quantity) + parseInt(Find.quantity);
                    Find.quantity = ChangeQuantity;
                    localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
                    console.log("la quantités du produit est maintenant de : " + Find.quantity);
                    confirmation();
                    // si il est deja dans le panier et que la couleur est pas la meme il l'ajoute 
                } else {
                    produitLocalStorage.push(obj);
                    localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
                    confirmation();

                }
                //si il est pas dans le panier il l'ajoute au tableau 
            } else {
                produitLocalStorage = [];
                produitLocalStorage.push(obj);
                localStorage.setItem("obj", JSON.stringify(produitLocalStorage));

                confirmation()
            }
        }
    });
}

