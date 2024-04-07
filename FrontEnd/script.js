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
        <figcaption>${work.title}</figcaption>
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

//**********      ajouter le bouton en début de tableau     ***********
categories.unshift(tousLesTavaux);
if (!token) {
  categories.forEach(function (categorie) {


    let button = document.createElement('button');
    button.classList.add('boutonFiltre');
    button.textContent = categorie.name;
    button.dataset.id = categorie.id;
    document.querySelector('.filtres').appendChild(button);

  })


  //**********      Ajout de la partie filtre      **********


  const boutonsFiltre = document.querySelectorAll('.boutonFiltre');
  boutonsFiltre.forEach(button => {
    button.addEventListener('click', function () {
      const filtreId = button.dataset.id;
      const filtered = filtreId == 0 ? works : works.filter(work => work.category.id == filtreId);
      displayWorks(filtered);
  
      // Ajoute la classe "selected" au bouton actuellement sélectionné
      boutonsFiltre.forEach(btn => {
        if (btn === button) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      });
    });
  });
}
//**********      texte "login" en "logout" si l'utilisateur est connecté      **********

function login(token) {
  if (token) {
    document.getElementById("bouton_login").innerText = "logout";

  } else {
    document.getElementById("bouton_login").innerText = "login";
  }
}
login(token);





//**********      Fonction de déconnexion      **********

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


// **********      Partie Modals      **********

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
  fenetreModal2.style.display = 'none';// modale2.classList.add("off")
  afficherModal(fenetreModal1);
  genererListeModal(works, fenetreModal1); // Générer la liste dans la modal 1
}

// Fonction pour afficher la modal 2 et cacher la modal 1
function afficherModal2(e) {
  e.preventDefault();
  fenetreModal1.style.display = 'none';
  afficherModal(fenetreModal2);
}


//**********      Modal 2      **********

// Code HTML de la modal2
const modal2HTML = `
<div id="modal2">
    <button class="bouton-precedent"><i class="fa-solid fa-arrow-left"></i></button>
    <button class="bouton-fermer2"><i class="fa-solid fa-xmark"></i></button>
    <h1>Ajout photo</h1>
    <div id="preview" class="hidden"></div>
    <div class="fenetre-ajout">
        <input class="hidden" type="file" id="input-photo" accept="image/jpeg, image/png" name='image' />
        <div class="logoAjout">
            <i class="fa-regular fa-image" style="color: #B9C5CC;"></i>
        </div>
        <label for="input-photo" id="custom-file-upload">+ Ajouter Photo</label>
        <p>jpg, png : 4mo max</p>
        <img id="image-preview" src="#" alt="Aperçu de l'image" style="display: none;">
    </div>
    <div id="ajoutModal">
        <form id='ajout-form' action="#">
            <label for="title-texte">Titre</label>
            <input type="text" id="title-texte" name='title' />
            <label for="categorie">Catégorie</label>
            <select name="category" id="categorie"></select>
            <hr>
            <input id="valider-ajout-modal" class="bouton-valider" type="submit" value="Valider">
        </form>
    </div>
</div>`;

// Sélection de la div modalForm
const modalForm = document.querySelector('.modalForm');

// Insertion de la modal2 dans la modalForm
modalForm.innerHTML = modal2HTML;

//**********      Ouverture des modals      **********

// Gestionnaires d'événements pour ouvrir les modales
const boutonOuvrirModal1 = document.querySelector('#bouton-ouvrir-modal1');
if (token) {boutonOuvrirModal1.addEventListener('click', afficherModal1);
}

const boutonOuvrirModal2 = document.querySelector('#bouton-ouvrir-modal2');
boutonOuvrirModal2.addEventListener('click', afficherModal2);


// Gestionnaire d'événement pour le bouton "Ajouter"    
const boutonAjouter = document.querySelector('#bouton-ouvrir-modal2');
boutonAjouter.addEventListener('click', afficherModal2); // Ouvre la modal 2



//**********      Fonction pour générer la liste d'éléments dans une modal      **********
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

  //**********      Suppression du projet      **********

  // Gestionnaire d'événements pour les boutons 'bouton-supprimer'

  // Gestionnaire d'événements pour les boutons 'bouton-supprimer'
  const boutonsSupprimer = modal.querySelectorAll('#bouton-supprimer');
  boutonsSupprimer.forEach(bouton => {
    bouton.addEventListener('click', handleSuppression);
  });
}


async function handleSuppression(event) {
  // Demande de confirmation 
  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
  if (confirmation) {
    // Récupérer l'ID de l'élément à supprimer
    const workId = event.target.closest('figure').dataset.id;
    try {
      // Récupérer le token d'authentification depuis le localStorage
      const token = localStorage.getItem("token");

      // Vérifier si le token est présent
      if (!token) {

        alert("Vous devez être connecté.");
        return; // Arrêter l'exécution de la fonction si le token est absent
      }

      // Créer les en-têtes (headers) de la requête avec le token d'authentification
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      // Effectuer la requête DELETE pour supprimer l'élément
      const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: headers
      });

      if (response.ok) {
        // Supprimer l'élément de la galerie
        const figureModal = event.target.closest('figure');
        if (figureModal) {
          figureModal.parentNode.removeChild(figureModal);
        }

        alert("L'élément a été supprimé avec succès !");
      } else {
        throw new Error("Erreur lors de la suppression de l'élément.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur s'est produite lors de la suppression de l'élément.");
    }
  }
}



