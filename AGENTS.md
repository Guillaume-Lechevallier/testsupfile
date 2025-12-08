# Consignes pour les prochains agents

- Toujours mettre à jour `README.md` lorsque vous ajoutez ou modifiez une fonctionnalité visible.
- Vérifier le rendu web avec `npm run web -- --port 19006 --non-interactive --clear` (arrêter avec `Ctrl+C`).
- Le projet est uniquement frontal (Expo/React Native) : aucun backend ou base de données n'est présent. Si une évolution nécessite un schéma SQL, placez les instructions dans `last_update.sql` et archivez l'ancien contenu dans `last_update_old.sql` si besoin.
- Évitez d'ajouter des fichiers binaires : privilégiez les sources texte et les assets déjà présents.
- Les captures d'écran via `browser_container.run_playwright_script` ont rencontré des erreurs génériques dans cet environnement; prévoyez une alternative (exécution locale, autre outil) si besoin d'une preuve visuelle.
