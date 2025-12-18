/* ===================================================================
   BALLON MATH - SCRIPT PRINCIPAL
   Auteur : Mahmoud Salem et Jerry Kiremesha
   Cours : ICS3UC
   =================================================================== */

/* ===== VARIABLES GLOBALES POUR LE JEU ===== */
let nomJoueur = "";           // Nom du joueur
let score = 0;                // Score actuel du joueur
let tempsRestant = 60;        // Temps restant en secondes
let intervalTimer = null;     // Référence pour l'intervalle du timer
let bonneReponse = 0;         // La bonne réponse à la question actuelle
let difficulte = "intermediaire"; // Niveau de difficulté par défaut

/* ===== FONCTION POUR OBTENIR LA DIFFICULTÉ DEPUIS LOCALSTORAGE ===== */
// Cette fonction récupère le niveau de difficulté sauvegardé
function obtenirDifficulte() {
    // Vérifie si une difficulté est sauvegardée dans localStorage
    let diff = localStorage.getItem("difficulte");
    // Si aucune difficulté n'est sauvegardée, utilise "intermediaire" par défaut
    if (!diff) {
        diff = "intermediaire";
        localStorage.setItem("difficulte", diff);
    }
    return diff;
}

/* ===== FONCTION POUR DÉFINIR LA DIFFICULTÉ ===== */
// Cette fonction sauvegarde le niveau de difficulté choisi
function definirDifficulte(niveau) {
    localStorage.setItem("difficulte", niveau);
    difficulte = niveau;
}

