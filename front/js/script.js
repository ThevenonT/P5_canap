/**
 * @return tout les produits présent 
 */
fetch('http://localhost:3000/api/products')

  // récupère tous les produit et les passent au format json 
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })

  // récupère tous les produits dans une variable 
  .then(function (value) {
    const section = document.getElementById('items');

    // retourne les produits individuellement 
    for (let valu of value) {

      // créer une balise <a> et ajoute les attributs de chaque produit
      const a = document.createElement('a');
      a.setAttribute('href', './product.html?id=' + valu._id);

      // créez une balise <article> et l'ajoute à la balise <section>
      const article = document.createElement('article');
      section.appendChild(a);

      // ajoute la balise <article> à l'intérieur de la balise <a>
      a.appendChild(article);

      // ajoute une image, un titre et une description dans la balise <article>
      article.innerHTML = "<img src=" + valu.imageUrl + " alt='Lorem ipsum dolor sit amet, Kanap name1'>" +
        "<h3 class='productName'>" + valu.name + "</h3>" +
        "<p class='productDescription'>" + valu.description + "</p>";

      console.log('produit individuel: ', valu);

    }



  })
  .catch(function (err) {

    // Si une erreur si produit 
    console.log("il y a une erreur " + err);
  });





