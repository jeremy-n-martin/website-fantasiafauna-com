/* Catalogue des créatures — éditer ici (une carte = un bloc).
 * roles     = exactement 1 parmi : normal, fast, ranged, caster, tank
 * abilities = capacités de jeu (voir ABILITIES dans game.js + CAPACITES.md)
 * Charger ce fichier AVANT game.js (voir index.html).
 */
const CREATURES = [
  {
    "id": 1,
    "name": "Ange",
    "capital": "Citadelle",
    "size": "1,9",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol",
      "transpercer"
    ],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Céleste",
    "power": 72,
    "popularity": 93,
    "cost": 8,
    "attack": 8,
    "health": 9,
    "rarity": "mythique",
    "spell": "Transpercer : le surplus de dégâts atteint la tour.",
    "image": "img/Ange 1.png",
    "quote": "« Rien n'est plus terrifiant qu'une lumière qui refuse de pardonner. »",
    "costColored": 2,
    "costNeutral": 6
  },
  {
    "id": 2,
    "name": "Valkyrie",
    "capital": "Citadelle",
    "size": "1,9",
    "roles": [
      "normal"
    ],
    "abilities": [
      "donner-buff"
    ],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Céleste",
    "power": 52,
    "popularity": 86,
    "cost": 6,
    "attack": 6,
    "health": 10,
    "rarity": "rare",
    "spell": "À l’arrivée : +1/+1 à une créature alliée.",
    "image": "img/Valkyrie 1.png",
    "quote": "« Elles ne choisissent pas les vainqueurs, elles choisissent les morts. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 3,
    "name": "Pégase",
    "capital": "Citadelle",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Céleste",
    "power": 30,
    "popularity": 79,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "rare",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Pégase 1.png",
    "quote": "« L'immortalité a deux ailes et le sabot lourd. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 4,
    "name": "Griffon",
    "capital": "Citadelle",
    "size": "3",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 32,
    "popularity": 77,
    "cost": 4,
    "attack": 2,
    "health": 5,
    "rarity": "rare",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Griffon 1.png",
    "quote": "« Une serre pour déchirer le sol, une aile pour balayer le ciel. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 5,
    "name": "Exorciste",
    "capital": "Citadelle",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [
      "cri-exorcisme"
    ],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 44,
    "popularity": 74,
    "cost": 5,
    "attack": 4,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "À l’arrivée : retire tous les buffs des créatures adverses.",
    "image": "img/Exorciste 1.png",
    "quote": "« La foi est un bouclier, le mot est un glaive. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 6,
    "name": "Chevalier",
    "capital": "Citadelle",
    "size": "1,8",
    "roles": [
      "tank"
    ],
    "abilities": [
      "survie"
    ],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 36,
    "popularity": 69,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Chevalier 1.png",
    "quote": "« La valeur ne se mesure pas à la pureté de l'âme, mais à la lourdeur de l'armure. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 7,
    "name": "Paladin",
    "capital": "Citadelle",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "soin",
      "bouclier-divin"
    ],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 48,
    "popularity": 68,
    "cost": 5,
    "attack": 4,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Soin et Bouclier divin.",
    "image": "img/Paladin 1.png",
    "quote": "« La grâce divine portée par cent kilos d'acier. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 8,
    "name": "Archer",
    "capital": "Citadelle",
    "size": "1,7",
    "roles": [
      "ranged"
    ],
    "abilities": [
      "debut-tour-tir"
    ],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 10,
    "popularity": 50,
    "cost": 2,
    "attack": 2,
    "health": 3,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Archer 1.png",
    "quote": "« Une flèche ne prie pas, elle frappe. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 9,
    "name": "Templier",
    "capital": "Citadelle",
    "size": "1,8",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 42,
    "popularity": 42,
    "cost": 5,
    "attack": 4,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Templier 1.png",
    "quote": "« Le fer sanctifié tranche aussi bien les hérétiques que les doutes. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 10,
    "name": "Guerrier",
    "capital": "Citadelle",
    "size": "1,75",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 20,
    "popularity": 40,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Guerrier 1.png",
    "quote": "« L'acier brut ne fléchit pas devant la magie. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 11,
    "name": "Prêtre",
    "capital": "Citadelle",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [
      "soin",
      "bouclier-divin"
    ],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 18,
    "popularity": 38,
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Prêtre 1.png",
    "quote": "« La bénédiction est un baume, le marteau est le remède. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 12,
    "name": "Spadassin",
    "capital": "Citadelle",
    "size": "1,75",
    "roles": [
      "tank"
    ],
    "abilities": [
      "activer-tank"
    ],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 28,
    "popularity": 36,
    "cost": 3,
    "attack": 3,
    "health": 4,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Spadassin 1.png",
    "quote": "« La finesse de la lame dissimule la brutalité de l'estoc. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 13,
    "name": "Kenku",
    "capital": "Citadelle",
    "size": "1,5",
    "roles": [
      "normal"
    ],
    "abilities": [
      "lancer"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 11,
    "popularity": 35,
    "cost": 2,
    "attack": 2,
    "health": 5,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Kenku 1.png",
    "quote": "« L'imitation du chant des oiseaux précède souvent le silence de la mort. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 14,
    "name": "Clerc",
    "capital": "Citadelle",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "soin"
    ],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 24,
    "popularity": 34,
    "cost": 3,
    "attack": 2,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Clerc 1.png",
    "quote": "« Un cœur pieux dans un corps façonné pour la guerre. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 15,
    "name": "Page",
    "capital": "Citadelle",
    "size": "1,65",
    "roles": [
      "normal"
    ],
    "abilities": [
      "soutient-2"
    ],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 3,
    "popularity": 28,
    "cost": 1,
    "attack": 1,
    "health": 1,
    "rarity": "commune",
    "spell": "Soutien 2 : +1 PV max à 2 alliés aléatoires (ou lui-même).",
    "image": "img/Page 1.png",
    "quote": "« Le premier pas vers la gloire est d'apprendre à porter le bouclier d'un autre. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 16,
    "name": "Arbalétrier",
    "capital": "Citadelle",
    "size": "1,7",
    "roles": [
      "ranged"
    ],
    "abilities": [
      "debut-tour-tir"
    ],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 10,
    "popularity": 26,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Arbalétrier 1.png",
    "quote": "« La corde claque, la querelle fend l'air, le destin s'accomplit. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 17,
    "name": "Moine",
    "capital": "Citadelle",
    "size": "1,75",
    "roles": [
      "normal"
    ],
    "abilities": [
      "bouclier-divin"
    ],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 32,
    "popularity": 25,
    "cost": 3,
    "attack": 4,
    "health": 6,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Moine 1.png",
    "quote": "« La discipline de l'esprit transforme le poing en acier. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 18,
    "name": "Acolyte",
    "capital": "Citadelle",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "soins-leger"
    ],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 5,
    "popularity": 20,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Soins légers : +1 PV à un allié blessé tous les 3 tours.",
    "image": "img/Acolyte 1.png",
    "quote": "« Les murmures de l'autel s'éteignent sous le fracas des armes. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 19,
    "name": "Aasimar",
    "capital": "Citadelle",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Céleste",
    "power": 24,
    "popularity": 18,
    "cost": 4,
    "attack": 4,
    "health": 7,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Aasimar 1.png",
    "quote": "« Le sang des anges ne garantit pas la paix, il la conquiert. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 20,
    "name": "Ecuyer",
    "capital": "Citadelle",
    "size": "1,7",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "Vivant"
    ],
    "origin": "Humain",
    "power": 8,
    "popularity": 18,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Ecuyer 1.png",
    "quote": "« Servir dans l'ombre du héros jusqu'à devenir le rempart. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 21,
    "name": "Alérion",
    "capital": "Hameau",
    "size": "1,2",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 12,
    "popularity": 6,
    "cost": 2,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Alérion 1.png",
    "quote": "« Un présage d'argent qui vole sans faire de bruit. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 22,
    "name": "Voleur",
    "capital": "Empyrée",
    "size": "1,7",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Humain",
    "power": 12,
    "popularity": 6,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Voleur 1.png",
    "quote": "« L'ombre s'étire avant même que la lame ne sorte du fourreau. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 23,
    "name": "Elfe",
    "capital": "Sylve",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 19,
    "popularity": 90,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Elfe 1.png",
    "quote": "« L'éternité s'écoule à travers la pointe d'une flèche. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 24,
    "name": "Licorne",
    "capital": "Sylve",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "soutient"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 39,
    "popularity": 85,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Licorne 1.png",
    "quote": "« La pureté n'est qu'un piège pour ceux qui sous-estiment sa corne. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 25,
    "name": "Centaure",
    "capital": "Sylve",
    "size": "2,3",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 14,
    "popularity": 69,
    "cost": 1,
    "attack": 1,
    "health": 1,
    "rarity": "inhabituelle",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Centaure 1.png",
    "quote": "« La vitesse du cheval, la précision de l'archer, une seule cible. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 26,
    "name": "Druide",
    "capital": "Sylve",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Humain",
    "power": 38,
    "popularity": 68,
    "cost": 5,
    "attack": 2,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Druide 1.png",
    "quote": "« La nature n'a pas besoin de pardonner pour guérir. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 27,
    "name": "Hippogriffe",
    "capital": "Sylve",
    "size": "3",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 25,
    "popularity": 67,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Hippogriffe 1.png",
    "quote": "« L'aigle et le lion scellés dans une tempête de plumes et de griffes. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 28,
    "name": "Dragon vert",
    "capital": "Sylve",
    "size": "18",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 74,
    "popularity": 66,
    "cost": 8,
    "attack": 4,
    "health": 10,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dragon vert 1.png",
    "quote": "« Le poison de la terre coule dans des veines centenaires. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 29,
    "name": "Demi-elfe",
    "capital": "Sylve",
    "size": "1,75",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 14,
    "popularity": 58,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Demi-elfe 1.png",
    "quote": "« L'héritage de deux mondes, la solitude de chacun. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 30,
    "name": "Tréant",
    "capital": "Sylve",
    "size": "9",
    "roles": [
      "normal"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "vivant",
      "végétal"
    ],
    "origin": "Féérique",
    "power": 55,
    "popularity": 56,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Tréant 1.png",
    "quote": "« L'écorce se souvient de chaque hache tombée, et elle se venge. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 31,
    "name": "Faune",
    "capital": "Sylve",
    "size": "1,7",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 17,
    "popularity": 52,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Faune 1.png",
    "quote": "« Le rire des sous-bois s'arrête net quand l'arc est tendu. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 32,
    "name": "Rôdeur",
    "capital": "Sylve",
    "size": "1,75",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Humain",
    "power": 24,
    "popularity": 52,
    "cost": 4,
    "attack": 1,
    "health": 6,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Rodeur 1.png",
    "quote": "« Connaître la forêt, c'est savoir où cacher les corps. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 33,
    "name": "Dryade",
    "capital": "Sylve",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "végétal"
    ],
    "origin": "Féérique",
    "power": 24,
    "popularity": 50,
    "cost": 4,
    "attack": 2,
    "health": 7,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dryade 1.png",
    "quote": "« La sève est plus épaisse que le sang quand la terre s'éveille. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 34,
    "name": "Satyre",
    "capital": "Sylve",
    "size": "1,6",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 18,
    "popularity": 50,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Satyre 1.png",
    "quote": "« L'ivresse de la flûte masque le tranchant du poignard. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 35,
    "name": "Elfe des neiges",
    "capital": "Sylve",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "furie"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 21,
    "popularity": 48,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Elfe des neiges 1.png",
    "quote": "« La glace ne conserve pas la vie, elle la fige. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 36,
    "name": "Leshy",
    "capital": "Sylve",
    "size": "10",
    "roles": [
      "caster"
    ],
    "abilities": [
      "apres-attaque"
    ],
    "natures": [
      "éthéré",
      "végétal"
    ],
    "origin": "Féérique",
    "power": 47,
    "popularity": 40,
    "cost": 6,
    "attack": 4,
    "health": 8,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Leshy 1.png",
    "quote": "« La forêt a un visage, et il n'a rien d'humain. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 37,
    "name": "Ours-hibou",
    "capital": "Sylve",
    "size": "2,5",
    "roles": [
      "normal"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 24,
    "popularity": 40,
    "cost": 3,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Ours-hibou 1.png",
    "quote": "« Une bête née de la fureur des bois et du silence des cavernes. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 38,
    "name": "Vouivre",
    "capital": "Sylve",
    "size": "5",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 44,
    "popularity": 38,
    "cost": 5,
    "attack": 2,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Vouivre 1.png",
    "quote": "« L'ombre des ailes suffit à étouffer le cri des proies. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 39,
    "name": "Firbolg",
    "capital": "Sylve",
    "size": "2,4",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 30,
    "popularity": 16,
    "cost": 4,
    "attack": 2,
    "health": 7,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Firbolg 1.png",
    "quote": "« La douceur de la forêt dissimule des racines géantes. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 40,
    "name": "Amphiptère",
    "capital": "Sylve",
    "size": "4",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 24,
    "popularity": 7,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Amphiptère 1.png",
    "quote": "« La couleuvre ailée glisse sans bruit avant de fondre sur sa cible. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 41,
    "name": "Basajaun",
    "capital": "Sylve",
    "size": "2,4",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 15,
    "popularity": 7,
    "cost": 2,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Basajaun 1.png",
    "quote": "« Le gardien des hautes cimes ne demande pas son chemin. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 42,
    "name": "Nain",
    "capital": "Cénote",
    "size": "1,35",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 12,
    "popularity": 76,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Nain 1.png",
    "quote": "« Façonné dans la roche, taillé pour durer plus longtemps que les royaumes. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 43,
    "name": "Runiste",
    "capital": "Forteresse",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Axiomatique",
    "power": 32,
    "popularity": 34,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Runiste 1.png",
    "quote": "« Chaque rune gravée est un ordre auquel le monde obéit. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 44,
    "name": "Xorn",
    "capital": "Forteresse",
    "size": "1,5",
    "roles": [
      "tank"
    ],
    "abilities": [
      "survie"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Elémentaire",
    "power": 40,
    "popularity": 26,
    "cost": 4,
    "attack": 1,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Xorn 1.png",
    "quote": "« Trois yeux pour scruter la pierre, trois bras pour broyer l'acier. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 45,
    "name": "Dao",
    "capital": "Forteresse",
    "size": "2,9",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 57,
    "popularity": 22,
    "cost": 5,
    "attack": 3,
    "health": 8,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dao 1.png",
    "quote": "« La montagne a pris forme et demande son dû. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 46,
    "name": "Tatzelwurm",
    "capital": "Forteresse",
    "size": "1,5",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 22,
    "popularity": 16,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Tatzelwurm 1.png",
    "quote": "« Un corps de serpent né sous la pression des profondeurs. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 47,
    "name": "Halfling",
    "capital": "Hameau",
    "size": "1",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 12,
    "popularity": 64,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Halfling 1.png",
    "quote": "« La petitesse est un art, la discrétion une arme. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 48,
    "name": "Jackalope",
    "capital": "Hameau",
    "size": "0,5",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 8,
    "popularity": 55,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "inhabituelle",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Jackalope 1.png",
    "quote": "« Une oreille attentive aux secrets de la terre et une corne pour trancher. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 49,
    "name": "Barde",
    "capital": "Hameau",
    "size": "1,7",
    "roles": [
      "ranged"
    ],
    "abilities": [
      "donner-buff"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 15,
    "popularity": 37,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Barde 1.png",
    "quote": "« La poésie est plus tranchante que le fer quand elle touche juste. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 50,
    "name": "Kikimora",
    "capital": "Hameau",
    "size": "0,6",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 18,
    "popularity": 32,
    "cost": 3,
    "attack": 2,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Kikimora 1.png",
    "quote": "« La nuit apporte son lot de murmures et d'illusions. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 51,
    "name": "Tomte",
    "capital": "Hameau",
    "size": "0,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 10,
    "popularity": 30,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Tomte 1.png",
    "quote": "« La farce n'est drôle que jusqu'au premier sang. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 52,
    "name": "Boggart",
    "capital": "Hameau",
    "size": "1",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 10,
    "popularity": 26,
    "cost": 2,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Boggart 1.png",
    "quote": "« La peur prend le visage de ce que vous redoutez le plus. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 53,
    "name": "Nisse",
    "capital": "Hameau",
    "size": "0,75",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 9,
    "popularity": 26,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Nisse 1.png",
    "quote": "« Un sourire amical au coin du feu avant que le piège ne se referme. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 54,
    "name": "Brownie",
    "capital": "Hameau",
    "size": "0,6",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 6,
    "popularity": 23,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Brownie 1.png",
    "quote": "« La malice s'habille de guenilles et de rires moqueurs. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 55,
    "name": "Aitvaras",
    "capital": "Hameau",
    "size": "0,6",
    "roles": [
      "caster"
    ],
    "abilities": [
      "donner-buff"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 14,
    "popularity": 7,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Aitvaras 1.png",
    "quote": "« Une étincelle volant dans le noir, annonciatrice de malheur. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 56,
    "name": "Vampire",
    "capital": "Nécropole",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol-de-vie"
    ],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 68,
    "popularity": 95,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Vampire 1.png",
    "quote": "« Le sang s'arrête de couler, mais la soif ne s'éteint jamais. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 57,
    "name": "Zombie",
    "capital": "Nécropole",
    "size": "1,7",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 8,
    "popularity": 95,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "mythique",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Zombie 1.png",
    "quote": "« La chair se décompose, mais l'ordre d'avancer demeure. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 58,
    "name": "Fantôme",
    "capital": "Empyrée",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "mort-vivant",
      "éthéré"
    ],
    "origin": "Nécrotique",
    "power": 22,
    "popularity": 86,
    "cost": 2,
    "attack": 1,
    "health": 2,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Fantome 1.png",
    "quote": "« Une lueur sans corps qui traverse les murs et glace le sang. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 59,
    "name": "Squelette",
    "capital": "Nécropole",
    "size": "1,75",
    "roles": [
      "normal"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 6,
    "popularity": 85,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "rare",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Squelette 1.png",
    "quote": "« La mort a retiré tout le inutile pour ne laisser que le combat. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 60,
    "name": "Liche",
    "capital": "Nécropole",
    "size": "1,8",
    "roles": [
      "ranged"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 86,
    "popularity": 80,
    "cost": 7,
    "attack": 4,
    "health": 8,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Liche 1.png",
    "quote": "« La mort n'est pas une fin, c'est un changement de souverain. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 61,
    "name": "Momie",
    "capital": "Nécropole",
    "size": "1,75",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 43,
    "popularity": 70,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Momie 1.png",
    "quote": "« Les bandelettes gardent la chair, mais la malédiction conserve le pouvoir. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 62,
    "name": "Nosferatu",
    "capital": "Nécropole",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "quand-tue"
    ],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 45,
    "popularity": 70,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Nosferatu 1.png",
    "quote": "« Un noble déchu dont l'élégance masque une férocité ancienne. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 63,
    "name": "Nécromancien",
    "capital": "Forteresse",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [
      "quand-blesse"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Nécrotique",
    "power": 46,
    "popularity": 67,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Nécromancien 1.png",
    "quote": "« Lever l'armée des morts ne demande pas de pitié, seulement de la volonté. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 64,
    "name": "Wendigo",
    "capital": "Hameau",
    "size": "2,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "aberration",
      "éthéré"
    ],
    "origin": "Nécrotique",
    "power": 45,
    "popularity": 65,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Wendigo 1.png",
    "quote": "« La faim des glaces éternelles incrustée dans une bête décharnée. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 65,
    "name": "Poltergeist",
    "capital": "Nécropole",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "furie"
    ],
    "natures": [
      "éthéré",
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 18,
    "popularity": 63,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Poltergeist 1.png",
    "quote": "« Les objets se meuvent seuls quand la haine survit au corps. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 66,
    "name": "Banshee",
    "capital": "Nécropole",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol-de-vie"
    ],
    "natures": [
      "mort-vivant",
      "éthéré"
    ],
    "origin": "Nécrotique",
    "power": 42,
    "popularity": 61,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Banshee 1.png",
    "quote": "« Un cri qui déchire le voile entre la vie et le trépas. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 67,
    "name": "Chevalier de la mort",
    "capital": "Nécropole",
    "size": "1,9",
    "roles": [
      "normal"
    ],
    "abilities": [
      "dernier-souffle"
    ],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 76,
    "popularity": 61,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Chevalier de la mort 1.png",
    "quote": "« L'acier noir est scellé par une promesse d'outre-tombe. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 68,
    "name": "Goule",
    "capital": "Terrier",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Infernal",
    "power": 18,
    "popularity": 60,
    "cost": 2,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Goule 1.png",
    "quote": "« Une faim d'entrailles couve sous la terre fraîche. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 69,
    "name": "Spectre",
    "capital": "Nécropole",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "mort-vivant",
      "éthéré"
    ],
    "origin": "Nécrotique",
    "power": 19,
    "popularity": 60,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Spectre 1.png",
    "quote": "« Ni tout à fait présent, ni tout à fait disparu, le spectre hante la lumière. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 70,
    "name": "Revenant",
    "capital": "Nécropole",
    "size": "1,8",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 32,
    "popularity": 56,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Revenant 1.png",
    "quote": "« La rancœur est une lame qui ne se rouille jamais. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 71,
    "name": "Wraith",
    "capital": "Nécropole",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "mort-vivant",
      "éthéré"
    ],
    "origin": "Nécrotique",
    "power": 40,
    "popularity": 55,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Wraith 1.png",
    "quote": "« L'ombre portée par la mort s'étend sur ceux qui doutent. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 72,
    "name": "Dullahan",
    "capital": "Nécropole",
    "size": "1,9",
    "roles": [
      "caster"
    ],
    "abilities": [
      "quand-tue"
    ],
    "natures": [
      "mort-vivant",
      "éthéré"
    ],
    "origin": "Nécrotique",
    "power": 42,
    "popularity": 52,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dullahan 1.png",
    "quote": "« Le cavalier sans tête galope vers la fin de vos certitudes. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 73,
    "name": "Dracoliche",
    "capital": "Nécropole",
    "size": "20",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 90,
    "popularity": 48,
    "cost": 8,
    "attack": 5,
    "health": 11,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dracoliche 1.png",
    "quote": "« La mort a des ailes d'os et un souffle de sépulcre. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 74,
    "name": "Nidhogg",
    "capital": "Terrier",
    "size": "30",
    "roles": [
      "tank"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Nécrotique",
    "power": 91,
    "popularity": 48,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "mythique",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Nidhogg 1.png",
    "quote": "« Ronger les racines du monde jusqu'à ce que le ciel s'effondre. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 75,
    "name": "Strigoi",
    "capital": "Nécropole",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol-de-vie"
    ],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 28,
    "popularity": 46,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Strigoi 1.png",
    "quote": "« Un vampire ancien dont l'humanité a quitté le regard depuis des siècles. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 76,
    "name": "Draugr",
    "capital": "Nécropole",
    "size": "2,1",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 31,
    "popularity": 40,
    "cost": 3,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Draugr 1.png",
    "quote": "« La terre humide du cimetière est leur seul lit. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 77,
    "name": "Mort-vivant",
    "capital": "Nécropole",
    "size": "1,75",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 18,
    "popularity": 40,
    "cost": 2,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Mort-vivant 1.png",
    "quote": "« La mort marche d'un pas lent, mais elle ne s'arrête jamais. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 78,
    "name": "Dame Blanche",
    "capital": "Nécropole",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré",
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 24,
    "popularity": 32,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dame Blanche 1.png",
    "quote": "« Une silhouette d'albâtre qui annonce le deuil avant l'heure. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 79,
    "name": "Ombre",
    "capital": "Sylve",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "éthéré",
      "mort-vivant"
    ],
    "origin": "Le Vide",
    "power": 17,
    "popularity": 32,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Ombre 1.png",
    "quote": "« La pénombre elle-même a pris une forme pour étouffer vos pas. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 80,
    "name": "Wight",
    "capital": "Nécropole",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "allie-meurt"
    ],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 32,
    "popularity": 30,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Wight 1.png",
    "quote": "« Un seigneur déchu revêtu d'une armure d'os et de nuit. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 81,
    "name": "Preta",
    "capital": "Nécropole",
    "size": "1,7",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 14,
    "popularity": 26,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Preta 1.png",
    "quote": "« La faim insatiable d'un cadavre qui a oublié son nom. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 82,
    "name": "Sluagh",
    "capital": "Nécropole",
    "size": "1,7",
    "roles": [
      "normal"
    ],
    "abilities": [
      "furie"
    ],
    "natures": [
      "mort-vivant",
      "éthéré"
    ],
    "origin": "Nécrotique",
    "power": 27,
    "popularity": 26,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Sluagh 1.png",
    "quote": "« Le vol silencieux de l'âme errante. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 83,
    "name": "Varcolac",
    "capital": "Empyrée",
    "size": "2",
    "roles": [
      "normal"
    ],
    "abilities": [
      "bouclier-divin"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Nécrotique",
    "power": 38,
    "popularity": 26,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Varcolac 1.png",
    "quote": "« Une bête née de la rage de la terre et des corps abandonnés. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 84,
    "name": "Ghast",
    "capital": "Nécropole",
    "size": "1,8",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol-de-vie"
    ],
    "natures": [
      "mort-vivant"
    ],
    "origin": "Nécrotique",
    "power": 24,
    "popularity": 22,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Ghast 1.png",
    "quote": "« La pourriture fortifiée par une rage aveugle. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 85,
    "name": "Alp",
    "capital": "Bastion",
    "size": "1,4",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Nécrotique",
    "power": 18,
    "popularity": 18,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Alp 1.png",
    "quote": "« L'esprit mauvais qui se glisse dans les cauchemars des vivants. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 86,
    "name": "Strige",
    "capital": "Bastion",
    "size": "0,7",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Nécrotique",
    "power": 14,
    "popularity": 18,
    "cost": 2,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Strige 1.png",
    "quote": "« Un rapace nocturne dont le cri annonce la perte de la raison. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 87,
    "name": "Valravn",
    "capital": "Bastion",
    "size": "1,2",
    "roles": [
      "tank"
    ],
    "abilities": [
      "activer-tank"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Nécrotique",
    "power": 26,
    "popularity": 18,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Valravn 1.png",
    "quote": "« Le corbeau de sang qui guette les batailles perdues. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 88,
    "name": "Ankou",
    "capital": "Forteresse",
    "size": "1,9",
    "roles": [
      "caster"
    ],
    "abilities": [
      "charge"
    ],
    "natures": [
      "mort-vivant",
      "éthéré"
    ],
    "origin": "Nécrotique",
    "power": 52,
    "popularity": 16,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Ankou 1.png",
    "quote": "« La faux ne fait pas de différence entre le saint et le pécheur. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 89,
    "name": "Vétala",
    "capital": "Nécropole",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "mort-vivant",
      "éthéré"
    ],
    "origin": "Nécrotique",
    "power": 32,
    "popularity": 16,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Vétala 1.png",
    "quote": "« Un esprit qui chevauche la dépouille des morts. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 90,
    "name": "Méduse",
    "capital": "Abîme",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 43,
    "popularity": 88,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Méduse 1.png",
    "quote": "« Le venin sous un visage de pierre, le regard qui transforme en statue. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 91,
    "name": "Gorgone",
    "capital": "Forteresse",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "activer-tank"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 45,
    "popularity": 82,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Gorgone 1.png",
    "quote": "« La beauté est une arme, le regard une sentence de pierre. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 92,
    "name": "Assassin",
    "capital": "Abîme",
    "size": "1,7",
    "roles": [
      "normal"
    ],
    "abilities": [
      "camouflage"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Le Vide",
    "power": 38,
    "popularity": 74,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Assassin 1.png",
    "quote": "« Frapper depuis la pénombre, disparaître avant le dernier soupir. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 93,
    "name": "Mothman",
    "capital": "Abîme",
    "size": "2",
    "roles": [
      "normal"
    ],
    "abilities": [
      "affaiblir"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Le Vide",
    "power": 24,
    "popularity": 68,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Mothman 1.png",
    "quote": "« L'envergure du mystère éclipse la lumière des étoiles. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 94,
    "name": "Araignée géante",
    "capital": "Tertre",
    "size": "2,5",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 14,
    "popularity": 66,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "inhabituelle",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Araignée géante 1.png",
    "quote": "« Huit pattes pour tisser la nuit, mille yeux pour surveiller le piège. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 95,
    "name": "Doppelganger",
    "capital": "Citadelle",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 28,
    "popularity": 64,
    "cost": 3,
    "attack": 5,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Doppelganger 1.png",
    "quote": "« Prendre votre visage pour mieux vous prendre votre vie. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 96,
    "name": "Illithid",
    "capital": "Abîme",
    "size": "1,9",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Astral",
    "power": 47,
    "popularity": 62,
    "cost": 5,
    "attack": 2,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Illithid 1.png",
    "quote": "« La pensée est un fouet, la chair un simple véhicule. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 97,
    "name": "Mimique",
    "capital": "Abîme",
    "size": "1,5",
    "roles": [
      "normal"
    ],
    "abilities": [
      "camouflage"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Le Néant",
    "power": 24,
    "popularity": 62,
    "cost": 2,
    "attack": 2,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Mimique 1.png",
    "quote": "« Ce qui ressemble à un trésor cache souvent des dents. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 98,
    "name": "Tyrannoeil",
    "capital": "Abîme",
    "size": "2,5",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "aberration"
    ],
    "origin": "Le Néant",
    "power": 66,
    "popularity": 62,
    "cost": 6,
    "attack": 4,
    "health": 8,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Tyrannoeil 1.png",
    "quote": "« L'œil central annule la magie, les autres vous détruisent. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 99,
    "name": "Basilic",
    "capital": "Abîme",
    "size": "1",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 30,
    "popularity": 56,
    "cost": 3,
    "attack": 1,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Basilic 1.png",
    "quote": "« Un regard suffit à figer le sang dans vos veines. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 100,
    "name": "Dragon d'ombre",
    "capital": "Abîme",
    "size": "18",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Le Néant",
    "power": 84,
    "popularity": 52,
    "cost": 8,
    "attack": 4,
    "health": 11,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dragon d'ombre 1.png",
    "quote": "« L'obscurité a des ailes, et elle crache le néant. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 101,
    "name": "Shoggoth",
    "capital": "Abîme",
    "size": "4,6",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "aberration"
    ],
    "origin": "Le Néant",
    "power": 78,
    "popularity": 52,
    "cost": 7,
    "attack": 4,
    "health": 9,
    "rarity": "mythique",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Shoggoth 1.png",
    "quote": "« La masse informe devore tout ce qu'elle touche. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 102,
    "name": "Drow",
    "capital": "Hameau",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 22,
    "popularity": 45,
    "cost": 3,
    "attack": 2,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Drow 1.png",
    "quote": "« La nuit a ses propres enfants, nés de la haine de la lumière. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 103,
    "name": "Occultiste",
    "capital": "Abîme",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Le Néant",
    "power": 30,
    "popularity": 44,
    "cost": 3,
    "attack": 3,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Occultiste 1.png",
    "quote": "« Le pacte est signé dans le sang, payé dans l'âme. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 104,
    "name": "Svartalf",
    "capital": "Hameau",
    "size": "1,4",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 24,
    "popularity": 40,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Svartalf 1.png",
    "quote": "« L'ombre des forêts oubliées porte le fer des anciens clans. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 105,
    "name": "Umber Hulk",
    "capital": "Abîme",
    "size": "2,5",
    "roles": [
      "tank"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Le Néant",
    "power": 40,
    "popularity": 36,
    "cost": 4,
    "attack": 1,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Umber Hulk 1.png",
    "quote": "« La carapace est épaisse, la fureur sans limite. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 106,
    "name": "Monstre rouilleur",
    "capital": "Abîme",
    "size": "1,5",
    "roles": [
      "tank"
    ],
    "abilities": [
      "affaiblir"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Le Néant",
    "power": 14,
    "popularity": 32,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Monstre rouilleur 1.png",
    "quote": "« La rouille rongera votre épée bien avant que vous ne touchiez la bête. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 107,
    "name": "Cube gélatineux",
    "capital": "Abîme",
    "size": "3",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "aberration"
    ],
    "origin": "Le Néant",
    "power": 17,
    "popularity": 31,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Cube gélatineux 1.png",
    "quote": "« Une masse d'acide translucide qui nettoie les donjons de toute vie. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 108,
    "name": "Arachne",
    "capital": "Abîme",
    "size": "2,2",
    "roles": [
      "normal"
    ],
    "abilities": [
      "camouflage"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 24,
    "popularity": 30,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Arachne 1.png",
    "quote": "« La moitié d'une femme, le reste d'un monstre des profondeurs. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 109,
    "name": "Otyugh",
    "capital": "Abîme",
    "size": "2,4",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "aberration"
    ],
    "origin": "Le Néant",
    "power": 31,
    "popularity": 24,
    "cost": 4,
    "attack": 1,
    "health": 6,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Otyugh 1.png",
    "quote": "« Une gueule entourée de tentacules, un appétit d'immondices. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 110,
    "name": "Gibbering Mouther",
    "capital": "Abîme",
    "size": "2,5",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "aberration"
    ],
    "origin": "Le Vide",
    "power": 30,
    "popularity": 24,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Gibbering Mouther 1.png",
    "quote": "« Le chaos fait chair, hurlant par mille bouches. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 111,
    "name": "Myconide",
    "capital": "Abîme",
    "size": "1,4",
    "roles": [
      "normal"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "végétal"
    ],
    "origin": "Primordial",
    "power": 14,
    "popularity": 22,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Myconide 1.png",
    "quote": "« Le champignon ne dort jamais, il s'étend dans l'ombre. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 112,
    "name": "Péryton",
    "capital": "Abîme",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Abyssal",
    "power": 22,
    "popularity": 22,
    "cost": 2,
    "attack": 1,
    "health": 1,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Péryton 1.png",
    "quote": "« Un rapace démoniaque qui s'abat depuis les cieux obscurs. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 113,
    "name": "Troglodyte",
    "capital": "Abîme",
    "size": "1,7",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 8,
    "popularity": 22,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Troglodyte 1.png",
    "quote": "« ramper dans la fange, oublier la lumière. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 114,
    "name": "Slaad",
    "capital": "Abîme",
    "size": "2",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Le Néant",
    "power": 47,
    "popularity": 20,
    "cost": 5,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Slaad 1.png",
    "quote": "« Le désordre est la seule loi, la métamorphose le seul moyen. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 115,
    "name": "Fauve désagrégateur",
    "capital": "Hameau",
    "size": "2,7",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 34,
    "popularity": 18,
    "cost": 5,
    "attack": 2,
    "health": 7,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Fauve désagrégateur 1.png",
    "quote": "« Deux tentacules pour attraper, six pattes pour déchirer. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 116,
    "name": "Flumph",
    "capital": "Abîme",
    "size": "0,8",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Le Vide",
    "power": 8,
    "popularity": 14,
    "cost": 1,
    "attack": 1,
    "health": 1,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Flumph 1.png",
    "quote": "« Une méduse flottante dont la douceur est un leurre mortel. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 117,
    "name": "Guêteur",
    "capital": "Abîme",
    "size": "18",
    "roles": [
      "normal"
    ],
    "abilities": [
      "gelant"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Le Vide",
    "power": 60,
    "popularity": 14,
    "cost": 6,
    "attack": 4,
    "health": 8,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Guêteur 1.png",
    "quote": "« L'ombre du plafond descend sur ses proies. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 118,
    "name": "Grell",
    "capital": "Abîme",
    "size": "1,5",
    "roles": [
      "caster"
    ],
    "abilities": [
      "dernier-souffle"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Le Vide",
    "power": 34,
    "popularity": 12,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Grell 1.png",
    "quote": "« Des tentacules de cerveau qui dérivent dans l'air nocturne. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 119,
    "name": "Amphisbène",
    "capital": "Abîme",
    "size": "2",
    "roles": [
      "normal"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 15,
    "popularity": 11,
    "cost": 2,
    "attack": 2,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Amphisbène 1.png",
    "quote": "« Deux têtes pour venin, aucun cerveau pour pitié. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 120,
    "name": "Orc",
    "capital": "Bastion",
    "size": "1,9",
    "roles": [
      "normal"
    ],
    "abilities": [
      "etendard"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 13,
    "popularity": 86,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Orc 1.png",
    "quote": "« Le sang et la fureur sont les seuls maîtres du combat. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 121,
    "name": "Minotaure",
    "capital": "Bastion",
    "size": "2,3",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 39,
    "popularity": 82,
    "cost": 5,
    "attack": 2,
    "health": 6,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Minotaure 1.png",
    "quote": "« La corne brise les boucliers, le piétinement efface les traces. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 122,
    "name": "Warg",
    "capital": "Bastion",
    "size": "1,5",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 16,
    "popularity": 70,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Warg 1.png",
    "quote": "« Le loup géant ne chasse pas pour manger, mais pour régner. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 123,
    "name": "Wyverne",
    "capital": "Bastion",
    "size": "6",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 44,
    "popularity": 70,
    "cost": 5,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Wyverne 1.png",
    "quote": "« Une bête ailée qui règne sur les pics arides. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 124,
    "name": "Barbare",
    "capital": "Bastion",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [
      "survie"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Humain",
    "power": 26,
    "popularity": 54,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Barbare 1.png",
    "quote": "« La force brute n'a pas besoin de tactique pour prévaloir. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 125,
    "name": "Béhémoth",
    "capital": "Bastion",
    "size": "25",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 88,
    "popularity": 54,
    "cost": 8,
    "attack": 5,
    "health": 11,
    "rarity": "mythique",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Béhémoth 1.png",
    "quote": "« Un monstre titanesque dont les griffes fendent la terre. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 126,
    "name": "Berserker",
    "capital": "Bastion",
    "size": "1,8",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Humain",
    "power": 30,
    "popularity": 53,
    "cost": 4,
    "attack": 2,
    "health": 7,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Berserker 1.png",
    "quote": "« La rage pure transcende la douleur et la peur. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 127,
    "name": "Chupacabra",
    "capital": "Bastion",
    "size": "1,2",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 10,
    "popularity": 51,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Chupacabra 1.png",
    "quote": "« La légende urbaine qui suce le sang au fond des bois. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 128,
    "name": "Demi-orc",
    "capital": "Bastion",
    "size": "1,85",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 16,
    "popularity": 50,
    "cost": 2,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Demi-orc 1.png",
    "quote": "« L'héritier du sang orc, fort comme la pierre, dur comme le fer. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 129,
    "name": "Drake",
    "capital": "Bastion",
    "size": "4",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 29,
    "popularity": 50,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Drake 1.png",
    "quote": "« Une petite dragonne sans ailes, rapide comme l'éclair. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 130,
    "name": "Tigre-garou",
    "capital": "Bastion",
    "size": "2,1",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 35,
    "popularity": 32,
    "cost": 5,
    "attack": 2,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Tigre-garou 1.png",
    "quote": "« La rayure du tigre masque la férocité du tueur. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 131,
    "name": "Gnoll",
    "capital": "Bastion",
    "size": "2,1",
    "roles": [
      "normal"
    ],
    "abilities": [
      "activer-tank"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Abyssal",
    "power": 15,
    "popularity": 30,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Gnoll 1.png",
    "quote": "« La hyène qui marche comme un homme et rit devant la mort. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 132,
    "name": "Cynocéphale",
    "capital": "Bastion",
    "size": "1,8",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 9,
    "popularity": 15,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Cynocéphale 1.png",
    "quote": "« Un visage de chien sur un corps de guerrier sanguinaire. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 133,
    "name": "Sciapode",
    "capital": "Bastion",
    "size": "1,2",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 8,
    "popularity": 14,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Sciapode 1.png",
    "quote": "« Un seul pied pour bondir, une ombre pour se cacher. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 134,
    "name": "Blemmye",
    "capital": "Bastion",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 8,
    "popularity": 10,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Blemmye 1.png",
    "quote": "« Le monstre sans tête qui porte ses yeux sur le torse. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 135,
    "name": "Arimaspe",
    "capital": "Bastion",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 8,
    "popularity": 8,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Arimaspe 1.png",
    "quote": "« Un seul œil pour fixer la cible, un club pour l'écraser. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 136,
    "name": "Diable",
    "capital": "Empyrée",
    "size": "1,9",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Infernal",
    "power": 48,
    "popularity": 93,
    "cost": 4,
    "attack": 2,
    "health": 7,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Diable 1.png",
    "quote": "« Le feu infernal brûle plus fort dans un cœur trompeur. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 137,
    "name": "Démon",
    "capital": "Pandémonium",
    "size": "2",
    "roles": [
      "caster"
    ],
    "abilities": [
      "brulant"
    ],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Abyssal",
    "power": 48,
    "popularity": 87,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Démon 1.png",
    "quote": "« La fureur des abysses incarnée dans la chair et les cornes. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 138,
    "name": "Cerbère",
    "capital": "Hameau",
    "size": "4",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Nécrotique",
    "power": 66,
    "popularity": 77,
    "cost": 6,
    "attack": 3,
    "health": 8,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Cerbère 1.png",
    "quote": "« Le monstre à trois têtes qui garde la porte des enfers. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 139,
    "name": "Typhon",
    "capital": "Terrier",
    "size": "30",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 94,
    "popularity": 70,
    "cost": 7,
    "attack": 4,
    "health": 9,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Typhon 1.png",
    "quote": "« La tempête faite chair, l'ancien monstre des origines. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 140,
    "name": "Succube",
    "capital": "Pandémonium",
    "size": "1,7",
    "roles": [
      "normal"
    ],
    "abilities": [
      "furie"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Infernal",
    "power": 41,
    "popularity": 68,
    "cost": 3,
    "attack": 1,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Succube 1.png",
    "quote": "« Le désir est un piège dont on ne se réveille pas. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 141,
    "name": "Oni",
    "capital": "Citadelle",
    "size": "2,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol-de-vie"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Infernal",
    "power": 38,
    "popularity": 61,
    "cost": 4,
    "attack": 3,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Vol de vie: se soigne des dégâts infligés.",
    "image": "img/Oni 1.png",
    "quote": "« Le démon rouge de l'Orient, armé de sa masse de fer. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 142,
    "name": "Harpie",
    "capital": "Bastion",
    "size": "1,7",
    "roles": [
      "ranged"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 20,
    "popularity": 60,
    "cost": 3,
    "attack": 1,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Harpie 1.png",
    "quote": "« Un visage de femme sur un corps de rapace affamé. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 143,
    "name": "Manticore",
    "capital": "Forteresse",
    "size": "2",
    "roles": [
      "normal"
    ],
    "abilities": [
      "survie"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 39,
    "popularity": 60,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Manticore 1.png",
    "quote": "« Le corps du lion, l'aile de l'aigle, le dard du scorpion. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 144,
    "name": "Ifrit",
    "capital": "Forteresse",
    "size": "4",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 64,
    "popularity": 58,
    "cost": 6,
    "attack": 4,
    "health": 8,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Ifrit 1.png",
    "quote": "« Un esprit de feu piégé dans une armure de bronze. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 145,
    "name": "Chimère",
    "capital": "Forteresse",
    "size": "4",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 42,
    "popularity": 56,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Chimère 1.png",
    "quote": "« Trois têtes pour cracher le feu, la glace et le poison. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 146,
    "name": "Incube",
    "capital": "Pandémonium",
    "size": "1,8",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Infernal",
    "power": 43,
    "popularity": 45,
    "cost": 4,
    "attack": 1,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Incube 1.png",
    "quote": "« L'homme séduisant dont le baiser vole la vie. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 147,
    "name": "Archidémon",
    "capital": "Pandémonium",
    "size": "4",
    "roles": [
      "tank"
    ],
    "abilities": [
      "contact-mortel"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Abyssal",
    "power": 92,
    "popularity": 44,
    "cost": 8,
    "attack": 5,
    "health": 11,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Archidémon 1.png",
    "quote": "« Le général des armées infernales, la terreur des mortels. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 148,
    "name": "Rakshasa",
    "capital": "Bastion",
    "size": "1,9",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "aberration"
    ],
    "origin": "Infernal",
    "power": 46,
    "popularity": 44,
    "cost": 6,
    "attack": 5,
    "health": 9,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Rakshasa 1.png",
    "quote": "« La tête du tigre, les mains inversées, la magie noire. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 149,
    "name": "Érinye",
    "capital": "Terrier",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Infernal",
    "power": 58,
    "popularity": 44,
    "cost": 5,
    "attack": 2,
    "health": 7,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Érinye 1.png",
    "quote": "« La vengeance a le visage d'une femme aux ailes de chauve-souris. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 150,
    "name": "Diablotin",
    "capital": "Pandémonium",
    "size": "0,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Infernal",
    "power": 13,
    "popularity": 42,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Diablotin 1.png",
    "quote": "« Un petit démon ailé qui murmure des mensonges à l'oreille. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 151,
    "name": "Furie",
    "capital": "Terrier",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Infernal",
    "power": 58,
    "popularity": 42,
    "cost": 4,
    "attack": 2,
    "health": 7,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Furie 1.png",
    "quote": "« La fureur personnifiée sous des traits ailés. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 152,
    "name": "Marilith",
    "capital": "Pandémonium",
    "size": "3",
    "roles": [
      "normal"
    ],
    "abilities": [
      "apres-attaque"
    ],
    "natures": [
      "éthéré",
      "aberration"
    ],
    "origin": "Abyssal",
    "power": 75,
    "popularity": 42,
    "cost": 5,
    "attack": 2,
    "health": 6,
    "rarity": "mythique",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Marilith 1.png",
    "quote": "« Seize bras pour tenir autant de lames sanglantes. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 153,
    "name": "Archidiable",
    "capital": "Pandémonium",
    "size": "3",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Infernal",
    "power": 92,
    "popularity": 40,
    "cost": 7,
    "attack": 5,
    "health": 9,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Archidiable 1.png",
    "quote": "« Le maître du Pandémonium dont le nom fait trembler les rois. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 154,
    "name": "Tieffelin",
    "capital": "Pandémonium",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "furie"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Infernal",
    "power": 24,
    "popularity": 40,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Tieffelin 1.png",
    "quote": "« Le sang des démons coule dans des veines maudites. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 155,
    "name": "Chien de l'enfer",
    "capital": "Pandémonium",
    "size": "1,4",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Infernal",
    "power": 22,
    "popularity": 39,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Chien de l'enfer 1.png",
    "quote": "« La meute de feu qui traque les âmes perdues. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 156,
    "name": "Manananggal",
    "capital": "Pandémonium",
    "size": "1,6",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Infernal",
    "power": 34,
    "popularity": 38,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Manananggal 1.png",
    "quote": "« La femme coupée en deux qui vole dans la nuit. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 157,
    "name": "Lamie",
    "capital": "Pandémonium",
    "size": "2,5",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Infernal",
    "power": 34,
    "popularity": 35,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Lamie 1.png",
    "quote": "« Une créature de séduction et d'illusion sanguinaire. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 158,
    "name": "Cauchemar",
    "capital": "Pandémonium",
    "size": "2",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Infernal",
    "power": 23,
    "popularity": 34,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Cauchemar 1.png",
    "quote": "« Le cheval noir crachant des flammes par les naseaux. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 159,
    "name": "Cacodémon",
    "capital": "Pandémonium",
    "size": "1,5",
    "roles": [
      "caster"
    ],
    "abilities": [
      "brulant"
    ],
    "natures": [
      "éthéré",
      "aberration"
    ],
    "origin": "Abyssal",
    "power": 22,
    "popularity": 33,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Cacodémon 1.png",
    "quote": "« Une sphère flottante dotée d'une gueule béante et d'un œil unique. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 160,
    "name": "Orthros",
    "capital": "Pandémonium",
    "size": "2",
    "roles": [
      "normal"
    ],
    "abilities": [
      "furie"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Infernal",
    "power": 34,
    "popularity": 26,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Orthros 1.png",
    "quote": "« Le chien à deux têtes, gardien des troupeaux du diable. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 161,
    "name": "Démonologue",
    "capital": "Pandémonium",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Infernal",
    "power": 42,
    "popularity": 25,
    "cost": 3,
    "attack": 2,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Démonologue 1.png",
    "quote": "« L'érudit du sang démoniaque et des rites profanes. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 162,
    "name": "Vrock",
    "capital": "Pandémonium",
    "size": "2,4",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Abyssal",
    "power": 44,
    "popularity": 22,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Vrock 1.png",
    "quote": "« Un démon à tête de rapace dont le cri rend fou. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 163,
    "name": "Cambion",
    "capital": "Pandémonium",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Infernal",
    "power": 30,
    "popularity": 21,
    "cost": 2,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Cambion 1.png",
    "quote": "« L'enfant né de l'union d'un démon et d'une mortelle. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 164,
    "name": "Nuckelavee",
    "capital": "Pandémonium",
    "size": "2,4",
    "roles": [
      "caster"
    ],
    "abilities": [
      "apres-attaque"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Abyssal",
    "power": 48,
    "popularity": 20,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Nuckelavee 1.png",
    "quote": "« Le cavalier aquatique qui apporte la peste et la noyade. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 165,
    "name": "Glabrezu",
    "capital": "Pandémonium",
    "size": "5,5",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Abyssal",
    "power": 54,
    "popularity": 16,
    "cost": 5,
    "attack": 2,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Glabrezu 1.png",
    "quote": "« Des pinces gigantesques pour broyer les âmes déchues. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 166,
    "name": "Balor",
    "capital": "Pandémonium",
    "size": "3,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Abyssal",
    "power": 83,
    "popularity": 15,
    "cost": 6,
    "attack": 3,
    "health": 8,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Balor 1.png",
    "quote": "« Le fouet de feu et l'épée d'ombre pour tout consumer. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 167,
    "name": "Lémure",
    "capital": "Pandémonium",
    "size": "1,5",
    "roles": [
      "normal"
    ],
    "abilities": [
      "charge"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Infernal",
    "power": 8,
    "popularity": 15,
    "cost": 1,
    "attack": 1,
    "health": 1,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Lémure 1.png",
    "quote": "« La forme originelle des damnés, une masse de chair souffrante. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 168,
    "name": "Div",
    "capital": "Pandémonium",
    "size": "3",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Infernal",
    "power": 52,
    "popularity": 14,
    "cost": 5,
    "attack": 4,
    "health": 8,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Div 1.png",
    "quote": "« Le géant du désert qui maîtrise la magie du sable. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 169,
    "name": "Chort",
    "capital": "Pandémonium",
    "size": "1,6",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Infernal",
    "power": 20,
    "popularity": 7,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Chort 1.png",
    "quote": "« Le petit démon cornu des légendes slaves. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 170,
    "name": "Golem",
    "capital": "Manufacture",
    "size": "2,5",
    "roles": [
      "tank"
    ],
    "abilities": [
      "brulant"
    ],
    "natures": [
      "méchanique"
    ],
    "origin": "Axiomatique",
    "power": 45,
    "popularity": 75,
    "cost": 4,
    "attack": 1,
    "health": 5,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Golem 1.png",
    "quote": "« Une structure d'acier et de magie qui n'éprouve aucune douleur. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 171,
    "name": "Alchimiste",
    "capital": "Manufacture",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "double-attaque"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 14,
    "popularity": 72,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Alchimiste 1.png",
    "quote": "« L'art de transformer la matière en poison et le savoir en puissance. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 172,
    "name": "Gargouille",
    "capital": "Manufacture",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "méchanique"
    ],
    "origin": "Axiomatique",
    "power": 26,
    "popularity": 70,
    "cost": 3,
    "attack": 1,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Gargouille 1.png",
    "quote": "« La pierre taillée qui veille sur les cathédrales abandonnées. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 173,
    "name": "Gnome",
    "capital": "Manufacture",
    "size": "1",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 13,
    "popularity": 70,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Gnome 1.png",
    "quote": "« La terre a donné naissance à de petits êtres habiles. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 174,
    "name": "Golem de chair",
    "capital": "Manufacture",
    "size": "2,1",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "méchanique"
    ],
    "origin": "Axiomatique",
    "power": 38,
    "popularity": 58,
    "cost": 4,
    "attack": 1,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Golem de chair 1.png",
    "quote": "« Des morceaux de cadavres assemblés et animés par la foudre. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 175,
    "name": "Talos",
    "capital": "Manufacture",
    "size": "2,5",
    "roles": [
      "normal"
    ],
    "abilities": [
      "quand-tue"
    ],
    "natures": [
      "méchanique"
    ],
    "origin": "Axiomatique",
    "power": 70,
    "popularity": 58,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Talos 1.png",
    "quote": "« L'automate d'or qui protège les trésors oubliés. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 176,
    "name": "Gremlin",
    "capital": "Manufacture",
    "size": "0,8",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 12,
    "popularity": 56,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Gremlin 1.png",
    "quote": "« La malice incarnée qui démonte les engins des hommes. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 177,
    "name": "Golem de pierre",
    "capital": "Manufacture",
    "size": "3,5",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "méchanique"
    ],
    "origin": "Axiomatique",
    "power": 57,
    "popularity": 52,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Golem de pierre 1.png",
    "quote": "« La roche massive qui ne recule devant aucun obstacle. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 178,
    "name": "Colosse",
    "capital": "Manufacture",
    "size": "30",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "méchanique"
    ],
    "origin": "Axiomatique",
    "power": 62,
    "popularity": 47,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Colosse 1.png",
    "quote": "« Un géant de bronze d'une hauteur vertigineuse. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 179,
    "name": "Golem de fer",
    "capital": "Manufacture",
    "size": "3,7",
    "roles": [
      "tank"
    ],
    "abilities": [
      "fin-tour-buff"
    ],
    "natures": [
      "méchanique"
    ],
    "origin": "Axiomatique",
    "power": 71,
    "popularity": 46,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Golem de fer 1.png",
    "quote": "« L'acier forgé dans les feux sacrés de la création. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 180,
    "name": "Artificier",
    "capital": "Manufacture",
    "size": "1,7",
    "roles": [
      "ranged"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Axiomatique",
    "power": 16,
    "popularity": 40,
    "cost": 2,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Artificier 1.png",
    "quote": "« Le savoir-faire mécanique mis au service de la guerre. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 181,
    "name": "Automate",
    "capital": "Manufacture",
    "size": "1,9",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "méchanique"
    ],
    "origin": "Axiomatique",
    "power": 16,
    "popularity": 40,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Automate 1.png",
    "quote": "« Une machine sans âme qui exécute son programme jusqu'au bout. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 182,
    "name": "Homoncule",
    "capital": "Manufacture",
    "size": "0,3",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "méchanique"
    ],
    "origin": "Axiomatique",
    "power": 7,
    "popularity": 38,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Homoncule 1.png",
    "quote": "« Une minuscule créature créée pour servir son maître. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 183,
    "name": "Warforged",
    "capital": "Manufacture",
    "size": "1,9",
    "roles": [
      "tank"
    ],
    "abilities": [
      "double-attaque"
    ],
    "natures": [
      "vivant",
      "méchanique"
    ],
    "origin": "Axiomatique",
    "power": 24,
    "popularity": 34,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Warforged 1.png",
    "quote": "« Un corps de métal et de bois guidé par une étincelle de vie. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 184,
    "name": "Svirfneblin",
    "capital": "Manufacture",
    "size": "1",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 12,
    "popularity": 26,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Svirfneblin 1.png",
    "quote": "« Les nains des profondeurs qui façonnent la pierre sombre. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 185,
    "name": "Modron",
    "capital": "Manufacture",
    "size": "1",
    "roles": [
      "normal"
    ],
    "abilities": [
      "fin-tour-buff"
    ],
    "natures": [
      "méchanique"
    ],
    "origin": "Axiomatique",
    "power": 11,
    "popularity": 18,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Modron 1.png",
    "quote": "« Un cube de métal parfaitement ordonné et logique. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 186,
    "name": "Dactyle",
    "capital": "Manufacture",
    "size": "1,6",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Empyréen",
    "power": 32,
    "popularity": 15,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dactyle 1.png",
    "quote": "« Les maîtres de la forge antique aux doigts de fée. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 187,
    "name": "Forgelet",
    "capital": "Manufacture",
    "size": "1,6",
    "roles": [
      "normal"
    ],
    "abilities": [
      "quand-tue"
    ],
    "natures": [
      "méchanique",
      "vivant"
    ],
    "origin": "Axiomatique",
    "power": 25,
    "popularity": 12,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Forgelet 1.png",
    "quote": "« Le petit être de métal né des étincelles de l'enclume. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 188,
    "name": "Cabire",
    "capital": "Manufacture",
    "size": "1,4",
    "roles": [
      "caster"
    ],
    "abilities": [
      "brulant"
    ],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Céleste",
    "power": 38,
    "popularity": 8,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Cabire 1.png",
    "quote": "« Les esprits de la forge qui protègent les secrets du métal. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 189,
    "name": "Gobelin",
    "capital": "Terrier",
    "size": "1,1",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 9,
    "popularity": 74,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Gobelin 1.png",
    "quote": "« La petite peste verte qui attaque en nombre. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 190,
    "name": "Kobold",
    "capital": "Terrier",
    "size": "0,8",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 8,
    "popularity": 55,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Kobold 1.png",
    "quote": "« Le lézard trapu des cavernes, maître des pièges. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 191,
    "name": "Hobgobelin",
    "capital": "Terrier",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 14,
    "popularity": 44,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Hobgobelin 1.png",
    "quote": "« Le soldat discipliné des races gobelines. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 192,
    "name": "Cocatrix",
    "capital": "Terrier",
    "size": "1",
    "roles": [
      "normal"
    ],
    "abilities": [
      "affaiblir"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 22,
    "popularity": 36,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Cocatrix 1.png",
    "quote": "« Le coq à queue de serpent dont le souffle est mortel. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 193,
    "name": "Redcap",
    "capital": "Terrier",
    "size": "1,1",
    "roles": [
      "normal"
    ],
    "abilities": [
      "furie"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 18,
    "popularity": 30,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Redcap 1.png",
    "quote": "« Le bonnet rouge trempé dans le sang de ses victimes. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 194,
    "name": "Homme-rat",
    "capital": "Terrier",
    "size": "1,6",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 14,
    "popularity": 28,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Homme-rat 1.png",
    "quote": "« Le rongeur géant qui apporte la peste et la ruine. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 195,
    "name": "Bulette",
    "capital": "Terrier",
    "size": "3,7",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 30,
    "popularity": 27,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Bulette 1.png",
    "quote": "« Le monstre fouisseur qui surgit sous les pieds. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 196,
    "name": "Gobelours",
    "capital": "Terrier",
    "size": "2,1",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 18,
    "popularity": 26,
    "cost": 2,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Gobelours 1.png",
    "quote": "« Le grand gobelin poilu qui chasse dans les ombres. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 197,
    "name": "Barghest",
    "capital": "Terrier",
    "size": "1,4",
    "roles": [
      "caster"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 28,
    "popularity": 19,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Barghest 1.png",
    "quote": "« Le loup-démon qui hante les cauchemars des voyageurs. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 198,
    "name": "Trow",
    "capital": "Terrier",
    "size": "1,2",
    "roles": [
      "caster"
    ],
    "abilities": [
      "affaiblir"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 18,
    "popularity": 14,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Trow 1.png",
    "quote": "« Le lutin des mines qui fait s'effondrer les galeries. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 199,
    "name": "Dragon",
    "capital": "Empyrée",
    "size": "18",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 74,
    "popularity": 98,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dragon 1.png",
    "quote": "« Le seigneur des écarlates, le roi des écailles. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 200,
    "name": "Phénix",
    "capital": "Empyrée",
    "size": "3",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Empyréen",
    "power": 86,
    "popularity": 88,
    "cost": 7,
    "attack": 4,
    "health": 8,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Phénix 1.png",
    "quote": "« L'oiseau d'immortalité qui renaît de ses propres cendres. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 201,
    "name": "Titan",
    "capital": "Forteresse",
    "size": "8",
    "roles": [
      "tank"
    ],
    "abilities": [
      "quand-blesse"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 88,
    "popularity": 85,
    "cost": 8,
    "attack": 4,
    "health": 10,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Titan 1.png",
    "quote": "« La taille des montagnes, la force des tempêtes. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 202,
    "name": "Sphinx",
    "capital": "Forteresse",
    "size": "5",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Axiomatique",
    "power": 64,
    "popularity": 82,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Sphinx 1.png",
    "quote": "« L'énigme vivante qui devore ceux qui échouent. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 203,
    "name": "Djinn",
    "capital": "Empyrée",
    "size": "2,4",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 55,
    "popularity": 80,
    "cost": 4,
    "attack": 1,
    "health": 5,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Djinn 1.png",
    "quote": "« Le génie de l'air qui commande aux vents. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 204,
    "name": "Dragon rouge",
    "capital": "Pandémonium",
    "size": "20",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 85,
    "popularity": 78,
    "cost": 6,
    "attack": 3,
    "health": 8,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dragon rouge 1.png",
    "quote": "« Le feu rugissant sous des écailles carmin. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 205,
    "name": "Quetzalcoatl",
    "capital": "Terrier",
    "size": "15",
    "roles": [
      "tank"
    ],
    "abilities": [
      "furie"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Empyréen",
    "power": 94,
    "popularity": 74,
    "cost": 8,
    "attack": 4,
    "health": 10,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Quetzalcoatl 1.png",
    "quote": "« Le serpent à plumes sacré qui traverse les cieux. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 206,
    "name": "Dragon d'or",
    "capital": "Citadelle",
    "size": "20",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Céleste",
    "power": 86,
    "popularity": 72,
    "cost": 7,
    "attack": 7,
    "health": 7,
    "rarity": "mythique",
    "spell": "Vol et Tank.",
    "image": "img/Dragon d'or 1.png",
    "quote": "« La noblesse écarlate et le souffle d'or pur. »",
    "costColored": 3,
    "costNeutral": 4
  },
  {
    "id": 207,
    "name": "Dragon bleu",
    "capital": "Empyrée",
    "size": "18",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 76,
    "popularity": 70,
    "cost": 6,
    "attack": 3,
    "health": 8,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dragon bleu 1.png",
    "quote": "« L'éclair qui fend le ciel sous des écailles d'azur. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 208,
    "name": "Dragon d'argent",
    "capital": "Citadelle",
    "size": "19",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Céleste",
    "power": 82,
    "popularity": 64,
    "cost": 6,
    "attack": 6,
    "health": 6,
    "rarity": "mythique",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Dragon d'argent 1.png",
    "quote": "« La brume argentée et le souffle de glace. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 209,
    "name": "Archimage",
    "capital": "Hameau",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 75,
    "popularity": 63,
    "cost": 7,
    "attack": 4,
    "health": 8,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Archimage 1.png",
    "quote": "« Le pouvoir suprême concentré dans un esprit mortel. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 210,
    "name": "Dragon d'airain",
    "capital": "Bastion",
    "size": "16",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 70,
    "popularity": 62,
    "cost": 7,
    "attack": 4,
    "health": 8,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dragon d'airain 1.png",
    "quote": "« L'éclat du laiton et le souffle de feu ardent. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 211,
    "name": "Élémentaire",
    "capital": "Forteresse",
    "size": "3",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 43,
    "popularity": 60,
    "cost": 4,
    "attack": 1,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Elémentaire 1.png",
    "quote": "« La terre, l'air, le feu et l'eau réunis sous une forme éthérée. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 212,
    "name": "Garuda",
    "capital": "Terrier",
    "size": "12",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Céleste",
    "power": 88,
    "popularity": 58,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "mythique",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Garuda 1.png",
    "quote": "« L'oiseau sacré dont le battement d'ailes crée les tempêtes. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 213,
    "name": "Qilin",
    "capital": "Hameau",
    "size": "4",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Céleste",
    "power": 58,
    "popularity": 56,
    "cost": 5,
    "attack": 4,
    "health": 8,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Qilin 1.png",
    "quote": "« La licorne dorée de l'Orient, symbole de pureté. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 214,
    "name": "Dragon de cuivre",
    "capital": "Manufacture",
    "size": "17",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 72,
    "popularity": 55,
    "cost": 7,
    "attack": 4,
    "health": 8,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dragon de cuivre 1.png",
    "quote": "« La patine du cuivre et la force des anciens temps. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 215,
    "name": "Enchanteresse",
    "capital": "Terrier",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 40,
    "popularity": 55,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Enchanteresse 1.png",
    "quote": "« Le charme de la magie au service de la beauté. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 216,
    "name": "Nephilim",
    "capital": "Terrier",
    "size": "3,2",
    "roles": [
      "tank"
    ],
    "abilities": [
      "camouflage"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Empyréen",
    "power": 45,
    "popularity": 54,
    "cost": 4,
    "attack": 1,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Nephilim 1.png",
    "quote": "« Les fils des anges tombés sur terre, géants parmi les hommes. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 217,
    "name": "Oracle",
    "capital": "Hameau",
    "size": "1,7",
    "roles": [
      "ranged"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 20,
    "popularity": 53,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Oracle 1.png",
    "quote": "« Le regard fixé sur les étoiles, la voix lisant l'avenir. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 218,
    "name": "Lamassu",
    "capital": "Terrier",
    "size": "5",
    "roles": [
      "caster"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Céleste",
    "power": 64,
    "popularity": 50,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Lamassu 1.png",
    "quote": "« Le taureau ailé à tête d'homme, protecteur des palais. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 219,
    "name": "Pyromancien",
    "capital": "Forteresse",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [
      "survie"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 36,
    "popularity": 50,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Pyromancien 1.png",
    "quote": "« Maître du feu sacré et des étincelles célestes. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 220,
    "name": "Enchanteur",
    "capital": "Terrier",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 40,
    "popularity": 48,
    "cost": 4,
    "attack": 2,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Enchanteur 1.png",
    "quote": "« Façonner la réalité par la simple volonté de l'esprit. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 221,
    "name": "Sleipnir",
    "capital": "Terrier",
    "size": "2",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 57,
    "popularity": 48,
    "cost": 4,
    "attack": 1,
    "health": 6,
    "rarity": "rare",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Sleipnir 1.png",
    "quote": "« Le destrier à huit pattes d'Odin, plus rapide que le vent. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 222,
    "name": "Norne",
    "capital": "Terrier",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Astral",
    "power": 82,
    "popularity": 46,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Norne 1.png",
    "quote": "« Les trois sœurs qui tissent le fil de votre destinée. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 223,
    "name": "Oiseau-tonnerre",
    "capital": "Sylve",
    "size": "12",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Céleste",
    "power": 72,
    "popularity": 46,
    "cost": 7,
    "attack": 4,
    "health": 8,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Oiseau-tonnerre 1.png",
    "quote": "« L'aigle géant qui maîtrise la foudre et le tonnerre. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 224,
    "name": "Salamandre",
    "capital": "Forteresse",
    "size": "1,5",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 28,
    "popularity": 44,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Salamandre 1.png",
    "quote": "« Le lézard de feu qui vit dans les brasiers. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 225,
    "name": "Ensorceleur",
    "capital": "Manufacture",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 50,
    "popularity": 42,
    "cost": 4,
    "attack": 3,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Ensorceleur 1.png",
    "quote": "« Le pouvoir du sang magique qui coule dans les veines. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 226,
    "name": "Simurgh",
    "capital": "Hameau",
    "size": "8",
    "roles": [
      "normal"
    ],
    "abilities": [
      "soutient"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Céleste",
    "power": 73,
    "popularity": 40,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Simurgh 1.png",
    "quote": "« L'oiseau mythique dont la sagesse guérit les maux. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 227,
    "name": "Asura",
    "capital": "Empyrée",
    "size": "2,5",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Céleste",
    "power": 65,
    "popularity": 38,
    "cost": 5,
    "attack": 2,
    "health": 7,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Asura 1.png",
    "quote": "« Le démon à plusieurs bras de la mythologie védique. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 228,
    "name": "Mage",
    "capital": "Empyrée",
    "size": "1,75",
    "roles": [
      "ranged"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 52,
    "popularity": 38,
    "cost": 4,
    "attack": 2,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Mage 1.png",
    "quote": "« Le maître des éléments et des formules anciennes. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 229,
    "name": "Apsara",
    "capital": "Empyrée",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Céleste",
    "power": 28,
    "popularity": 34,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Apsara 1.png",
    "quote": "« La nymph des eaux célestes, dansant sur les nuages. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 230,
    "name": "Illusionniste",
    "capital": "Empyrée",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [
      "celerite"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 48,
    "popularity": 30,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Illusionniste 1.png",
    "quote": "« Créer des réalités qui n'existent que dans l'esprit des autres. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 231,
    "name": "Péri",
    "capital": "Empyrée",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Céleste",
    "power": 31,
    "popularity": 30,
    "cost": 2,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Péri 1.png",
    "quote": "« L'esprit céleste aux ailes de lumière. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 232,
    "name": "Yaksha",
    "capital": "Empyrée",
    "size": "2",
    "roles": [
      "caster"
    ],
    "abilities": [
      "donner-buff"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Céleste",
    "power": 42,
    "popularity": 30,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Yaksha 1.png",
    "quote": "« Le gardien de la nature aux pouvoirs éthérés. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 233,
    "name": "Chronomancien",
    "capital": "Empyrée",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 62,
    "popularity": 29,
    "cost": 5,
    "attack": 4,
    "health": 8,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Chronomancien 1.png",
    "quote": "« Le maître du temps qui manipule le passé et l'avenir. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 234,
    "name": "Anzu",
    "capital": "Hameau",
    "size": "8",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 83,
    "popularity": 28,
    "cost": 8,
    "attack": 4,
    "health": 11,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Anzu 1.png",
    "quote": "« L'oiseau-tempête de la mythologie mésopotamienne. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 235,
    "name": "Invocateur",
    "capital": "Empyrée",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 55,
    "popularity": 28,
    "cost": 5,
    "attack": 4,
    "health": 8,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Invocateur 1.png",
    "quote": "« L'art de faire apparaître des créatures d'un autre monde. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 236,
    "name": "Mushussu",
    "capital": "Empyrée",
    "size": "4",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Céleste",
    "power": 47,
    "popularity": 28,
    "cost": 3,
    "attack": 1,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Mushussu 1.png",
    "quote": "« Le dragon-lion de Babylone, gardien des portes. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 237,
    "name": "Volva",
    "capital": "Empyrée",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 34,
    "popularity": 28,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Volva 1.png",
    "quote": "« La prophétesse du nord qui lit dans les runes. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 238,
    "name": "Cryomancien",
    "capital": "Forteresse",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 36,
    "popularity": 25,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Cryomancien 1.png",
    "quote": "« La magie du froid absolu concentrée dans une incantation. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 239,
    "name": "Jann",
    "capital": "Forteresse",
    "size": "1,9",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 39,
    "popularity": 25,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Jann 1.png",
    "quote": "« Le génie du désert né du feu sans fumée. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 240,
    "name": "Sylphe",
    "capital": "Forteresse",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 25,
    "popularity": 25,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Sylphe 1.png",
    "quote": "« L'esprit du vent, léger comme un souffle d'air. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 241,
    "name": "Genasi",
    "capital": "Forteresse",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 22,
    "popularity": 24,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Genasi 1.png",
    "quote": "« L'héritier des génies, portant l'élément dans son sang. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 242,
    "name": "Githyanki",
    "capital": "Empyrée",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Astral",
    "power": 30,
    "popularity": 24,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Githyanki 1.png",
    "quote": "« Le guerrier psionique de l'espace astral. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 243,
    "name": "Aarakocra",
    "capital": "Empyrée",
    "size": "1,5",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 12,
    "popularity": 22,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Aarakocra 1.png",
    "quote": "« L'homme-oiseau des cieux, ennemi des serpents. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 244,
    "name": "Ziz",
    "capital": "Empyrée",
    "size": "100",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Céleste",
    "power": 96,
    "popularity": 22,
    "cost": 8,
    "attack": 5,
    "health": 11,
    "rarity": "mythique",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Ziz 1.png",
    "quote": "« L'oiseau géant dont l'ombre peut couvrir une ville. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 245,
    "name": "Githzerai",
    "capital": "Empyrée",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Astral",
    "power": 28,
    "popularity": 20,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Githzerai 1.png",
    "quote": "« Le moine psionique en quête d'illumination. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 246,
    "name": "Augure",
    "capital": "Empyrée",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "gelant"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Céleste",
    "power": 6,
    "popularity": 13,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Augure 1.png",
    "quote": "« Lire les présages dans le vol des oiseaux et le chant des vents. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 247,
    "name": "Thaumaturge",
    "capital": "Empyrée",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 36,
    "popularity": 10,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Thaumaturge 1.png",
    "quote": "« Le grand art de transformer les miracles en réalité. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 248,
    "name": "Troll",
    "capital": "Tertre",
    "size": "2,7",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 40,
    "popularity": 80,
    "cost": 3,
    "attack": 1,
    "health": 3,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Troll 1.png",
    "quote": "« La régénération infinie couplée à une fureur aveugle. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 249,
    "name": "Géant",
    "capital": "Tertre",
    "size": "8",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 55,
    "popularity": 79,
    "cost": 4,
    "attack": 1,
    "health": 5,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Géant 1.png",
    "quote": "« Le titan de pierre qui soulève des montagnes. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 250,
    "name": "Yéti",
    "capital": "Tertre",
    "size": "2,2",
    "roles": [
      "normal"
    ],
    "abilities": [
      "quand-blesse"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 35,
    "popularity": 78,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Yéti 1.png",
    "quote": "« L'homme des neiges redoutable qui traque dans la brume. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 251,
    "name": "Ogre",
    "capital": "Tertre",
    "size": "2,8",
    "roles": [
      "tank"
    ],
    "abilities": [
      "pietinement"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 20,
    "popularity": 77,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Ogre 1.png",
    "quote": "« La bête poilue des forêts, idiote mais destructrice. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 252,
    "name": "Cyclope",
    "capital": "Tertre",
    "size": "4,5",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 34,
    "popularity": 71,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Cyclope 1.png",
    "quote": "« Le géant à un œil, forgeron de la foudre. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 253,
    "name": "Fenrir",
    "capital": "Tertre",
    "size": "15",
    "roles": [
      "normal"
    ],
    "abilities": [
      "survie"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 92,
    "popularity": 70,
    "cost": 6,
    "attack": 4,
    "health": 8,
    "rarity": "mythique",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Fenrir 1.png",
    "quote": "« Le loup monstrueux qui dévorera le soleil au Ragnarök. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 254,
    "name": "Sasquatch",
    "capital": "Tertre",
    "size": "2,4",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 18,
    "popularity": 70,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Sasquatch 1.png",
    "quote": "« L'homme-singe des forêts oubliées. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 255,
    "name": "Wyrm",
    "capital": "Tertre",
    "size": "12",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 70,
    "popularity": 58,
    "cost": 6,
    "attack": 3,
    "health": 8,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Wyrm 1.png",
    "quote": "« Le grand serpent sans pattes des contes anciens. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 256,
    "name": "Grendel",
    "capital": "Tertre",
    "size": "3,5",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 50,
    "popularity": 54,
    "cost": 4,
    "attack": 2,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Grendel 1.png",
    "quote": "« La bête d'un autre monde qui terrorisait les héros. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 257,
    "name": "Jotunn",
    "capital": "Tertre",
    "size": "6",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 64,
    "popularity": 50,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Jotunn 1.png",
    "quote": "« Le géant du givre, ennemi des dieux du Nord. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 258,
    "name": "Yuki-onna",
    "capital": "Tertre",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 38,
    "popularity": 50,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Yuki-onna 1.png",
    "quote": "« La femme des neiges au regard qui glace le cœur. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 259,
    "name": "Roc",
    "capital": "Tertre",
    "size": "25",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 69,
    "popularity": 46,
    "cost": 5,
    "attack": 2,
    "health": 6,
    "rarity": "rare",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Roc 1.png",
    "quote": "« L'oiseau géant qui emporte les éléphants dans ses serres. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 260,
    "name": "Lindworm",
    "capital": "Tertre",
    "size": "8",
    "roles": [
      "normal"
    ],
    "abilities": [
      "activer-tank"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 47,
    "popularity": 45,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Lindworm 1.png",
    "quote": "« Le serpent à deux pattes des légendes nordiques. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 261,
    "name": "Tarasque",
    "capital": "Tertre",
    "size": "7",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 92,
    "popularity": 45,
    "cost": 7,
    "attack": 5,
    "health": 9,
    "rarity": "mythique",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Tarasque 1.png",
    "quote": "« Le monstre ultime, la terreur invincible de la terre. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 262,
    "name": "Zmey",
    "capital": "Tertre",
    "size": "15",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 65,
    "popularity": 42,
    "cost": 5,
    "attack": 2,
    "health": 7,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Zmey 1.png",
    "quote": "« Le dragon à trois têtes des légendes slaves. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 263,
    "name": "Géant des glaces",
    "capital": "Tertre",
    "size": "6,5",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 58,
    "popularity": 28,
    "cost": 4,
    "attack": 1,
    "health": 5,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Géant des glaces 1.png",
    "quote": "« Le colosse des glaces taillé dans la banquise. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 264,
    "name": "Oréade",
    "capital": "Tertre",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 24,
    "popularity": 28,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Oréade 1.png",
    "quote": "« La nymph des montagnes à la voix de brise. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 265,
    "name": "Fomorien",
    "capital": "Tertre",
    "size": "4,2",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 46,
    "popularity": 26,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Fomorien 1.png",
    "quote": "« Le géant contrefait des profondeurs de la terre. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 266,
    "name": "Ettin",
    "capital": "Tertre",
    "size": "4",
    "roles": [
      "normal"
    ],
    "abilities": [
      "activer-tank"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 40,
    "popularity": 24,
    "cost": 3,
    "attack": 1,
    "health": 3,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Ettin 1.png",
    "quote": "« Le géant à deux têtes qui se dispute tout le temps. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 267,
    "name": "Goliath",
    "capital": "Tertre",
    "size": "2,2",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 19,
    "popularity": 24,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Goliath 1.png",
    "quote": "« Le colosse des montagnes, fier et solitaire. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 268,
    "name": "Hécatonchire",
    "capital": "Tertre",
    "size": "25",
    "roles": [
      "tank"
    ],
    "abilities": [
      "quand-blesse"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 94,
    "popularity": 18,
    "cost": 8,
    "attack": 5,
    "health": 11,
    "rarity": "mythique",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Hécatonchire 1.png",
    "quote": "« Le monstre aux cent bras qui lançait des rochers géants. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 269,
    "name": "Amarok",
    "capital": "Tertre",
    "size": "3",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 30,
    "popularity": 16,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Amarok 1.png",
    "quote": "« Le grand loup solitaire de l'Arctique. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 270,
    "name": "Barbegazi",
    "capital": "Tertre",
    "size": "1,2",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 5,
    "popularity": 5,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Barbegazi 1.png",
    "quote": "« Le petit être à barbe glacée qui vit dans la neige. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 271,
    "name": "Sorcière",
    "capital": "Hameau",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 28,
    "popularity": 90,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Sorcière 1.png",
    "quote": "« La vieille sorcière des bois, maîtresse des chaudrons. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 272,
    "name": "Loup-garou",
    "capital": "Forteresse",
    "size": "2,1",
    "roles": [
      "normal"
    ],
    "abilities": [
      "survie"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 34,
    "popularity": 88,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Loup-garou 1.png",
    "quote": "« La bête humaine qui se transforme sous la pleine lune. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 273,
    "name": "Fée",
    "capital": "Terrier",
    "size": "0,3",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 18,
    "popularity": 83,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Fée 1.png",
    "quote": "« La petite fée de la forêt, légère comme un papillon. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 274,
    "name": "Leprechaun",
    "capital": "Bastion",
    "size": "0,6",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 18,
    "popularity": 78,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Leprechaun 1.png",
    "quote": "« Le farceur irlandais qui cache son pot d'or. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 275,
    "name": "Sorcier",
    "capital": "Forteresse",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [
      "bouclier-divin"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 28,
    "popularity": 76,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Sorcier 1.png",
    "quote": "« Le maître de la magie des forêts et des esprits. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 276,
    "name": "Baba Yaga",
    "capital": "Manufacture",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "fin-tour-buff"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 72,
    "popularity": 74,
    "cost": 8,
    "attack": 5,
    "health": 11,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Baba Yaga 1.png",
    "quote": "« La sorcière qui vit dans une cabane montée sur des pattes de poulet. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 277,
    "name": "Kitsune",
    "capital": "Manufacture",
    "size": "1,65",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 34,
    "popularity": 74,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Kitsune 1.png",
    "quote": "« Le renard à neuf queues, maître de la métamorphose. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 278,
    "name": "Lycanthrope",
    "capital": "Manufacture",
    "size": "2",
    "roles": [
      "normal"
    ],
    "abilities": [
      "quand-tue"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 34,
    "popularity": 68,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Lycanthrope 1.png",
    "quote": "« L'homme qui partage le sang de la bête. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 279,
    "name": "Mandragore",
    "capital": "Bosquet",
    "size": "0,5",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "végétal"
    ],
    "origin": "Féérique",
    "power": 18,
    "popularity": 58,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Mandragore 1.png",
    "quote": "« La racine hurlante qui donne la folie ou la mort. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 280,
    "name": "Tanuki",
    "capital": "Hameau",
    "size": "0,6",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 30,
    "popularity": 58,
    "cost": 4,
    "attack": 2,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Tanuki 1.png",
    "quote": "« Le chien-râteau farceur du folklore japonais. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 281,
    "name": "Pixie",
    "capital": "Forteresse",
    "size": "0,25",
    "roles": [
      "caster"
    ],
    "abilities": [
      "pietinement"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 11,
    "popularity": 52,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Pixie 1.png",
    "quote": "« La petite fée ailée qui protège les fleurs. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 282,
    "name": "Yokai",
    "capital": "Bastion",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 30,
    "popularity": 52,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Yokai 1.png",
    "quote": "« L'esprit japonais qui hante les vieux lieux. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 283,
    "name": "Nekomata",
    "capital": "Bosquet",
    "size": "0,6",
    "roles": [
      "caster"
    ],
    "abilities": [
      "soutient-2"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 19,
    "popularity": 50,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Nekomata 1.png",
    "quote": "« Le chat à deux queues qui manipule les morts. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 284,
    "name": "Jabberwock",
    "capital": "Bosquet",
    "size": "5",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Féérique",
    "power": 58,
    "popularity": 48,
    "cost": 8,
    "attack": 4,
    "health": 10,
    "rarity": "rare",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Jabberwock 1.png",
    "quote": "« Le monstre aux dents de sabre de l'autre côté du miroir. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 285,
    "name": "Tengu",
    "capital": "Bosquet",
    "size": "1,8",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 38,
    "popularity": 48,
    "cost": 6,
    "attack": 4,
    "health": 8,
    "rarity": "inhabituelle",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Tengu 1.png",
    "quote": "« L'homme-oiseau des montagnes sacrées. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 286,
    "name": "Baku",
    "capital": "Bosquet",
    "size": "2",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 24,
    "popularity": 46,
    "cost": 4,
    "attack": 2,
    "health": 7,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Baku 1.png",
    "quote": "« Le tapir magique qui devore les cauchemars. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 287,
    "name": "Changeling",
    "capital": "Bosquet",
    "size": "1,2",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 10,
    "popularity": 46,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Changeling 1.png",
    "quote": "« L'enfant fée échangé à la naissance. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 288,
    "name": "Sprite",
    "capital": "Bosquet",
    "size": "0,2",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 10,
    "popularity": 46,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Sprite 1.png",
    "quote": "« La petite créature ailée de la forêt. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 289,
    "name": "Chaman",
    "capital": "Forteresse",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Astral",
    "power": 22,
    "popularity": 41,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Chaman 1.png",
    "quote": "« Le guide spirituel des tribus, connecté aux ancêtres. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 290,
    "name": "Rokurokubi",
    "capital": "Bosquet",
    "size": "1,7",
    "roles": [
      "tank"
    ],
    "abilities": [
      "soutient"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Féérique",
    "power": 17,
    "popularity": 40,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Rokurokubi 1.png",
    "quote": "« La femme au cou extensible du folklore japonais. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 291,
    "name": "Nymphe",
    "capital": "Bosquet",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "soutient-2"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 23,
    "popularity": 38,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Nymphe 1.png",
    "quote": "« La nymph des bois d'une beauté mortelle. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 292,
    "name": "Guenaude",
    "capital": "Bosquet",
    "size": "1,7",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 40,
    "popularity": 36,
    "cost": 7,
    "attack": 4,
    "health": 8,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Guenaude 1.png",
    "quote": "« La vieille femme laide des contes qui devore les enfants. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 293,
    "name": "Pooka",
    "capital": "Bosquet",
    "size": "1,6",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 21,
    "popularity": 36,
    "cost": 3,
    "attack": 2,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Pooka 1.png",
    "quote": "« Le lutin noir qui monte les chevaux la nuit. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 294,
    "name": "Sidhe",
    "capital": "Bosquet",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 39,
    "popularity": 36,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Sidhe 1.png",
    "quote": "« Le noble peuple fée des collines d'Irlande. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 295,
    "name": "Lutin",
    "capital": "Bosquet",
    "size": "0,5",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 14,
    "popularity": 35,
    "cost": 2,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Lutin 1.png",
    "quote": "« Le petit être espiègle qui cache les objets. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 296,
    "name": "Spriggan",
    "capital": "Bosquet",
    "size": "0,9",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 20,
    "popularity": 34,
    "cost": 3,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Spriggan 1.png",
    "quote": "« L'esprit du bois qui fait pousser la végétation. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 297,
    "name": "Fée-dragon",
    "capital": "Bosquet",
    "size": "0,6",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 24,
    "popularity": 32,
    "cost": 4,
    "attack": 1,
    "health": 6,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Fée-dragon 1.png",
    "quote": "« Le petit dragon des fées aux ailes d'insecte. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 298,
    "name": "Huldra",
    "capital": "Bosquet",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 22,
    "popularity": 30,
    "cost": 4,
    "attack": 2,
    "health": 7,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Huldra 1.png",
    "quote": "« La belle femme des forêts au dos creux comme un tronc d'arbre. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 299,
    "name": "Mara",
    "capital": "Bosquet",
    "size": "1,6",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 29,
    "popularity": 30,
    "cost": 5,
    "attack": 4,
    "health": 8,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Mara 1.png",
    "quote": "« L'esprit de la nuit qui apporte les cauchemars. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 300,
    "name": "Korrigan",
    "capital": "Bosquet",
    "size": "0,6",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 18,
    "popularity": 28,
    "cost": 2,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Korrigan 1.png",
    "quote": "« Le petit lutin breton qui danse dans les menhirs. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 301,
    "name": "Bête du Gévaudan",
    "capital": "Terrier",
    "size": "1,2",
    "roles": [
      "normal"
    ],
    "abilities": [
      "camouflage"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 18,
    "popularity": 24,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Bête du Gévaudan 1.png",
    "quote": "« La bête sauvage qui a terrorisé les vallées de France. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 302,
    "name": "Tabaxi",
    "capital": "Bosquet",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 20,
    "popularity": 24,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Tabaxi 1.png",
    "quote": "« L'homme-chat agile et curieux des contrées lointaines. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 303,
    "name": "Farfadet",
    "capital": "Bosquet",
    "size": "0,8",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 10,
    "popularity": 20,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Farfadet 1.png",
    "quote": "« Le petit farceur des bois qui joue des tours aux voyageurs. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 304,
    "name": "Vila",
    "capital": "Bosquet",
    "size": "1,7",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 35,
    "popularity": 20,
    "cost": 5,
    "attack": 2,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Vila 1.png",
    "quote": "« L'esprit de la brume qui danse sur les lacs. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 305,
    "name": "Croquemitaine",
    "capital": "Bosquet",
    "size": "2",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 16,
    "popularity": 17,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Croquemitaine 1.png",
    "quote": "« Le monstre sous le lit qui effraie les petits enfants. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 306,
    "name": "Cu-sith",
    "capital": "Bosquet",
    "size": "2,2",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 25,
    "popularity": 9,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Cu-sith 1.png",
    "quote": "« Le chien vert des fées dont le jappement annonce la mort. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 307,
    "name": "Bucca",
    "capital": "Bosquet",
    "size": "1,5",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 12,
    "popularity": 4,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Bucca 1.png",
    "quote": "« Le lutin de la mine qui aide ou nuit aux mineurs. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 308,
    "name": "Kraken",
    "capital": "Cénote",
    "size": "30",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol-de-vie"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Abyssal",
    "power": 82,
    "popularity": 85,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "mythique",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Kraken 1.png",
    "quote": "« Le monstre tentaculaire des abysses qui coule les navires. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 309,
    "name": "Léviathan",
    "capital": "Cénote",
    "size": "100",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 93,
    "popularity": 80,
    "cost": 7,
    "attack": 5,
    "health": 9,
    "rarity": "mythique",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Léviathan 1.png",
    "quote": "« La créature colossale qui entoure les océans du monde. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 310,
    "name": "Hydre",
    "capital": "Bastion",
    "size": "12",
    "roles": [
      "normal"
    ],
    "abilities": [
      "bouclier-divin"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 51,
    "popularity": 78,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Hydre 1.png",
    "quote": "« Le serpent d'eau à plusieurs têtes qui repoussent quand on les coupe. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 311,
    "name": "Jormungandr",
    "capital": "Cénote",
    "size": "40000000",
    "roles": [
      "tank"
    ],
    "abilities": [
      "affaiblir"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 98,
    "popularity": 76,
    "cost": 8,
    "attack": 4,
    "health": 10,
    "rarity": "mythique",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Jormungandr 1.png",
    "quote": "« Le serpent monde qui entoure la terre de ses anneaux. »",
    "costColored": 3,
    "costNeutral": 5
  },
  {
    "id": 312,
    "name": "Kappa",
    "capital": "Sylve",
    "size": "1,2",
    "roles": [
      "normal"
    ],
    "abilities": [
      "poison"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Féérique",
    "power": 24,
    "popularity": 72,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "inhabituelle",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Kappa 1.png",
    "quote": "« Le démon des rivières japonais à la tête creusée d'eau. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 313,
    "name": "Dragon noir",
    "capital": "Nécropole",
    "size": "17",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 72,
    "popularity": 70,
    "cost": 6,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Vol: ignore le premier bloqueur adverse.",
    "image": "img/Dragon noir 1.png",
    "quote": "« L'ombre des profondeurs aux écailles d'ébène. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 314,
    "name": "Sirène",
    "capital": "Cénote",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Abyssal",
    "power": 26,
    "popularity": 67,
    "cost": 3,
    "attack": 2,
    "health": 5,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Sirène 1.png",
    "quote": "« Le chant mortel qui attire les marins sur les récifs. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 315,
    "name": "Dragon marin",
    "capital": "Cénote",
    "size": "22",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 78,
    "popularity": 66,
    "cost": 5,
    "attack": 2,
    "health": 6,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dragon marin 1.png",
    "quote": "« Le serpent des mers ailé qui commande aux tempêtes. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 316,
    "name": "Dragon de bronze",
    "capital": "Forteresse",
    "size": "18",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 76,
    "popularity": 60,
    "cost": 7,
    "attack": 5,
    "health": 9,
    "rarity": "mythique",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Dragon de bronze 1.png",
    "quote": "« Les écailles d'étain et le souffle d'acide pur. »",
    "costColored": 2,
    "costNeutral": 5
  },
  {
    "id": 317,
    "name": "Kelpie",
    "capital": "Hameau",
    "size": "1,7",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 29,
    "popularity": 58,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Kelpie 1.png",
    "quote": "« L'esprit du cheval d'eau qui noie ses cavaliers. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 318,
    "name": "Naga",
    "capital": "Manufacture",
    "size": "4,5",
    "roles": [
      "caster"
    ],
    "abilities": [
      "brulant"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Céleste",
    "power": 52,
    "popularity": 56,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Naga 1.png",
    "quote": "« Le serpent sacré à tête humaine des eaux claires. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 319,
    "name": "Scylla",
    "capital": "Cénote",
    "size": "12",
    "roles": [
      "normal"
    ],
    "abilities": [
      "gelant"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Abyssal",
    "power": 68,
    "popularity": 54,
    "cost": 5,
    "attack": 2,
    "health": 6,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Scylla 1.png",
    "quote": "« Le monstre des écueils aux six têtes et douze pieds. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 320,
    "name": "Rusalka",
    "capital": "Hameau",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "mort-vivant",
      "éthéré"
    ],
    "origin": "Nécrotique",
    "power": 22,
    "popularity": 46,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Rusalka 1.png",
    "quote": "« La noyée dont le spectre hante les berges des rivières. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 321,
    "name": "Mélusine",
    "capital": "Hameau",
    "size": "1,75",
    "roles": [
      "caster"
    ],
    "abilities": [
      "soutient"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Féérique",
    "power": 32,
    "popularity": 44,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Mélusine 1.png",
    "quote": "« La fée des eaux à la queue de serpent. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 322,
    "name": "Selkie",
    "capital": "Sylve",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "soutient"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 16,
    "popularity": 44,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Selkie 1.png",
    "quote": "« L'être des phoques qui retire sa peau pour devenir humain. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 323,
    "name": "Triton",
    "capital": "Cénote",
    "size": "1,8",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol-de-vie"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 28,
    "popularity": 44,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Triton 1.png",
    "quote": "« Le descendant des mers, maître des tridents et des vagues. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 324,
    "name": "Yuan-ti",
    "capital": "Cénote",
    "size": "2,4",
    "roles": [
      "caster"
    ],
    "abilities": [
      "camouflage"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Primordial",
    "power": 47,
    "popularity": 38,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Yuan-ti 1.png",
    "quote": "« L'homme-serpent des cités englouties. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 325,
    "name": "Homme-lézard",
    "capital": "Cénote",
    "size": "2",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 16,
    "popularity": 36,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Homme-lézard 1.png",
    "quote": "« Le guerrier des marais aux écailles vertes. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 326,
    "name": "Naiade",
    "capital": "Cénote",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 24,
    "popularity": 36,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Naiade 1.png",
    "quote": "« La nymph des fontaines et des ruisseaux d'eau douce. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 327,
    "name": "Ondine",
    "capital": "Cénote",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 21,
    "popularity": 36,
    "cost": 2,
    "attack": 1,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Ondine 1.png",
    "quote": "« L'esprit de l'eau claire et transparente. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 328,
    "name": "Hippocampe",
    "capital": "Cénote",
    "size": "3,5",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Elémentaire",
    "power": 24,
    "popularity": 35,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Hippocampe 1.png",
    "quote": "« Le destrier des mers aux sabots d'écume. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 329,
    "name": "Néréide",
    "capital": "Cénote",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol-de-vie"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 27,
    "popularity": 34,
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Néréide 1.png",
    "quote": "« La nymph des mers qui protège les marins. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 330,
    "name": "Marid",
    "capital": "Cénote",
    "size": "4",
    "roles": [
      "caster"
    ],
    "abilities": [
      "camouflage"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 69,
    "popularity": 32,
    "cost": 5,
    "attack": 3,
    "health": 7,
    "rarity": "rare",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Marid 1.png",
    "quote": "« Le génie des eaux, noble et puissant comme l'océan. »",
    "costColored": 1,
    "costNeutral": 4
  },
  {
    "id": 331,
    "name": "Grindylow",
    "capital": "Sylve",
    "size": "1,2",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Féérique",
    "power": 13,
    "popularity": 30,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Grindylow 1.png",
    "quote": "« Le monstre aquatique des légendes britanniques. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 332,
    "name": "Nixe",
    "capital": "Cénote",
    "size": "1,7",
    "roles": [
      "caster"
    ],
    "abilities": [
      "affaiblir"
    ],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 22,
    "popularity": 30,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Nixe 1.png",
    "quote": "« La fée des eaux douces qui attire les nageurs. »",
    "costColored": 1,
    "costNeutral": 1
  },
  {
    "id": 333,
    "name": "Sahuagin",
    "capital": "Cénote",
    "size": "1,8",
    "roles": [
      "normal"
    ],
    "abilities": [
      "pietinement"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 11,
    "popularity": 28,
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "commune",
    "spell": "Tir: attaque sans subir de riposte une fois.",
    "image": "img/Sahuagin 1.png",
    "quote": "« Le guerrier des profondeurs à tête de poisson. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 334,
    "name": "Vodyanoi",
    "capital": "Cénote",
    "size": "1,6",
    "roles": [
      "caster"
    ],
    "abilities": [],
    "natures": [
      "éthéré"
    ],
    "origin": "Elémentaire",
    "power": 28,
    "popularity": 28,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Vodyanoi 1.png",
    "quote": "« L'esprit des eaux qui fait couler les bateaux. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 335,
    "name": "Kuo-toa",
    "capital": "Cénote",
    "size": "1,5",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Abyssal",
    "power": 11,
    "popularity": 22,
    "cost": 1,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Charge: +1 attaque au tour d’invocation.",
    "image": "img/Kuo-toa 1.png",
    "quote": "« Le peuple poisson qui vénère les dieux très anciens. »",
    "costColored": 1,
    "costNeutral": 0
  },
  {
    "id": 336,
    "name": "Aspidochelone",
    "capital": "Cénote",
    "size": "300",
    "roles": [
      "normal"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 84,
    "popularity": 20,
    "cost": 6,
    "attack": 3,
    "health": 8,
    "rarity": "mythique",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Aspidochelone 1.png",
    "quote": "« La tortue géante si grande qu'on la prend pour une île. »",
    "costColored": 2,
    "costNeutral": 4
  },
  {
    "id": 337,
    "name": "Lusca",
    "capital": "Cénote",
    "size": "23",
    "roles": [
      "tank"
    ],
    "abilities": [
      "camouflage"
    ],
    "natures": [
      "vivant",
      "aberration"
    ],
    "origin": "Abyssal",
    "power": 64,
    "popularity": 20,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "rare",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Lusca 1.png",
    "quote": "« Le poulpe géant à tête de requin des Bahamas. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 338,
    "name": "Peluda",
    "capital": "Cénote",
    "size": "2,2",
    "roles": [
      "tank"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 39,
    "popularity": 16,
    "cost": 4,
    "attack": 1,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Peluda 1.png",
    "quote": "« Le serpent de mer velu qui crache du feu et de l'acide. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 339,
    "name": "Aboleth",
    "capital": "Cénote",
    "size": "6",
    "roles": [
      "caster"
    ],
    "abilities": [
      "vol"
    ],
    "natures": [
      "aberration"
    ],
    "origin": "Le Néant",
    "power": 52,
    "popularity": 14,
    "cost": 4,
    "attack": 2,
    "health": 6,
    "rarity": "inhabituelle",
    "spell": "Déclenchement: inflige 2 dégâts à une cible aléatoire.",
    "image": "img/Aboleth 1.png",
    "quote": "« Le maître télépathique des cités englouties depuis des eons. »",
    "costColored": 1,
    "costNeutral": 3
  },
  {
    "id": 340,
    "name": "Catoblépas",
    "capital": "Cénote",
    "size": "2,5",
    "roles": [
      "normal"
    ],
    "abilities": [],
    "natures": [
      "vivant"
    ],
    "origin": "Primordial",
    "power": 34,
    "popularity": 13,
    "cost": 3,
    "attack": 3,
    "health": 5,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Catoblépas 1.png",
    "quote": "« Le monstre au regard mortel et au cou de chameau. »",
    "costColored": 1,
    "costNeutral": 2
  },
  {
    "id": 341,
    "name": "Chuul",
    "capital": "Forteresse",
    "size": "3",
    "roles": [
      "tank"
    ],
    "abilities": [],
    "natures": [
      "aberration"
    ],
    "origin": "Le Néant",
    "power": 27,
    "popularity": 10,
    "cost": 2,
    "attack": 1,
    "health": 3,
    "rarity": "commune",
    "spell": "Garde: absorbe les attaques prioritaires.",
    "image": "img/Chuul 1.png",
    "quote": "« La créature des profondeurs avec des pinces d'acier. »",
    "costColored": 1,
    "costNeutral": 1
  }
];

