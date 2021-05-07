// Le contenu du panier : les boutons, la validation et la confirmation sont générer à l'intérieur de panier.js quand au 
// éléments du formulaires ils sont créés à l'intérieur du panier.html.

// Déclaration de variables en dehors de la portée de la fonction
let carteProduit = JSON.parse(localStorage.getItem('cameraAjoutée'));
const panierContainer = document.querySelector('.panier.container');
const submitBtn = document.querySelector('.submit');
const formContainer = document.querySelector('.form.container');
const btnContainer = document.querySelector('.button.container');
const panierTitle = document.getElementById('panierTitle');

// déclaration de la variable création du contenu de panier
const panierContent = document.getElementById('panierContent');
// déclaration de la variable du bouton dupprimer le panier
const btnVidePanier = document.createElement('button');
// déclaration de la variable pour l'affichage du prix total du panier
const prixTotal = document.createElement('p');

// Affichage du contenu du panier
function afficheLeContenuDuPanier() {
    if (localStorage.getItem('cameraAjoutée') != null) {
        panierTitle.textContent = 'Résumé des produits dans le panier';
        panierTitle.style.fontSize = '2rem';
        // Afficher le bouton Effacer le panier
        afficheLeBtnVidePanier();
        // Afficher le prix total
        afficheLePrixTotal();

        // boucle sur les articles ajoutés pour les montrer à l'intérieur du panier
        for (let i in carteProduit) {
            // Créez tous les éléments nécessaires
            let {divContainerProduit, imageProduit, nomProduit, nomLentille, prixProduit, btnSupprimeProduit,
                quantiteProduitContainer, ajoute, quantity, retire} = creationDesElements();
            
            // Ajouter des attributs et du texte aux éléments du panier
            definirLesAttributsEtLeTexte(divContainerProduit, imageProduit, i, nomProduit, nomLentille, prixProduit, btnSupprimeProduit);

            // Afficher et mettre à jour la quantité avec le bouton d'augmentation / diminution
            afficherLaQuantite(quantiteProduitContainer, ajoute, retire, quantity, i);
            mettreAJourLaQuantite(ajoute, retire, quantity, prixProduit, divContainerProduit);
            btnRetirerEnQuantite(i, retire);

            // Ajouter des conteneurs d'articles au conteneur de panier
            ajoutDeLaCarteProduitAuPanier(divContainerProduit, imageProduit, nomProduit, nomLentille,
                 prixProduit, btnSupprimeProduit, quantiteProduitContainer);
            
            // Pour retirer un article du panier
            removeItem(btnSupprimeProduit, divContainerProduit);
        };
    } else {
        // Définir l'en-tête du panier lorsque le panier est vide
        panierTitle.textContent = 'Votre panier est vide !';
        panierTitle.style.fontSize = '2rem';
    };
};

afficheLeContenuDuPanier();


// Créez tous les éléments nécessaires pour les transmettre à d'autres fonctions
function creationDesElements() {
    let divContainerProduit = document.createElement('div');
    let imageProduit = document.createElement('img');
    let nomProduit = document.createElement('h3');
    let nomLentille = document.createElement('span');
    let prixProduit = document.createElement('span');
    let btnSupprimeProduit = document.createElement('button');
    let quantiteProduitContainer = document.createElement('div');
    let ajoute = document.createElement('button');
    let quantity = document.createElement('p');
    let retire = document.createElement('button');
    return {divContainerProduit, imageProduit, nomProduit, nomLentille, prixProduit, btnSupprimeProduit,
        quantiteProduitContainer, ajoute, quantity, retire};
}

