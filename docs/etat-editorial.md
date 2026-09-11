# État du chantier éditorial — premier point de sauvegarde

Ce point de sauvegarde contient **70 notices longues au format JSON** dans `data/notices/`, sur un objectif de 340. Il reste donc **270 notices à rédiger**. Les 340 fiches synthétiques du catalogue ne doivent pas être confondues avec ces notices longues.

Les 70 fichiers passent les contrôles structurels : rubriques, sous-parties d'histoire naturelle, longueur minimale et résolution des appels de sources. Ce contrôle ne certifie ni l'exactitude documentaire ni la qualité littéraire.

## Relecture

Une première relecture indépendante a examiné 18 notices et demandé des reprises substantielles sur neuf : Aarakocra, Aasimar, Aboleth, Cryomancien, Dryade, Écuyer, Marilith, Quetzalcoatl et Sidhe. Ces reprises restent ouvertes à ce point de sauvegarde. Les autres notices ne sont pas réputées validées par défaut.

Les corrections portent notamment sur l'attribution d'un épisode dans Dryade, la télépathie de Marilith et les passages qui donnent des conseils d'écriture au lieu de décrire les créatures.

## Sauvegarde Git et intégration au site

L'utilisateur demande désormais des commits et pushes réguliers sur `main`, sans attendre le catalogue complet. Les brouillons sont donc sauvegardés dans Git avec leur statut explicite.

Le fichier chargé par le navigateur, `js/notices.js`, reste inchangé dans ce point de sauvegarde. Les JSON de travail ne deviennent pas automatiquement des notices visibles sur le site. Leur intégration requiert une étape distincte de relecture et d'assemblage.

Aucun journal d'agent, cache documentaire, paquet de test installé localement ou réglage Hermes n'est destiné à être publié.
