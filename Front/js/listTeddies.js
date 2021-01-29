const $teddies = document.getElementById("teddies");
const teddyTemplate = `
<div class="container">
  <div class="row">
    <div class="teddy card">
	  <h2 class="teddy-name"></h2>
	  <button class="teddy-price"></button>
    <img class="teddy-image" src="" alt="" />
    <p class="teddy-description"></p>
    <br>
    <a class="teddy-voirplus"><button>Voir le produit</button></a>
    </div>
  </div>
</div>
`;

async function main() {
  const response = await fetch("http://localhost:3000/api/teddies"); // fetch = va chercher
  const teddies = await response.json();
  console.log(teddies);

  for (let i = 0; i < teddies.length; i++) {
    console.log(i, teddies[i]);

    //Autre façon d'écrire la boucle//
    /*for (let teddy of teddies){
      console.log(teddy)
    } */

    //On transforme la chaine de caractère en objet pour le DOM, il n'est pas déja inclus au DOM
    const $teddy = document
      .createRange()
      .createContextualFragment(teddyTemplate);

    const $teddyName = $teddy.querySelector(".teddy-name");
    const $teddyPrice = $teddy.querySelector(".teddy-price");
    const $teddyImage = $teddy.querySelector(".teddy-image");
    const $teddyDescription = $teddy.querySelector(".teddy-description");
    const $teddyLink = $teddy.querySelector(".teddy-voirplus");

    $teddyName.textContent = teddies[i].name;
    $teddyPrice.textContent = (teddies[i].price / 100.0).toFixed(2) + " €";
    $teddyImage.setAttribute("src", teddies[i].imageUrl);
    $teddyImage.setAttribute("alt", teddies[i].name);
    $teddyDescription.textContent = teddies[i].description;
    $teddyLink.setAttribute("href", "product.html?id=" + teddies[i]._id);

    $teddies.appendChild($teddy);
  }
}