// Ajouter des attributs et du texte aux éléments du panier
function definirLesAttributsEtLeTexte(divContainerProduit, imageProduit, i, nomProduit, nomLentille, prixProduit, btnSupprimeProduit) {
    divContainerProduit.classList.add('cart-item');
    divContainerProduit.style.display = 'flex';
    divContainerProduit.style.justifyContent = 'space-between';
    divContainerProduit.style.alignItems = 'center';
    divContainerProduit.style.border = '2px solid black';
    
    imageProduit.setAttribute('src', carteProduit[i].image);
    imageProduit.setAttribute('alt', carteProduit[i].name);
    imageProduit.style.width = '150px';
    imageProduit.style.border = '2px solid black';
    imageProduit.style.marginLeft = '5px';
    nomProduit.textContent = carteProduit[i].name;
    nomProduit.style.margin = '0px auto';
    nomProduit.style.borderBottom = '2px solid black';
    nomLentille.textContent = carteProduit[i].lense;
    nomLentille.style.margin = '0px auto';
    prixProduit.textContent = '$' + carteProduit[i].quantity * carteProduit[i].price / 100;
    btnSupprimeProduit.innerHTML = '<i class="fas fa-times"></i>';
    btnSupprimeProduit.setAttribute('aria-label', 'remove');
    btnSupprimeProduit.classList.add('btnSupprimeProduit');
// Ajout d'un identifiant d'élément à utiliser dans la fonction removeItem 
    divContainerProduit.setAttribute('id', carteProduit[i].id);
}

// Affiche la quantité et le bouton ajouter/retirer
function afficherLaQuantite(quantiteProduitContainer, ajoute, retire, quantity, i) {
    quantiteProduitContainer.classList.add('quantite-container');
    ajoute.classList.add('fas', 'fa-chevron-up', 'ajoute');
    ajoute.setAttribute('aria-label', 'ajoute');
    retire.classList.add('fas', 'fa-chevron-down', 'retire');
    retire.setAttribute('aria-label', 'retire');
    quantity.textContent = carteProduit[i].quantity;
    quantiteProduitContainer.style.margin = '5px 5px';

    quantiteProduitContainer.appendChild(ajoute);
    quantiteProduitContainer.appendChild(quantity);
    quantiteProduitContainer.appendChild(retire);
}

// Mise à jour de la quantité avec le bouton ajouter/retirer
function mettreAJourLaQuantite(ajoute, retire, quantity, prixProduit, divContainerProduit) {
    let productId = divContainerProduit.getAttribute('id');
    let camera = carteProduit.find(product => product.id === productId);
    
    ajoute.addEventListener('click', () => {
        camera.quantity++;
        localStorage.setItem('cameraAjoutée', JSON.stringify(carteProduit));
        quantity.textContent = camera.quantity;
        prixProduit.textContent = '$' + camera.quantity * camera.price / 100;
        afficheLePrixTotal();
        if (camera.quantity > 1) {
            retire.removeAttribute('disabled');
        }
    });

    retire.addEventListener('click', () => {
        camera.quantity--;
        localStorage.setItem('cameraAjoutée', JSON.stringify(carteProduit));
        quantity.textContent = camera.quantity;
        prixProduit.textContent = '$' + camera.quantity * camera.price / 100;
        afficheLePrixTotal();

        if (camera.quantity < 2) {
            retire.disabled = true;
        }
    });
}
// btn permettant de retirer un produit
function btnRetirerEnQuantite(i, retire) {
    if (carteProduit[i].quantity > 1) {
        retire.removeAttribute('disabled');
    }
    if (carteProduit[i].quantity < 2) {
        retire.disabled = true;
    }
}

// Obtention du prix total des articles du panier
function ObtentionPrixTotal() {
    let total = 0;
    for (let i in carteProduit) {
        total += carteProduit[i].quantity * carteProduit[i].price / 100;
    }
    return '$' + total;
}

// Affichage du prix total 
function afficheLePrixTotal() {
    let priceSum = ObtentionPrixTotal();
    prixTotal.textContent = 'Total: ' + priceSum;
    prixTotal.style.marginLeft = '15px';
    prixTotal.style.fontSize = '1.6rem';
    prixTotal.style.color = 'black';
    prixTotal.style.fontFamily = 'Smythe', 'cursive';
    btnContainer.appendChild(prixTotal);
}

// Affichage du boutton vider le panier en entier
function afficheLeBtnVidePanier() {
    btnVidePanier.classList.add('clear-cart-btn');
    btnVidePanier.textContent = 'Clear cart';
    btnVidePanier.style.backgroundColor = 'snow';
    btnVidePanier.style.border = '2px solid red';
    btnVidePanier.style.marginTop = '10px';
    btnContainer.appendChild(btnVidePanier);
}

