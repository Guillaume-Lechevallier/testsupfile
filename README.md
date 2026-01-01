# SUPFile mobile + web

Applications React Native (Expo Router) et React Web proposant une page de connexion moderne pour SUPFile et une
prévisualisation de l'espace fichiers avec des données de démonstration.

## Prérequis
- Node.js 18+ et npm
- Expo CLI (optionnel, `npx expo` est utilisé dans les scripts)

## Installation
```bash
npm install
```

Installez ensuite la version web :
```bash
cd web
npm install
```

## Lancement du front
Lance un serveur web Expo afin de vérifier le rendu de l'écran de connexion mobile :
```bash
npm run web -- --port 19006 --non-interactive --clear
```
Arrêtez le serveur avec `Ctrl+C` une fois la compilation terminée.

Lance l'équivalent web en React (Vite) :
```bash
cd web
npm run dev -- --host 0.0.0.0 --port 5173
```

## Structure
- `mobile/app/index.tsx` : écran de connexion principal (Expo Router).
- `mobile/app/_layout.tsx` : configuration du Stack Expo Router (route d'accueil, onglets, modale).
- `mobile/components/` : composants utilitaires Expo.
- `mobile/app/files.tsx` : écran vitrine listant des fichiers/dossiers fictifs avec les icônes d'extensions.
- `web/src/screens/Login.tsx` : écran de connexion côté web.
- `web/src/screens/Files.tsx` : vue web listant les fichiers/dossiers factices.

## Fonctionnalités
### Écran de connexion
- En-tête épuré avec icône de menu.
- Logo SUPFile avec icône cloud.
- Champs stylisés pour l'email et le mot de passe avec chevrons.
- Bouton de connexion désactivé tant que le formulaire est incomplet.
- Validation simple : les identifiants `admin` / `admin` redirigent vers l'explorateur de fichiers démo.
- Alternative de connexion Google et invitation à l'inscription.
- Barre de pied de page avec icônes de réseaux sociaux et liens légaux.

### Explorateur de fichiers (données de test, aucun back-end)
- Grille de dossiers et fichiers factices pour chaque type d'extension disponible dans `assets/icons`.
- Barre de recherche statique et bouton de déconnexion (non fonctionnels, pour la mise en forme).
- Barre latérale colorée rappelant la charte SUPFile.

### Équivalent web
- Même logique de connexion (admin/admin) avec redirection vers `/files`.
- Reprise des cartes, du fil d'Ariane et de la barre latérale au format web React.

## Back-end et base de données
Ce dépôt ne contient pas d’API ni de base de données. Aucune migration n'est nécessaire (pas de `last_update.sql`).
