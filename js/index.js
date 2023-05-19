/*///////////////////////////////////////////////////////////////////////
                     LES VARIABLES DU QUIZ
                     Syphax Mokraoui Gr:04
///////////////////////////////////////////////////////////////////////*/

// Extraits audio à utiliser dans l'interface du quiz
let audio = {
  succes: new Audio("media/son-bon.mp3"),
  echec: new Audio("media/son-echec.mp3"),
};

// Numéro de la question courante
let noQuestion = 0;

// Nombre de réponses justes
let nombreReponsesJustes = 0;

// Barre d'avancement du quiz
let barreAvancement = document.querySelector(".barre-avancement");
// Largeur de la barre à tout moment (initialement 0)
let largeurBarre = 0;
// Cible de largeur pour chaque étape d'avancement du quiz (calculée selon
// la progression dans les questions et le nombre total de questions)
let largeurCibleBarre = 0;

// Zone d'affichage du quiz
let zoneQuiz = document.querySelector(".quiz");

// Section contenant une question du quiz et sa position sur l'axe des X
let sectionQuestion = document.querySelector("section");
let positionX = 100;

// Conteneurs des titres des questions et des choix de réponse
let titreQuestion = document.querySelector(".titre-question");
let lesChoixDeReponses = document.querySelector(".les-choix-de-reponse");

// Titre animé du quiz
let titreIntro = document.querySelector(".anim-titre-intro");

// Zone de fin du quiz
let zoneFin = document.querySelector(".fin");

// Bouton servant à recommencer le quiz
let btnRecommencer = document.querySelector("main.fin .btn-recommencer");

/*///////////////////////////////////////////////////////////////////////
                            ÉVÉNEMENTS
///////////////////////////////////////////////////////////////////////*/
// Gérer la fin de l'animation d'intro
titreIntro.addEventListener("animationend", afficherConsignePourDebuterLeJeu);

// Gestion du bouton de redémarrage du quiz (à la fin du quiz)
btnRecommencer.addEventListener("click", recommencer);

/*///////////////////////////////////////////////////////////////////////
                            LES FONCTIONS
///////////////////////////////////////////////////////////////////////*/

/**
 * Afficher les consignes pour débuter le jeu
 *
 * @param {Event} event : objet AnimationEvent de l'événement distribué
 */
function afficherConsignePourDebuterLeJeu(event) {
  //console.log(event.animationName);
  //On affiche la consigne si c'est la fin de la deuxième animation: etirer-mot
  if (event.animationName == "etirer-mot") {
    //On affiche un message dans le pied de page
    let piedDePage = document.querySelector("footer");
    piedDePage.innerHTML =
      "<h1>Cliquer dans l'écran pour commencer le quiz</h1>";

    //On met un écouteur sur la fenêtre pour enlever l'intro et commencer le quiz
    window.addEventListener("click", commencerLeQuiz);
  }
}

/**
 * Enlever les éléments de l'intro et commencer le quiz
 *
 */
function commencerLeQuiz() {
  //On enlève le conteneur de l'intro
  document.querySelector("main.intro").remove();

  //On enlève l'écouteur qui gère le début du quiz
  window.removeEventListener("click", commencerLeQuiz);

  //On met le conteneur du quiz visible
  zoneQuiz.style.display = "flex";

  //On affiche la première question
  afficherQuestion();
}

/**
 * Afficher la question courante
 *
 */
function afficherQuestion() {
  // Récupérer l'objet de la question en cours dans le tableau des questions
  let objetQuestion = lesQuestions[noQuestion];

  // Affecter le texte dans le titre de la question
  titreQuestion.innerText = objetQuestion.titre;

  // Créer et afficher les balises des choix de réponse :
  // On commence par vider le conteneur des choix de réponses.
  lesChoixDeReponses.innerHTML = "";

  // Puis on le remplit de nouveau avec les choix de réponses de la question
  let unChoix;
  for (let i = 0; i < objetQuestion.choix.length; i++) {
    //On crée la balise et on y affecte une classe CSS
    unChoix = document.createElement("div");
    unChoix.classList.add("choix");
    //On intègre la valeur du choix de réponse
    unChoix.innerText = objetQuestion.choix[i];

    //On affecte dynamiquement l'index de chaque choix
    unChoix.indexChoix = i;

    //On met un écouteur pour vérifier la réponse choisie
    unChoix.addEventListener("mousedown", verifierReponse);

    //Enfin on affiche ce choix
    lesChoixDeReponses.append(unChoix);
  }

  // Modifier la valeur de la position de la section sur l'axe des X
  // pour son animation
  positionX = 100;

  //Partir la première requête pour l'animation de la section
  requestAnimationFrame(animerSection);

  // Fixer la largeur cible de la barre d'avancement (en proportion du nombre
  // de questions disponibles, et du numéro de la question à venir)
  largeurCibleBarre = ((noQuestion + 1) / lesQuestions.length) * 100;

  // Utiliser l'API RequestAnimationFrame pour démarrer l'animation de la
  // barre d'avancement réalisée dans la fonction "animerBarreAvancement" (ci-dessous)
  requestAnimationFrame(animerBarreAvancement);
}

