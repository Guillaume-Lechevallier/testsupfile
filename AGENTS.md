# Consignes pour les prochains agents

- Toujours mettre à jour `README.md` lorsque vous ajoutez ou modifiez une fonctionnalité visible.
- Vérifier le rendu web avec `npm run web -- --port 19006 --non-interactive --clear` (arrêter avec `Ctrl+C`).
- Le code mobile (Expo/React Native) et sa configuration se trouvent dans `mobile/` ; la version web React est dans `web/` (Vite).
- Pour lancer le web React : `cd web && npm run dev -- --host 0.0.0.0 --port 5173`.
- Le back-end Node.js (Express) est dans `back/` et dépend d'une base PostgreSQL. Si une évolution nécessite un schéma SQL, placez les instructions dans `last_update.sql` et archivez l'ancien contenu dans `last_update_old.sql` si besoin.
- Évitez d'ajouter des fichiers binaires : privilégiez les sources texte et les assets déjà présents.
- Les captures d'écran via `browser_container.run_playwright_script` ont rencontré des erreurs génériques dans cet environnement; prévoyez une alternative (exécution locale, autre outil) si besoin d'une preuve visuelle.
- Le script `scripts/install.sh` installe les dépendances front/back et initialise la base à partir de `back/db/init.sql`.
- L'écran de connexion redirige vers `/files` après une authentification via l'API (`/api/auth/login` ou `/api/auth/register`).
