//Auteur : Mahmoud Salem et Jerry Kiremesha | Cours : ICS3UC |
// script.js Page de javascript

// Variable globales pour le jeu
let nomJoueur = ""; // Stocke le nom du joueur
let score = 0; // Score actuel du joueur
let tempsRestant = 60; // Temps restant en secondes
let intervalTimer = null; // Référence à l'intervalle du chronomètre
let bonneReponse = 0; // Stocke la bonne réponse de la question actuelle
let difficulte = "intermediaire"; // Niveau de difficulté par défaut
let jeuEnCours = false; // Indique si le jeu est en cours
let scoresSession = []; // Tableau pour stocker les scores de la session

// fonction pour obtenir le niveau de localstorage 
// Récupère le niveau de difficulté sauvegardé ou utilise le niveau par défaut
function obtenirDifficulte() {
    let diff = localStorage.getItem("difficulte"); // Lit la valeur dans localStorage
    if (!diff) { // Si aucune valeur n'est trouvée
        diff = "intermediaire"; // Utilise le niveau intermédiaire par défaut
        localStorage.setItem("difficulte", diff); // Sauvegarde le niveau par défaut
    }
    return diff; // Retourne le niveau de difficulté
}

// Fonction pour definir la difficulté
// Sauvegarde le niveau de difficulté choisi par le joueur
function definirDifficulte(niveau) {
    localStorage.setItem("difficulte", niveau); // Sauvegarde dans localStorage
    difficulte = niveau; // Met à jour la variable globale
}

