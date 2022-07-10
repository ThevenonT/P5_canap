// PAGE PANIER \\
import Fetch_ID from "./product.js";

// Déclaration des variable \\
/**
 * @return les produits présents dans localStorage.getItem('obj');
 */

let produitLocalStorage = JSON.parse(localStorage.getItem("obj"));
console.log('produitLocalStorage', produitLocalStorage);
console.log('localStorage', localStorage);
/**
 * @return document.querySelector("#cart__items");
 */
let section = document.querySelector("#cart__items");

let colors;
let quantity;

/**
 * se répète temps qu'il y a des objet dans localStorage
 * @return ajout des élément dans le dom 
 */
addCard();
async function addCard() {
    console.log(produitLocalStorage);

    if (produitLocalStorage !== null) {
        for (let key in produitLocalStorage) {
            let id = produitLocalStorage[key]._id;
            console.log(await Fetch_ID(id));
            await Fetch_ID(id)
                .then(function (article) {
                    console.log('article', article);
                    console.log('article', article.imageUrl);
                    /**
                     * @return document.createElement('article');
                     */
                    let Article = document.createElement('article');
                    colors = produitLocalStorage[key].colors;
                    quantity = String(produitLocalStorage[key].quantity);
                    let Img = article.imageUrl;
                    let Altimg = article.altTxt;
                    let Name = article.name;
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
            supprimer();
            modifieQ();
            ajoute();
        }
    }
    else {
        let titre_Alert = document.getElementById('cart__items');
        titre_Alert.innerHTML = "<h1>Le panier est vide ! </h1>"
        return;
    }

}




/**
 * calcul le prix et la quantité total 
 */
let tabPrice = [];
let tabQuantite = []
function total(price, quantite) {
    console.log('price', price);
    console.log('quantité', quantite);
    let quantityTotal = document.getElementById('totalQuantity');
    let prixTotal = document.getElementById('totalPrice');
    let totalQ = 0;
    let totalP = 0;
    let QNumber = Number(quantite);
    tabPrice.push({ price });
    tabQuantite.push({ QNumber })
    console.log(tabPrice);
    console.log(tabQuantite);

    for (let key in tabPrice) {
        console.log(tabPrice[key].price)
        totalP += (tabQuantite[key].QNumber * tabPrice[key].price);
        totalQ += tabQuantite[key].QNumber;
    }
    console.log(totalP);
    console.log(totalQ);


    quantityTotal.innerHTML = totalQ;
    prixTotal.innerHTML = totalP;

}


/**
 * Supprime l'élément cliqué
 */
function supprimer() {
    let sup = document.querySelectorAll("#deleteItem");
    console.log(sup);

    for (let i = 0; i < sup.length; i++) {
        // écoute si on clique sur supprimer
        sup[i].addEventListener("click", () => {
            console.log('sup');
            let _ID = sup[i].closest("article").dataset.id;
            let _COLOR = sup[i].closest("article").dataset.color;
            // filtre tous les element qui n'ont pas l'id et la couleur identique a celui cliquer 
            produitLocalStorage = produitLocalStorage.filter(element => element._id !== _ID || element.colors !== _COLOR);
            // renvoie toute les donner dans localStorage
            localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
            location.reload();
        })

    }


}


// modifie la quantité
function modifieQ() {

    let modify = document.querySelectorAll('.itemQuantity');
    // se repete tant qu'il y a des produit dans le panier 
    for (let i = 0; i < modify.length; i++) {
        modify[i].addEventListener('change', () => {
            // récuperer l'id, la couleur et la quantity
            let _ID = modify[i].closest("article").dataset.id;
            let _COLOR = modify[i].closest("article").dataset.color;
            let _QUANTITY = modify[i].value;
            // renvoie le produit qui contient l'id et la couleur 
            let produit = produitLocalStorage.find(element => element._id == _ID && element.colors == _COLOR);
            produit.quantity = _QUANTITY;
            produitLocalStorage[i].quantity = produit.quantity;
            localStorage.setItem("obj", JSON.stringify(produitLocalStorage));
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
let btn = document.getElementById('order');
let input = document.querySelectorAll('input');


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
    validfirstName();
    function validfirstName() {
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
        validfirstName();
    });

    //LAST NAME
    validlastName();
    function validlastName() {
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
        validlastName();
    });

    // ADDRESS
    validaddress();
    function validaddress() {
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
        validaddress();
    });

    // CITY
    validcity();
    function validcity() {
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
        validcity();


    });

    // EMAIL
    validemail();
    function validemail() {
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
        validemail();
    });

    // si tous les champ son valide apres verification des regex renvoie true sinon renvoie false 
    if (validfirstName() & validlastName() & validaddress() & validcity() & validemail()) {
        return true;
    } else {
        return false;
    }

}



/**
 *  crée un tableau et y ajoute les id des produit present dans localStorage
 */
function ajoute() {
    btn.addEventListener('click', (e) => {

        e.preventDefault();

        //crée un tableau avec les id des produit present dans localStorage
        let id = [];
        console.log(produitLocalStorage);
        if (produitLocalStorage !== null) {
            if (produitLocalStorage.length >= 1) {
                for (let i = 0; i < produitLocalStorage.length; i++) {
                    id.push(produitLocalStorage[i]._id);
                }
            } else {

                alert('le panier est vide !')

            }
        }

        console.log(id);
        // crée un tableau contact et y ajoute le tableau des produit 
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
        if (verify()) {
            if (produitLocalStorage !== null) {
                if (produitLocalStorage.length >= 1) {
                    fetch("http://localhost:3000/api/products//order", options)

                        .then((response) => response.json())

                        .then((res) => {

                            console.log(res.orderId);



                            if (verify()) {
                                localStorage.clear();
                                document.location.href = 'confirmation.html?orderId=' + res.orderId;
                            }

                        })

                        .catch((error) => {
                            console.log("error :" + error)
                        })

                }
            }
        }
    })
}


