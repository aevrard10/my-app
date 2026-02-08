# E2E Scenarios (Detox)

## Pré-requis
- Build iOS debug (dev client)
- Base locale vide

## Scénario 1 — Onboarding + création reptile
- Ouvrir l’app
- Aller à Reptiles
- Ajouter un reptile (nom, espèce, type, date naissance)
- Vérifier qu’il apparait dans la liste

## Scénario 2 — Agenda + notification
- Créer un événement à +5 min, rappel à l’heure
- Fermer l’app
- Vérifier réception notification

## Scénario 3 — Stock alimentaire
- Ajouter un aliment (ex: souris adulte, qty 5)
- Incrémenter +1, décrémenter -1
- Vérifier stock affiche 5 → 6 → 5
- Empêcher sous‑0

## Scénario 4 — Mesures
- Ajouter une mesure (poids + taille)
- Vérifier graphique apparait

## Scénario 5 — Santé
- Ajouter un événement santé (type + description)
- Vérifier dans historique santé

## Scénario 6 — QR code
- Ouvrir fiche reptile
- Générer QR
- Scanner → deep link vers fiche

## Scénario 7 — Offline
- Activer mode avion
- Ajouter un événement
- Fermer / relancer → event toujours présent

