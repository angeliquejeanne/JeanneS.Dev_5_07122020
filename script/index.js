// fonction qui va faire la requête au serveur
function actionRequete() {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('GET', "http://localhost:3000/api/cameras");
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if(request.status === 200) {
          resolve(JSON.parse(request.response));
        } else {
          reject('Désolé, une erreur cest produite');
        }
      }
    }
    request.send();
  });
};

async function actionPromesse() {
  try {
    const demandeDePromesse = actionRequete();
    const reponseDePromesse = await demandeDePromesse;
    creationsectionProduits(reponseDePromesse);
  } catch (error) {
    document.querySelector('.cardCam .card').innerHTML = '<h3 class="grid-heading">' + erreur + '</h3>';
  }
};

actionPromesse();


// Ici on va créer nos cartes produits

function creationsectionProduits(response) {
  const camCard = document.querySelector('#card');
  for (let i in response) {
    const {img, a1, a2, h3, p, div, section} = creationDesElements();
    definitionDesAttributsEtDuText(response, i, img, a1, a2, h3, p);
    ajoutElements(a2, img, div, a1, h3, p, section, camCard);
  }
};
function ajoutElements(a2, img, div, a1, h3, p, section, camCard) {
  a2.appendChild(img);
  div.appendChild(a1);
  div.appendChild(h3);
  div.appendChild(p);
  section.appendChild(a2);
  section.appendChild(div);
  camCard.appendChild(section);
}
function definitionDesAttributsEtDuText(response, i, img, a1, a2, h3, p) {
  const imgSrc = response[i].imageUrl;
  img.setAttribute('src', imgSrc);
  img.setAttribute('alt', response[i].name);
  a1.setAttribute('href', 'catalogue.html?id=' + response[i]._id);
  a2.setAttribute('href', 'catalogue.html?id=' + response[i]._id);
  a1.textContent = response[i].name;
  h3.textContent = '$' + response[i].price / 100;
  p.textContent = response[i].description;
}
function creationDesElements() {
  const section = document.createElement('section');
  const img = document.createElement('img');
  const div = document.createElement('div');
  const a1 = document.createElement('a');
  const a2 = document.createElement('a');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');
  return { img, a1, a2, h3, p, div, section };
}