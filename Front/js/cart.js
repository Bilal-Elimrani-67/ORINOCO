let _id = $_GET["_id"];
let ligneDuPanier = "";

function showCart() {
  let i = 1;
  let currentCart = JSON.parse(localStorage.getItem("cart")) ?? [];
  let prixTotal = 0;
  for (let prod of currentCart) {
    const prixLigne = (prod.quantity * prod.price) / 100.0;
    prixTotal += prixLigne;
    ligneDuPanier += `<tr><td>${prod.quantity}</td><td>${prod.name}</td><td>${
      prod.color
    }</td><td>${prixLigne.toFixed(2)} €</td></tr>`;
    i++;
  }

  const template = `
<div class="container">
  <div class="row">
  <p id="error"></p>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Nom</th>
          <th scope="col">Couleur</th>
          <th scope="col">Prix</th>
        </tr>
      </thead>
      <tbody>${ligneDuPanier}</tbody>
      <tfooter>
        <tr>
          <th colspan="3" scope="col">Prix Total </th>
          <th scope="col">${prixTotal.toFixed(2)}€</th>
        </tr>
      </tfooter>
    </table>
  </div>
</div>
</br>
</br>

<div class="container">
  <div class="row">
     <div class="col-12">
          <form action="confirm.html" method="POST" id="loginForm">
            <h3 class="text-center">Veuillez remplir les champs</h3>
            </br>
            </br>

            <!-- Nom-->
            <div class="form-group">
              <label for="lastname">Nom</label>
              <input type="text" class="form-control" name="lastname" placeholder="Entrez votre nom"  />
              <small></small>
            </div>

            <!-- Prénom -->
            <div class="form-group">
              <label for="firstname">Prénom</label>
              <input type="text" class="form-control" name="firstname" placeholder="Entrez votre prénom" />
              <small></small>
            </div>

            <!-- Adresse -->
            <div class="form-group">
              <label for="adress">Adresse postale</label>
              <input type="text" class="form-control" name="adress" placeholder="Entrez votre adresse" />
              <small></small>
            </div>

            <!-- Ville -->
            <div class="form-group">
              <label for="city">Ville</label>
              <input type="text" class="form-control" name="city" placeholder="Entrez votre ville"/>
              <small></small>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">Email</label>
              <input type="text" class="form-control" name="email" placeholder="Entrez votre email"/>
              <small></small>
            </div>
            
            <div class="form-group">
              <button type="submit" id="btn-buy" class="btn btn-secondary ">
                Confirmer ma commande
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</div>


<p style="color: red;" id="erreur"></p>
`;

  document.getElementById("app").innerHTML = template;
}

showCart();

let form = document.querySelector("#loginForm");

//Ecouter la modification de nom
form.lastname.addEventListener("change", function () {
  validLastname(this);
});

//Ecouter la modification du prénom
form.firstname.addEventListener("change", function () {
  validFirstname(this);
});

//Ecouter la modification de l'adresse
form.adress.addEventListener("change", function () {
  validAdress(this);
});

//Ecouter la modification de la ville
form.city.addEventListener("change", function () {
  validCity(this);
});

//Ecouter la modification de l'email
form.email.addEventListener("change", function () {
  validEmail(this);
});

//Ecouter la soumission du formulaire
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (
    validLastname(form.lastname) &&
    validFirstname(form.firstname) &&
    validAdress(form.adress) &&
    validCity(form.city) &&
    validEmail(form.email)
  ) {
    /* Recuperation des ID produits du panier */
    const arrayIdProducts = [];

    const productsInCart = JSON.parse(localStorage.getItem("cart")) ?? [];

    productsInCart.map((prod) => {
      arrayIdProducts.push(prod._id);
    });

    const products = arrayIdProducts;
    console.log(products.length);
    if (products.length == 0) {
      document.getElementById("error").innerText = "Votre panier est vide :(";
      return;
    }

    /* Recuperation des données du formulaire */
    const contact = {
      firstName: form.firstname.value,
      lastName: form.lastname.value,
      address: form.adress.value,
      city: form.city.value,
      email: form.email.value,
    };

    /* POST Api -> Donne l'ID du order en retour */
    try {
      const res = await fetch("http://localhost:3000/api/teddies/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact, products }),
      });
      const data = await res.json();

      console.log(data);
      form.reset();
      localStorage.clear();
      let API_Price = 0;
      for (let product of productsInCart) {
        //Je récupére un produit dans ma liste de produits
        API_Price += product["price"] * product.quantity;
        //Je récupére le prix de mon API
      }
      window.location.replace(
        `confirm.html?uuid=${data["orderId"]}&price=${(API_Price / 100).toFixed(
          2
        )}`
      );
    } catch (e) {
      console.log(e);
    }
  }
});

