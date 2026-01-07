# SUPFile mobile + web

Applications React Native (Expo Router) et React Web proposant une page de connexion moderne pour SUPFile et une
prévisualisation de l'espace fichiers synchronisée avec l'API Node.js.

## Prérequis
- Node.js 18+ et npm
- PostgreSQL 13+ (pour l'API)
- Expo CLI (optionnel, `npx expo` est utilisé dans les scripts)

## Installation complète
Un script unique prépare le back-end, le front web, l'application mobile et initialise la base de données.

```bash
./scripts/install.sh
```

Il copie les fichiers `.env.example` en `.env` si besoin. Pensez à ajuster les variables (mot de passe DB, secret JWT).

### Variables d'environnement
- `back/.env` : `PORT`, `CLIENT_URL`, `JWT_SECRET`, `DB_*`.
- `web/.env` : `VITE_API_URL` (URL de l'API).
- `mobile/.env` : `EXPO_PUBLIC_API_URL` (URL de l'API, utiliser `http://10.0.2.2:8080` pour Android Emulator).

## Lancement du front
Lance un serveur web Expo afin de vérifier le rendu de l'écran de connexion mobile :
```bash
cd mobile
npm run web -- --port 19006 --non-interactive --clear
```
Arrêtez le serveur avec `Ctrl+C` une fois la compilation terminée.

Lance l'équivalent web en React (Vite) :
```bash
cd web
npm run dev -- --host 0.0.0.0 --port 5173
```

## Lancement du back-end
```bash
cd back
npm run start
```

## Structure
- `back/` : API Node.js (Express) et accès PostgreSQL.
- `mobile/` : application Expo (package.json, app.json, tsconfig.json).
- `mobile/app/index.tsx` : écran de connexion principal (Expo Router).
- `mobile/app/_layout.tsx` : configuration du Stack Expo Router (route d'accueil, onglets, modale).
- `mobile/components/` : composants utilitaires Expo.
- `mobile/app/files.tsx` : écran listant les fichiers/dossiers issus de l'API.
- `web/src/screens/Login.tsx` : écran de connexion côté web.
- `web/src/screens/Files.tsx` : vue web listant les fichiers/dossiers renvoyés par l'API.

## Fonctionnalités
### Écran de connexion
- En-tête épuré avec icône de menu.
- Logo SUPFile avec icône cloud.
- Champs stylisés pour l'email et le mot de passe avec chevrons.
- Bouton de connexion désactivé tant que le formulaire est incomplet.
- Connexion et inscription via l'API (`/api/auth/login` et `/api/auth/register`).
- Alternative de connexion Google et invitation à l'inscription.
- Barre de pied de page avec icônes de réseaux sociaux et liens légaux.

### Explorateur de fichiers (API)
- Grille de dossiers et fichiers provenant de l'API (`/api/files`).
- Barre de recherche statique et bouton de déconnexion (non fonctionnels, pour la mise en forme).
- Barre latérale colorée rappelant la charte SUPFile.

### Équivalent web
- Même logique de connexion/inscription via l'API avec redirection vers `/files`.
- Reprise des cartes, du fil d'Ariane et de la barre latérale au format web React.

## Back-end et base de données
- L'API Node.js (Express) est disponible dans `back/` et utilise PostgreSQL.
- Les variables d'environnement sont décrites dans `back/.env.example`.
- L'initialisation de la base est fournie dans `back/db/init.sql`.
- Le OAuth Google est optionnel : renseignez les variables `GOOGLE_*` si besoin.
