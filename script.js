let nouveauMot          = '';
let nouveauMotMystere   = document.querySelector('#motMystere');
let lettres             = document.querySelectorAll('.lettre');
let lettreMystere;
let motMystere          = new Array;
let victoire            = 0;
let potence             = document.querySelector('#potence');
let recommencer         = false;
let trompette           = document.querySelector('#trompette');
let pendu               = ['img/sprite_1.png','img/sprite_2.png','img/sprite_3.png','img/sprite_4.png','img/sprite_5.png','img/sprite_6.png','img/sprite_7.png'];
let etatPendu           = 1;
let redemption          = false;
const url               = 'https://dicolink.p.rapidapi.com/mots/motauhasard?maxlong=-1&minlong=5&verbeconjugue=false';
const optionsApi        = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '528adfe0d7msh71eb406b20e32d7p13c484jsn11ce25c13ee7',
		'X-RapidAPI-Host': 'dicolink.p.rapidapi.com'
    }
};

async function choisirMotMystere () {
    if (motMystere.length !== 0) {
        reload ();
    } else {
        nouveauMot = prompt ('Quel mot souhaitez-vous faire deviner :\n(si vous ne mettez rien, un mot sera généré aléatoirement)')
        nouveauMotMystere.innerHTML = 'Votre Seigneur réfléchie...';

        if (nouveauMot == null) {
            alert ('Vous devez écrire un mot!');
            choisirMotMystere ();
        } else if (nouveauMot == '') {
            let requete = await fetch (url, optionsApi);

            if (!requete.ok) {
                alert('Un problème est survenu.');
            } else {
                let reponse = await requete.json();
                nouveauMot = reponse[0].mot;
            }
        }
        nouveauMot = supprimerAccentCaractereSpeciaux(nouveauMot);
        afficherMotMystere();
    }
}

supprimerAccentCaractereSpeciaux = function(a) {
    if(typeof a === 'string'){
    var str = a ;
    var tab_accent_brut = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ";
    var tab_sansAccent_brut = "aaaaaaaaaaaaooooooooooooeeeeeeeecciiiiiiiiuuuuuuuuynn";
    var tab_accent = tab_accent_brut.split('');
    var tab_sansAccent = tab_sansAccent_brut.split('');
    tabCorrAcc = new Array();
    var i = -1;
    while (tab_accent[++i]) {
        tabCorrAcc[tab_accent[i]] = tab_sansAccent[i]
    }
    tabCorrAcc['Œ'] = 'OE';
    tabCorrAcc['œ'] = 'oe';
    str = str.replace(/./g, function($0) {
    return (tabCorrAcc[$0]) ? tabCorrAcc[$0] : $0
    })
    return str;
}}

function afficherMotMystere () {
    nouveauMotMystere.innerHTML = '';
    motMystere = [...nouveauMot.toUpperCase()];
    
    motMystere.forEach(lettre => {
        lettreMystere = document.createElement('div');
        if (lettre === ' ') {
            lettreMystere.className = 'mystere';
            lettreMystere.textContent = lettre;
        } else if(lettre === '-') {
            lettreMystere.className = 'decouvert';
            lettreMystere.textContent = lettre;
        } else {
            lettreMystere.className = 'mystere box';
            lettreMystere.textContent = lettre;
        }
        nouveauMotMystere.append(lettreMystere);

    })

    trompette.play();
    lettres.forEach (lettre => {
        lettre.addEventListener('click', comparerLettre);
    });

}

function comparerLettre (e) {

    lettreClickee = e.target;
    lettreChoisie = e.target.innerHTML;
    lettresMysteres = document.querySelectorAll('.mystere');
    
    lettresMysteres.forEach (lettre => {
        if (lettre.innerHTML === lettreChoisie ) {
            lettre.className = 'decouvert';
            lettreClickee.className = 'utilisee';
            redemption = true;
            victoire ++;
            if (victoire == motMystere.length) {
                setTimeout(() => {
                    alert ('Bravo, vous étes sauvé!');
                    reload ();
                }, 1000);
            }
        } else {
            lettreClickee.className = 'utilisee';
        }
    })
    if (redemption == false) {
        pendreHautEtCour ();
    } else {
        redemption = false;
    }
}

function pendreHautEtCour() {
    potence.src = pendu[etatPendu];
    etatPendu++;
    if (etatPendu == 7) {
        lettresMysteres.forEach (lettre => {
            lettre.className = 'decouvert';
        })
        setTimeout (() => {
            alert ('Bon voyage dans les Limbes.');
            reload ();
        }, 1000);
    }
}

function reload () {
    recommencer = confirm ('Souhaitez-vous recommencer');
    if (recommencer == true) {
        window.location.reload ();
    } else if (recommencer == false && victoire !== motMystere.lenght) {
        alert ('La partie n\'est pas isFinite.');
    } else {
        alert ('Merci d\'avoir joué!');
    }
}

do {
    nouveauMotMystere.addEventListener('click', choisirMotMystere);
} while (recommencer);