/**
 * Animer la barre d'avancement
 */
function animerBarreAvancement() {
  /*
        Remarque : Utiliser les variables 'largeurBarre', 'largeurCibleBarre', 
        et 'barreAvancement' définies et initialisées pour vous en haut du fichier.
    */
  // Modifier la largeur de la barre d'avancement en l'augmentant de 1vw à
  // chaque appel de cette fonctions
  largeurBarre++;
  barreAvancement.style.width = largeurBarre + "vw";

  // Si la largeur cible n'est pas encore atteinte, faire une autre requête
  // d'animation à l'aide de RAF
  if (largeurBarre < largeurCibleBarre) {
    requestAnimationFrame(animerBarreAvancement);
  }
}

/**
 * Animer l'arrivée de la section contenant la question
 */
function animerSection() {
  //On décrémente la position de 2 (vw)
  positionX -= 2;
  sectionQuestion.style.transform = `translateX(${positionX}vw)`;
  //On part une autre requête  d'animation si la position n'est pas atteinte
  if (positionX > 0) {
    requestAnimationFrame(animerSection);
  }
}

/**
 * Vérifier la réponse cliquée et gerer le passage à la prochaine question.
 *
 * @param {object} event Informations sur l'événement MouseEvent distribué
 */
function verifierReponse(event) {
  // Ne pas modifier cette ligne de code
  lesChoixDeReponses.classList.toggle("desactiver");
  // Vérifier si la réponse cliquée est bonne
  let reponseChoisie = event.target.indexChoix;
  console.log(reponseChoisie);
  let bonneReponse = lesQuestions[noQuestion].bonneReponse;
  console.log(bonneReponse);
  // Capturer et valider la réponse.
  if (reponseChoisie == bonneReponse) {
    // Associer les effets de l'interface (animation, transition, sons)
    event.target.classList.add("reponse-succes");
    audio.succes.play();
    // Incrémenter le nombre de réponses justes au besoin (variable définie en haut du fichier)
    nombreReponsesJustes++;
  } else {
    event.target.classList.add("reponse-echec");
    audio.echec.play();
  }
  //faire en sorte qu'on passe à la prochaine question uniqument
  //lorsque l'animation de la réponse cliquée est terminée !
  event.target.addEventListener("animationend", gererProchaineQuestion);
}

/**
 * Fonction permettant de gérer l'affichage de la prochaine question
 *
 */
function gererProchaineQuestion(event) {
  // On réactive les clics sur les choix de réponse
  lesChoixDeReponses.classList.toggle("desactiver");

  // On incrémente noQuestion pour la  prochaine question à afficher
  noQuestion++;

  //S'il reste une question on l'affiche, sinon c'est la fin du quiz...
  if (noQuestion < lesQuestions.length) {
    afficherQuestion();
  } else {
    afficherFinQuiz();
  }
}

/**
 * Afficher l'interface de la fin du quiz
 *
 */
function afficherFinQuiz() {
  // Retirer la zone du quiz de l'affichage
  zoneQuiz.style.display = "none";

  // Créer dynamiquement la section qui contiendra le score (résultat)
  let sectionResultat = document.createElement("section");
  // Ajoutez dans la sectionResultat le texte correspondant au score obtenu,
  // associer la classe CSS adéquate pour le format et l'animation du résultat
  // et insérer cette section à l'emplacement adéquat de la page HTML (dans
  // l'élément "zoneFin", juste avant l'élément "btnRecommencer")
  sectionResultat.innerText =
    "Votre score est de " + nombreReponsesJustes + " /9 !";
  sectionResultat.classList.add("resultat");

  btnRecommencer.before(sectionResultat);
  // Remettre dans l'affichage la zone de "fin du quiz"
  zoneFin.style.display = "flex";

  // Le bouton "recommencer" est affiché à la fin de l'animation du résultat du quiz
  sectionResultat.addEventListener("animationend", afficherBtnRecommencer);
}

/**
 * Modifier l'opacité du bouton 'recommencer' pour le rendre visible
 */
function afficherBtnRecommencer() {
  btnRecommencer.style.opacity = "1";
}
/**
 * Redémarrer le quiz (sans l'animation de début) en réinitialisant l'état de
 * l'application.
 */
function recommencer() {
  // Remettre les variables numériques du quiz à leurs valeurs initiales (à vous
  // de voir lesquelles vous devez réinitialiser)
  noQuestion = 0;
  nombreReponsesJustes = 0;
  largeurBarre = 0;
  largeurCibleBarre = 0;
  barreAvancement.style.width = "0vw";

  // Retirer du DOM la section contenant le résultat (l'élément ayant la classe 'resultat')
  document.querySelector(".resultat").remove();
  // Remettre l'opacité du bouton "recommencer" à 0
  btnRecommencer.style.opacity = "0";
  // On réaffiche le conteneur de la zone du quiz (son affichage initial était "flex")
  zoneQuiz.style.display = "flex";
  // Et on retire la zone de "fin du quiz" de l'affichage
  zoneFin.style.display = "none";
  // Finalement, on peut afficher la première question...
  afficherQuestion();
}
