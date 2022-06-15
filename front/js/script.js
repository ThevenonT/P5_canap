/**
 * query the api products
 * @return all the products present
 */
fetch('http://localhost:3000/api/products')
  // receive all products in json format
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  // put all the products in a variable 
  .then(function (value) {
    const section = document.getElementById('items');
    // return the products individually
    for (let valu of value) {
      // create an <a> tag and add the attributes of each product
      const a = document.createElement('a');
      a.setAttribute('href', './product.html?id=' + valu._id);
      // create an <article> tag and add it to the tag <section>
      const article = document.createElement('article');
      section.appendChild(a);
      // add the <article> tag inside the <a> tag
      a.appendChild(article);
      // add image, title and description in the <article> tag
      article.innerHTML = "<img src=" + valu.imageUrl + " alt='Lorem ipsum dolor sit amet, Kanap name1'>" + "<h3 class='productName'>" + valu.name + "</h3>" + "<p class='productDescription'>" + valu.description + "</p>";

      console.log(valu)

    }



  })
  .catch(function (err) {
    // An error has occurred
    console.log("il y a une erreur " + err);
  });





