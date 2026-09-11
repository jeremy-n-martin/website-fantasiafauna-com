# -*- coding: utf-8 -*-
"""Génère js/fiches.js — blocs d'identité pour chaque créature."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_JS = ROOT / "js" / "creatures-data.js"
OUT_JS = ROOT / "js" / "fiches.js"

FOLK = "Créature folklorique traditionnelle"
MODERN = "⚠️ Pas une créature folklorique traditionnelle"

# slug -> accroche, origine, tradition (None = folklorique), famille, danger 1-5, habitat, trait
FICHES: dict[str, dict] = {}


def add(slug: str, accroche: str, origine: str, famille: str, danger: int, habitat: str, trait: str, folk: bool = True) -> None:
    FICHES[slug] = {
        "accroche": accroche,
        "origine": origine,
        "tradition": FOLK if folk else MODERN,
        "famille": famille,
        "danger": danger,
        "habitat": habitat,
        "trait": trait,
    }


# --- A ---
add("aarakocra", "Un peuple ailé qui préfère le vent aux murs.", "Fantasy de jeu de rôle, XXe siècle", "Humanoïde ailé / peuple des airs", 2, "Pics, nids d'altitude, cités perchées", "Ailes fonctionnelles et culture aérienne", False)
add("aasimar", "Un mortel marqué par une lueur céleste.", "Fantasy de jeu de rôle, XXe siècle", "Humanoïde / lignée céleste", 2, "Cités, sanctuaires, routes de pèlerinage", "Héritage céleste et manifestation de lumière", False)
add("aboleth", "Un tyran aquatique qui se souvient de tout.", "Fantasy de jeu de rôle, XXe siècle", "Aberration / prédateur abyssal", 5, "Lacs souterrains, ruines englouties", "Mémoire millénaire et domination psychique", False)
add("acolyte", "Un fidèle encore au seuil des grands secrets.", "Archétype religieux universel", "Clerc / initié", 1, "Temples, monastères, processions", "Foi naissante plus que pouvoir acquis", False)
add("aitvaras", "Un esprit du foyer qui rapporte des richesses volées… et brûle la maison si on l'offense.", "Folklore lituanien", "Esprit domestique / voleur de fortune", 3, "Greniers, cheminées, fermes", "Coq noir au logis, serpent ou traînée de feu dans le ciel")
add("alchimiste", "Un artisan qui transfigure la matière pour en extraire un miracle.", "Traditions hermétiques européennes", "Savant / transmutateur", 2, "Laboratoires, ateliers fumants", "Cornues, élixirs et transmutation", False)
add("alerion", "Un oiseau royal presque sans pattes, tout en ailes.", "Héraldique médiévale européenne", "Figure héraldique / aiglon", 1, "Armoiries, notamment celles de Lorraine", "Aiglon représenté sans bec ni pattes", False)
add("alp", "Un cauchemar germanique qui s'assoit sur la poitrine des dormeurs.", "Folklore germanique", "Esprit nocturne / incube", 3, "Chambres, toits, lisières de forêt", "Pesanteur onirique et vol de souffle")
add("amarok", "Un loup immense qui chasse les égarés dans la nuit arctique.", "Mythologie inuit", "Loup géant / chasseur", 4, "Toundra, neiges, étendues nocturnes", "Taille colossale et chasse solitaire")
add("amphiptere", "Un serpent sans pattes dont les ailes seules défient la terre.", "Héraldique et bestiaires européens", "Dragon serpentin / volant", 4, "Armoiries, cieux et terres de légende", "Corps serpentin, ailes et absence de pattes")
add("amphisbene", "Un serpent à deux têtes qui n'a jamais de dos.", "Antiquité gréco-romaine", "Serpent double / chthonien", 3, "Sables, déserts, terres brûlées", "Deux têtes opposées, déplacement dans les deux sens")
add("ange", "Un messager de lumière, souvent plus terrible qu'il n'y paraît.", "Traditions abrahamiques", "Céleste / messager", 4, "Cieux, seuils sacrés, visions", "Ailes, gloire et parole qui tranche")
add("ankou", "Le fossoyeur breton qui vient chercher les morts.", "Folklore breton", "Psychopompe / faucheur", 5, "Chemins creux, cimetières, nuits d'hiver", "Charrette des morts et silhouette de l'Ankou")
add("anzu", "L'oiseau-lion qui déroba la Tablette des Destinées.", "Mythologie mésopotamienne", "Oiseau divin / voleur de pouvoir", 5, "Montagnes sacrées, tempêtes", "Vol de la Tablette des Destinées et puissance des tempêtes")
add("apsara", "Une danseuse céleste dont la grâce trouble dieux et mortels.", "Mythologies indiennes", "Être céleste / danseuse divine", 2, "Cours divines, nuages, palais", "Danse, beauté surnaturelle et métamorphose")
add("arachne", "La tisseuse trop habile, changée en araignée.", "Mythologie grecque", "Araignée / maudite", 1, "Ateliers, toiles, recoins", "Orgueil du métier et tissage éternel")
add("araignee-geante", "Une tisseuse de la taille d'un cheval, affamée.", "Fantasy et folklore élargi", "Arachnide géant / prédateur", 4, "Grottes, forêts sombres, puits", "Toile monumentale et venin", False)
add("arbaletrier", "Un tireur patient, aussi implacable que le bois tendu.", "Archétype militaire médiéval", "Guerrier / tireur", 2, "Remparts, compagnies, champs de bataille", "Arbalète et discipline de tir", False)
add("archer", "L'œil porte loin ; la flèche est déjà partie.", "Archétype martial universel", "Guerrier / tireur", 2, "Bois, murailles, compagnies", "Précision à distance", False)
add("archidemon", "Un prince de l'abîme, couronné de maléfices.", "Démonologie et fantasy", "Démon majeur / seigneur infernal", 5, "Cercles infernaux, autels noirs", "Autorité sur légions et malédictions", False)
add("archidiable", "Un hiérarque de l'enfer, juriste du pacte.", "Démonologie chrétienne et fantasy", "Diable majeur / seigneur infernal", 5, "Cours infernales, contrats, trônes de braise", "Loi infernale et ambition froide", False)
add("archimage", "Un mage qui a trop lu, trop vécu, trop payé.", "Archétype de fantasy", "Magicien / maître arcanique", 4, "Tours, bibliothèques, cercles", "Puissance magique à son apogée", False)
add("arimaspe", "Un peuple borgne qui dispute l'or aux griffons.", "Récits grecs sur le Nord", "Peuple légendaire / humanoïde borgne", 3, "Montagnes hyperboréennes, filons d'or", "Un seul œil et guerre contre les griffons")
add("artificier", "Un inventeur qui coud la magie à la machine.", "Fantasy moderne", "Artisan magique / ingénieur", 3, "Ateliers, forges, laboratoires", "Objets magiques et mécanismes", False)
add("aspidochelone", "Une île qui respire : c'est une bête.", "Bestiaires médiévaux", "Monstre marin / île trompeuse", 4, "Océans, routes de marins", "Dos pris pour une île, plongeon fatal aux marins")
add("assassin", "Celui qui n'existe qu'entre deux ombres.", "Archétype universel", "Tueur / infiltré", 4, "Rues, cours, toits", "Furtivité et frappe unique", False)
add("asura", "Un rival des dieux, splendide et belliqueux.", "Mythologies indiennes", "Puissance divine / rivale des devas", 5, "Royaumes célestes et champs de bataille", "Puissance, ambition et rivalité avec les devas")
add("augure", "Un lecteur d'oiseaux et de signes.", "Antiquité romaine", "Devin / interprète", 1, "Temples, collines, places publiques", "Lecture des présages", False)
add("automate", "Un corps d'engrenages auquel on a donné un ordre — et jamais le droit de l'oublier.", "Traditions des automates et fantasy", "Construction animée / machine", 3, "Forges, palais, laboratoires", "Mécanique infatigable et obéissance absolue", False)

# --- B ---
add("baba-yaga", "La sorcière de la hutte aux pattes de poule.", "Folklore slave", "Sorcière / initiée", 5, "Forêts profondes, izba mobile", "Cabane ambulante et épreuves cruelles")
add("baku", "Un mangeur de cauchemars, mi-éléphant mi-rêve.", "Folklore japonais", "Esprit onirique / protecteur", 2, "Chambres, seuils du sommeil", "Dévore les mauvais songes")
add("balor", "Un démon à l'œil de feu, général de la ruine.", "Fantasy de jeu de rôle, XXe siècle", "Démon majeur / seigneur du feu", 5, "Abîmes, champs de bataille infernaux", "Regard incendiaire et taille colossale", False)
add("banshee", "Le cri qui annonce une mort dans la lignée.", "Folklore irlandais", "Esprit funèbre / messagère", 1, "Ruines familiales, landes, nuits", "Plainte qui précède le deuil")
add("barbare", "Un guerrier farouche que l'instinct maintient debout quand l'acier cède.", "Archétype de fantasy", "Guerrier / combattant farouche", 3, "Steppes, clans, frontières", "Rage et endurance", False)
add("barbegazi", "Un nain des Alpes à la barbe pleine de neige.", "Bestiaires fantastiques modernes, XXe siècle", "Être alpin moderne / nain des neiges", 1, "Glaciers, cols, avalanches", "Pieds vastes et secours aux voyageurs", False)
add("barde", "Une voix qui arme autant qu'elle console.", "Archétype celtique et de fantasy", "Artiste / magicien de la parole", 2, "Cours, tavernes, routes", "Chant, mémoire et charme", False)
add("barghest", "Un chien noir de mauvais augure.", "Folklore du nord de l'Angleterre", "Chien spectral / présage", 4, "Landes, croisées, cimetières", "Forme de molosse et malheur annoncé")
add("basajaun", "Le seigneur sauvage des forêts basques.", "Folklore basque", "Géant sylvestre / premier berger", 3, "Bois d'Iraty, estives, grottes", "Poil long, sagesse agraire, cri d'alerte")
add("basilic", "Le roi des serpents, dont le regard tue.", "Antiquité et bestiaires médiévaux", "Serpent royal / regard mortel", 5, "Puits, caves, déserts de pierre", "Regard mortel et haleine venimeuse")
add("behemoth", "La bête de terre, trop grande pour être chassée.", "Bible / traditions juives", "Colosse animal / primordial", 5, "Roseaux, marais, monde primordial", "Force prodigieuse et souveraineté sur les bêtes terrestres")
add("berserker", "Le guerrier qui revêt la fureur de la bête.", "Sagas scandinaves", "Guerrier / possédé par la rage", 4, "Champs de bataille, halles, hivers", "Transe de combat et fureur associée à l'ours")
add("bete-du-gevaudan", "Un loup trop grand, trop rusé, trop réel.", "Faits historiques et légende du Gévaudan, XVIIIe siècle", "Animal mangeur d'hommes / énigme historique", 5, "Margeride, forêts et villages du Gévaudan", "Attaques meurtrières et identité toujours débattue")
add("blemmye", "Un homme dont le visage pousse sur la poitrine.", "Récits antiques et médiévaux", "Humanoïde merveilleux", 1, "Confins, récits de voyage", "Absence de tête, visage pectoral")
add("boggart", "Un lutin rancunier qui harcèle la maisonnée.", "Folklore anglais", "Esprit du foyer / farceur malveillant", 2, "Fermes, greniers, seuils", "Persécutions domestiques capables de suivre la maisonnée")
add("brownie", "Un petit aide nocturne, à condition qu'on le respecte.", "Folklore écossais et anglais", "Esprit domestique", 1, "Cuisines, étables, foyers", "Travail nocturne récompensé par une offrande de lait ou de crème")
add("bucca", "Un esprit des mines et des côtes cornouaillaises.", "Folklore cornique", "Esprit des profondeurs / marin", 2, "Mines, criques, tempêtes", "Humeur changeante, terre ou mer")
add("bulette", "Une taupe cuirassée qui chasse sous les champs.", "Fantasy de jeu de rôle, XXe siècle", "Prédateur fouisseur", 4, "Plaines, collines, sous-sols agricoles", "Bond hors de terre et carapace", False)

# --- C ---
add("cabire", "Un dieu mystérieux honoré dans les rites secrets de Samothrace.", "Cultes antiques de Samothrace et de Lemnos", "Divinité chthonienne / culte à mystères", 2, "Sanctuaires insulaires, lieux initiatiques", "Initiations secrètes et protection des voyageurs")
add("cacodemon", "Un mauvais daimon, l'esprit qui veut du mal.", "Antiquité grecque / démonologie", "Démon / esprit malfaisant", 4, "Seuils, fièvres, lieux souillés", "Influence maligne plutôt que forme unique")
add("cambion", "L'enfant d'un mortel et d'un démon.", "Démonologie médiévale", "Hybride infernal", 3, "Cours, marges, lignées maudites", "Double héritage, charme et maléfice")
add("catoblepas", "Une bête à la tête basse dont le souffle et le regard donnent la mort.", "Antiquité gréco-romaine", "Ongulé monstrueux / regard mortel", 5, "Marais africains imaginaires", "Encolure trop lourde, souffle ou œil fatal")
add("cauchemar", "Le poids qui étouffe au milieu de la nuit.", "Folklore européen", "Esprit onirique / oppresseur", 3, "Lits, chambres, heures creuses", "Oppression thoracique et visions")
add("centaure", "Mi-homme mi-cheval, sagesse et fureur au galop.", "Mythologie grecque", "Hybride équin", 3, "Montagnes, forêts, plaines thessaliennes", "Torse humain sur corps de cheval")
add("cerbere", "Le chien à trois têtes qui garde les Enfers.", "Mythologie grecque", "Gardien infernal", 5, "Portes des Enfers, rives du Styx", "Trois gueules et vigilance éternelle")
add("chaman", "Celui qui voyage pour soigner le monde visible.", "Traditions sibériennes et circumpolaires", "Intercesseur / voyageur d'esprits", 2, "Steppes, taïgas, villages", "Tambour, transe, alliés invisibles", False)
add("changeling", "L'enfant substitué, trop sage ou trop étrange.", "Folklore celtique et germanique", "Fée / substitut", 2, "Berceaux, seuils, tertres", "Échange d'enfant avec le Petit Peuple")
add("chevalier", "L'idéal armé, entre vœu et fer.", "Archétype médiéval européen", "Guerrier / noble d'armes", 3, "Châteaux, routes, tournois", "Armure, code et monture", False)
add("chevalier-de-la-mort", "Un paladin retourné, fidèle à la tombe.", "Fantasy de jeu de rôle", "Mort-vivant / antipaladin", 5, "Nécropoles, champs de batailles oubliés", "Aura de mort et serment brisé", False)
add("chien-de-l-enfer", "Un molosse de braise aux yeux de charbon.", "Folklore européen et fantasy", "Canidé infernal / gardien", 4, "Portails, nécropoles, brasiers", "Feu intérieur et chasse des âmes")
add("chimere", "Lion, chèvre et serpent cousus en une seule faim.", "Mythologie grecque", "Hybride monstrueux / souffle", 5, "Lycie, montagnes, terres brûlées", "Trois natures et haleine de feu")
add("chort", "Un diable slave, cornu et moqueur.", "Folklore slave", "Diable / lutin malin", 3, "Carrefours, tavernes, forêts", "Cornes, sabots et marchés trompeurs")
add("chronomancien", "Un mage qui plie les heures comme du fil.", "Fantasy moderne", "Magicien / maître du temps", 4, "Tours, paradoxes, seuils d'époques", "Altération du temps", False)
add("chupacabra", "Le suceur de bétail des nuits américaines.", "Légende contemporaine, XXe siècle", "Prédateur cryptide", 3, "Ranchs, broussailles, nuits chaudes", "Attaques sur le bétail et silhouette controversée", False)
add("chuul", "Un crustacé intelligent, trop grand pour la mer.", "Fantasy de jeu de rôle", "Aberration aquatique / pinceur", 4, "Marais, grottes noyées, ruines côtières", "Pinces paralysantes et carapace", False)
add("clerc", "Le soldat d'un dieu, prière à une main, masse à l'autre.", "Archétype de fantasy", "Prêtre / guerrier sacré", 3, "Temples, pèlerinages, sièges", "Magie divine et doctrine", False)
add("cocatrix", "Un coq-serpent né d'un œuf impossible.", "Bestiaires médiévaux", "Hybride monstrueux / regard mortel", 4, "Caves, fumiers, ruines", "Œuf de coq couvé par un crapaud ou un serpent")
add("colosse", "Une statue trop grande, parfois encore debout.", "Antiquité et fantasy", "Statue monumentale / géant de fantasy", 5, "Ports, temples, déserts de pierre", "Échelle monumentale", False)
add("croquemitaine", "L'homme qui mange les enfants trop curieux.", "Folklore français", "Épouvantail / ogre pédagogique", 3, "Greniers, recoins, nuits d'hiver", "Menace éducative incarnée")
add("cryomancien", "Un mage qui parle la langue du gel.", "Fantasy moderne", "Magicien / maître du froid", 3, "Glaciers, tours gelées, hivers", "Glace comme arme et rempart", False)
add("cu-sith", "Le chien féerique vert, dont l'aboiement est un compte à rebours.", "Folklore écossais", "Canidé féerique / psychopompe", 4, "Highlands, tertres, brumes", "Pelage vert et trois aboiements fatals")
add("cube-gelatineux", "Un bloc transparent qui digère ce qu'il traverse.", "Fantasy de jeu de rôle", "Limon / nettoyeur de donjon", 3, "Couloirs souterrains, égouts, caves", "Transparence et digestion lente", False)
add("cyclope", "Un géant à l'œil unique : forgeron divin ou pasteur sauvage.", "Mythologie grecque, traditions hésiodique et homérique", "Géant / artisan primordial", 4, "Forges divines, îles et grottes selon les récits", "Œil unique, force immense et rôles variables selon les traditions")
add("cynocephale", "L'homme à tête de chien des confins du monde.", "Récits antiques et médiévaux", "Hybride cynocéphale", 3, "Indes imaginaires, marges des cartes", "Tête canine sur corps humain")

# --- D ---
add("dactyle", "Un forgeron-magicien né, selon un récit, des doigts de la Grande Mère.", "Mythologies grecque et phrygienne, monts Ida", "Esprit forgeron / magicien idæen", 2, "Mont Ida, forges et sanctuaires de la Grande Mère", "Invention du fer et des rythmes magiques")
add("dame-blanche", "Une apparition pâle au bord des routes et des châteaux.", "Folklore européen", "Fantôme / messagère", 2, "Ponts, allées, ruines nobiliaires", "Robe blanche et présage")
add("dao", "Un génie de la terre, orgueilleux comme la pierre.", "Fantasy de jeu de rôle, XXe siècle", "Génie élémentaire / terre", 4, "Plan élémentaire de la Terre, mines et labyrinthes", "Maîtrise de la pierre et des trésors", False)
add("demi-elfe", "Ni tout à fait des siens, ni tout à fait des nôtres.", "Fantasy littéraire et de jeu", "Hybride elfe-humain", 2, "Villes frontières, compagnies, routes", "Double héritage, nulle part chez soi", False)
add("demi-orc", "La force orque dans un visage trop humain.", "Fantasy de jeu de rôle", "Hybride orc-humain", 3, "Marges, compagnies, camps", "Vigueur et stigmate social", False)
add("demon", "Une puissance d'en bas, affamée d'âme ou de désordre.", "Démonologie abrahamique et fantasy", "Entité infernale", 4, "Abîmes, cercles, invocations", "Malice spirituelle incarnée")
add("demonologue", "Le savant qui converse trop bien avec l'abîme.", "Occultisme européen", "Savant / invocateur", 3, "Cabinets noirs, grimoires, cryptes", "Science des noms démoniaques", False)
add("diable", "L'adversaire cornu, tentateur plus que brute.", "Traditions chrétiennes européennes", "Diable / tentateur", 4, "Carrefours, cours, déserts spirituels", "Pacte, ruse et chute")
add("diablotin", "Un petit malin, plus nuisance que prince.", "Folklore et fantasy", "Diable mineur / familier", 2, "Ateliers maudits, poches, toits", "Farces cruelles et servitude infernale")
add("div", "Un démon iranien, maître du mensonge et ennemi de l'ordre sacré.", "Traditions zoroastriennes et folklore iranien", "Démon / puissance malfaisante", 4, "Ruines, déserts, forteresses noires", "Mensonge, violence et opposition aux yazatas")
add("djinn", "Un être de feu sans fumée, ni ange ni homme.", "Traditions arabes et islamiques", "Génie / esprit de feu", 4, "Déserts, ruines, lieux retirés", "Libre arbitre, magie, métamorphose")
add("doppelganger", "Le double vivant dont l'apparition annonce le malheur.", "Folklore germanique / fantasy", "Double surnaturel / présage", 4, "Maisons, routes et lieux familiers", "Sosie d'une personne vivante, souvent funeste")
add("dracoliche", "Un dragon qui a choisi l'os plutôt que la mort.", "Fantasy de jeu de rôle", "Dragon mort-vivant", 5, "Tombes draconiques, nécropoles volantes", "Phylactère et souffle d'outre-tombe", False)
add("dragon", "Sous mille formes, le dragon incarne la puissance indomptable.", "Traditions eurasiennes", "Créature draconique / puissance mythique", 5, "Eaux, montagnes, cavernes ou cieux selon les traditions", "Formes, pouvoirs et symboles variables selon les cultures")
add("dragon-bleu", "Un dragon des orages et des dunes électrifiées.", "Fantasy de jeu de rôle", "Dragon chromatique / foudre", 5, "Déserts, canyons, cieux d'orage", "Souffle d'éclair", False)
add("dragon-d-airain", "Un dragon du sable, bavard et brûlant.", "Fantasy de jeu de rôle", "Dragon métallique / feu", 4, "Déserts, oasis, dunes", "Chaleur et ruse sociable", False)
add("dragon-d-argent", "Un dragon des neiges, ami des mortels sous déguisement.", "Fantasy de jeu de rôle", "Dragon métallique / froid", 4, "Monts enneigés, villes, nuages", "Métamorphose humaine et souffle glacé", False)
add("dragon-d-ombre", "Un dragon né de l'ombre plus que de l'écaille.", "Fantasy de jeu de rôle", "Dragon planaire / ténèbres", 5, "Plans d'ombre, ruines, nuits sans lune", "Essence umbrale", False)
add("dragon-d-or", "Le plus sage des dragons, soleil parmi les reptiles.", "Fantasy de jeu de rôle, XXe siècle", "Dragon métallique / soleil", 5, "Cieux, palais cachés, montagnes sacrées", "Justice, feu et forme humaine", False)
add("dragon-de-bronze", "Un dragon des côtes, loyal comme la marée.", "Fantasy de jeu de rôle", "Dragon métallique / foudre marine", 4, "Falaises, îles, tempêtes", "Gardien des rivages", False)
add("dragon-de-cuivre", "Un dragon des rochers, farceur et acide.", "Fantasy de jeu de rôle", "Dragon métallique / acide", 4, "Canyons, collines sèches", "Humour et souffle corrosif", False)
add("dragon-marin", "Le dragon des abysses, tempête à écailles.", "Folklore maritime et fantasy", "Dragon aquatique", 5, "Océans, fosses, tempêtes", "Souffle et règne sous les vagues")
add("dragon-noir", "Un dragon des marais, fait d'acide et de rancune.", "Fantasy de jeu de rôle", "Dragon chromatique / acide", 5, "Marécages, ruines noyées", "Corruption des eaux", False)
add("dragon-rouge", "Le tyran ailé, feu, montagne et trésor.", "Fantasy de jeu de rôle, XXe siècle", "Dragon chromatique / feu", 5, "Volcans, sommets, cavernes de magma", "Souffle incendiaire et orgueil", False)
add("dragon-vert", "Un dragon des bois, poison et mensonge.", "Fantasy de jeu de rôle", "Dragon chromatique / poison", 5, "Forêts anciennes, clairières trompeuses", "Souffle toxique et intrigues", False)
add("drake", "Un dragon mineur, assez grand pour tuer un village.", "Fantasy moderne", "Dragon mineur / bête draconique", 4, "Collines, grottes, lisières", "Force bestiale et pouvoirs variables selon les univers", False)
add("draugr", "Le mort islandais qui garde son tertre et sa force.", "Sagas scandinaves", "Mort-vivant / gardien de tombe", 4, "Tertres, fermes, rivages", "Corps gonflé, force surnaturelle")
add("drow", "Un elfe des profondeurs, beauté et couteau.", "Fantasy de jeu de rôle", "Elfe noir / souterrain", 3, "Cités souterraines, Outreterre", "Société matriarcale et magie d'ombre", False)
add("druide", "Le prêtre des bois, plus ancien que le temple.", "Religions celtiques antiques / littérature et fantasy", "Prêtre de la nature / intercesseur", 3, "Forêts, cercles de pierre, clairières", "Savoir rituel, divination et communion avec la nature", False)
add("dryade", "Une nymphe des arbres, présence vivante au cœur du bois.", "Mythologie grecque", "Nymphe sylvestre", 2, "Chênes, bosquets, forêts", "Affinité avec les arbres et les bois")
add("dullahan", "Le cavalier sans tête qui dit votre nom.", "Folklore irlandais", "Psychopompe / cavalier", 5, "Routes nocturnes, haies, ponts", "Tête sous le bras, mort nommée")

# --- E ---
add("ecuyer", "Le jeune fer qui n'est pas encore chevalier.", "Archétype médiéval", "Guerrier / apprenti", 1, "Cours, camps, écuries", "Service et apprentissage des armes", False)
add("elementaire", "La matière devenue volonté : feu, air, eau, pierre.", "Occultisme paracelsien / fantasy moderne", "Esprit élémentaire", 4, "Plans et lieux saturés d'un élément", "Corps d'élément pur", False)
add("elfe", "Un peuple ancien, gracieux et parfois impitoyable.", "Folklore germanique / fantasy moderne", "Peuple féerique / être de grande longévité", 3, "Forêts, tertres, cités cachées", "Longévité, magie, altérité")
add("elfe-des-neiges", "Un elfe taillé dans le givre et le silence.", "Fantasy moderne", "Elfe / peuple du froid", 3, "Banquises, taïgas, cités de glace", "Résistance au froid et isolement", False)
add("enchanteresse", "Celle dont les mots nouent le destin d'autrui.", "Archétype européen", "Magicienne / charmeuse", 3, "Tours, îles, cours", "Enchantement et séduction magique", False)
add("enchanteur", "Le mage qui habille le monde de sorts durables.", "Archétype arthurien et médiéval", "Magicien / enchanteur", 3, "Forêts, cours, îles", "Enchantements et conseil", False)
add("ensorceleur", "La magie brute coule dans ses veines, plus ancienne que tout grimoire.", "Fantasy de jeu de rôle", "Magicien inné", 3, "Lignées, marges, compagnies", "Pouvoir héréditaire plutôt qu'étudié", False)
add("erinye", "Une Furie, vengeance aux ailes noires.", "Mythologie grecque", "Divinité chthonienne / vengeresse", 5, "Seuils du crime, Enfers, sang versé", "Châtiment implacable des crimes de sang")
add("ettin", "Un géant à deux têtes qui se disputent le même gourdin.", "Fantasy de jeu de rôle, XXe siècle", "Géant / bicéphale", 4, "Collines, cavernes, landes", "Deux consciences querelleuses dans un même corps", False)
add("exorciste", "Celui qui connaît le nom capable de chasser l'invisible.", "Traditions religieuses", "Clerc / chasseur d'esprits", 3, "Sanctuaires, maisons hantées, seuils", "Rituels d'expulsion des entités", False)

# --- F ---
add("fantome", "Un mort qui n'a pas fini de hanter les vivants.", "Folklore universel", "Esprit / revenant", 2, "Maisons, champs de bataille, brumes", "Immatérialité et attachement à un lieu, un objet ou une dette")
add("farfadet", "Un petit être de landes, plus espiègle que sage.", "Folklore français", "Lutin / farceur", 1, "Landes, fermes, nuits", "Malices et disparitions d'objets")
add("faune", "L'esprit rustique des bois, compagnon des bergers et des vieux dieux.", "Mythologie romaine", "Divinité rustique / esprit des campagnes", 2, "Bois, champs, pâturages", "Présence rustique, musique et pouvoir prophétique")
add("fauve-desagregateur", "Une bête dont la simple présence défait la matière.", "Fantasy moderne, origine précise non attestée", "Aberration / prédateur", 5, "Donjons, failles, non-lieux", "Aura de désintégration", False)
add("fee", "Le Petit Peuple, plus ancien et plus dangereux qu'un conte.", "Folklore celtique et européen", "Fée / peuple surnaturel", 3, "Tertres, cercles, heures crépusculaires", "Glamour, temps déformé, dons empoisonnés")
add("fee-dragon", "Un minuscule dragon au sang féerique.", "Fantasy de jeu de rôle", "Dragon miniature / fée", 2, "Bosquets, jardins magiques, clairières", "Petite taille, invisibilité, magie et souffle euphorisant", False)
add("fenrir", "Le loup enchaîné qui dévorera Odin au Ragnarök.", "Mythologie nordique", "Loup cosmique / destin", 5, "Île de Lyngvi, liens magiques, Ragnarök", "Croissance prodigieuse, lien de Gleipnir et mort annoncée d'Odin")
add("firbolg", "Un géant discret, plus berger que tyran.", "Fantasy de jeu de rôle, d'après un nom irlandais", "Humanoïde apparenté aux géants / peuple sylvestre", 3, "Forêts profondes, collines", "Taille, magie discrète, vie recluse", False)
add("flumph", "Une méduse volante, trop gentille pour ce monde.", "Fantasy de jeu de rôle", "Aberration / télépathe bénin", 1, "Grottes, failles psychiques", "Lévitation et lecture d'intentions", False)
add("fomorien", "Les puissances hostiles venues de sous la mer et de sous la terre.", "Mythologie irlandaise", "Peuple surnaturel / puissance hostile", 5, "Mers, mondes souterrains et champs de bataille d'Irlande", "Formes diverses, pouvoirs redoutables et guerre contre les Tuatha Dé Danann")
add("forgelet", "Un petit esprit de l'enclume, étincelle devenue aide.", "Fantasy moderne / création originale", "Esprit artisan / familier du feu", 1, "Forges, ateliers, soufflets", "Travail du métal et farces de braise", False)
add("furie", "La colère sacrée qui ne pardonne pas le sang versé.", "Mythologie grecque", "Divinité chthonienne / vengeresse", 5, "Crimes impunis, seuils, Enfers", "Poursuite jusqu'à la purification")

# --- G ---
add("gargouille", "La pierre qui crache l'eau… et parfois plus.", "Architecture médiévale / fantasy moderne", "Figure architecturale / gardien de fantasy", 3, "Cathédrales, gouttières, nuits de pluie", "Gouttière sculptée ; animation issue de la fiction moderne", False)
add("garuda", "L'oiseau-soleil, ennemi éternel des nagas.", "Mythologies indiennes", "Oiseau divin / monture", 5, "Cieux, palais divins, jungles mythiques", "Ailes colossales et fureur contre les serpents")
add("geant", "L'humain trop grand, souvent plus ancien que les rois.", "Folklore eurasien", "Géant", 4, "Montagnes, landes, origines du monde", "Taille et force hors mesure")
add("geant-des-glaces", "Un titan de givre, frère du blizzard.", "Mythologie nordique / fantasy moderne", "Géant du givre / puissance primordiale", 5, "Jötunheim, glaciers, hivers", "Puissance du givre et rivalité avec les dieux")
add("genasi", "Un mortel pétri d'un élément : braise, brise, onde ou roc.", "Fantasy de jeu de rôle", "Humanoïde / lignée élémentaire", 2, "Confins élémentaires, cités, déserts", "Une affinité élémentaire inscrite dans le sang", False)
add("ghast", "Une goule plus fétide, plus vive, plus affamée.", "Fantasy de jeu de rôle", "Mort-vivant / charognard", 4, "Nécropoles, champs de bataille", "Puanteur paralysante", False)
add("gibbering-mouther", "Une marée de bouches et d'yeux dont le murmure brise la raison.", "Fantasy horrifique de jeu de rôle", "Aberration / amas vivant", 4, "Profondeurs, failles, non-lieux", "Babillage incessant qui égare l'esprit", False)
add("githyanki", "Un peuple pirate de l'entre-mondes, né de l'esclavage mental.", "Fantasy de jeu de rôle", "Humanoïde extraplanaire / guerrier astral", 4, "Mer Astrale, cités-forteresses", "Lames d'argent et haine des illithids", False)
add("githzerai", "Le peuple qui oppose une discipline absolue au chaos des Limbes.", "Fantasy de jeu de rôle", "Humanoïde extraplanaire / ascète des Limbes", 3, "Limbes, monastères, forteresses mentales", "Maîtrise de soi contre le chaos", False)
add("glabrezu", "Un démon à pinces, tentateur plus que simple brute.", "Fantasy de jeu de rôle", "Démon / corrupteur", 5, "Abîmes, cours démoniaques", "Quatre bras, pinces et promesses de pouvoir corruptrices", False)
add("gnoll", "L'hyène debout, faim érigée en peuple.", "Fantasy de jeu de rôle", "Humanoïde / chasseur", 3, "Savanes, ruines, bandes", "Rire, charognage, férocité", False)
add("gnome", "Un petit peuple de la terre, rusé et tenace.", "Folklore européen / fantasy", "Petit peuple / artisan", 2, "Collines, mines, jardins", "Taille réduite, artisanat, tours")
add("gobelin", "Le petit malin des bois et des mines, trop nombreux.", "Folklore européen / fantasy", "Petit peuple / fauteur de troubles", 2, "Grottes, forêts, ruines", "Ruse, nombre, cruauté mesquine")
add("gobelours", "Le plus massif des gobelinoïdes frappe avant d'être vu.", "Fantasy de jeu de rôle", "Gobelinoïde / brute furtive", 3, "Camps, collines, cavernes", "Force, furtivité et goût de l'embuscade", False)
add("golem", "L'argile à laquelle un Nom sacré commande de se lever.", "Traditions juives d'Europe centrale", "Créature artificielle / gardien", 4, "Quartiers menacés, ateliers, synagogues légendaires", "Vie insufflée par des lettres ou un Nom sacré")
add("golem-de-chair", "Des dépouilles cousues ensemble, réveillées par une volonté qui n'est pas la leur.", "Fantasy et imaginaire gothique", "Créature artificielle / horreur", 4, "Laboratoires, cryptes", "Corps composite, force et fureur", False)
add("golem-de-fer", "Une statue de métal, sourde à la pitié comme à la fatigue.", "Fantasy de jeu de rôle", "Créature artificielle / gardien", 5, "Forges magiques, chambres fortes, palais", "Résistance prodigieuse et poings d'acier", False)
add("golem-de-pierre", "Le temple se lève, et chaque pas devient un séisme.", "Fantasy de jeu de rôle", "Créature artificielle / gardien", 4, "Ruines, sanctuaires, nécropoles", "Masse de pierre animée et force monumentale", False)
add("goliath", "Un colosse des sommets, rival des géants.", "Fantasy de jeu de rôle", "Humanoïde / montagnard", 3, "Pics, glaciers, campements d'altitude", "Force, endurance et esprit de compétition", False)
add("gorgone", "Un seul regard, et la chair se souvient qu'elle fut poussière.", "Mythologie grecque", "Monstre au regard / créature chthonienne", 5, "Grottes, temples oubliés, îles", "Chevelure de serpents et regard pétrifiant")
add("goule", "Le mangeur de tombes, trop humain encore.", "Folklore arabe (ghūl) / fantasy moderne", "Démon changeforme / mort-vivant de fantasy", 3, "Déserts et lieux isolés ; cimetières dans les adaptations occidentales", "Égarement des voyageurs et métamorphose ; nécrophagie dans les adaptations")
add("grell", "Un cerveau volant, tout tentacules et faim.", "Fantasy de jeu de rôle", "Aberration / prédateur aérien", 4, "Cavernes, donjons, plafonds", "Lévitation et tentacules paralysants", False)
add("gremlin", "Le saboteur miniature des machines.", "Folklore moderne, XXe siècle", "Lutin / fauteur technique", 2, "Hangars, usines, appareils", "Sabotage méthodique des machines", False)
add("grendel", "Le maraudeur de Heorot, né des marais.", "Poème de Beowulf", "Ogre / descendant de Caïn", 4, "Marais, salles d'hydromel, nuits danoises", "Force, haine du chant, bras arraché")
add("griffon", "Aigle et lion cousus pour garder l'or.", "Antiquité et bestiaires", "Hybride / gardien", 4, "Montagnes, nids, trésors", "Serres, ailes et royauté animale")
add("grindylow", "Un petit noyeur des mares anglaises.", "Folklore du Yorkshire", "Esprit aquatique / noyeur", 3, "Mares, roseaux, eaux troubles", "Longs bras qui entraînent les enfants sous l'eau")
add("guenaude", "Une vieille sorcière dont les maléfices mûrissent aux lisières.", "Folklore européen", "Sorcière / recluse", 3, "Cabanes, landes, lisières", "Maléfices, herbes, œil mauvais")
add("guerrier", "Le métier des armes, sans autre magie que l'entraînement.", "Archétype universel", "Combattant", 3, "Camps, compagnies, champs", "Maîtrise martiale", False)
add("gueteur", "L'œil de la nuit sur les murs.", "Archétype urbain médiéval", "Sentinelle / garde", 2, "Remparts, rues, tours", "Vigilance et lanterne", False)

# --- H ---
add("halfling", "Un petit peuple des collines, plus foyer que gloire.", "Fantasy littéraire", "Petit peuple / pastoral", 1, "Terriers, villages, auberges", "Discrétion, chance, confort", False)
add("harpie", "Un vent de rapine aux ailes d'oiseau et au visage de femme.", "Mythologie grecque", "Esprit du vent / ravisseuse ailée", 3, "Falaises, îles, tempêtes", "Rapt soudain et souillure des festins")
add("hecatonchire", "Cent bras pour une seule colère primordiale.", "Mythologie grecque", "Géant primordial", 5, "Tartare, origines du cosmos", "Cent bras et cinquante têtes")
add("hippocampe", "Le cheval des vagues, écailleux et loyal.", "Antiquité grecque / héraldique", "Hybride marin", 2, "Mers, cortèges de Poséidon", "Avant de cheval, arrière de poisson")
add("hippogriffe", "Le coursier impossible, né d'un griffon et d'une jument.", "Poésie chevaleresque italienne (L'Arioste), XVIe siècle", "Hybride volant", 3, "Cieux, montagnes, écuries magiques", "Avant de griffon ailé et arrière de cheval", False)
add("hobgobelin", "Le gobelin discipliné, soldat plutôt que voleur.", "Fantasy de jeu de rôle", "Gobelinoïde / militariste", 3, "Camps fortifiés, légions", "Ordre martial et cruauté organisée", False)
add("homme-lezard", "Un peuple d'écailles, plus marais que couronne.", "Fantasy de jeu de rôle", "Reptilien / tribal", 3, "Marais, ziggourats, jungles", "Sang froid et culte ancien", False)
add("homme-rat", "La vermine debout, trop nombreuse sous la ville.", "Fantasy / horreur urbaine", "Hybride / souterrain", 3, "Égouts, caves, fléaux", "Tanières, peste et essaim", False)
add("homoncule", "Un être humain miniature que l'alchimiste prétend créer en vase clos.", "Alchimie européenne, XVIe siècle", "Créature artificielle", 2, "Laboratoires, cornues, cabinets d'alchimiste", "Génération artificielle en vase clos", False)
add("huldra", "La belle des bois, creuse dans le dos comme un tronc.", "Folklore scandinave", "Fée / séductrice sylvestre", 3, "Forêts, estives, lisières", "Queue de vache, dos évidé")
add("hydre", "Coupez une tête, deux vous regardent.", "Mythologie grecque", "Serpent / régénérant", 5, "Marais de Lerne, eaux croupies", "Têtes multiples et régénération")

# --- I-J ---
add("ifrit", "Un djinn d'une puissance farouche, prompt à défier hommes et esprits.", "Traditions arabes et islamiques", "Djinn puissant / esprit rebelle", 4, "Déserts, ruines, lieux désolés", "Force redoutable, ruse et nature de feu sans fumée")
add("illithid", "Le mangeur de cerveaux, empire de l'esprit.", "Fantasy de jeu de rôle", "Aberration / psionique", 5, "Cités souterraines, vaisseaux mentaux", "Tentacules faciaux et extraction cérébrale", False)
add("illusionniste", "Celui qui gagne sans que le monde sache qu'il a menti.", "Archétype magique", "Magicien / trompeur", 2, "Cours, théâtres, champs", "Illusions et leurres", False)
add("incube", "Le démon du lit, visiteur des sommeils.", "Démonologie médiévale", "Démon / succube masculin", 3, "Chambres, nuits, rêves", "Visite sexuelle et vol de vigueur")
add("invocateur", "Celui qui ouvre, et parfois ne referme pas.", "Archétype occulte et fantasy", "Magicien / ouvreur de portes", 3, "Cercles, grimoires, seuils", "Convocation d'entités", False)
add("jabberwock", "La bête aux yeux de flamme, aux griffes ravisseuses et aux mâchoires voraces.", "Lewis Carroll, XIXe siècle", "Monstre littéraire / dragonesque", 5, "Bois touffu, royaume du non-sens", "Yeux de flamme, griffes ravisseuses et mâchoires voraces", False)
add("jackalope", "Le lièvre à bois, farceur des prairies.", "Folklore nord-américain moderne", "Hybride / cryptide humoristique", 1, "Steppes, bars, cartes postales", "Bois de cerf sur lièvre", False)
add("jann", "L'antique esprit du désert, ancêtre des djinns selon certaines traditions.", "Traditions arabes et islamiques", "Djinn primordial / esprit du désert", 3, "Déserts, terres désolées, ruines", "Feu sans fumée, métamorphose et ancienneté")
add("jormungandr", "Le serpent qui ceint le monde, et le lâchera.", "Mythologie nordique", "Serpent cosmique", 5, "Océan du monde, fin des temps", "Envergure planétaire, venin de Ragnarök")
add("jotunn", "L'antique adversaire des dieux, géant sans être toujours immense.", "Mythologie nordique", "Être primordial / géant", 5, "Jötunheim, glaces, chaos originel", "Force, magie et rivalité avec les Ases")

# --- K ---
add("kappa", "La tortue-loutre des rivières, polie et dangereuse.", "Folklore japonais", "Esprit aquatique / noyeur", 3, "Rivières, étangs, canaux", "Cuvette crânienne et goût des concombres")
add("kelpie", "Le cheval d'eau qui n'a qu'une rive : le fond.", "Folklore écossais", "Métamorphe aquatique", 4, "Rivières, gués, berges isolées", "Monture collante et noyade")
add("kenku", "L'oiseau sans voix propre, voleur de paroles.", "Fantasy de jeu de rôle", "Humanoïde aviaire / imitateur", 2, "Villes, toits, compagnies", "Mimétisme vocal et parole empruntée", False)
add("kikimora", "L'esprit féminin du foyer slave, parfois aide, souvent peste.", "Folklore slave", "Esprit domestique", 2, "Izbas, fuseaux, greniers", "Filage nocturne et humeurs")
add("kitsune", "À chaque siècle pousse une queue ; à chaque queue, un secret.", "Folklore japonais", "Renard surnaturel / métamorphe", 3, "Sanctuaires, villes, lisières", "Métamorphose, feux follets et ruse")
add("kobold", "Un petit reptile des profondeurs, faible seul et redoutable derrière ses pièges.", "Fantasy de jeu de rôle, XXe siècle", "Humanoïde reptilien / piégeur", 2, "Galeries, pièges, tanières", "Pièges, tactique de groupe et vénération draconique", False)
add("korrigan", "Le nain breton des sources et des landes.", "Folklore breton", "Lutin / fée nocturne", 2, "Fontaines, menhirs, landes", "Danses nocturnes, trésors et sortilèges")
add("kraken", "Sous ce que les marins prennent pour une île, la mer ouvre ses bras.", "Récits maritimes scandinaves, XVIIe-XVIIIe siècles", "Céphalopode colossal", 5, "Mers de Norvège et du Groenland, routes maritimes", "Corps pris pour une île, bras immenses et tourbillon fatal")
add("kuo-toa", "Les poissons debout, fous de dieux inventés.", "Fantasy de jeu de rôle", "Humanoïde aquatique / cultiste", 3, "Lacs souterrains, temples humides", "Folie collective et vision du divin", False)

# --- L ---
add("lamassu", "Le taureau ailé à visage d'homme, seuil des rois.", "Mythologie assyrienne", "Gardien hybride / protecteur", 4, "Portes palatiales, cités antiques", "Ailes, cornes, vigilance")
add("lamie", "La séductrice antique, enfant-dévoreuse.", "Mythologie grecque", "Démone / séductrice", 4, "Seuils, routes, nuits", "Beauté et faim d'enfants ou d'amants")
add("lemure", "Une âme damnée réduite à une masse rampante.", "Fantasy de jeu de rôle, XXe siècle", "Diable inférieur / damné", 2, "Enfers, fosses, légions infernales", "Corps informe et esprit presque effacé", False)
add("leprechaun", "Le cordonnier au pot d'or, plus rusé que riche.", "Folklore irlandais", "Lutin / artisan", 2, "Tertres, haies, ateliers solitaires", "Or caché et marché trompeur")
add("leshy", "Le seigneur des bois slaves, qui perd les chasseurs.", "Folklore slave", "Esprit sylvestre / maître forestier", 3, "Taïgas, clairières, sentiers", "Taille changeante, égarement")
add("leviathan", "Le dragon des eaux, trop grand pour le filet.", "Bible / traditions juives", "Serpent marin / primordial", 5, "Abysses, origines du monde", "Envergure océanique")
add("liche", "Le mage qui a arraché son âme à la mort pour l'enfermer ailleurs.", "Fantasy moderne", "Mort-vivant / arcaniste", 5, "Tombes, tours, sanctuaires profanés", "Immortalité liée à un réceptacle secret", False)
add("licorne", "La bête blanche, corne unique, vertu dangereuse.", "Bestiaires médiévaux", "Bête merveilleuse", 2, "Forêts profondes, clairières", "Corne purificatrice et capture par une jeune vierge")
add("lindworm", "Un dragon-serpent de Scandinavie et de Germanie.", "Folklore germanique et nordique", "Dragon serpentin / sans ailes", 4, "Tertres, caves, campagnes", "Anneaux, venin et parfois deux pattes antérieures")
add("loup-garou", "L'homme qui revêt la peau du loup et chasse parmi les vivants.", "Folklore européen", "Lycanthrope", 4, "Campagnes, bois, marges des villages", "Métamorphose humaine en loup")
add("lusca", "Le tentacule géant qui happe les imprudents dans les trous bleus.", "Folklore bahaméen contemporain, XXe siècle", "Céphalopode colossal / monstre marin", 4, "Trous bleus, récifs, grottes sous-marines", "Bras gigantesques et courants meurtriers des trous bleus", False)
add("lutin", "Le petit peuple des foyers et des bois français.", "Folklore français", "Esprit / farceur", 1, "Fermes, granges, lisières", "Tours, dons, disparitions")
add("lycanthrope", "Toute bête qui dort dans un humain.", "Folklore européen élargi", "Métamorphe / malédiction", 4, "Forêts, villages, terres sauvages", "Métamorphose d'humain en animal")

# --- M ---
add("mage", "Celui qui a fait de l'invisible un métier.", "Archétype universel / fantasy", "Magicien", 3, "Tours, écoles, cours", "Étude des arcanes", False)
add("manananggal", "La femme qui se sépare à la taille pour chasser la nuit.", "Folklore philippin", "Aswang / prédatrice ailée", 4, "Villages, toits, nuits", "Torse ailé, entrailles et vulnérabilité du corps abandonné")
add("mandragore", "La racine qui crie, trop humaine sous terre.", "Bestiaires et herbaires européens", "Plante magique / esprit végétal", 3, "Champs de potence, jardins secrets", "Forme anthropomorphe et cri")
add("manticore", "Lion, visage d'homme, queue de scorpion.", "Récits perses et grecs", "Hybride / prédateur", 5, "Inde imaginaire, déserts, marches", "Dards, crocs, voix humaine")
add("mara", "L'esprit qui chevauche le dormeur.", "Folklore scandinave", "Cauchemar / oppresseur", 3, "Lits, chevauchées nocturnes", "Pesanteur et chevauchée")
add("marid", "Le plus puissant des djinns marins, orgueilleux comme la vague.", "Traditions arabes", "Djinn puissant / esprit marin", 5, "Océans, palais de corail, tempêtes", "Puissance, orgueil et lien aux mers")
add("marilith", "La générale-démone aux six lames, stratège des armées abyssales.", "Fantasy de jeu de rôle", "Démon / stratège", 5, "Abîmes, champs de bataille infernaux", "Six bras armés et corps inférieur de serpent", False)
add("meduse", "La Gorgone dont le regard est un tombeau de pierre.", "Mythologie grecque", "Monstre au regard", 5, "Antre, île, temple oublié", "Pétrification, chevelure de serpents")
add("melusine", "La fée des eaux, serpent le samedi.", "Folklore français (Poitou)", "Fée / fondatrice de lignée", 3, "Sources, châteaux, bains secrets", "Double nature, tabou du regard")
add("mimique", "Le coffre qui a faim.", "Fantasy de jeu de rôle", "Changeforme / prédateur", 3, "Donjons, trésors, salles au butin", "Imitation d'objet, morsure", False)
add("minotaure", "L'homme-taureau au cœur du labyrinthe.", "Mythologie grecque", "Hybride / prisonnier mythique", 4, "Labyrinthe de Crète", "Force taurine et prison du Labyrinthe")
add("modron", "Un rouage vivant dans une machine cosmique qui ne tolère aucune erreur.", "Fantasy de jeu de rôle", "Créature artificielle / incarnation de l'ordre", 3, "Plans mécaniques, cités géométriques", "Hiérarchie absolue et corps géométrique", False)
add("moine", "Le corps comme unique grimoire.", "Traditions monastiques et arts martiaux de fantasy", "Ascète / combattant", 3, "Monastères, routes, sommets", "Discipline physique et intérieure", False)
add("momie", "Le défunt embaumé qui se relève pour défendre son tombeau.", "Fiction fantastique occidentale, XIXe-XXe siècles", "Mort-vivant / gardien", 4, "Tombes, pyramides, sables", "Bandelettes, malédiction et éternité desséchée", False)
add("monstre-rouilleur", "La bête qui mange le fer plus vite que la bataille.", "Fantasy de jeu de rôle", "Prédateur / corrosion", 3, "Donjons, arsenaux, caves", "Toucher qui rouille le métal", False)
add("mort-vivant", "Ce qui devrait reposer, et marche encore.", "Folklore universel / fantasy", "Mort animée", 3, "Cimetières, champs, cryptes", "Animation contre-nature")
add("mothman", "L'ombre ailée aux yeux rouges des ponts américains.", "Folklore contemporain, XXe siècle", "Cryptide / présage", 3, "Ponts, mines, villes industrielles", "Ailes, yeux lumineux, catastrophe annoncée", False)
add("mushussu", "Le dragon-serpent de Marduk, symbole royal.", "Mythologie mésopotamienne", "Dragon hybride / gardien", 4, "Portes de Babylone, temples", "Cornes, écailles, loyauté divine")
add("myconide", "Un peuple-champignon dont chaque nuage de spores porte une pensée.", "Fantasy de jeu de rôle", "Fungoïde / communauté souterraine", 2, "Grottes humides, forêts souterraines", "Communication par spores", False)

# --- N ---
add("naga", "Le serpent-roi, gardien des eaux et des trésors enfouis.", "Mythologies indiennes et asiatiques", "Serpent divin / aquatique", 4, "Rivières, palais sous-marins, jungles", "Corps ophidien, métamorphose et pouvoir sur les eaux")
add("naiade", "La nymphe d'une source, trop liée à son eau.", "Mythologie grecque", "Nymphe aquatique", 2, "Sources, fontaines, ruisseaux", "Vie liée à une eau vive")
add("nain", "Le peuple de la pierre, de l'enclume et des serments que rien n'use.", "Mythologies germanique et nordique / fantasy", "Petit peuple / forgeron", 3, "Montagnes, salles souterraines, mines", "Artisanat prodigieux, ténacité et mémoire des offenses")
add("necromancien", "Le mage qui refuse aux morts le droit de se taire.", "Occultisme et fantasy", "Magicien / maître des morts", 4, "Cryptes, champs, tours", "Animation et pacte avec les défunts", False)
add("nekomata", "Le chat à deux queues, trop vieux pour être inoffensif.", "Folklore japonais", "Yokai / félin", 3, "Maisons, toits, temples", "Deux queues, métamorphose et manipulation des morts")
add("nephilim", "Les êtres antédiluviens que certaines traditions font naître d'une union interdite.", "Bible hébraïque et traditions postbibliques", "Être antédiluvien / géant selon les traditions", 5, "Monde antédiluvien", "Origine énigmatique et stature légendaire")
add("nereide", "Les cinquante sœurs de la mer Méditerranée.", "Mythologie grecque", "Nymphe marine", 2, "Vagues, cortèges de Nérée", "Beauté marine, assistance aux marins")
add("nidhogg", "Le dragon qui ronge la racine du monde.", "Mythologie nordique", "Dragon / dévoreur cosmique", 5, "Racines d'Yggdrasil, Niflheim", "Rongement éternel, cadavres")
add("nisse", "Le petit gardien scandinave de la ferme.", "Folklore scandinave", "Esprit du foyer / tomte", 1, "Fermes, étables, greniers", "Bonnet rouge et offrande de bouillie de Noël")
add("nixe", "L'esprit des eaux germaniques, souvent noyeur.", "Folklore germanique", "Esprit aquatique", 3, "Rivières, lacs, moulins", "Chant, forme humaine, noyade")
add("norne", "Celle qui file, plus forte que les dieux.", "Mythologie nordique", "Destin / fileuse", 5, "Puits d'Urd, racines du monde", "Fil du destin")
add("nosferatu", "Le vampire au nom énigmatique, popularisé par la littérature et l'écran.", "Littérature vampirique et cinéma, XIXe-XXe siècles", "Vampire / porteur de peste", 4, "Cryptes, villes, nuits", "Soif de sang, contagion et horreur physique", False)
add("nymphe", "L'esprit local d'un lieu trop beau pour être vide.", "Mythologie grecque", "Esprit / nature", 2, "Bois, eaux, montagnes", "Attache à un site")

# --- O ---
add("occultiste", "L'initié qui cherche les lois cachées derrière le visible.", "Occultisme moderne", "Savant / praticien", 2, "Cabinets, loges, bibliothèques", "Savoir interdit", False)
add("ogre", "Le grand mangeur d'hommes des contes.", "Folklore européen", "Géant / anthropophage", 4, "Forêts, châteaux, chemins", "Faim d'humains, force")
add("oiseau-tonnerre", "L'esprit ailé dont le passage ébranle le ciel.", "Traditions autochtones d'Amérique du Nord", "Être-tonnerre / puissance céleste", 5, "Cieux, lacs, montagnes sacrées", "Battements d'ailes tonitruants et éclairs")
add("ombre", "Un mort réduit à sa silhouette affamée.", "Fantasy de jeu de rôle, XXe siècle", "Mort-vivant / ombre prédatrice", 3, "Cryptes, coins, crépuscules", "Drain de force et intangibilité", False)
add("ondine", "L'esprit des eaux douces qui cherche une âme parmi les mortels.", "Occultisme de Paracelse, XVIe siècle", "Élémentaire d'eau", 3, "Lacs, rivières, sources", "Corps d'eau et âme acquise par l'union humaine", False)
add("oni", "Le démon japonais, massue et faim.", "Folklore japonais", "Démon / ogre", 4, "Montagnes, enfers, seuils", "Cornes, peau vive, kanabō")
add("oracle", "La bouche d'un dieu, souvent à double tranchant.", "Antiquité méditerranéenne", "Devin / intercesseur", 2, "Sanctuaires, vapeurs, trépieds", "Parole prophétique", False)
add("orc", "Le peuple de la guerre, né des romans plus que des sagas.", "Fantasy littéraire, XXe siècle", "Humanoïde / guerrier", 3, "Camps, collines, forteresses", "Force, nombre, culture martiale", False)
add("oreade", "La nymphe de la montagne, sœur du roc.", "Mythologie grecque", "Nymphe montagnarde", 2, "Pics, grottes, sentiers d'altitude", "Attache aux monts")
add("orthros", "Le chien à deux têtes, frère de Cerbère.", "Mythologie grecque", "Gardien canin / bicéphale", 4, "Troupeaux monstrueux, confins", "Deux têtes, lignée typhonnienne")
add("otyugh", "L'ordure devenue prédateur, tentacules dans l'égout.", "Fantasy de jeu de rôle", "Aberration / charognard", 3, "Fosses d'aisances, décharges, caves", "Tentacules, infection, habitat d'immondices", False)
add("ours-hibou", "L'ours à tête de hibou, prédateur d'une férocité aveugle.", "Fantasy de jeu de rôle", "Hybride / prédateur sauvage", 4, "Forêts profondes, cavernes", "Force d'ours, bec acéré et agressivité", False)

# --- P ---
add("page", "L'enfant des armes, encore hors du serment.", "Archétype médiéval", "Serviteur / apprenti", 1, "Cours, châteaux", "Service nobiliaire", False)
add("paladin", "Le serment devenu armure.", "Archétype de fantasy (chanson de geste)", "Guerrier sacré", 3, "Ordres, routes, sièges", "Foi martiale et magie divine", False)
add("pegase", "Le cheval né du sang de Méduse, ailes ouvertes.", "Mythologie grecque", "Cheval ailé / divin", 3, "Cieux, sources, Hélicon", "Vol, inspiration des poètes")
add("peluda", "La bête velue de l'Huisne, cuirassée de piquants empoisonnés.", "Folklore sarthois (La Ferté-Bernard)", "Dragon / bête de rivière", 4, "Huisne, berges, campagnes de la Sarthe", "Piquants venimeux, souffle de feu et crues destructrices")
add("peri", "Un esprit persan, exilé du paradis, encore lumineux.", "Mythologie persane", "Fée / esprit ailé", 2, "Jardins, cieux, seuils du paradis", "Beauté, magie, rédemption possible")
add("peryton", "Le cerf-oiseau dont l'ombre est humaine.", "Borges / fantasy moderne", "Hybride / présage", 4, "Falaises, îles, cieux", "Ombre d'homme, soif de cœurs", False)
add("phenix", "L'oiseau qui meurt pour renaître plus vif.", "Antiquité (Égypte / Grèce) / bestiaires", "Oiseau solaire / cyclique", 2, "Autels de feu, déserts, cieux", "Immolation et renaissance")
add("pixie", "La petite fée piquante, plus farce que couronne.", "Folklore cornique et anglais", "Fée mineure", 1, "Landes, tertres, clairières", "Lumières, égarement, rires")
add("poltergeist", "Le bruit sans corps, colère dans les murs.", "Folklore européen moderne", "Esprit / manifestation", 2, "Maisons hantées, chambres, greniers", "Objets projetés et tapage")
add("pooka", "Parfois cheval, parfois ombre : toujours une route que l'on regrette d'avoir prise.", "Folklore irlandais", "Fée / esprit trompeur", 3, "Landes, routes, champs", "Métamorphose, chevauchées nocturnes et paroles ambiguës")
add("preta", "L'affamé éternel, gorge fine, ventre immense.", "Bouddhisme / hindouisme", "Esprit affamé", 2, "Cimetières, lieux désolés, mondes de renaissance", "Faim inextinguible")
add("pretre", "Le médiateur officiel du sacré.", "Archétype religieux universel", "Clerc", 2, "Temples, autels, processions", "Rite et intercession", False)
add("pyromancien", "Le mage qui a choisi le feu comme langue maternelle.", "Fantasy moderne", "Magicien / feu", 3, "Brasiers, champs de bataille, tours", "Maîtrise des flammes", False)

# --- Q-R ---
add("qilin", "La chimère chinoise dont la venue annonce un sage souverain.", "Mythologie chinoise", "Créature de bon augure / hybride", 2, "Cours impériales, forêts sacrées", "Andouillers, écailles et bienveillance")
add("quetzalcoatl", "Le Serpent à plumes, maître du vent, du savoir et de l'étoile du matin.", "Religions nahuas de Mésoamérique", "Divinité / Serpent à plumes", 5, "Cieux, temples, horizon de l'aube", "Vent, savoir, prêtrise et étoile du matin")
add("rakshasa", "Le changeforme nocturne qui dévore les hommes et profane les rites.", "Épopées et mythologies indiennes", "Être démoniaque / métamorphe", 5, "Forêts, champs de bataille, palais", "Métamorphose, illusion et anthropophagie")
add("redcap", "Le lutin au bonnet teint dans le sang.", "Folklore des Marches anglo-écossaises", "Fée malveillante / tueur", 4, "Ruines fortifiées des Marches anglo-écossaises", "Bonnet rouge et sabots de fer")
add("revenant", "Le mort qui revient pour une dette, pas pour durer.", "Folklore européen", "Mort-vivant / vengeur", 3, "Tombes, villages, serments brisés", "Retour ciblé, injustice")
add("roc", "L'oiseau qui prend un éléphant comme un poisson.", "Récits arabes et persans", "Oiseau colossal", 5, "Îles, océans, nids de montagne", "Envergure mythique")
add("rodeur", "L'œil de la lisière, plus piste que cour.", "Archétype de fantasy", "Éclaireur / survivant", 3, "Forêts, frontières, routes", "Pistage et autonomie", False)
add("rokurokubi", "Le jour, un visage ordinaire ; la nuit, un cou qui cherche dans les ténèbres.", "Folklore japonais", "Yokai / humain transformé", 3, "Maisons, auberges, rues nocturnes", "Cou démesurément extensible")
add("runiste", "Celui qui grave le destin dans le bois et la pierre.", "Traditions germaniques / fantasy", "Magicien / graveur", 3, "Pierres, halls, batailles", "Runes comme sorts", False)
add("rusalka", "L'esprit d'une jeune morte qui danse près des eaux et attire les vivants.", "Folklore slave", "Esprit féminin / aquatique", 3, "Rivières, saules, nuits de juin", "Danse, chant et mort au bord de l'eau")

# --- S ---
add("sahuagin", "Le requin debout, royaume sous les vagues.", "Fantasy de jeu de rôle", "Humanoïde marin / prédateur", 4, "Récifs, fosses, cités coralliennes", "Société guerrière aquatique", False)
add("salamandre", "La salamandre traverse les flammes sans jamais s'y consumer.", "Bestiaires européens et cosmologie de Paracelse", "Animal merveilleux / élémentaire de feu", 3, "Bûchers, fourneaux, volcans", "Vie dans le feu et résistance aux flammes")
add("sasquatch", "Le gardien velu des forêts, à la frontière du monde visible.", "Traditions des Sts'ailes (sásq'ets) et cryptozoologie nord-américaine moderne", "Être forestier / cryptide", 2, "Forêts du Nord-Ouest pacifique, montagnes", "Gardien et changeforme chez les Sts'ailes, cryptide furtif dans les récits modernes")
add("satyre", "Le compagnon indompté de Dionysos, ivre de danse et de désir.", "Mythologie grecque", "Esprit sauvage / cortège dionysiaque", 2, "Bois, vendanges, fêtes", "Oreilles et queue chevalines dans l'art ancien, traits caprins plus tardifs")
add("sciapode", "L'homme à la jambe unique dort à l'ombre de son propre pied.", "Récits antiques et médiévaux", "Humanoïde merveilleux", 1, "Indes imaginaires, terres brûlées", "Jambe unique et pied immense servant de parasol")
add("scylla", "Tapie dans la falaise face à Charybde, elle arrache six marins au navire.", "Mythologie grecque", "Monstre marin / dévoreuse", 5, "Caverne d'un détroit, écueils", "Six longs cous armés de gueules et douze pieds dans l'Odyssée")
add("selkie", "La femme-phoque, peau volée, nostalgie de mer.", "Folklore des Orcades et Shetland", "Changeforme marin", 2, "Côtes, récifs, foyers forcés", "Peau de phoque, mariage captif")
add("shoggoth", "Le protoplasme esclave a appris à imiter ses maîtres, puis à les haïr.", "Lovecraft, XXe siècle", "Aberration / masse protoplasmique", 5, "Cités antédiluviennes, glaces, profondeurs", "Yeux innombrables, imitation et révolte", False)
add("sidhe", "Les Aos Sí règnent sous les tertres, splendides et redoutables.", "Folklore irlandais", "Peuple féerique / noblesse surnaturelle", 4, "Tertres (sídhe), collines, seuils de Samhain", "Glamour, temps altéré et tabous")
add("simurgh", "L'oiseau-sage, assez vieux pour enseigner les rois.", "Mythologie persane", "Oiseau primordial / sage", 3, "Montagne, arbre du savoir, cieux", "Sagesse, guérison, envergure")
add("sirene", "Son chant promet le savoir et ne laisse derrière lui que des épaves.", "Mythologie grecque et bestiaires médiévaux", "Hybride ailé ou pisciforme / enchanteresse fatale", 4, "Îles, écueils, routes maritimes", "Femme-oiseau dans l'Antiquité, femme-poisson dans la tradition médiévale")
add("slaad", "Le chaos incarné, crapaud d'un plan trop libre.", "Fantasy de jeu de rôle", "Aberration / chaos", 4, "Limbes, failles, invasions", "Reproduction par implantation, couleurs de caste", False)
add("sleipnir", "Le cheval à huit jambes, monture d'un dieu.", "Mythologie nordique", "Monture divine", 3, "Neuf mondes, cieux, chemins d'Odin", "Huit jambes, course entre les mondes")
add("sluagh", "La chasse aérienne des morts sans repos déferle depuis l'ouest.", "Folklore gaélique écossais et irlandais", "Horde de morts / chasse nocturne", 4, "Cieux nocturnes, fenêtres tournées vers l'ouest", "Vol en essaim et rapt des âmes")
add("sorcier", "Il arrache ses pouvoirs aux secrets, aux pactes ou au sang.", "Folklore européen et fantasy", "Magicien / praticien occulte", 3, "Campagnes, cours, lieux retirés", "Maléfices, rituels et pactes possibles", False)
add("sorciere", "Celle que l'on accuse d'abord, et qui parfois sait.", "Folklore européen", "Praticienne / maléficieuse", 3, "Cabanes, villages, sabbats", "Herbes, maléfices, savoirs")
add("spadassin", "La lame comme seul argument.", "Archétype renaissant", "Escrimeur / mercenaire", 3, "Rues, cours, duels", "Maîtrise de l'épée", False)
add("spectre", "Un fantôme trop solide dans sa haine.", "Folklore / fantasy", "Esprit / vengeur", 4, "Ruines, serments, nuits", "Toucher glacial, intangibilité")
add("sphinx", "Lion royal en Égypte, énigme meurtrière sur la route de Thèbes.", "Mythologies égyptienne et grecque", "Hybride léonin / gardien ou monstre à énigme", 4, "Temples et tombes d'Égypte, route de Thèbes", "Pouvoir protecteur en Égypte, énigme fatale en Grèce")
add("spriggan", "Le petit gardien cornique, qui gonfle en géant.", "Folklore cornique", "Fée / gardien de trésor", 3, "Cromlechs, caches, landes", "Taille changeante, vol d'enfants")
add("sprite", "Une étincelle féerique assez vive pour égarer un voyageur.", "Fantasy moderne inspirée du folklore britannique", "Fée minuscule / esprit lumineux", 1, "Bosquets, clairières, jardins enchantés", "Lueur, vol et malices", False)
add("squelette", "Les os se relèvent, privés de chair mais non d'ordres.", "Imaginaire macabre européen et fantasy moderne", "Mort-vivant / serviteur animé", 2, "Cryptes, champs de bataille, laboratoires", "Animation magique d'une ossature", False)
add("strige", "L'oiseau-vampire antique, soif et nuit.", "Antiquité romaine", "Oiseau / vampire", 3, "Nuits, berceaux, toits", "Vol, sang, métamorphose")
add("strigoi", "Le mort-vivant roumain, cousin du vampire.", "Folklore roumain", "Vampire / revenant", 4, "Villages, tombes, Carpathes", "Sortie de tombe, maléfice")
add("succube", "La visiteuse nocturne donne au désir le visage de l'épuisement.", "Démonologie médiévale", "Démone / visiteuse nocturne", 3, "Chambres, sommeils, visions", "Séduction nocturne et épuisement de la victime")
add("svartalf", "L'artisan obscur de l'Edda, si proche du nain que les noms se confondent.", "Edda en prose de Snorri, XIIIe siècle", "Être souterrain / proche des nains", 3, "Svartálfaheimr, souterrains, forges", "Identité incertaine et artisanat merveilleux")
add("svirfneblin", "Le gnome des profondeurs, gris comme le schiste.", "Fantasy de jeu de rôle", "Gnome / souterrain", 2, "Outreterre, mines, cités cachées", "Discrétion, magie d'illusion, méfiance", False)
add("sylphe", "L'être de l'air voyage dans les vents comme l'homme marche sur terre.", "Cosmologie de Paracelse, XVIe siècle", "Être élémentaire / air", 2, "Vents, cimes, nuages", "Affinité absolue avec l'air et les vents")

# --- T ---
add("tabaxi", "Le peuple-chat, voyageur plus que roi.", "Fantasy de jeu de rôle", "Humanoïde félin / nomade", 2, "Jungles, caravanes, ports", "Curiosité, agilité, récits", False)
add("talos", "Le colosse de bronze qui ceint une île.", "Mythologie grecque", "Automate / gardien", 5, "Crète, rivages, mythes argonautiques", "Corps de bronze, veine d'ichor")
add("tanuki", "Le chien viverrin qui change de forme, bat du ventre et se rit des gens trop sérieux.", "Folklore japonais", "Yokai / esprit farceur", 2, "Bois, temples, routes", "Métamorphose, illusions et goût de la fête")
add("tarasque", "La bête du Rhône, carapace et fureur, vaincue par une sainte.", "Folklore provençal", "Dragon / bête de rivière", 5, "Rhône, Tarascon, marais", "Carapace, six pattes, légende de sainte Marthe")
add("tatzelwurm", "Le ver-chat des Alpes, entre deux rochers et deux témoignages.", "Traditions alpines et cryptozoologie, XIXe-XXe siècles", "Dragon nain / cryptide", 3, "Alpes, grottes, alpages", "Tête féline et corps serpentin")
add("templier", "Le moine-soldat garde les routes sous la croix et le fer.", "Histoire et archétype médiéval", "Ordre religieux / guerrier", 3, "Commanderies, routes, forteresses", "Règle monastique, discipline et cavalerie lourde", False)
add("tengu", "L'esprit ailé des montagnes, tour à tour fléau, ascète et maître d'armes.", "Folklore japonais", "Yokai / esprit montagnard", 4, "Montagnes, temples, forêts", "Bec ou long nez, ailes et maîtrise martiale")
add("thaumaturge", "Le faiseur de prodiges, entre saint et charlatan.", "Antiquité tardive / fantasy", "Magicien / faiseur de miracles", 3, "Cours, places, sanctuaires", "Prodiges publics", False)
add("tieffelin", "Un mortel marqué par un héritage infernal, sans en partager nécessairement la nature.", "Fantasy de jeu de rôle", "Planétaire / lignée infernale", 2, "Villes, marges, compagnies", "Traits infernaux et préjugés d'autrui", False)
add("tigre-garou", "L'homme prend la forme du tigre et la jungle retient son souffle.", "Folklores de l'Asie du Sud et du Sud-Est", "Métamorphe / félin", 4, "Jungles, villages, nuits", "Métamorphose en tigre, volontaire ou maudite")
add("titan", "Une puissance de l'ancien monde, renversée par les Olympiens.", "Mythologie grecque", "Divinité ancienne / puissance déchue", 5, "Monde primordial, cieux, Tartare pour les vaincus", "Génération divine antérieure aux Olympiens")
add("tomte", "Le petit gardien de la ferme protège chaque poutre tant qu'on respecte son dû.", "Folklore scandinave", "Esprit domestique / gardien de ferme", 1, "Fermes, étables, greniers", "Protection du domaine, offrande de bouillie et vengeance s'il est offensé")
add("treant", "L'arbre s'arrache au sol lorsque la forêt appelle à la guerre.", "Fantasy de jeu de rôle, XXe siècle, inspirée des Ents", "Végétal conscient / gardien", 4, "Forêts anciennes, sanctuaires sylvestres", "Force, lenteur et mémoire des siècles", False)
add("triton", "Le peuple à queue de poisson, sonneur de conque.", "Mythologie grecque", "Humanoïde marin", 3, "Cours de Poséidon, récifs", "Conque, queue, royaumes sous-marins")
add("troglodyte", "Le reptile puant des grottes, plus embuscade que royaume.", "Fantasy de jeu de rôle", "Reptilien / souterrain", 3, "Cavernes, boyaux, embuscades", "Puanteur, camouflage, tribu", False)
add("troll", "Le géant des montagnes fuit parfois le soleil qui le change en pierre.", "Folklore scandinave et fantasy moderne", "Géant / être sauvage", 4, "Montagnes, grottes, forêts reculées", "Pétrification solaire selon certains récits, régénération en fantasy")
add("trow", "Le petit peuple des Orcades, plus sombre que fée.", "Folklore des Orcades et Shetland", "Fée / nocturne", 2, "Tertres, nuits, îles", "Haine du jour, enlèvements")
add("typhon", "L'ouragan-père de monstres, rival de Zeus.", "Mythologie grecque", "Primordial / tempête", 5, "Cilicie, Etna, origines", "Cent têtes, vents, lignée monstrueuse")
add("tyrannoeil", "Un prédateur paranoïaque dont les rayons oculaires frappent tandis que son regard central étouffe la magie.", "Jeu de rôle américain, 1975", "Monstre oculaire / prédateur fantastique", 5, "Cavernes, ruines et complexes souterrains", "Œil central antimagique et pédoncules aux effets distincts", False)

# --- U-Z ---
add("umber-hulk", "Le fouisseur cuirassé dont les yeux brouillent l'esprit.", "Fantasy de jeu de rôle", "Prédateur souterrain", 4, "Galeries, Outreterre, mines", "Mandibules, confusion du regard", False)
add("valkyrie", "Elle traverse la bataille pour choisir les guerriers promis à Odin.", "Mythologie nordique", "Psychopompe / guerrière divine", 4, "Champs de bataille, cieux, Valhalla", "Choix d'une partie des morts au combat et service d'Odin")
add("valravn", "Le corbeau des morts réclame le sang d'un enfant pour redevenir chevalier.", "Ballades et folklore danois", "Corbeau surnaturel / changeforme", 3, "Champs de bataille, routes nocturnes, toits", "Intelligence humaine, pacte et métamorphose par le sang")
add("vampire", "Le mort qui boit pour ne pas s'arrêter.", "Folklore européen (Balkans) / littérature", "Mort-vivant / sang", 4, "Cryptes, villes, nuits", "Soif, contagion, tabous")
add("varcolac", "Le démon monte au ciel et mord le Soleil ou la Lune jusqu'à l'éclipse.", "Folklore roumain", "Dévoreur d'astres / démon céleste", 4, "Cieux, villages, éclipses", "Forme variable et dévoration du Soleil ou de la Lune")
add("vetala", "L'esprit suspendu aux arbres entre dans les cadavres et défie les vivants.", "Traditions hindoues et contes sanskrits", "Esprit / possesseur de cadavres", 3, "Terrains de crémation, arbres, nuits", "Possession des morts et énigmes dans le cycle de Vikram")
add("vila", "La nymphe des montagnes danse avec le vent et punit les serments trahis.", "Folklore slave méridional", "Esprit féminin / nymphe", 3, "Forêts, montagnes, clairières de danse", "Beauté, maîtrise des vents, guérison et vengeance")
add("vodyanoi", "Le maître irascible de l'étang entraîne sous l'eau ceux qui rompent ses règles.", "Folklore slave oriental", "Esprit aquatique / noyeur", 4, "Moulins, rivières, étangs", "Noyade, maîtrise des poissons et pactes avec les meuniers")
add("voleur", "Celui dont le métier est l'absence d'un objet.", "Archétype universel", "Filou / infiltré", 2, "Villes, guildes, toits", "Discrétion et ruse", False)
add("volva", "La voyante au bâton chante le destin devant les dieux et les hommes.", "Religion nordique préchrétienne et littérature norroise", "Devineresse / praticienne du seiðr", 3, "Halls, fermes, assemblées rituelles", "Bâton, seiðr et prophétie chantée")
add("vouivre", "Le dragon-serpent des fontaines, escarboucle au front.", "Folklore franc-comtois et alpin", "Dragon / gardien de source", 4, "Sources, grottes, trésors", "Joyau frontal, vol, venin")
add("vrock", "Le démon-vautour, danse et spores.", "Fantasy de jeu de rôle", "Démon / aviaire", 4, "Abîmes, champs de bataille", "Ailes, cri, danse de la ruine", False)
add("warforged", "Forgé pour la guerre, il doit maintenant apprendre à vivre.", "Univers d'Eberron, fantasy de jeu de rôle, XXIe siècle", "Être artificiel / personne", 3, "Anciennes forges, compagnies, cités", "Corps construit et identité conquise", False)
add("warg", "Un loup doué d'une intelligence cruelle, monture des armées de l'ombre.", "Fantasy littéraire du XXe siècle, d'après le vieux norrois vargr", "Loup monstrueux / monture maléfique", 4, "Landes, armées, forêts", "Taille, intelligence et alliance avec des peuples guerriers", False)
add("wendigo", "La faim devient esprit lorsque l'hiver brise le dernier interdit.", "Traditions de plusieurs peuples algonquiens d'Amérique du Nord", "Esprit de la faim / cannibale", 5, "Forêts hivernales, périodes de famine", "Faim insatiable, froid et transgression du tabou cannibale")
add("wight", "Le mort du tertre garde encore son trésor et sa volonté mauvaise.", "Fantasy moderne, d'après le vieil anglais wiht et le barrow-wight littéraire", "Mort-vivant / gardien de tertre", 3, "Tertres, ruines, nécropoles", "Garde funéraire et absorption de la force vitale", False)
add("wraith", "La haine survit au corps et glisse désormais parmi les brumes.", "Folklore écossais et fantasy moderne", "Esprit / apparition malveillante", 4, "Ruines, brumes, lieux de mort", "Immatérialité et absorption de la force vitale")
add("wyrm", "Le vieux serpent-dragon s'enroule sous la terre autour de son or.", "Traditions germaniques et fantasy, d'après le vieil anglais wyrm", "Dragon serpentin", 4, "Tertres, cavernes, trésors", "Corps serpentin, venin et garde jalouse de l'or")
add("wyverne", "Le dragon héraldique fend le ciel sur deux pattes et deux ailes.", "Héraldique britannique et fantasy moderne", "Dragon bipède / volant", 4, "Écus, bannières, falaises et cieux de fantasy", "Deux pattes, ailes membraneuses et queue barbelée")
add("xorn", "Le mangeur de gemmes, trois bras dans la pierre.", "Fantasy de jeu de rôle", "Élémentaire / minéral", 3, "Plans de Terre, veines, grottes", "Passage dans la roche, faim de minerais", False)
add("yaksha", "Le génie des trésors et des bois indiens.", "Mythologies indiennes", "Esprit / gardien", 3, "Forêts, grottes, richesses", "Ambivalence, magie, garde")
add("yeti", "L'homme des neiges laisse ses traces là où l'air devient trop rare.", "Traditions himalayennes, notamment tibétaines et sherpas, et cryptozoologie moderne", "Être montagnard / cryptide", 3, "Glaciers, cols, hautes neiges", "Fourrure, traces et adaptation à l'altitude")
add("yokai", "Le surnaturel japonais, trop vaste pour une seule forme.", "Folklore japonais", "Esprit / catégorie", 3, "Seuils, nuits, villages", "Métamorphose, caprice, monde invisible")
add("yuan-ti", "Le peuple-serpent, temple et venin.", "Fantasy de jeu de rôle", "Reptilien / cultiste", 4, "Jungles, ziggourats, cités perdues", "Hybridation ophidienne, intrigues", False)
add("yuki-onna", "La femme des neiges, beauté et gel.", "Folklore japonais", "Yokai / froid", 4, "Tempêtes de neige, cols, nuits", "Haleine glacée, disparition dans le blanc")
add("ziz", "Ses ailes voilent le soleil, pendant céleste du Béhémoth et du Léviathan.", "Traditions juives rabbiniques médiévales", "Oiseau primordial", 5, "Cieux, hauteurs du monde", "Envergure cosmique et ailes capables d'obscurcir le soleil")
add("zmey", "Le dragon slave, souvent à trois têtes, parfois trop humain.", "Folklore slave", "Dragon / orage", 5, "Montagnes, orages, princesses", "Têtes multiples, feu, parfois séduction")
add("zombie", "Du zonbi asservi au mort contagieux moderne, le corps marche sans volonté.", "Traditions haïtiennes et cinéma d'horreur moderne", "Personne asservie ou mort animé / serviteur", 3, "Récits haïtiens, cimetières et villes ravagées au cinéma", "Asservissement magique en Haïti, faim et contagion dans la fiction moderne")


def load_creatures() -> list[dict]:
    text = DATA_JS.read_text(encoding="utf-8")
    start = text.index("{")
    end = text.rindex("}") + 1
    return json.loads(text[start:end])["creatures"]


def main() -> None:
    creatures = load_creatures()
    missing = [c["slug"] for c in creatures if c["slug"] not in FICHES]
    extra = [s for s in FICHES if s not in {c["slug"] for c in creatures}]
    if missing:
        raise SystemExit("fiches manquantes: " + ", ".join(missing))
    if extra:
        print("fiches en trop (ignorées):", extra)

    payload = {}
    for creature in creatures:
        slug = creature["slug"]
        row = dict(FICHES[slug])
        row["nom"] = creature["name"]
        payload[slug] = row

    OUT_JS.write_text(
        "window.FF_FICHES = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"fiches={len(payload)} wrote {OUT_JS}")


if __name__ == "__main__":
    main()
