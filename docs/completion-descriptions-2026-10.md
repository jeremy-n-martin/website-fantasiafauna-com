# Complément des descriptions — 28 octobre 2026

À la demande de l’utilisateur après la fiche du Basilic, les 231 présentations limitées à une rubrique sont complétées avec les textes existants : Mythes et origines, Particularités, Histoire naturelle (Comportement, Habitat, Alimentation, Intelligence, Reproduction, Prédateurs), Héritage et curiosités. Les 340 fiches disposent donc de toutes les rubriques.

La source publiée est data/descriptions.json, construite en conservant les accroches précédemment corrigées. Les brouillons data/notices et le registre d’approbations sont préservés. Les 109 notices relues gardent la priorité. Il ne s’agit pas d’attribuer rétroactivement une relecture indépendante aux 231 autres textes. Les contraintes du constructeur historique des notices longues ne sont pas modifiées.

Le constructeur des descriptions exige désormais cinq rubriques, six sous-parties naturelles, des paragraphes non vides et non dupliqués, des références bien formées et des appels résolus. Le test de rendu impose cinq sections et onze liens de sommaire sur chaque fiche, sans bibliographie publique. Les textes n’ont pas été allongés artificiellement pour atteindre un nombre de mots.

## Basilic

La fiche opposait une accroche sur le petit serpent antique à des mesures de plusieurs mètres et dizaines de kilos, sans préciser leur origine. Les champs Taille et Poids distinguent désormais les versions. Une explication a été ajoutée aux Particularités ; le passage sur la belette a été recoupé dans Pline, Histoire naturelle VIII, 33 (traduction Bostock et Riley, Project Gutenberg). Les variantes antiques, médiévales et de fantasy sont séparées dans la lecture.

## Validation

python tools/build_descriptions.py --check
python tools/check_page_shells.py
node tools/check_no_public_sources.js
node tools/check_notice_render.js
node tools/check_anchor_navigation.js
