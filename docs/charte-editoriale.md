# Fantasia Fauna — charte éditoriale

Fantasia Fauna est un bestiaire encyclopédique consacré aux créatures fantastiques, mythologiques, folkloriques et légendaires du monde entier. Chaque notice doit donner envie de poursuivre la lecture, en associant précision documentaire, observation naturaliste et force d'évocation.

## Voix

Écrire en français adulte, vivant et précis. Chercher le merveilleux dans les détails propres à la créature : un geste, une matière, une coutume, un paysage. Varier le rythme. Être épique sans emphase, mystérieux sans flou, érudit sans appareil universitaire envahissant. L'ombre, la grâce ou la tragédie dépendent du sujet, non d'une formule commune.

Éviter les introductions interchangeables, les séries de phrases nominales dramatiques, les conclusions publicitaires, les « depuis la nuit des temps », « bien plus qu'un simple », « incarne la dualité », « dans la riche tapisserie », les répétitions de « ce n'est pas X, c'est Y ». Aucun bavardage de chatbot dans le texte publié. Ne pas produire les notices par substitution de noms dans un canevas de prose.

## Structure de référence

Conserver les cinq rubriques de la notice du Tyrannœil et une courte description d'ouverture :

1. `fascination` : présence, silhouette, ressort singulier de fascination.
2. `legendes` : traditions situées, récits, sources, transformations historiques.
3. `anomalies` : anatomie, pouvoirs, limites et contradictions propres à la créature.
4. `naturelle` : introduction puis six parties, dans cet ordre : Comportement, Habitat, Alimentation, Intelligence, Reproduction, Prédateurs.
5. `reliques` : étymologie sûre, objets, iconographie, variantes ou postérité.

Les titres visibles existants sont conservés. Les catégories humaines du catalogue (Archer, Acolyte, etc.) restent des fonctions ou des archétypes humains : ne pas les inventer comme espèces. Adapter l'histoire naturelle à leurs communautés, leur transmission et leurs adversaires, en expliquant ce choix avec sobriété.

## Rigueur

- Distinguer récit traditionnel, religion vivante, invention littéraire, création de jeu de rôle et interprétation proposée par Fantasia Fauna.
- Nommer les peuples, lieux, textes ou collecteurs lorsqu'ils sont connus. Ne pas fusionner toutes les traditions en une biologie prétendument universelle.
- Vérifier les affirmations historiques structurantes et les anecdotes précises dans des sources effectivement consultées. Préférer textes primaires, institutions patrimoniales, musées, travaux spécialisés et documentation officielle des univers fictifs ; une encyclopédie secondaire peut aider à retrouver ces sources.
- Conserver des références consultables et des appels de source discrets. Ne pas inventer d'URL, de citation ou de date. Ne pas recopier de longs passages de sources modernes.
- Quand les traditions ne décrivent ni régime alimentaire, ni reproduction, ni prédateur, ne pas fabriquer une donnée zoologique. Expliquer plutôt comment les récits font apparaître, vivre, disparaître ou transmettre cette figure. Les rapprochements et hypothèses doivent être reconnaissables comme tels.
- Une scène évocatrice peut illustrer un motif attesté ; elle ne doit jamais se faire passer pour un conte local retrouvé.
- Les univers modernes ont des versions et des éditions : situer les variantes importantes. Un dragon chromatique de jeu de rôle n'est pas une espèce traditionnelle attestée dans un folklore ancien.
- Ne pas attribuer une origine ancienne au Forgelet ou à toute autre entrée dont la provenance n'est pas établie. Vérifier la fiche existante ; annoncer une création de fantasy lorsqu'il s'agit d'une interprétation du catalogue.

## Livraison

Les sources éditables sont des fichiers JSON individuels dans `data/notices/`. Chaque fichier contient `description`, `sections` et `sources` (objets `id`, `title`, `url`). Le fichier `js/notices.js` est assemblé à partir de ces fichiers. La notice du Tyrannœil sert de référence et son texte ne doit pas être remplacé par une version plus pauvre.

Les contrôles techniques vérifient les 340 identifiants exacts, les cinq rubriques, les six sous-parties, les références, les paragraphes vides et les duplications. Ils ne remplacent pas une relecture documentaire et stylistique.

Effectuer des commits et des pushes réguliers sur `main`, par lots cohérents et contrôlés, sans attendre les 340 notices. Cette consigne remplace l'interdiction initiale des pushes intermédiaires. Distinguer la sauvegarde des brouillons JSON dans Git de leur intégration au site via `js/notices.js`. Ne pas présenter des notices rédigées comme relues ou validées avant leur contrôle effectif.