// ************Validation LASTNAME*************
const validLastname = function (inputLastname) {
  let msg;
  let valid = false;
  //Au moins 2 caracteres
  if (inputLastname.value.length < 2) {
    msg = "Le nom doit faire au moins 2 caracteres";
  }
  //Au moins 1 maj
  else if (!/[A-Z]/.test(inputLastname.value)) {
    msg = "Le nom doit avoir au moins 1 majuscule";
  }
  //Au moins 1 min
  else if (!/[a-z]/.test(inputLastname.value)) {
    msg = "Le nom doit avoir au moins 1 minuscule";
  }
  //Nom valide
  else {
    msg = "Ce nom est valide";
    valid = true;
  }

  //Affichage
  //recuperation de la balise SMALL
  let small = inputLastname.nextElementSibling;

  //On test l'expression reguliere
  if (valid /*== true*/) {
    small.innerHTML = "Nom valide";
    small.classList.remove("text-danger");
    small.classList.add("text-success");
    return true;
  } else {
    small.innerHTML = msg;
    small.classList.add("text-success");
    small.classList.add("text-danger");
    return false;
  }
};

// ************Validation FIRSTNAME*************
const validFirstname = function (inputFirstname) {
  let msg;
  let valid = false;
  //Au moins 2 caracteres
  if (inputFirstname.value.length < 2) {
    msg = "Le prénom doit faire au moins 2 caracteres";
  }
  //Au moins 1 maj
  else if (!/[A-Z]/.test(inputFirstname.value)) {
    msg = "Le prénom doit avoir au moins 1 majuscule";
  }
  //Au moins 1 min
  else if (!/[a-z]/.test(inputFirstname.value)) {
    msg = "Le prénom doit avoir au moins 1 minuscule";
  }
  //Prénom valide
  else {
    msg = "Ce prénom est valide";
    valid = true;
  }

  //Affichage
  //recuperation de la balise SMALL
  let small = inputFirstname.nextElementSibling;

  //On test l'expression reguliere
  if (valid /*== true*/) {
    small.innerHTML = "Prénom valide";
    small.classList.remove("text-danger");
    small.classList.add("text-success");
    return true;
  } else {
    small.innerHTML = msg;
    small.classList.add("text-success");
    small.classList.add("text-danger");
    return false;
  }
};

// ************Validation ADRESSE*************
const validAdress = function (inputAdress) {
  let msg;
  let valid = false;
  //Au moins 2 caracteres
  if (inputAdress.value.length < 5) {
    msg = "L'adresse doit faire au moins 5 caracteres";
  }
  /* //Au moins 1 maj
  else if (!/[A-Z]/.test(inputAdress.value)) {
    msg = "Le nom de l'adresse doit avoir au moins 1 majuscule";
  }*/
  //Au moins 1 min
  else if (!/[a-z]/.test(inputAdress.value)) {
    msg = "Le nom de l'adresse doit avoir au moins 1 minuscule";
  }
  //Au moins 1 chiffre
  else if (!/[0-9]/.test(inputAdress.value)) {
    msg = "L'adresse doit contenir au moins 1 chiffre";
  }
  //Adresse valide
  else {
    msg = "Cette adresse est valide";
    valid = true;
  }

  //Affichage
  //recuperation de la balise SMALL
  let small = inputAdress.nextElementSibling;

  //On test l'expression reguliere
  if (valid /*== true*/) {
    small.innerHTML = "Adresse valide";
    small.classList.remove("text-danger");
    small.classList.add("text-success");
    return true;
  } else {
    small.innerHTML = msg;
    small.classList.add("text-success");
    small.classList.add("text-danger");
    return false;
  }
};

// ************Validation VILLE*************
const validCity = function (inputCity) {
  let msg;
  let valid = false;
  //Au moins 2 caracteres
  if (inputCity.value.length < 3) {
    msg = "Le nom de la ville doit faire au moins 3 caracteres";
  }
  //Au moins 1 maj
  else if (!/[A-Z]/.test(inputCity.value)) {
    msg = "Le nom de la ville doit avoir au moins 1 majuscule";
  }
  //Au moins 1 min
  else if (!/[a-z]/.test(inputCity.value)) {
    msg = "Le nom de la ville doit avoir au moins 1 minuscule";
  }

  //Ville valide
  else {
    msg = "Cette ville est valide";
    valid = true;
  }

  //Affichage
  //recuperation de la balise SMALL
  let small = inputCity.nextElementSibling;

  //On test l'expression reguliere
  if (valid /*== true*/) {
    small.innerHTML = "Ville valide";
    small.classList.remove("text-danger");
    small.classList.add("text-success");
    return true;
  } else {
    small.innerHTML = msg;
    small.classList.add("text-success");
    small.classList.add("text-danger");
    return false;
  }
};

// ************Validation EMAIL*************
const validEmail = function (inputEmail) {
  //Création de la reg exp pour validation email
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9-_.]+[@]{1}[a-zA-Z0-9-_]+[.]{1}[a-z]{2,10}$"
  );
  //recuperation de la balise SMALL

  let small = inputEmail.nextElementSibling;

  //On test l'expression reguliere
  if (emailRegExp.test(inputEmail.value) /*== true*/) {
    small.innerHTML = "Adresse mail valide";
    small.classList.remove("text-danger");
    small.classList.add("text-success");
    return true;
  } else {
    small.innerHTML = "Adresse mail non valide";
    small.classList.add("text-success");
    small.classList.add("text-danger");
    return false;
  }
};