// Ajout du détails du conteneur produits au panier
function ajoutDeLaCarteProduitAuPanier(divContainerProduit, imageProduit, nomProduit, nomLentille, prixProduit, btnSupprimeProduit, quantiteProduitContainer) {
    divContainerProduit.appendChild(imageProduit);
    divContainerProduit.appendChild(nomProduit);
    divContainerProduit.appendChild(nomLentille);
    divContainerProduit.appendChild(prixProduit);
    divContainerProduit.appendChild(btnSupprimeProduit);
    divContainerProduit.appendChild(quantiteProduitContainer);
    panierContent.appendChild(divContainerProduit);
}

// Pour supprimer un article du panier
function removeItem(btnSupprimeProduit, divContainerProduit) {
    btnSupprimeProduit.addEventListener('click', (event) => {
        event.preventDefault();

        // Obtention de  l'identifiant de l'élément 
        let product_id = divContainerProduit.getAttribute('id');
        
        divContainerProduit.remove();
        // Boucle dans la carteProduit pour supprimer la divContainerProduit avec l'id correspondant.
        for (let i = 0; i < carteProduit.length; i++) {
            if (carteProduit[i].id == product_id) {
                carteProduit.splice(i, 1);
            };
        };

        // Mise à jour du localstorage
        localStorage.setItem('cameraAjoutée', JSON.stringify(carteProduit));
        
        afficheLePrixTotal();
    
        if (carteProduit.length === 0) {
            localStorage.removeItem('cameraAjoutée');
        }

        MAJPanierQuandIlEstVide();
    });
};

// A l'écoute d'un événement pour le panier vide
btnVidePanier.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('cameraAjoutée');
    MAJPanierQuandIlEstVide();
});

// Lorsque le panier est vide, masquez les éléments et supprimez le du localstorage
function MAJPanierQuandIlEstVide() {
    if (JSON.parse(localStorage.getItem('cameraAjoutée')) == null) {
        formContainer.style.display = 'none';
        panierTitle.textContent = 'Votre panier est vide, veuillez retourner sur la page accueil pour selectionner un article.';
        btnContainer.style.display = 'none';
        panierContent.style.display = 'none';
    };
}
MAJPanierQuandIlEstVide();


// Formulaire de validation de la commande
// Variables pour l'objet de contact et la validation du formulaire
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
const formInputs = [firstName, lastName, address, city];
// Définir la validation, quand le boolean est à false (faux)
let firstNameValid = false;
let lastNameValid = false;
let addressValid = false;
let cityValid = false;
let emailValid = false;
const emailRegex = /.+@.+\..+/;
const validations = [firstNameValid, lastNameValid, addressValid, cityValid];

for (let i in formInputs) {
    formInputs[i].addEventListener('blur', () => {
        if (formInputs[i].value == "") {
            validations[i] = false;
            formInputs[i].style.border = 'medium solid red';
        } else {
            formInputs[i].style.border = 'none';
            validations[i] = true;
        }
    })
}

// Ecouteur d'événements, séparé pour le champ d'e-mail avec expression régulière
email.addEventListener('blur', () => {
    if (email.value == "" || !emailRegex.test(email.value)) {
        emailValid = false;
        email.style.border = 'medium solid red';
    } else {
        emailValid = true;
        email.style.border = 'none';
    }
})

// Ecouteur d'événement pour créer un objet de contact et un tableau d'éléments et l'envoyer au serveur
submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    for (let i in formInputs) {
        if (formInputs[i].value == "") {
            formInputs[i].style.border = 'medium solid red';
        }
    }

    if (email.value == "") {
        email.style.border = 'medium solid red';
    } else if (!emailRegex.test(email.value)) {
        alert('Please use a correct Email');
    }

    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    };

    let products = [];
    for (let i in carteProduit) {
        products.push(carteProduit[i].id);
    }
    
    let order = {
        contact, products
    }

    verifierLaValidation(order);
})

function verifierLaValidation(order) {
    let verifierLaValidation = true;
    for (let i in validations) {
        // Vérifiez si toutes les entrées de formulaire sont validées
        if (validations[i] === false || emailValid === false) {
            verifierLaValidation = false;
        }
    }
    // Si toutes les entrées sont validées, envoyer la commande au serveur
    if (verifierLaValidation === true) {
        confirmerLaCommande(order);
    } else {
        if(!document.querySelector('.error-message')) {
            const errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'Veuillez remplir tous les champs!';
            errorMessage.style.color = '#ff0000';
            formContainer.appendChild(errorMessage);
        }
    }
}

