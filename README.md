# VoltR · Générateur de signature e-mail

Outil **portable et autonome** : un seul fichier `index.html`, sans installation ni serveur.
Un double-clic l'ouvre dans le navigateur par défaut (Mac, Windows, Linux). Il fonctionne aussi en ligne (GitHub Pages, puis voltr.tech).

## Utilisation

1. Ouvrir `index.html` (double-clic) ou la version en ligne.
2. Remplir le formulaire : l'aperçu se construit en direct (formats ordinateur/mobile, thèmes clair/sombre).
   Contour vert = champ valide ; contour orange = champ invalide (il ne sera pas affiché, sans bloquer la génération).
3. Cliquer sur **Générer vos signatures**, choisir sa messagerie (Gmail, Outlook, Apple Mail, Spark, Code HTML) puis suivre le guide affiché.

### Règles d'affichage

| Champ | Règle |
|---|---|
| Nom | Seul champ obligatoire |
| Titre | Facultatif (boîtes génériques ou de service) : s'il est vide, le filet se place sous le nom. |
| Téléphone | Numéros français normalisés en `+33 X XX XX XX XX` (lien `tel:`). Un numéro non reconnu est masqué. |
| E-mail | Masqué si vide ou invalide (lien `mailto:`). |
| LinkedIn | Profil `linkedin.com/in/…` valide → profil de la personne ; sinon → [page VoltR](https://www.linkedin.com/company/voltr/home/). |
| Rendez-vous | Lien `http(s)` valide → ligne « Prendre rendez-vous » ; sinon la ligne est masquée et la signature se resserre. |
| www.voltr.tech | Fixe pour tout le monde. |
| Accroche | Figée : « Batteries lithium françaises à impact positif » (intégrée à l'image du bloc). |

### Versions produites

| Version | Usage |
|---|---|
| Ordinateur | Gmail, Apple Mail, Spark (copier-coller) |
| Ordinateur · Outlook | Outlook web / nouveau / Mac / classique (police Arial en premier) + fichier `.htm` pour Outlook classique |
| Mobile (compacte, 344 px) | Mail iOS, Outlook mobile, Spark mobile |
| Texte | App Gmail mobile (qui n'accepte que du texte) |
| Code HTML | Autres clients, éditeurs HTML, archivage |

## Choix techniques (issus des tests « VOLTR V2 » sur Notion)

- **Bloc VoltR = image PNG @2x** (448×350 affichée en 224×175) : le dégradé, le logo et l'accroche restent identiques partout, y compris en mode sombre. Les dimensions sont fixées dans les attributs *et* dans le style (corrige l'image « écrasée » dans Gmail et Outlook).
- **Aucun fond sur la colonne texte** : chaque client adapte le texte en mode sombre sans créer de bloc de couleur différente (corrige les « fonds de couleur différente » de Spark, Outlook et Gmail iOS).
- **Filet gris moyen `#9C9CA8`** : il reste visible sur fond clair comme sur fond sombre (l'ancien `#121212` disparaissait).
- **Téléphone et e-mail en liens explicites non soulignés** : Gmail ne les re-souligne plus automatiquement.
- **Icône LinkedIn opaque** (carré bleu, lettres blanches) : lisible sur les deux thèmes.
- **Mise en page en tableaux, styles en ligne**, polices `Helvetica Neue / Helvetica / Arial` (Sequel Sans n'est pas installée chez les destinataires ; la version Outlook met Arial en premier pour éviter le repli sur Times).
- L'interface embarque la police **Inter** (licence OFL, voir `brand/INTER-LICENSE.txt`), la plus proche de Sequel Sans parmi les polices libres. Elle sert à l'interface et au texte de l'image.

## Hébergement des images

Les messageries n'affichent pas les images intégrées au code d'une signature : `assets/signature-block.png` et `assets/linkedin.png` doivent donc être **en ligne**.
Le réglage se fait sans toucher au code, dans **Paramètres avancés** en bas du générateur :

| Mode | Quand l'utiliser |
|---|---|
| **Automatique** (par défaut) | Page publiée en ligne (GitHub Pages, site web) : les images sont prises dans le dossier `assets/` à côté de la page. |
| **Dossier en ligne** | Images publiées dans un autre dossier web (ex. `https://www.exemple.fr/signature/assets/`). |
| **Liens individuels** | Un lien par image, par exemple des liens de partage **Google Drive** : l'outil les convertit en liens d'image directs et vérifie qu'ils fonctionnent. |

Le bouton **Télécharger le générateur configuré (.html)** produit une copie du générateur avec ce réglage intégré. C'est ce fichier qu'on distribue : il s'ouvre d'un double-clic, sans aucun réglage.
Un `index.html` ouvert en local sans réglage affiche un avertissement « Hébergement des images non configuré ».

Pas à pas : [`docs/tuto-1-github.html`](docs/tuto-1-github.html) (GitHub Pages) et [`docs/tuto-2-google-drive.html`](docs/tuto-2-google-drive.html) (fichier .html + Google Drive).

### Changer d'hébergement

Les signatures déjà installées gardent l'adresse des images au moment de leur création. Après un changement d'hébergement, chaque utilisateur doit **regénérer et réinstaller** sa signature ; gardez l'ancien hébergement en ligne le temps de la transition.

## Régénérer les images

```bash
npm i -D playwright            # une fois
node tools/build-assets.cjs    # assets/signature-block.png + assets/linkedin.png
```

Les images sont produites par le même code que l'aperçu (`window.VoltRSignature.renderBlock`), donc toujours identiques.
Pour changer l'accroche un jour : modifier `CFG.DEFAULT_BASELINE` dans `index.html`, relancer ce script et republier `assets/signature-block.png` (toutes les signatures existantes se mettent à jour, l'adresse de l'image ne change pas).

## Arborescence

```
index.html              Générateur (autonome : CSS, JS, polices et favicon intégrés)
assets/                 Images hébergées référencées par les signatures
  signature-block.png   Bloc VoltR, accroche officielle
  linkedin.png          Icône LinkedIn
brand/                  Kit de marque VoltR (logos SVG/PNG, favicon, webclip)
docs/                   Tutoriels (GitHub Pages ; fichier .html + Google Drive)
tools/build-assets.cjs  Génération des PNG via Playwright
```
