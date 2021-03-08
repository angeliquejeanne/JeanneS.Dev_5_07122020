const contenuMain = document.querySelector('main .container .produit__content .content__produit');
const bouttonAjoutPanier = document.createElement('button');
const formulaire = document.createElement('form');
const formulaireLabel = document.createElement('label');
const formulaireSelection = document.createElement('select');

// Obtention de la chaîne de requête du produit via l'API
const chaineDeRequete = window.location.search;
const parametreUrl = new URLSearchParams(chaineDeRequete);
const produitId = parametreUrl.get('id');

// Demande des données au serveur
function actionRequete() {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:3000/api/cameras/' + produitId);
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200 || request.status === 201) {
                    resolve(JSON.parse(request.response));
                } else {
                    reject('désolé, une erreur cest produite');
                }
            }
        }
        request.send();
    })
};
async function obtentionInfoProduit() {
    try {
        const demandeDePromesse = actionRequete();
        const reponseDePromesse = await demandeDePromesse;
        creationInfoProduit(reponseDePromesse);
    } catch (error) {
        document.querySelector('.content__produit').innerHTML = '<h3>' + error + '</h3>';
    }
};
obtentionInfoProduit();


// Creation du contenu de la page catalogue
function creationInfoProduit(response) {
    const sourceImg  = response.imageUrl;
    const { img, h2, p1, p2 } = creationDesElements();
    choixLentille(response);
// Définition des attributs des éléments et le contenu du texte
    img.setAttribute('src', sourceImg );
    img.setAttribute('alt', response.name);
    h2.textContent = response.name;
    p1.textContent = response.description;
    p2.textContent = '$' + response.price / 100;
    bouttonAjoutPanier.textContent = 'Ajout au Panier';
    bouttonAjoutPanier.classList.add('buttonAjoutPanier');

    appendElements(img, h2, p1, p2);
    ajoutPanier(response);
};

// création des éléments affichés
function creationDesElements() {
    const img = document.createElement('img');
    const h2 = document.createElement('h2');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    return { img, h2, p1, p2 };
}

//Créer un formulaire pour sélectionner les lentilles et définir la valeur de toutes les options
function choixLentille(response) {
    formulaireLabel.textContent = 'Choix de lentille: ';
    formulaireLabel.setAttribute('for', 'selection');
    formulaireSelection.setAttribute('id', 'selection');
    for (let i in response.lenses) {
        const formulaireOption = document.createElement('option');
        formulaireOption.textContent = response.lenses[i];
        
        formulaireOption.setAttribute('value', response.lenses[i]);
        formulaireSelection.appendChild(formulaireOption);
        formulaireSelection.style.backgroundColor = ('yellow');
    };
    formulaire.appendChild(formulaireLabel);
    formulaire.appendChild(formulaireSelection);
}

// Ajout des éléments DOM au conteneur principal
function appendElements(img, h2, p1, p2) {
    contenuMain.appendChild(img);
    contenuMain.appendChild(h2);
    contenuMain.appendChild(p1);
    contenuMain.appendChild(formulaire);
    contenuMain.appendChild(p2);
    contenuMain.appendChild(bouttonAjoutPanier);
}

//Ajouter le produit au local storage en cliquant sur le bouton Ajouter au panier
function ajoutPanier(response) {
    bouttonAjoutPanier.addEventListener('click', () => {
        // Obtenir des informations sur le produit à partir de la demande d'API
        let produit = {
            'image': response.imageUrl,
            'id': response._id,
            'name': response.name, 
            'lense': formulaireSelection.value, 
            'price': response.price,
            'quantity': 1
        }

        // Obtention d'un massage d'ajout au local storage
        let cameraAjoutée = JSON.parse(localStorage.getItem('cameraAjoutée'));
        
        majLocalStorage(cameraAjoutée, produit);

        const messageValidationAjoutPanier = document.createElement('p');
        messageValidationAjoutPanier.textContent = produit.name + ' Produit ajouter à votre panier!'
        messageValidationAjoutPanier.style.color = 'black';
        messageValidationAjoutPanier.style.backgroundColor = 'snow';
        messageValidationAjoutPanier.style.textAlign = 'center';
        messageValidationAjoutPanier.style.marginRight = '15px';
        contenuMain.appendChild(messageValidationAjoutPanier);
    });
};

function majLocalStorage(cameraAjoutée, produit) {
    // Création d'un tableau si localstorage est vide
    if (cameraAjoutée == null) {
        let cameraAjoutée = [];
        cameraAjoutée.push(produit);
        enrDsLocalStorage(cameraAjoutée);
    }
    let checkId = false;
    for (let i in cameraAjoutée) {
        // Vérifier si l'ID est déjà présent, si oui ajouter +1 en quantité
        if (cameraAjoutée[i].id === produit.id) {
            cameraAjoutée[i].quantity + 1;
            enrDsLocalStorage(cameraAjoutée);
            checkId = true;
        }
    }
    // Si l'ID n'est pas présent, ajouter un nouveau produit à local storage
    if (cameraAjoutée != null && checkId === false) {
        cameraAjoutée.push(produit);
        enrDsLocalStorage(cameraAjoutée);
    }
}
function enrDsLocalStorage(cameraAjoutée) {
    localStorage.setItem('cameraAjoutée', JSON.stringify(cameraAjoutée));
}
