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

Les messageries n'affichent pas les images intégrées au code d'une signature : les PNG de `assets/` doivent donc être **en ligne**.

- Si la page est servie en ligne (GitHub Pages, voltr.tech…), les images sont prises dans le dossier `assets/` **à côté de la page**. Le passage sur voltr.tech est donc automatique.
- Si la page est ouverte en local (double-clic), l'adresse par défaut est `https://giageniusgui.github.io/VoltR-Signature-Generator/assets/` (modifiable dans `CFG.FALLBACK_ASSET_BASE` ou dans **Paramètres avancés**).
- L'outil vérifie que les images sont accessibles et affiche un avertissement sinon.

### Activer GitHub Pages

*Settings* → *Pages* → *Build and deployment* → *Deploy from a branch* → choisir la branche (par ex. `main`) et le dossier `/ (root)`.

### Migration vers voltr.tech

Copier `index.html` et le dossier `assets/` à l'emplacement voulu sur voltr.tech (ex. `voltr.tech/signature/`). Mettre ensuite à jour `CFG.FALLBACK_ASSET_BASE` dans `index.html` pour la version hors ligne.
Attention : les signatures déjà installées continueront de pointer vers l'ancienne adresse tant qu'elles ne seront pas régénérées. Gardez les deux hébergements le temps de la transition.

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
tools/build-assets.cjs  Génération des PNG via Playwright
```