/* ===== FONCTION POUR GÉNÉRER UNE QUESTION SELON LA DIFFICULTÉ ===== */
// Cette fonction crée une question mathématique basée sur le niveau de difficulté
function genererQuestion(niveau) {
    let num1, num2, operation, reponse;
    
    // Switch pour gérer les différents niveaux de difficulté
    switch(niveau) {
        case "debutant":
            // Débutant : Addition et soustraction simples (nombres < 100)
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            
            // Choisit aléatoirement entre addition et soustraction
            if (Math.random() < 0.5) {
                operation = "+";
                reponse = num1 + num2;
            } else {
                operation = "-";
                // S'assure que le résultat est positif
                if (num1 < num2) {
                    let temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                reponse = num1 - num2;
            }
            break;
            
        case "intermediaire":
            // Intermédiaire : Toutes les opérations avec nombres entiers
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
            
            // Choisit aléatoirement parmi les 4 opérations
            let operationAleatoire = Math.floor(Math.random() * 4);
            
            if (operationAleatoire === 0) {
                operation = "+";
                reponse = num1 + num2;
            } else if (operationAleatoire === 1) {
                operation = "-";
                if (num1 < num2) {
                    let temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                reponse = num1 - num2;
            } else if (operationAleatoire === 2) {
                operation = "×";
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                reponse = num1 * num2;
            } else {
                operation = "÷";
                // S'assure que la division donne un nombre entier
                num2 = Math.floor(Math.random() * 10) + 1;
                reponse = Math.floor(Math.random() * 15) + 1;
                num1 = num2 * reponse;
            }
            break;
            
        case "avance":
            // Avancé : Toutes les opérations incluant les décimaux
            num1 = (Math.random() * 20 + 1).toFixed(1);
            num2 = (Math.random() * 20 + 1).toFixed(1);
            num1 = parseFloat(num1);
            num2 = parseFloat(num2);
            
            let opAvancee = Math.floor(Math.random() * 4);
            
            if (opAvancee === 0) {
                operation = "+";
                reponse = (num1 + num2).toFixed(1);
                reponse = parseFloat(reponse);
            } else if (opAvancee === 1) {
                operation = "-";
                if (num1 < num2) {
                    let temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                reponse = (num1 - num2).toFixed(1);
                reponse = parseFloat(reponse);
            } else if (opAvancee === 2) {
                operation = "×";
                num1 = (Math.random() * 10 + 1).toFixed(1);
                num2 = (Math.random() * 10 + 1).toFixed(1);
                num1 = parseFloat(num1);
                num2 = parseFloat(num2);
                reponse = (num1 * num2).toFixed(1);
                reponse = parseFloat(reponse);
            } else {
                operation = "÷";
                num2 = (Math.random() * 10 + 1).toFixed(1);
                num2 = parseFloat(num2);
                reponse = (Math.random() * 10 + 1).toFixed(1);
                reponse = parseFloat(reponse);
                num1 = (num2 * reponse).toFixed(1);
                num1 = parseFloat(num1);
                reponse = (num1 / num2).toFixed(1);
                reponse = parseFloat(reponse);
            }
            break;
    }
    
    return {
        question: num1 + " " + operation + " " + num2 + " = ?",
        reponse: reponse
    };
}

/* ===== FONCTION POUR GÉNÉRER DES RÉPONSES INCORRECTES ===== */
// Cette fonction crée deux fausses réponses pour les paniers
function genererFaussesReponses(bonneRep, niveau) {
    let fausses = [];
    let range = niveau === "debutant" ? 20 : (niveau === "intermediaire" ? 30 : 15);
    
    // Boucle while pour générer deux réponses uniques et différentes de la bonne réponse
    while (fausses.length < 2) {
        let fausse;
        
        // Génère une fausse réponse proche de la bonne réponse
        if (niveau === "avance") {
            fausse = parseFloat((bonneRep + (Math.random() * range - range/2)).toFixed(1));
        } else {
            fausse = Math.floor(bonneRep + (Math.random() * range - range/2));
        }
        
        // S'assure que la fausse réponse est différente de la bonne et pas déjà dans le tableau
        if (fausse !== bonneRep && !fausses.includes(fausse) && fausse > 0) {
            fausses.push(fausse);
        }
    }
    
    return fausses;
}

/* ===== FONCTION POUR MÉLANGER UN TABLEAU ===== */
// Cette fonction mélange aléatoirement les éléments d'un tableau
function melangerTableau(tableau) {
    // Boucle for qui parcourt le tableau de la fin au début
    for (let i = tableau.length - 1; i > 0; i--) {
        // Génère un index aléatoire
        let j = Math.floor(Math.random() * (i + 1));
        // Échange les éléments à l'index i et j
        let temp = tableau[i];
        tableau[i] = tableau[j];
        tableau[j] = temp;
    }
    return tableau;
}

/* ===== FONCTION POUR DÉMARRER LE JEU ===== */
// Cette fonction initialise et démarre le jeu
function demarrerJeu() {
    // Récupère le nom du joueur depuis le champ de saisie
    nomJoueur = document.getElementById("nom").value.trim();
    
    // Vérifie si le nom a été entré
    if (nomJoueur === "") {
        alert("Entre ton nom !");
        return;
    }
    
    // Récupère la difficulté sauvegardée
    difficulte = obtenirDifficulte();
    
    // Cache la zone de saisie du nom et affiche le compte à rebours
    document.getElementById("zoneNom").classList.add("hidden");
    document.getElementById("compteRebours").classList.remove("hidden");
    
    // Lance le compte à rebours de 3, 2, 1
    let compteur = 3;
    let elementCompte = document.getElementById("compte");
    elementCompte.innerHTML = compteur;
    
    // Intervalle pour décrémenter le compte à rebours
    let intervalCompte = setInterval(function() {
        compteur--;
        if (compteur > 0) {
            elementCompte.innerHTML = compteur;
        } else if (compteur === 0) {
            elementCompte.innerHTML = "Êtes-vous prêt ?";
        } else {
            clearInterval(intervalCompte);
            commencerPartie();
        }
    }, 1000);
}

/* ===== FONCTION POUR COMMENCER LA PARTIE ===== */
// Cette fonction démarre réellement le jeu après le compte à rebours
function commencerPartie() {
    // Cache le compte à rebours et affiche le jeu
    document.getElementById("compteRebours").classList.add("hidden");
    document.getElementById("zoneJeu").classList.remove("hidden");
    
    // Affiche le message de bienvenue
    document.getElementById("message").innerHTML = "Bonne chance " + nomJoueur + " 🏀";
    
    // Initialise le score et le temps
    score = 0;
    tempsRestant = 60;
    
    // Affiche le score et le timer
    document.getElementById("score").innerHTML = "Score : " + score + " points";
    document.getElementById("timer").innerHTML = "Temps : " + tempsRestant + "s";
    
    // Lance le timer qui décrémente chaque seconde
    intervalTimer = setInterval(function() {
        tempsRestant--;
        document.getElementById("timer").innerHTML = "Temps : " + tempsRestant + "s";
        
        // Vérifie si le temps est écoulé
        if (tempsRestant <= 0) {
            clearInterval(intervalTimer);
            finJeu();
        }
    }, 1000);
    
    // Génère la première question
    nouvelleQuestion();
}

/* ===== FONCTION POUR CRÉER UNE NOUVELLE QUESTION ===== */
// Cette fonction génère une nouvelle question et affiche les réponses
function nouvelleQuestion() {
    // Génère la question selon la difficulté
    let questionObj = genererQuestion(difficulte);
    bonneReponse = questionObj.reponse;
    
    // Affiche la question
    document.getElementById("equation").innerHTML = questionObj.question;
    
    // Génère les fausses réponses
    let fausses = genererFaussesReponses(bonneReponse, difficulte);
    
    // Crée un tableau avec toutes les réponses et le mélange
    let reponses = [bonneReponse, fausses[0], fausses[1]];
    reponses = melangerTableau(reponses);
    
    // Affiche les réponses dans les trois paniers
    let paniers = document.querySelectorAll(".panier");
    for (let i = 0; i < paniers.length; i++) {
        paniers[i].innerHTML = reponses[i];
        // Enlève les classes d'animation précédentes
        paniers[i].classList.remove("reussi", "rate");
    }
}

/* ===== FONCTION POUR VÉRIFIER LA RÉPONSE ===== */
// Cette fonction est appelée quand le joueur clique sur un panier
function verifierReponse(element) {
    // Récupère la valeur du panier cliqué
    let valeur = parseFloat(element.innerText);
    
    // Vérifie si la réponse est correcte
    if (valeur === bonneReponse) {
        // Bonne réponse : ajoute 2 points et animation de succès
        element.classList.add("reussi");
        score += 2;
        document.getElementById("score").innerHTML = "Score : " + score + " points";
        
        // Enlève l'animation après 500ms
        setTimeout(function() {
            element.classList.remove("reussi");
        }, 500);
    } else {
        // Mauvaise réponse : animation d'échec
        element.classList.add("rate");
        setTimeout(function() {
            element.classList.remove("rate");
        }, 500);
    }
    
    // Génère une nouvelle question après un court délai
    setTimeout(nouvelleQuestion, 600);
}

/* ===== FONCTION POUR TERMINER LE JEU ===== */
// Cette fonction affiche le résultat final et permet de recommencer
function finJeu() {
    // Cache la zone de jeu
    document.getElementById("zoneJeu").classList.add("hidden");
    
    // Affiche l'écran de fin avec le score
    document.getElementById("ecranFin").classList.remove("hidden");
    document.getElementById("resultatFinal").innerHTML = 
        nomJoueur + " a obtenu " + score + " points !";
}

/* ===== FONCTION POUR RECOMMENCER LE JEU ===== */
// Cette fonction réinitialise le jeu pour une nouvelle partie
function recommencer() {
    // Cache l'écran de fin
    document.getElementById("ecranFin").classList.add("hidden");
    
    // Réaffiche la zone de saisie du nom
    document.getElementById("zoneNom").classList.remove("hidden");
    
    // Réinitialise le champ de nom
    document.getElementById("nom").value = "";
    
    // Réinitialise les variables
    score = 0;
    tempsRestant = 60;
    nomJoueur = "";
          }
