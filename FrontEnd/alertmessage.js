/************************************************************* */

// Création de la structure HTML des modales
function createModalElements() {
    // Créer la div pour la modal d'alerte
    const alertModal = document.createElement('div');
    alertModal.classList.add('modal');
    alertModal.id = 'alertModal';
  
    // Créer le contenu de la modal d'alerte
    const alertContent = document.createElement('div');
    alertContent.classList.add('modal-content');
  
    // Créer le bouton de fermeture de la modal d'alerte
    const closeModalButton = document.createElement('span');
    closeModalButton.classList.add('close-modal');
    closeModalButton.innerHTML = '&times;';
  
    // Créer le paragraphe pour afficher le message d'alerte
    const alertMessage = document.createElement('p');
    alertMessage.id = 'alertMessage';
  
    // Assembler les éléments de la modal d'alerte
    alertContent.appendChild(closeModalButton);
    alertContent.appendChild(alertMessage);
    alertModal.appendChild(alertContent);
  
    // Ajouter la modal d'alerte au body
    document.body.appendChild(alertModal);
  
    // Gestionnaire d'événement pour fermer la modal en cliquant sur la croix
    closeModalButton.addEventListener('click', () => {
      alertModal.style.display = 'none';
    });
  
    // Gestionnaire d'événement pour fermer la modal en cliquant en dehors de celle-ci
    window.addEventListener('click', (event) => {
      if (event.target === alertModal) {
        alertModal.style.display = 'none';
      }
    });
  }
  
  function showAlert(message) {
    // Vérifier si la modal d'alerte est déjà affichée
    const alertModal = document.getElementById('alertModal');
    if (alertModal.style.display !== 'block') {
      // Sélectionner l'élément de message de l'alerte
      const alertMessage = document.getElementById('alertMessage');
      // Afficher le message spécifié dans l'alerte
      alertMessage.textContent = message;
      // Afficher la modal d'alerte
      alertModal.style.display = 'block';
    }
  }