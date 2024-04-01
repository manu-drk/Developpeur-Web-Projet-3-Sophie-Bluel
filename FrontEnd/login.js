const form = document.getElementById("login");

// On ajoute un gestionnaire d'évènement 'submit'
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userLogin = {
    email: event.target.querySelector("[name=email]").value,
    password: event.target.querySelector("[name=mdp]").value,
  };

  console.log(userLogin);

  // Création de la charge utile au format JSON
  const chargeUtile = JSON.stringify(userLogin);


fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: chargeUtile
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Email ou mot de passe incorrect");
    }
    return response.json();
  })
  .then(loginData => {
    
    const token = loginData.token;

    // Stockage du token dans le localStorage
    localStorage.setItem("token", token);

    // Redirection vers la page d'accueil
    window.location.href = "http://127.0.0.1:5501/FrontEnd/index.html";
  })
  .catch(error => {
    // En cas d'erreur, afficher un message d'alerte
    alert(error.message);
  });
  
});



// // Ces lignes changent le texte "login" en "logout" si l'utilisateur est connectÃ©
// const boutonLogin = document.querySelector('#bouton_login');
// if (token) {
//   boutonLogin.innerText = 'logout';
//   boutonLogin.href = './index.html';
//   boutonLogin.addEventListener('click', event => {
//     localStorage.removeItem('token');
//   })
// }
// else {
//   boutonLogin.innerText = 'login';
// }