// PAGE PANIER \\
import Fetch_ID from "./product.js";

// Déclaration des variable \\
/**
 * @return les produits présents dans localStorage;
 */
let produitLocalStorage = JSON.parse(localStorage.getItem("obj"));
console.log('produitLocalStorage', produitLocalStorage);
console.log('localStorage', localStorage);
/**
 * 
 * @return la balise section contenant l'id cart__items;
 */
let section = document.querySelector("#cart__items");

let colors;
let quantity;

/**
 * affiche les informations des produits présent dans le panier
 * @return ajoute les élément un par un dans le DOM 
 */
async function addCard() {
    console.log(produitLocalStorage);
    // si il y a des produit présent dans local storage 
    if (produitLocalStorage !== null) {

        // récupère les produit et ses information un par un dans une variable nommée key
        for (let key in produitLocalStorage) {
            // récupère l'id du produit dans local Storage 
            let id = produitLocalStorage[Number(key)]._id;

            console.log(await Fetch_ID(id));

            // récupère les information du produit en passent l'id du produit en paramètre 
            await Fetch_ID(id)
                .then(function (article) {

                    // créer un balise article  
                    let Article = document.createElement('article');
                    // récupère la couleur du produit renseignée dans le local storage 
                    colors = produitLocalStorage[key].colors;
                    // récupère la quantité du produit renseignée dans le local storage 
                    quantity = String(produitLocalStorage[key].quantity);
                    // récupère l'image du produit retourner par l'api 
                    let Img = article.imageUrl;
                    // récupère le texte descriptif de l'image du produit retourner par l'api
                    let Altimg = article.altTxt;
                    // récupère le nom du produit retourner par l'api
                    let Name = article.name;
                    // récupère le prix du produit retourner par l'api
                    let Price = article.price;
                    // ajoute l'élément Article comme enfants de l'élément section
                    section.appendChild(Article);
                    // ajout de la classe "cart__item" 
                    Article.classList.add("cart__item")
                    // ajout de l'attribut "data-id"
                    Article.setAttribute("data-id", `${id}`);
                    // ajout de l'attribut data-color
                    Article.setAttribute("data-color", `${colors}`);
                    // ajout des éléments sous format html 
                    Article.innerHTML =
                        `<div class="cart__item__img">
                            <img src="${Img}" alt="${Altimg}">
                        </div>
                        <div class="cart__item__content__description">
                                    <h2>${Name}</h2>
                                    <p>${colors}</p>
                                    <p>${Price} €</p>
                                </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                                </div>

                                <div class="cart__item__content__settings__delete">
                                    <p id="deleteItem" class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                    </div> `;

                    total(Price, quantity);
                })
            // appelle des function suivante après l'insertion des produits 
            supprimer();
            modifieQ();
            ValidationOfOrder();
        }
    }
    else {

        let titre_Alert = document.getElementById('cart__items');
        titre_Alert.innerHTML = "<h1>Le panier est vide ! </h1>"
        return;
    }

}
// appelle de la function addCard()
addCard();




let tabPrice = [];
let tabQuantite = []
/**
 * calcul le prix et la quantité total 
 * @param price - est le prix du produit 
 * @param quantite - est la quantité du produit 
 * @return quantite * price 
 */
function total(price, quantite) {
    console.log('price', price);
    console.log('quantité', quantite);
    // récupère la balise l'id totalQuantity 
    let quantityTotal = document.getElementById('totalQuantity');
    // récupère la balise totalPrice 
    let prixTotal = document.getElementById('totalPrice');
    // nombre de la quantité total
    let totalQ = 0;
    // nombre du prix total 
    let totalP = 0;
    // récupère la quantité selection lors de l'ajout dans le local storage 
    let QNumber = Number(quantite);
    // ajoute le prix du produit dans le tableau du prix 
    tabPrice.push({ price });
    // ajoute la quantité du produit dans le tableau de le quantité
    tabQuantite.push({ QNumber })

    console.log(tabPrice);
    console.log(tabQuantite);
    // récupère les produits présent dans le tableau de prix un par un dans une variable 
    for (let key in tabPrice) {
        console.log(tabPrice[key].price)
        // calcul le prix total et les enregistre dans leur variable 
        totalP += (tabQuantite[key].QNumber * tabPrice[key].price);
        // calcul la quantité total et les enregistre dans leur variable 
        totalQ += tabQuantite[key].QNumber;
    }
    console.log(totalP);
    console.log(totalQ);

    // ajoute la quantité total au DOM
    quantityTotal.innerHTML = totalQ;
    // ajoute le prix total au DOM
    prixTotal.innerHTML = totalP;

}


