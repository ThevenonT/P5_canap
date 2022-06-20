// PAGE PANIER \\

// Déclaration des variable \\
/**
 * @return les produits présents dans localStorage.getItem('obj');
 */
let produitLocalStorage = JSON.parse(localStorage.getItem("obj"));
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
function addCard() {
    for (let key in produitLocalStorage) {
        /**
         * @return document.createElement('article');
         */
        let Article = document.createElement('article');
        let id = produitLocalStorage[key]._id;
        colors = produitLocalStorage[key].colors;
        quantity = produitLocalStorage[key].quantity;
        let Img = produitLocalStorage[key].img;
        let Altimg = produitLocalStorage[key].altImg;
        let Name = produitLocalStorage[key].name;
        let Price = produitLocalStorage[key].price;
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

    }

}
addCard();


/**
 * calcul le prix et la quantité total 
 */
function total() {
    let quantityTotal = document.getElementById('totalQuantity');
    let quantity = document.getElementsByClassName('itemQuantity');
    let prixTotal = document.getElementById('totalPrice');
    let totalQ = 0;
    let totalP = 0;



    for (let i = 0; i < quantity.length; i++) {
        console.log(quantity[i].value);
        totalQ += Number(quantity[i].value);
        totalP += (quantity[i].value * produitLocalStorage[i].price);
    }
    quantityTotal.innerHTML = totalQ;
    prixTotal.innerHTML = totalP;


}
total();

/**
 * Supprime l'élément cliqué
 */
function supprimer() {

    let sup = document.querySelectorAll("#deleteItem");
    for (let i = 0; i < sup.length; i++) {
        // écoute si on clique sur supprimer
        sup[i].addEventListener("click", () => {
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
supprimer();

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
modifieQ();


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
let Regex = new RegExp("^[a-zA-Z ,.'-]+$");
let addressRegex = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
let emailRegex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');


/**
 * écoute les évènements sur les inputs et les compares au regex
 * @returns boolean 
 */
function verify() {

    // FIRST NAME
    function validfirstName() {
        if (firstName.value.length <= 0) {
            firstNameErrorMsg.innerHTML = "";
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
    function validlastName() {
        if (lastName.value.length <= 0) {

            lastNameErrorMsg.innerHTML = "";

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
    function validaddress() {
        if (address.value.length <= 0) {

            addressErrorMsg.innerHTML = "";
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
    function validcity() {
        if (city.value.length <= 0) {
            cityErrorMsg.innerHTML = "";

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
    function validemail() {
        if (email.value.length <= 0) {
            emailErrorMsg.innerHTML = "";

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
verify();


/**
 *  crée un tableau et y ajoute les id des produit present dans localStorage
 */
function ajoute() {
    btn.addEventListener('click', (e) => {

        e.preventDefault();
        //crée un tableau avec les id des produit present dans localStorage
        let id = [];
        for (let i = 0; i < produitLocalStorage.length; i++) {
            id.push(produitLocalStorage[i]._id);
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
        fetch("http://localhost:3000/api/products//order", options)

            .then((response) => response.json())

            .then((res) => {

                console.log(res.orderId);

                console.log(verify());
                if (verify()) {
                    localStorage.clear();
                    localStorage.setItem('orderId', res.orderId);
                    document.location.href = 'confirmation.html?orderId=' + res.orderId;
                } else {

                    firstNameErrorMsg.innerHTML = "merci de renseigner ce champ !";
                    lastNameErrorMsg.innerHTML = "merci de renseigner ce champ !";
                    addressErrorMsg.innerHTML = "merci de renseigner ce champ !";
                    cityErrorMsg.innerHTML = "merci de renseigner ce champ !";
                    emailErrorMsg.innerHTML = "merci de renseigner ce champ !";
                }

            })

            .catch((error) => {
                console.log("error :" + error)
            })
    })
}
ajoute();

