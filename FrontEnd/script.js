// if(localStorage.token)[
//     alert("Ok")
// ]
var token = localStorage.getItem("token");

let works = window.sessionStorage.getItem("works");

const reponse = await fetch('http://localhost:5678/api/works');
works = await reponse.json();

let categories = window.sessionStorage.getItem("categories");

const response = await fetch('http://localhost:5678/api/categories');
categories = await response.json();

// ne pas avoir d'affichage en double
const categoriesSet = new Set();



const displayWorks = (filtered = []) => {
  let tabImg = filtered?.length ? filtered : works;
  const gallery = document.querySelector('.gallery');
  const galleryWorks = tabImg.map(work => {
    return `
        
        <figure data-id="${work.categoryId}">
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}"</figcaption>
        </figure>
    
        `;
  }).join('')
  gallery.innerHTML = galleryWorks
};
displayWorks();

// ajouter le filtre toutes catégories
const tousLesTavaux = {
  id: 0,
  name: 'Tous',
}

// **************   ajouter le bouton en début de tableau     ***********
categories.unshift(tousLesTavaux);
if (!token) {
  categories.forEach(function (categorie) {


    let button = document.createElement('button');
    button.classList.add('boutonFiltre');
    button.textContent = categorie.name;
    button.dataset.id = categorie.id;
    document.querySelector('.filtres').appendChild(button);

  })


  // ******************** ajout de la partie filtre      **************


  const boutonsFiltre = document.querySelectorAll('.boutonFiltre');
  boutonsFiltre.forEach(button => {
    button.addEventListener('click', function () {
      const filtreId = button.dataset.id;
      const filtered = filtreId == 0 ? works : works.filter(work => work.category.id == filtreId);
      displayWorks(filtered);
    })
  })
}
// ****************    texte "login" en "logout" si l'utilisateur est connecté **************

function login(token) {
  if (token) {
    document.getElementById("bouton_login").innerText = "logout";
    // logout.href = './index.html';
  } else {
    document.getElementById("bouton_login").innerText = "login";
  }
}
login(token);





//************ Fonction de déconnexion ************

function deco() {
  // Supprimer le token
  localStorage.removeItem("token");

  // Rediriger vers la page index.html
  window.location.href = "index.html";
}

// Sélection de l'élément de déconnexion
const logoutButton = document.getElementById("bouton_login");

// Gestion de l'état du bouton lors du chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (token) {
    // Si l'utilisateur est connecté, on affiche "logout"
    logoutButton.textContent = "logout";
  } else {
    // Si l'utilisateur n'est pas connecté, on affiche "login"
    logoutButton.textContent = "login";
    logoutButton.href = "login.html";
  }
});

// Ajout d'un gestionnaire d'événements pour le clic sur le bouton de déconnexion/login
logoutButton.addEventListener("click", function (event) {

  event.preventDefault();

  // Vérifier si l'utilisateur est connecté ou déconnecté
  const token = localStorage.getItem("token");
  if (token) {
    // Si l'utilisateur est connecté, déconnectez-le
    deco();
  } else {
    // Si l'utilisateur est déconnecté, redirigez-le vers la page de connexion
    window.location.href = "login.html";
  }
});





// Afficher la topbar si l'utilisateur est connecté

if (token) {
  const topbar = document.querySelector('header');
  const header = document.createElement('div');
  header.id = 'topbarLogin';
  const texteHeader = document.createElement('p');
  texteHeader.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>Mode édition';


  topbar.prepend(header);
  header.appendChild(texteHeader)

  const navigation = document.getElementById('navigation');
  navigation.style.paddingTop = '80px';

  const sectionWorks = document.querySelector('#sectionProjet');
  const modifierWorks = document.createElement('p');
  modifierWorks.id = 'bouton-ouvrir-modal1';
  modifierWorks.innerHTML = '<a href="#modal1"><i class="fa-solid fa-pen-to-square"></i>Modifier</a>';
  sectionWorks.appendChild(modifierWorks);

}


// ******************************      Modals      ******************************



// Définition des modales
const fenetreModal1 = document.querySelector('.modalEcran');
const fenetreModal2 = document.querySelector('.modalForm');

// Fonction pour afficher une modal spécifique
function afficherModal(modal) {
  fenetreModal1.style.display = 'none';
  fenetreModal2.style.display = 'none';
  modal.style.display = 'flex';
}

// Fonction pour afficher la modal 1 et cacher la modal 2
function afficherModal1(e) {
  e.preventDefault();
  fenetreModal2.style.display = 'none';
  afficherModal(fenetreModal1);
  genererListeModal(works, fenetreModal1); // Générer la liste dans la modal 1
}

// Fonction pour afficher la modal 2 et cacher la modal 1
function afficherModal2(e) {
  e.preventDefault();
  fenetreModal1.style.display = 'none';
  afficherModal(fenetreModal2);
}



// Gestionnaires d'événements pour ouvrir les modales
const boutonOuvrirModal1 = document.querySelector('#bouton-ouvrir-modal1');
boutonOuvrirModal1.addEventListener('click', afficherModal1);

const boutonOuvrirModal2 = document.querySelector('#bouton-ouvrir-modal2');
boutonOuvrirModal2.addEventListener('click', afficherModal2);


// Gestionnaire d'événement pour le bouton "Ajouter"    
const boutonAjouter = document.querySelector('#bouton-ouvrir-modal2');
boutonAjouter.addEventListener('click', afficherModal2); // Ouvre la modal 2



//********** Fonction pour générer la liste d'éléments dans une modal **********
function genererListeModal(works, modal) {
  const modalGallery = modal.querySelector('#galleryModal');
  modalGallery.innerHTML = '';

  works.forEach(work => {
    const figureModal = document.createElement('figure');
    figureModal.dataset.id = work.id;
    figureModal.id = 'figure-modal';
    modalGallery.appendChild(figureModal);

    const imageModal = document.createElement('img');
    imageModal.src = work.imageUrl;
    figureModal.appendChild(imageModal);

    const divBoutons = document.createElement('div');
    divBoutons.id = 'boutons-modal';
    figureModal.appendChild(divBoutons);

    const boutonSupprimer = document.createElement('button');
    boutonSupprimer.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    boutonSupprimer.id = 'bouton-supprimer';
    divBoutons.appendChild(boutonSupprimer);

  });
}



//********** Fonction pour fermer les modales **********
function closeModal1(e) {
  e.preventDefault();
  fenetreModal1.style.display = 'none';
}

function closeModal2(e) {
  e.preventDefault();
  fenetreModal2.style.display = 'none';
}

// Gestionnaire d'événement pour fermer les modales
const boutonsFermerModal1 = document.querySelectorAll('.bouton-fermer1');
boutonsFermerModal1.forEach(bouton => {
  bouton.addEventListener('click', closeModal1);
});

const boutonsFermerModal2 = document.querySelectorAll('.bouton-fermer2');
boutonsFermerModal2.forEach(bouton => {
  bouton.addEventListener('click', closeModal2);
});