function faireUneRequete(order) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:3000/api/cameras/' + 'order');
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200 || request.status === 201) {
                    resolve(JSON.parse(request.response));
                } else {
                    reject(JSON.parse(request.response));
                }
            };
        };
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(order));
    });
};

async function confirmerLaCommande(order) {   
    try {
        let promiseRequest = faireUneRequete(order);
        let promiseResponse = await promiseRequest;
        afficherLaConfirmation(promiseResponse);
    } catch (error) {
        btnVidePanier.style.display = 'none';
        panierContent.remove();
        panierTitle.textContent = 'Server error';
    }
}

// Affichage du message de la confirmation de commande
function afficherLaConfirmation(response) {
    panierContainer.style.display = 'none';
    btnContainer.style.display = 'none';
    formContainer.style.display = 'none';

    // Enregistrer les éléments commandés dans sessionstorage
    sessionStorage.setItem('orderedCameras', JSON.stringify(carteProduit));
    let orderedCameras = JSON.parse(sessionStorage.getItem('orderedCameras'));
    
    // Créer tous les éléments de confirmation
    let confirmContainer = document.createElement('div');
    confirmContainer.classList.add('confirmation', 'container');

    let confirmHeader = document.createElement('h2');
    confirmHeader.textContent = 'Nous vous remercions de votre commande!';
    confirmHeader.style.marginTop = '20px';

    let confirmMessage = document.createElement('p');
    confirmMessage.textContent = 'Vous trouverez ci-dessous votre numéro de commande qui est également envoyé à votre adresse e-mail.';
    confirmMessage.style.marginTop = '25px';

    let orderId = document.createElement('span');
    orderId.textContent = 'orderID: ' + response.orderId;
    orderId.style.marginTop = '50px';

    let itemList = document.createElement('ul');
    for (let i in orderedCameras) {
        let orderedItem = document.createElement('li');
        orderedItem.textContent = orderedCameras[i].quantity + ' x ' + orderedCameras[i].name + ' ' + orderedCameras[i].lense;
        itemList.appendChild(orderedItem);
        itemList.style.marginTop = '25px';
    }

    let confirmPriceSum = ObtentionPrixTotal();
    let confirmPrice = document.createElement('span');
    confirmPrice.textContent = 'Total Price: ' + confirmPriceSum;

    // Supprimer du localstorage
    localStorage.removeItem('cameraAjoutée');
    MAJPanierQuandIlEstVide();

    ajouterLesElementsDeConfirmation(confirmContainer, confirmHeader, confirmMessage, orderId, itemList, confirmPrice);
};

function ajouterLesElementsDeConfirmation(confirmContainer, confirmHeader, confirmMessage, orderId, itemList, confirmPrice) {
    let mainContainer = document.querySelector('main');
    confirmContainer.appendChild(confirmHeader);
    confirmHeader.style.color = 'black';
    confirmHeader.style.fontSize = '2rem';
    
    confirmContainer.appendChild(confirmMessage);
    confirmMessage.style.color = 'black';
    confirmMessage.style.fontSize = '1.2rem';

    confirmContainer.appendChild(orderId);
    orderId.style.borderBottom = '3px solid snow';
    orderId.style.color = 'black';
    orderId.style.fontSize = '1.4rem';

    confirmContainer.appendChild(itemList)
    itemList.style.color = 'black';
    itemList.style.fontSize = '1.2rem';
    itemList.style.listStyleType = 'none';

    confirmContainer.appendChild(confirmPrice);
    confirmPrice.style.borderBottom = '3px solid snow';
    confirmPrice.style.color = 'black';
    confirmPrice.style.fontSize = '1.4rem';

    mainContainer.appendChild(confirmContainer);
    confirmContainer.style.marginTop = '25px';
    confirmContainer.style.marginBottom = '25px';
    confirmContainer.style.backgroundColor = 'rgba(255, 250, 250, 0.3)';
    confirmContainer.style.border = '2px solid snow';
    confirmContainer.style.paddingBottom = '20px';

};