// Fonction pour géneré une question par rapport a la difficulté
// Crée une question mathématique adaptée au niveau choisi
function genererQuestion(niveau) {
    let num1, num2, operation, reponse; // Variables pour la question
    
    // Switch pour gérer les trois niveaux de difficulté
    switch(niveau) {
        case "debutant": // Niveau débutant : addition et soustraction simples
            num1 = Math.floor(Math.random() * 50) + 1; // Nombre entre 1 et 50
            num2 = Math.floor(Math.random() * 50) + 1; // Nombre entre 1 et 50
            
            if (Math.random() < 0.5) { // 50% de chance d'avoir une addition
                operation = "+"; // Opération addition
                reponse = num1 + num2; // Calcul de la réponse
            } else { // 50% de chance d'avoir une soustraction
                operation = "-"; // Opération soustraction
                if (num1 < num2) { // S'assure que num1 est plus grand pour éviter les négatifs
                    let temp = num1; // Variable temporaire pour l'échange
                    num1 = num2; // Échange les valeurs
                    num2 = temp; // Échange les valeurs
                }
                reponse = num1 - num2; // Calcul de la réponse
            }
            break;
            
        case "intermediaire": // Niveau intermédiaire : toutes les opérations avec entiers
            num1 = Math.floor(Math.random() * 20) + 1; // Nombre entre 1 et 20
            num2 = Math.floor(Math.random() * 20) + 1; // Nombre entre 1 et 20
            
            let operationAleatoire = Math.floor(Math.random() * 4); // Choisit une opération (0-3)
            
            if (operationAleatoire === 0) { // Addition
                operation = "+";
                reponse = num1 + num2;
            } else if (operationAleatoire === 1) { // Soustraction
                operation = "-";
                if (num1 < num2) { // Évite les résultats négatifs
                    let temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                reponse = num1 - num2;
            } else if (operationAleatoire === 2) { // Multiplication
                operation = "×";
                num1 = Math.floor(Math.random() * 12) + 1; // Tables jusqu'à 12
                num2 = Math.floor(Math.random() * 12) + 1; // Tables jusqu'à 12
                reponse = num1 * num2;
            } else { // Division
                operation = "÷";
                num2 = Math.floor(Math.random() * 10) + 1; // Diviseur entre 1 et 10
                reponse = Math.floor(Math.random() * 15) + 1; // Résultat entre 1 et 15
                num1 = num2 * reponse; // Calcule le dividende pour avoir une division exacte
            }
            break;
            
        case "avance": // Niveau avancé : toutes les opérations avec décimaux
            num1 = (Math.random() * 20 + 1).toFixed(1); // Nombre décimal entre 1.0 et 21.0
            num2 = (Math.random() * 20 + 1).toFixed(1); // Nombre décimal entre 1.0 et 21.0
            num1 = parseFloat(num1); // Convertit en nombre
            num2 = parseFloat(num2); // Convertit en nombre
            
            let opAvancee = Math.floor(Math.random() * 4); // Choisit une opération
            
            if (opAvancee === 0) { // Addition
                operation = "+";
                reponse = (num1 + num2).toFixed(1); // Arrondit à 1 décimale
                reponse = parseFloat(reponse);
            } else if (opAvancee === 1) { // Soustraction
                operation = "-";
                if (num1 < num2) { // Évite les négatifs
                    let temp = num1;
                    num1 = num2;
                    num2 = temp;
                }
                reponse = (num1 - num2).toFixed(1);
                reponse = parseFloat(reponse);
            } else if (opAvancee === 2) { // Multiplication
                operation = "×";
                num1 = (Math.random() * 10 + 1).toFixed(1); // Nombres plus petits pour la multiplication
                num2 = (Math.random() * 10 + 1).toFixed(1);
                num1 = parseFloat(num1);
                num2 = parseFloat(num2);
                reponse = (num1 * num2).toFixed(1);
                reponse = parseFloat(reponse);
            } else { // Division
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
    
    // Retourne un objet contenant la question et sa réponse
    return {
        question: num1 + " " + operation + " " + num2 + " = ?",
        reponse: reponse
    };
}

// Fonction pour généré des réponses incorrectes
// Crée deux fausses réponses proches de la bonne réponse
function genererFaussesReponses(bonneRep, niveau) {
    let fausses = []; // Tableau pour stocker les fausses réponses
    let range = niveau === "debutant" ? 20 : (niveau === "intermediaire" ? 30 : 15); // Si niveau est "debutant" ? alors 20 : sinon 15 » Le ? signifie “si la condition est vraie”. On utilise ca a rapport de chaque niveau
    
    while (fausses.length < 2) { // Continue jusqu'à avoir 2 fausses réponses
        let fausse;
        
        if (niveau === "avance") { // Pour le niveau avancé, génère des décimaux
            fausse = parseFloat((bonneRep + (Math.random() * range - range/2)).toFixed(1));
        } else { // Pour les autres niveaux, génère des entiers
            fausse = Math.floor(bonneRep + (Math.random() * range - range/2));
        }
        
        // Vérifie que la fausse réponse est différente et positive
        if (fausse !== bonneRep && !fausses.includes(fausse) && fausse > 0) {
            fausses.push(fausse); // Ajoute la fausse réponse au tableau
        }
    }
    
    return fausses; // Retourne les deux fausses réponses
}

// Fonction pour melanger un tableau
// Algorithme de Fisher-Yates pour mélanger aléatoirement un tableau
function melangerTableau(tableau) {
    for (let i = tableau.length - 1; i > 0; i--) { // Parcourt le tableau en sens inverse
        let j = Math.floor(Math.random() * (i + 1)); // Index aléatoire
        let temp = tableau[i]; // Variable temporaire pour l'échange
        tableau[i] = tableau[j]; // Échange les éléments
        tableau[j] = temp; // Échange les éléments
    }
    return tableau; // Retourne le tableau mélangé
}

// Vérifie que le nom entré par le joueur est valide
function validerNom(nom) {
    nom = nom.trim(); // Enlève les espaces au début et à la fin
    
    if (nom === "") { // Vérifie si le nom est vide
        return { valide: false, message: "Entre ton nom !" };
    }
    
    if (nom.length > 20) { // Vérifie si le nom est trop long
        return { valide: false, message: "Ton nom est trop long (maximum 20 caractères) !" };
    }
    
    return { valide: true, nom: nom }; // Retourne que la validation est réussie
}


// Lance le processus de démarrage du jeu avec compte à rebours
function demarrerJeu() {
    let nomInput = document.getElementById("nom").value; // Récupère le nom entré
    let validation = validerNom(nomInput); // Valide le nom
    
    if (!validation.valide) { // Si la validation échoue
        alert(validation.message); // Affiche un message d'erreur
        return; // Arrête la fonction
    }
    
    nomJoueur = validation.nom; // Sauvegarde le nom validé
    difficulte = obtenirDifficulte(); // Récupère le niveau de difficulté
    
    document.getElementById("zoneNom").classList.add("cache"); // Cache la zone de saisie du nom
    document.getElementById("compteRebours").classList.remove("cache"); // Affiche le compte à rebours
    
    let elementCompte = document.getElementById("compte"); // Récupère l'élément du compte
    elementCompte.innerHTML = "Êtes-vous prêt ?"; // Affiche d'abord le message

    // Après 1 seconde, démarre le compte à rebours
    setTimeout(function() {
        let compteur = 3; // Commence à 3
        elementCompte.innerHTML = compteur; // Affiche 3
        
        let intervalCompte = setInterval(function() {
            compteur--; // Décrémente le compteur
            if (compteur > 0) {
                elementCompte.innerHTML = compteur; // Affiche le nombre
            } else { 
                clearInterval(intervalCompte); // Arrête l'intervalle
                commencerPartie(); // Lance le jeu
            }
        }, 1000);  // La fonction setInterval s'exécute toutes les 1000 ms (1 seconde) pour le compte à rebours
    }, 1000);      // La fonction setInterval s'exécute toutes les 1000 ms (1 seconde) pour le compte à rebours
}

// Commence le jeu et affiche la première question
function commencerPartie() {
    document.getElementById("compteRebours").classList.add("cache"); // Cache le compte à rebours
    document.getElementById("zoneJeu").classList.remove("cache"); // Affiche la zone de jeu
    
    document.getElementById("message").innerHTML = "Bonne chance " + nomJoueur + " 🏀"; // Message de bienvenue
    
    score = 0; // Réinitialise le score
    tempsRestant = 60; // Réinitialise le temps
    jeuEnCours = true; // Indique que le jeu est actif
    
    // Rend les paniers visibles et cliquables
    let paniers = document.querySelectorAll(".panier-basketball");
    for (let i = 0; i < paniers.length; i++) {
        paniers[i].classList.add("visible"); // Ajoute la classe visible
    }
    
    document.getElementById("score").innerHTML = "Score : " + score + " points"; // Affiche le score
    document.getElementById("chronometre").innerHTML = "Temps : " + tempsRestant + "s"; // Affiche le temps
    
    // Démarre le chronomètre
    intervalTimer = setInterval(function() {
        tempsRestant--; // Décrémente le temps
        document.getElementById("chronometre").innerHTML = "Temps : " + tempsRestant + "s"; // Met à jour l'affichage
        
        // Change la couleur du chronomètre selon le temps restant
        let timerElement = document.getElementById("chronometre");
        if (tempsRestant <= 10) { // Moins de 10 secondes
            timerElement.style.color = "#d32f2f"; // Rouge
            timerElement.style.fontWeight = "bold"; // Gras
        } else if (tempsRestant <= 30) { // Moins de 30 secondes
            timerElement.style.color = "#ff9800"; // Orange
        }
        
        if (tempsRestant <= 0) { // Quand le temps est écoulé
            clearInterval(intervalTimer); // Arrête le chronomètre
            finJeu(); // Termine le jeu
        }
    }, 1000); // Exécute chaque seconde
    
    nouvelleQuestion(); // Affiche la première question
}

// Fonction pour une nouvelle question
// Génère et affiche une nouvelle question avec les réponses mélangées
function nouvelleQuestion() {
    if (!jeuEnCours) return; // Ne fait rien si le jeu n'est pas actif
    
    let questionObj = genererQuestion(difficulte); // Génère la question
    bonneReponse = questionObj.reponse; // Sauvegarde la bonne réponse
    
    document.getElementById("equation").innerHTML = questionObj.question; // Affiche la question
    
    let fausses = genererFaussesReponses(bonneReponse, difficulte); // Génère les fausses réponses
    
    let reponses = [bonneReponse, fausses[0], fausses[1]]; // Crée un tableau avec toutes les réponses
    reponses = melangerTableau(reponses); // Mélange les réponses
    
    // Affiche les réponses dans les paniers
    let paniers = document.querySelectorAll(".panier-basketball");
    for (let i = 0; i < paniers.length; i++) {
        paniers[i].querySelector('.carre-reponse').innerHTML = reponses[i]; // Affiche la réponse
        paniers[i].classList.remove("animation-reussi", "animation-rate"); // Enlève les animations précédentes
        paniers[i].style.pointerEvents = "auto"; // Réactive les clics
    }
}

// Fonction pour verifier la reponse
// Vérifie si la réponse cliquée est correcte et met à jour le score
function verifierReponse(ceci) {
    if (!jeuEnCours) return; // Ne fait rien si le jeu n'est pas actif
    
    // Désactive tous les paniers pour éviter les clics multiples
    let paniers = document.querySelectorAll(".panier-basketball");
    for (let i = 0; i < paniers.length; i++) {
        paniers[i].style.pointerEvents = "none"; // Désactive les clics
    }
    
    let valeur = parseFloat(ceci.querySelector('.carre-reponse').innerText); // Récupère la valeur cliquée
    
    if (valeur === bonneReponse) { // Si la réponse est correcte
        ceci.classList.add("animation-reussi"); // Ajoute l'animation de succès
        score += 2; // Ajoute 2 points au score
        document.getElementById("score").innerHTML = "Score : " + score + " points"; // Met à jour l'affichage
        
        setTimeout(function() {
            ceci.classList.remove("animation-reussi"); // Enlève l'animation après 500ms
        }, 500);
    } else { // Si la réponse est incorrecte
        ceci.classList.add("animation-rate"); // Ajoute l'animation d'échec
        setTimeout(function() {
            ceci.classList.remove("animation-rate"); // Enlève l'animation après 500ms
        }, 500);
    }
    
    // Passe à la question suivante
    setTimeout(function() {
        nouvelleQuestion(); // Affiche la question suivante
    }, 1000); // Attend 1 seconde
}

// Fonction pour terminer le jeu
// Affiche l'écran de fin avec le score et les statistiques
function finJeu() {
    jeuEnCours = false; // Indique que le jeu est terminé
    
    // Cache les paniers
    let paniers = document.querySelectorAll(".panier-basketball");
    for (let i = 0; i < paniers.length; i++) {
        paniers[i].classList.remove("visible"); // Enlève la classe visible
    }
    
    document.getElementById("zoneJeu").classList.add("cache"); // Cache la zone de jeu
    document.getElementById("ecranFin").classList.remove("cache"); // Affiche l'écran de fin
    
    // Sauvegarde le score dans l'historique de la session
    let dateActuelle = new Date(); // Récupère la date et l'heure actuelles
    let heureFormatee = dateActuelle.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    }); // Formate l'heure
    
    scoresSession.push({ // Ajoute le score au tableau
        nom: nomJoueur,
        score: score,
        heure: heureFormatee,
        difficulte: difficulte
    });
    
    // Message personnalisé selon le score
    let message = "";
    let scoreParSeconde = score / 60; // Calcule la moyenne de points par seconde
    
    if (score >= 80) { // Score excellent
        message = "🏆 Incroyable " + nomJoueur + " ! Tu es un champion !";
    } else if (score >= 60) { // Bon score
        message = "🌟 Excellent travail " + nomJoueur + " !";
    } else if (score >= 40) { // Score moyen
        message = "👍 Bien joué " + nomJoueur + " !";
    } else if (score >= 20) { // Score faible
        message = "💪 Bon effort " + nomJoueur + " ! Continue de t'entraîner !";
    } else { // Score très faible
        message = "🎯 Continue de pratiquer " + nomJoueur + " !";
    }
    
    // Affiche le résultat final
    document.getElementById("resultatFinal").innerHTML = 
        message + "<br><br>Score final : " + score + " points<br>" +
        "Moyenne : " + scoreParSeconde.toFixed(1) + " points/seconde";
    
    // Affiche les scores précédents de la session
    afficherScoresPrecedents();
}

// Fonction pour afficher les scores precedent
// Affiche l'historique des scores de la session actuelle
function afficherScoresPrecedents() {
    let listeScores = document.getElementById("listeScores"); // Récupère l'élément de la liste
    
    if (!listeScores) return; // Si l'élément n'existe pas, sort de la fonction
    
    listeScores.innerHTML = ""; // Vide la liste
    
    if (scoresSession.length === 0) { // Si aucun score n'est enregistré
        listeScores.innerHTML = "<li>Aucun score précédent</li>"; // Message par défaut
        return;
    }
    
    // Parcourt tous les scores de la session
    for (let i = scoresSession.length - 1; i >= 0; i--) { // Commence par le plus récent
        let scoreData = scoresSession[i]; // Récupère les données du score
        let li = document.createElement("li"); // Crée un élément de liste
        
        // Détermine l'emoji du niveau
        let emojiDifficulte = "";
        if (scoreData.difficulte === "debutant") {
            emojiDifficulte = "🟢";
        } else if (scoreData.difficulte === "intermediaire") {
            emojiDifficulte = "🟡";
        } else {
            emojiDifficulte = "🔴";
        }
        
        // Remplit l'élément avec les informations
        li.innerHTML = emojiDifficulte + " " + scoreData.nom + " : " + 
                       scoreData.score + " pts (" + scoreData.heure + ")";
        listeScores.appendChild(li); // Ajoute l'élément à la liste
    }
}

// Fonction pour recommencer le jeu
// Réinitialise le jeu pour une nouvelle partie
function recommencer() {
    
    document.getElementById("ecranFin").classList.add("cache"); // Cache l'écran de fin
    document.getElementById("zoneNom").classList.remove("cache"); // Affiche la zone de saisie du nom
    
    document.getElementById("nom").value = ""; // Vide le champ de nom
    
    // Réinitialise toutes les variables
    score = 0;
    tempsRestant = 60;
    nomJoueur = "";
    jeuEnCours = false;
    
    // Réinitialise le style du chronomètre
    let timerElement = document.getElementById("chronometre");
    if (timerElement) {
        timerElement.style.color = "#d32f2f"; // Couleur rouge par défaut
        timerElement.style.fontWeight = "bold"; // Texte en gras
    }
}
