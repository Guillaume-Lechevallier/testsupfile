# SUPFile mobile

Application React Native (Expo Router) proposant une page de connexion moderne pour SUPFile.

## Prérequis
- Node.js 18+ et npm
- Expo CLI (optionnel, `npx expo` est utilisé dans les scripts)

## Installation
```bash
npm install
```

## Lancement du front
Lance un serveur web Expo afin de vérifier le rendu de l'écran de connexion :
```bash
npm run web -- --port 19006 --non-interactive --clear
```
Arrêtez le serveur avec `Ctrl+C` une fois la compilation terminée.

## Structure
- `app/index.tsx` : écran de connexion principal.
- `app/_layout.tsx` : configuration du Stack Expo Router (route d'accueil, onglets, modale).
- `components/` : composants utilitaires fournis par le squelette Expo.

## Fonctionnalités de l'écran de connexion
- En-tête épuré avec icône de menu.
- Logo SUPFile avec icône cloud.
- Champs stylisés pour l'email et le mot de passe avec chevrons.
- Bouton de connexion désactivé tant que le formulaire est incomplet.
- Alternative de connexion Google et invitation à l'inscription.
- Barre de pied de page avec icônes de réseaux sociaux et liens légaux.

## Back-end et base de données
Ce dépôt ne contient pas d’API ni de base de données. Aucune migration n'est nécessaire (pas de `last_update.sql`).
