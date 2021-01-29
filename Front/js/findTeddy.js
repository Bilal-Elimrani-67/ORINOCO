let _id = $_GET("id");

function initAddToCart(_id, quantity, color, name, price) {
  let currentCart = JSON.parse(localStorage.getItem("cart")) ?? [];
  const newProduct = { _id, quantity, color, name, price };
  let exist = false;
  currentCart.forEach((item) => {
    if (item.name === newProduct.name && item.color === newProduct.color) {
      item.quantity = Number(item.quantity) + Number(newProduct.quantity);
      exist = true;
    }
  });
  if (!exist) currentCart.push(newProduct);
  localStorage.setItem("cart", JSON.stringify(currentCart));
  console.log(JSON.parse(localStorage.getItem("cart")));
}

const $app = document.getElementById("app");
const teddyTemplate = `
<div class="container">
  <div class="row">
    <form class="teddy" action="cart.html">
	  <h2 class="teddy-name"></h2>
    <button class="teddy-price"></button>
    <br>
    <img class="teddy-image" src="" alt="" />
    <p class="teddy-description"></p>
    <br>
    <input id="_id" name="_id" value="" type="hidden"/>
    <input id="name" name="name" value="" type="hidden"/>
    <input id="price" name="price" value="" type="hidden"/>
    <label for="quantity">Quantité</label>
    <select id="quantity" name="quantity">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
    </select>
    <br>
    <label for="color">Couleur</label>
    <select id="color" class="teddy-color">
    </select>
    <br>
    <button id="addtocart" type="submit">Ajouter au panier</button>
    </form>
  </div>
</div>
		`;

async function main() {
  const response = await fetch("http://localhost:3000/api/teddies/" + _id);
  const teddy = await response.json();
  console.log(teddy);

  if (teddy) {
    //On transforme la chaine de caractère en objet pour le DOM, il n'est pas déja inclus au DOM
    const $teddy = document
      .createRange()
      .createContextualFragment(teddyTemplate);

    const $teddyName = $teddy.querySelector(".teddy-name");
    const $teddyPrice = $teddy.querySelector(".teddy-price");
    const $teddyImage = $teddy.querySelector(".teddy-image");
    const $teddyDescription = $teddy.querySelector(".teddy-description");
    const $teddyInputColor = $teddy.querySelector(".teddy-color");

    $teddyName.textContent = teddy.name;
    $teddyPrice.textContent = (teddy.price / 100.0).toFixed(2) + " €";
    $teddyImage.setAttribute("src", teddy.imageUrl);
    $teddyImage.setAttribute("alt", teddy.name);
    $teddyDescription.textContent = teddy.description;
    $teddy.querySelector("input[name=_id]").value = _id;
    $teddy.querySelector("input[name=name]").value = teddy.name;
    $teddy.querySelector("input[name=price]").value = teddy.price;

    for (const color of teddy.colors) {
      const $option = document.createElement("option");
      $option.setAttribute("value", color);
      /*const options = "<option value="1"></option>"*/
      $option.textContent = color;

      $teddyInputColor.appendChild($option);
    }

    $app.appendChild($teddy);

    document.getElementById("addtocart").onclick = (e) => {
      e.preventDefault();
      let id = document.getElementById("_id").value;
      let name = document.getElementById("name").value;
      let price = document.getElementById("price").value;
      let quantity = document.getElementById("quantity").options[
        document.getElementById("quantity").selectedIndex
      ].text;
      let color = document.getElementById("color").options[
        document.getElementById("color").selectedIndex
      ].text;
      console.log(quantity);
      initAddToCart(id, quantity, color, name, price);
      window.location.replace("cart.html");
    };
  }
}

main();