//**********      Fonction pour fermer les modales      **********
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

//**********      Fonction pour fermer les modales lors du clic  en dehors de la modale
function closeModalOutside(e) {
  // Vérifification si clique sur l'arrière-plan de la modal
  if (e.target === fenetreModal1 || e.target === fenetreModal2) {
    closeModal1(e);
    closeModal2(e);
  }
}

// Gestionnaire d'événements pour le clic à l'extérieur de la modal
fenetreModal1.addEventListener('click', closeModalOutside);
fenetreModal2.addEventListener('click', closeModalOutside);



//**********      fonction précedent      **********

const boutonPrecedent = document.querySelector('.bouton-precedent');

function retourModal1() {
  fenetreModal1.style.display = 'flex';
  fenetreModal2.style.display = 'none';

}

boutonPrecedent.addEventListener('click', retourModal1);



//**********      Ajoute selection des catégories      **********

// Sélection de l'élément de formulaire pour les catégories
const categorieSelect = document.getElementById('categorie');

// Fonction pour ajouter les options de catégorie dans le formulaire
function formCategories(categories) {
  // Supprimer les options existantes
  categorieSelect.innerHTML = '';

  const filteredCategories = categories.filter(category => category.id !== 0);

  // Ajouter les options des catégories restantes dans le formulaire
  filteredCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorieSelect.appendChild(option);
  });
}
formCategories(categories);

//**********      Ajout de l'imagne en miniature      **********


const inputPhoto = document.getElementById("input-photo");

// Sélection des éléments HTML à masquer
const logoAjoutElement = document.querySelector('.logoAjout');
const labelAjoutElement = document.getElementById('custom-file-upload');
const paragrapheElement = document.querySelector('#modal2 p');

// Sélection de l'image
const imagePreview = document.getElementById("image-preview");

// Ajouter d'événements 
inputPhoto.addEventListener("change", function () {
  // Vérifier si des fichiers ont été sélectionnés
  if (inputPhoto.files && inputPhoto.files[0]) {
    // Créer un objet URL pour l'image sélectionnée
    const reader = new FileReader();

    reader.onload = function (e) {
      // Afficher l'image dans l'élément de prévisualisation
      imagePreview.src = e.target.result;
      // Afficher l'élément de prévisualisation
      imagePreview.style.display = "block";

      // Masquer les autres éléments HTML
      logoAjoutElement.style.display = "none";
      labelAjoutElement.style.display = "none";
      paragrapheElement.style.display = "none";
    }


    reader.readAsDataURL(inputPhoto.files[0]);
  }
});


//**********      Condition des informations pour valider      **********
// Sélectionner les éléments du formulaire
const titleInput = document.getElementById("title-texte");
const categorySelect = document.getElementById("categorie");
const photoInput = document.getElementById("input-photo");
const boutonValider = document.getElementById("valider-ajout-modal");

// Fonction pour vérifier si le bouton Valider doit être activé
function verifierConditions() {
  const titreValide = titleInput.value.trim() !== '';
  const categorieChoisie = categorySelect.value !== '';
  const photoInseree = photoInput.files.length > 0;

  boutonValider.disabled = !(titreValide && categorieChoisie && photoInseree);
  boutonValider.classList.toggle('valide', (titreValide && categorieChoisie && photoInseree));
}

// Ajouter des écouteurs d'événements pour les changements dans les éléments du formulaire
titleInput.addEventListener("input", verifierConditions);
categorySelect.addEventListener("change", verifierConditions);
photoInput.addEventListener("change", verifierConditions);

// Appeler la fonction une première fois pour initialiser l'état du bouton Valider
verifierConditions();

//**********      Post du nouveau projet      **********


// Ajouter un gestionnaire d'événements pour le clic sur le bouton de validation
boutonValider.addEventListener("click", async function (event) {
  event.preventDefault();

  // Récupérer les valeurs saisies dans le formulaire
  const title = document.getElementById("title-texte").value;
  const categoryId = document.getElementById("categorie").value;
  const imageFile = document.getElementById("input-photo").files[0];

  if (!title.trim()) {
    aler("Veuillez entrer un titre.");
    return; // Arrêter l'exécution de la fonction si le titre est vide
  }
  // Créer un objet FormData pour envoyer les données
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", categoryId);
  formData.append("image", imageFile);

  // Récupérer le token d'authentification depuis le localStorage
  const token = localStorage.getItem("token");

  // Vérifier si le token est présent
  if (!token) {
    alert("Vous devez être connecté.");
    return; // Arrêter l'exécution de la fonction si le token est absent
  }

  // Créer les en-têtes (headers) de la requête avec le token d'authentification
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  try {
    // Effectue une requêtepour envoyer les données au serveur
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: headers
    });

    if (response.ok) {
      // Gérer la réponse du serveur si nécessaire
      console.log("Image ajoutée avec succès !");
      // Réinitialiser le formulaire 
      document.getElementById("ajout-form").reset();
      // Réinitialiser l'aperçu de l'image
      document.getElementById("image-preview").src = "#";
      document.getElementById("image-preview").style.display = "none";
      // Réafficher les éléments masqués
      document.querySelector('.logoAjout').style.display = "block";
      document.getElementById('custom-file-upload').style.display = "block";
      document.querySelector('#modal2 p').style.display = "block";
    } else {
      throw new Error("Erreur lors de l'ajout de l'image.");
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("alerte")
  }
});
