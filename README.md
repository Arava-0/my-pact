# pact.

[Français](#fr--français) | [English](#en--english)

<video src="docs/preview.mp4" controls width="100%"></video>


---

## FR — Français

### Présentation

**pact.** est une plateforme minimaliste de signature électronique de contrats, auto-hébergeable et sans tiers de confiance.

- Choisissez un **modèle de contrat** parmi la bibliothèque intégrée
- Renseignez les informations des parties — le document est généré en temps réel
- Partagez un **lien unique** et un **mot de passe** avec l'autre partie
- Les deux parties signent électroniquement depuis n'importe quel appareil
- Le contrat est **scellé et archivé** une fois les deux signatures recueillies
- Les contrats non signés expirent automatiquement après **14 jours**

### Architecture

```
pact.dby-fly.fr/          →  Web   (React + Vite + nginx)    :8100
pact.dby-fly.fr/api/*     →  API   (Hono + Node.js)          :8101
                              Base  (MongoDB 7)               interne
```

Le reverse proxy nginx route `/api/*` vers l'API et `/` vers le frontend statique.

```
my-pact/
├── api/
│   ├── src/
│   │   ├── models/       Schéma Mongoose (Contract)
│   │   ├── contracts.ts  Routes REST (création, signature, fichiers)
│   │   ├── cleanup.ts    Service d'expiration automatique (24h)
│   │   ├── db.ts         Connexion MongoDB
│   │   └── index.ts      Point d'entrée Hono
│   └── scripts/
│       └── init-db.js    Initialisation MongoDB (utilisateur applicatif)
└── web/
    └── src/
        ├── pages/        Home, Create, Contract
        ├── templates/    Système de templates (index, shared, nda-dev, nda-generic, prestation)
        ├── api.ts        Client fetch typé
        └── App.tsx       Routeur React
```

### Démarrage rapide

```bash
# 1. Copier et adapter la configuration
cp .env.example .env

# 2. Construire et démarrer
docker compose up -d --build
```

L'API démarre sur `:8101` et le frontend sur `:8100`.

### Configuration

Fichier `.env` à la racine :

```env
# MongoDB — identifiants admin (init du conteneur)
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=rootpassword

# MongoDB — utilisateur applicatif
MONGO_USER=pact
MONGO_PASSWORD=pactpassword
MONGO_DATABASE=pact
MONGO_HOST=pact-db

# CORS — origines autorisées (séparées par des virgules)
CORS_ORIGINS=https://pact.dby-fly.fr
```

### API — routes

| Route | Méthode | Description |
|---|---|---|
| `/api/contracts` | `POST` | Créer un contrat (type + données) |
| `/api/contracts/:id` | `GET` | Récupérer un contrat (header `x-password`) |
| `/api/contracts/:id/sign` | `POST` | Signer (`{ party: "party1" \| "party2" }`) |
| `/api/contracts/:id/files` | `POST` | Joindre un fichier (form-data) |
| `/api/contracts/:id/files/:fileId` | `GET` | Télécharger un fichier joint |
| `/api/contracts/:id/files/:fileId` | `DELETE` | Supprimer un fichier joint |

Toutes les routes protégées nécessitent le header `x-password`.

### Flux de signature

```
Création  →  draft  →  party1_signed  →  completed
                                          (expiresAt = null)
```

Un contrat non signé expire automatiquement 14 jours après sa création. Les fichiers attachés sont supprimés avec lui.

### Modèles de documents disponibles

| ID | Catégorie | Description |
|---|---|---|
| `nda-dev` | Accord de confidentialité | Adapté aux missions de développement informatique |
| `nda-generic` | Accord de confidentialité | Champs libres, toutes industries |
| `prestation` | Prestation de services | Rémunération variable indexée sur le CA |

Vous souhaitez ajouter un modèle ? Consultez [CONTRIBUTING.md](CONTRIBUTING.md).

### Développement local

```bash
# Installer les dépendances
npm run setup

# Lancer l'API (port 3000)
npm run dev:api

# Lancer le frontend (port 5173)
npm run dev:web
```

Le proxy Vite redirige automatiquement `/api/*` vers `http://localhost:3000`.

---

## EN — English

### Overview

**pact.** is a minimalist, self-hostable electronic contract signing platform — no third party required.

- Pick a **contract template** from the built-in library
- Fill in the parties' details — the document renders live
- Share a **unique link** and **password** with the other party
- Both parties sign electronically from any device
- The contract is **sealed and archived** once both signatures are collected
- Unsigned contracts automatically expire after **14 days**

### Architecture

```
pact.dby-fly.fr/          →  Web   (React + Vite + nginx)    :8100
pact.dby-fly.fr/api/*     →  API   (Hono + Node.js)          :8101
                              DB    (MongoDB 7)               internal
```

The nginx reverse proxy routes `/api/*` to the API and `/` to the static frontend.

```
my-pact/
├── api/
│   ├── src/
│   │   ├── models/       Mongoose schema (Contract)
│   │   ├── contracts.ts  REST routes (create, sign, files)
│   │   ├── cleanup.ts    Automatic expiry service (every 24h)
│   │   ├── db.ts         MongoDB connection
│   │   └── index.ts      Hono entry point
│   └── scripts/
│       └── init-db.js    MongoDB init (app user creation)
└── web/
    └── src/
        ├── pages/        Home, Create, Contract
        ├── templates/    Template system (index, shared, nda-dev, nda-generic, prestation)
        ├── api.ts        Typed fetch client
        └── App.tsx       React router
```

### Quick start

```bash
# 1. Copy and configure
cp .env.example .env

# 2. Build and start
docker compose up -d --build
```

The API starts on `:8101` and the frontend on `:8100`.

### Configuration

`.env` file at the project root:

```env
# MongoDB — admin credentials (container init)
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=rootpassword

# MongoDB — application user
MONGO_USER=pact
MONGO_PASSWORD=pactpassword
MONGO_DATABASE=pact
MONGO_HOST=pact-db

# CORS — allowed origins (comma-separated)
CORS_ORIGINS=https://pact.dby-fly.fr
```

### API — routes

| Route | Method | Description |
|---|---|---|
| `/api/contracts` | `POST` | Create a contract (type + data) |
| `/api/contracts/:id` | `GET` | Fetch a contract (header `x-password`) |
| `/api/contracts/:id/sign` | `POST` | Sign (`{ party: "party1" \| "party2" }`) |
| `/api/contracts/:id/files` | `POST` | Attach a file (form-data) |
| `/api/contracts/:id/files/:fileId` | `GET` | Download an attached file |
| `/api/contracts/:id/files/:fileId` | `DELETE` | Delete an attached file |

All protected routes require the `x-password` header.

### Signing flow

```
Create  →  draft  →  party1_signed  →  completed
                                        (expiresAt = null)
```

An unsigned contract automatically expires 14 days after creation. Attached files are deleted along with it.

### Available document templates

| ID | Category | Description |
|---|---|---|
| `nda-dev` | Non-disclosure agreement | Tailored for software development engagements |
| `nda-generic` | Non-disclosure agreement | Free-text fields, any industry |
| `prestation` | Service contract | Variable compensation indexed on revenue |

Want to add a template? See [CONTRIBUTING.md](CONTRIBUTING.md).

### Local development

```bash
# Install dependencies
npm run setup

# Start the API (port 3000)
npm run dev:api

# Start the frontend (port 5173)
npm run dev:web
```

The Vite proxy automatically forwards `/api/*` to `http://localhost:3000`.

---

*Service by [DBY-FLY Group](https://dby-fly.fr)*