/**
 * ajoute un événement de type click au balise ayant l'id deleteItem 
 ** Supprime l'élément cliqué dans le localStorage
 */
function supprimer() {
    let sup = document.querySelectorAll("#deleteItem");
    console.log(sup);
    // récupère les balise ayant l'id deleteItem un par un 
    for (let i = 0; i < sup.length; i++) {
        // ajoute l'événement de type click au bouton supprimé de chaque produit présent dans le localStorage
        sup[i].addEventListener("click", () => {
            console.log('sup');
            // récupère l'id du produit cliqué  
            let _ID = sup[i].closest("article").dataset.id;
            // récupère la couleur du produit cliqué 
            let _COLOR = sup[i].closest("article").dataset.color;
            // filtre les produits qui n'ont pas l'id et la couleur identique a celui cliquer 
            produitLocalStorage = produitLocalStorage.filter(element => element._id !== _ID || element.colors !== _COLOR);
            // modifie objet present dans localStorage 
            localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
            // recharge la page pour affiché les modifications 
            location.reload();
        });
    };
}


/**
* ajoute un événement de type click au balise ayant la class itemQuantity
** modifie la quantité du produit cliqué
*/
function modifieQ() {
    // récupère les balise ayant la class itemQuantity
    let modify = document.querySelectorAll('.itemQuantity');
    // récupère les balise ayant la class itemQuantity un par un 
    for (let i = 0; i < modify.length; i++) {
        // ajoute un événement de type a la case modifier de chaque produit présent dans localStorage 
        modify[i].addEventListener('change', () => {
            // récupère l'id du produit cliqué 
            let _ID = modify[i].closest("article").dataset.id;
            // récupère la couleur du produit cliqué 
            let _COLOR = modify[i].closest("article").dataset.color;
            // récupère la quantité de la case du produit cliqué 
            let _QUANTITY = modify[i].value;
            // filtre les produits qui ont l'id et la couleur identique a celui cliquer 
            let produit = produitLocalStorage.find(element => element._id == _ID && element.colors == _COLOR);
            // ajoute la quantité modifier au produit cliqué
            produit.quantity = _QUANTITY;
            // modifie la quantité du produit 
            produitLocalStorage[i].quantity = produit.quantity;
            // ajoute la quantité modifier dans le localStorage 
            localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
            // recharge la page pour affiché la quantité modifier
            location.reload();

        })
    }
}



// VALIDATION DE COMMANDE \\

// Variable
let firstName = document.getElementById('firstName');
let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
let lastName = document.getElementById('lastName');
let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
let address = document.getElementById('address');
let addressErrorMsg = document.getElementById('addressErrorMsg');
let city = document.getElementById('city');
let cityErrorMsg = document.getElementById('cityErrorMsg');
let email = document.getElementById('email');
let emailErrorMsg = document.getElementById('emailErrorMsg');
let BtnCommander = document.getElementById('order');



// RegExp
let Regex = new RegExp("^[a-zA-Zéèàêîôâ ,.'-]+$");
let addressRegex = new RegExp("^[0-9a-zA-Z]{1,3}[a-z A-Z-'-éèàçêîôâ]{1,20}$");
let emailRegex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');


/**
 * écoute les évènements sur les inputs et les compares au regex
 * @returns boolean 
 */
