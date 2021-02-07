/**
 * @author Benjamin Peronne
 * @email contact@benjaminperonne.fr
 */

/*
JS | Activité 2
*/

document.querySelector('#jeu').style.visibility = 'hidden';

var j1 = new Object();
var j2 = new Object();
let players = [j1, j2];

var current_player = 1;
let nbr_instances = 0;
let keep_playing = true;

j1.ins = false;
j2.ins = false;

//Rempli le plateau de pions
function init_plateau() {
    var plateau = document.querySelector('#plateau');
    /* Remplir le plateau */
    for (let i = 0; i < 49; i++) {
        let tmp = document.createElement('div');
        tmp.classList.add('pion');
        tmp.setAttribute('onclick', 'touch(' + i + ')');
        plateau.appendChild(tmp);
    }
    document.querySelector('#jeu').style.visibility = 'visible';
}

//Fontion d'inscription
function ins(player) {
    // Completer pour vérifier l'inscription
    if (player == 1) {
        j1.ins = true;
        var x = document.getElementsByName('j1');
        let j1_name = document.getElementById('j1-name');

        x = x[0];
        /* Mettre le nom du joueur dans la balise #j1-name */
        j1_name.replaceChild(
            document.createTextNode(x.value),
            j1_name.firstChild
        );
        x.disabled = false;
        j1.name = j1_name.firstChild;
        // j1.name = x.value;
    } else {
        j2.ins = true;
        var x = document.getElementsByName('j2');
        let j2_name = document.getElementById('j2-name');
        x = x[0];
        /* Mettre le nom du joueur dans la balise #j2-name */
        j2_name.replaceChild(
            document.createTextNode(x.value),
            j2_name.firstChild
        );
        x.disabled = true;
        j2.name = j2_name.firstChild;
        // j2.name = x.value;
    }

    if (j1.ins && j2.ins) {
        // Retirer le panneau d'inscription
        var ins = document.getElementById('ins');
        ins.parentNode.removeChild(ins);
        /* retirer la balise div #ins du html */

        //Initialise le plateau
        init_plateau();

        //lien avec les logo
        j1.logo = document.querySelector('.fas.fa-user.j1');
        j2.logo = document.querySelector('.fas.fa-user.j2');

        //Instruction de jeu
        /* Mettre le nom du joueur dans la balise player-name */
        document
            .getElementById('player-name')
            .appendChild(document.createTextNode(j1.name.data));

        //ne joue pas pour le moment
        j2.logo.classList.toggle('fas');
        j2.logo.classList.toggle('far');

        // document.getElementById('j1-name').innerText = j1.name;
        // document.getElementById('j2-name').innerText = j2.name;
        // document.getElementById('j1-name').textContent = j1.name;
        // document.getElementById('j2-name').textContent = j2.name;
    }
}

function empty(box) {
    tokens = box.style.backgroundColor;
    return tokens != 'red' && tokens != 'yellow';
}

// We check if a line has 4 tokens of the same color aligned
function if_aligned(board, item, i, n, step = 1, r = 0) {
    if (i > n || r == 4) return [r, item];
    else {
        let c = board[i].style.backgroundColor;
        return c && c == item
            ? if_aligned(board, item, i + step, n, step, r + 1)
            : if_aligned(board, c, i + step, n, step, 1);
    }
}

function evaluate(board, i, col) {
    let r = 0,
        tmp = 0;

    // ----------------- verif horizontal
    if ((r = if_aligned(board, 'red', i - col, i - col + 6))[0] == 4 && r[1])
        return r[1] == 'red' ? -1 : 1;
    // ----------------- verif horizontal

    // ----------------- verif vertical
    if ((r = if_aligned(board, 'red', col, col + 42, 7))[0] == 4 && r[1])
        return r[1] == 'red' ? -1 : 1;
    // ----------------- verif vertical

    tmp = i - col * 7 - col;
    // ----------------- verif diagonal lower left
    if (tmp > 0) r = if_aligned(board, '', tmp, 48, 8);
    // ----------------- verif diagonal lower left
    // ----------------- verif upper diagonal to the left
    else {
        tmp = col - (i - col) / 7;
        r = if_aligned(board, 'red', tmp, 48 - tmp * 7, 8);
    }
    // ----------------- verif upper diagonal to the left

    if (r[0] == 4 && r[1]) return r[1] == 'red' ? -1 : 1;

    tmp = i - (6 - col) * 6;
    // ----------------- verif diagonal lower right
    if (tmp > 0)
        r = if_aligned(board, '', tmp, tmp + (6 - (tmp - 6) / 7) * 6, 6);
    // ----------------- verif diagonal lower right
    // ----------------- verif upper diagonal to the right
    else {
        tmp = col + (i - col) / 7;
        r = if_aligned(board, 'red', tmp, 42 - (6 - tmp) * 7, 6);
    }
    // ----------------- verif upper diagonal to the right
    if (r[0] == 4 && r[1]) return r[1] == 'red' ? -1 : 1;

    return 0;
}

function touch(id) {
    var pions = document.querySelectorAll('.pion'),
        names = document.getElementById('player-name'),
        infos = document.getElementById('info'),
        r = 0,
        i = 0,
        col = id % 7,
        jouable = false;

    for (i = col; i <= 41 && empty(pions[i]) && empty(pions[i + 7]); i += 7)
        jouable = true;

    if (empty(pions[id]) && (jouable || i < 7) && keep_playing) {
        nbr_instances += 1;
        pions[i].style.backgroundColor = current_player == 1 ? 'red' : 'yellow';

        if (nbr_instances >= 6) {
            r = evaluate(pions, i, col);
            if (r) {
                keep_playing = false;
                infos.replaceChild(
                    document.createTextNode(' Won !'),
                    infos.lastChild
                );
            } else if (!r && nbr_instances == 49) {
                keep_playing = false;
                names.replaceChild(
                    document.createTextNode('PAR: '),
                    names.firstChild
                );
                infos.replaceChild(
                    document.createTextNode(' No player wins !'),
                    infos.lastChild
                );
            }
        }

        if (!r && keep_playing) {
            current_player = current_player == 1 ? 2 : 1;
            names.replaceChild(
                document.createTextNode(players[current_player - 1].name.data),
                names.firstChild
            );
        }
    }
}
