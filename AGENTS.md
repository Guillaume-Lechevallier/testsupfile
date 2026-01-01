# Consignes pour les prochains agents

- Toujours mettre à jour `README.md` lorsque vous ajoutez ou modifiez une fonctionnalité visible.
- Vérifier le rendu web avec `npm run web -- --port 19006 --non-interactive --clear` (arrêter avec `Ctrl+C`).
- Le code mobile (Expo/React Native) se trouve désormais dans `mobile/` et la version web React dans `web/` (Vite).
- Pour lancer le web React : `cd web && npm run dev -- --host 0.0.0.0 --port 5173`.
- Le projet est uniquement frontal (Expo/React Native) : aucun backend ou base de données n'est présent. Si une évolution nécessite un schéma SQL, placez les instructions dans `last_update.sql` et archivez l'ancien contenu dans `last_update_old.sql` si besoin.
- Évitez d'ajouter des fichiers binaires : privilégiez les sources texte et les assets déjà présents.
- Les captures d'écran via `browser_container.run_playwright_script` ont rencontré des erreurs génériques dans cet environnement; prévoyez une alternative (exécution locale, autre outil) si besoin d'une preuve visuelle.
- L'écran de connexion redirige vers `/files` avec les identifiants de démo `admin` / `admin`, qui affiche la grille d'icônes basée sur `assets/icons/*`.