function verify() {

    // FIRST NAME
    validFirstName();
    function validFirstName() {
        console.log(firstName.value);
        if (firstName.value.length == 0) {
            firstNameErrorMsg.innerHTML = "merci de renseignée se champ !";
        }
        else if (Regex.test(firstName.value)) {

            firstNameErrorMsg.innerHTML = "";
            return true;

        } else {

            firstNameErrorMsg.innerHTML = "merci de vérifier ce champ !";
            return false;

        }
    };
    firstName.addEventListener('change', () => {
        console.log(firstName.value);
        validFirstName();
    });

    //LAST NAME
    validLastName();
    function validLastName() {
        console.log(lastName.value);
        if (lastName.value.length == 0) {

            lastNameErrorMsg.innerHTML = "merci de renseignée se champ !";

        } else if (Regex.test(lastName.value)) {
            lastNameErrorMsg.innerHTML = "";
            return true;
        } else {
            lastNameErrorMsg.innerHTML = "merci de vérifier ce champ !";
            return false;
        }
    }
    lastName.addEventListener('change', () => {
        console.log(lastName.value);
        validLastName();
    });

    // ADDRESS
    validAddress();
    function validAddress() {
        console.log(address.value);
        if (address.value.length === 0) {

            addressErrorMsg.innerHTML = "merci de renseignée se champ !";
        }
        else if (addressRegex.test(address.value)) {
            addressErrorMsg.innerHTML = "";
            return true;
        } else {
            addressErrorMsg.innerHTML = "merci de vérifier ce champ !";
            return false;
        }
    }
    address.addEventListener('change', () => {
        console.log(address.value);
        validAddress();
    });

    // CITY
    validCity();
    function validCity() {
        if (city.value.length == 0) {
            cityErrorMsg.innerHTML = "merci de renseignée se champ !";

        }
        else if (Regex.test(city.value)) {
            cityErrorMsg.innerHTML = "";
            return true;
        } else {
            cityErrorMsg.innerHTML = "merci de vérifier ce champ !";
            return false;
        }
    }
    city.addEventListener('change', () => {
        console.log(city.value);
        validCity();


    });

    // EMAIL
    validEmail();
    function validEmail() {
        if (email.value.length == 0) {
            emailErrorMsg.innerHTML = "merci de renseignée se champ !";

        }
        else if (emailRegex.test(email.value)) {
            emailErrorMsg.innerHTML = "";
            return true;
        } else {
            emailErrorMsg.innerHTML = "merci de vérifier ce champ !";
            return false;
        }
    }
    email.addEventListener('change', () => {
        console.log(email.value);
        validEmail();
    });

    // si tous les champ son valide apres verification des regex renvoie true sinon renvoie false 
    if (validFirstName() & validLastName() & validAddress() & validCity() & validEmail()) {
        return true;
    } else {
        return false;
    }

}



/**
 * ajoute un événement de type click au bouton commander
 ** vérifie la validation des information saisie par l'utilisateur 
 ** envoie le tableau de commande a l'api 
 * @return l'utilisateur sur la page confirmation de commande 
 */
function ValidationOfOrder() {
    // ajoute un événement de type click a la balise ayant l'id order
    BtnCommander.addEventListener('click', (e) => {
        // désactive les événement par default
        e.preventDefault();
        /** tableau contenant les id des produits présent dans le panier lors du passage de la commande */
        let id = [];
        console.log(produitLocalStorage);
        // si la variable produitLocalStorage est déclaré et n'est pas null
        if (produitLocalStorage !== null) {
            // si produitLocalStrorage a au moins un element présent 
            if (produitLocalStorage.length >= 1) {
                // récupère les produit un par un 
                for (let i = 0; i < produitLocalStorage.length; i++) {
                    // ajoute l'id du produit dans le tableau
                    id.push(produitLocalStorage[i]._id);
                }
            }
            else {
                // affiche une alert si le panier est vide
                alert('le panier est vide !')
            }
        }

        console.log(id);
        // crée un tableau avec les information renseignée  
        const tab = {
            contact: {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value,
            },
            products: id,
        };
        // créer un objet contenant les options pour la requête
        const options = {
            method: 'POST',
            body: JSON.stringify(tab),
            headers: {
                'Accept': 'application/json',
                "content-type": "application/json"
            },
        };

        // envoie de l'objet contact et du tableau des id de chaque produit present l'or de la commande 
        console.log(verify());
        // si les informations renseigné dans le formulaire de commande son valide
        if (verify()) {
            // si la variable produitLocalStorage est déclaré et n'est pas null 
            if (produitLocalStorage !== null) {
                // si les produit présent dans le panier et supérieur ou égale a 1
                if (produitLocalStorage.length >= 1) {
                    // requête l'api avec les information de commande dans le corp de la requête 
                    fetch("http://localhost:3000/api/products//order", options)

                        // passe la réponse de l'api au format json 
                        .then((response) => response.json())
                        .then((res) => {
                            console.log(res.orderId);
                            // vide le panier 
                            localStorage.clear('obj');
                            // redirige l'utilisateur sur la page confirmation
                            document.location.href = 'confirmation.html?orderId=' + res.orderId;

                        })

                        .catch((error) => {
                            console.log("error :" + error)
                        })

                }
            }
        }
    })
}


