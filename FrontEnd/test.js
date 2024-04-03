// // Sélectionner l'élément de formulaire par son ID
// const formElement = document.getElementById("ajout-form");

// // Ajouter un gestionnaire d'événements pour la soumission du formulaire
// formElement.addEventListener("submit", function(event) {
//     event.preventDefault(); // Empêcher le comportement par défaut du formulaire

//     const formData = new FormData(formElement); // Récupérer les données du formulaire

//     // Récupérer le token d'authentification depuis le localStorage
//     const token = localStorage.getItem("token");

//     // Vérifier si le token est présent
//     if (!token) {
//         alert("Vous devez vous connecter pour effectuer cette action.");
//         return; // Arrêter l'exécution de la fonction si le token est absent
//     }

//     // Créer les en-têtes (headers) de la requête avec le token d'authentification
//     const headers = new Headers();
//     headers.append("Authorization", `Bearer ${token}`);

//     // Effectuer une requête Ajax pour envoyer les données au serveur
//     fetch("http://localhost:5678/api/works", {
//         method: "POST",
//         body: formData,
//         headers: headers // Ajouter les en-têtes à la requête
//     })
//     .then(response => {
//         if (response.ok) {
//             // Gérer la réponse du serveur si nécessaire
//             console.log("Image ajoutée avec succès !");
//             // Réinitialiser le formulaire après l'envoi des données
//             formElement.reset();
//             // Réinitialiser l'aperçu de l'image
//             document.getElementById("image-preview").src = "#";
//             document.getElementById("image-preview").style.display = "none";
//             // Réafficher les éléments masqués
//             document.querySelector('.logoAjout').style.display = "block";
//             document.getElementById('custom-file-upload').style.display = "block";
//             document.querySelector('#modal2 p').style.display = "block";
//         } else {
//             throw new Error("Erreur lors de l'ajout de l'image.");
//         }
//     })
//     .catch(error => {
//         console.error("Erreur:", error);
//     });
// });
