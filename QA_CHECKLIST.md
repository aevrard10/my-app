# QA Checklist (Mobile)

## Installation & lancement
- Build dev/TestFlight OK (iOS)
- Lancement à froid sans crash
- Migration locale OK (si ancien stockage)

## Mode hors-ligne
- Activer mode avion
- Ajouter un reptile
- Ajouter un événement
- Ajouter un repas (stock)
- Ajouter une mesure
- Ajouter un événement santé
- Fermer / relancer l’app → données conservées

## Reptiles
- Ajout (photo, type, espèce, date naissance, dangerosité)
- Edition fiche (date naissance picker, notes, habitat)
- Suppression
- QR code ouvre la fiche via deep link

## Agenda
- Création événement (date/heure/reptile/type/recurrence)
- Modification d’événement
- Suppression occurrence / série
- Notifications locales (à l’heure / 10 min / 1h)

## Stock alimentaire
- Ajout d’un aliment (type auto + recherche)
- Modification stock (+/-)
- Suppression d’un aliment
- Stock à 0 ne passe pas en négatif
- Historique stock

## Santé
- Ajout événement santé
- Historique santé
- Suppression d’un événement santé

## Galerie & PDF
- Ajout photo (mobile)
- Affichage galerie (min 5 slots)
- Export PDF (iOS/Android uniquement)

## Performances
- 1 reptile + 5000 événements → UI fluide
- Scroll liste reptiles / agenda / stock sans lag visible

