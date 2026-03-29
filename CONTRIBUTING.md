# Contribuer à pact. — Proposer un nouveau template

[Français](#fr--français) | [English](#en--english)

---

## FR — Français

Merci de votre intérêt pour **pact.** ! La façon la plus directe de contribuer est de proposer un nouveau modèle de contrat. L'architecture est conçue pour que cela soit simple et autonome : **le backend n'a pas à être modifié**.

### Avant de commencer

Vérifiez qu'un template similaire n'existe pas déjà dans `web/src/templates/`. Si le vôtre est une variante d'un existant (ex. NDA spécialisé), préférez un nouveau fichier plutôt qu'une modification de l'existant.

### Structure d'un template

Chaque template est un fichier `.tsx` dans `web/src/templates/` qui exporte un objet conforme à l'interface `Template` :

```ts
export interface Template {
  id: string;               // Identifiant unique, kebab-case (ex. "nda-dev")
  category: string;         // Libellé de catégorie affiché dans le picker (ex. "Accord de confidentialité")
  label: string;            // Nom court du template (ex. "NDA — Développement")
  description: string;      // Description affichée dans le picker (1-2 phrases)
  party1Label: string;      // Nom de la première partie (ex. "La Société")
  party2Label: string;      // Nom de la deuxième partie (ex. "Le Collaborateur")
  defaultData: () => Record<string, unknown>;             // Valeurs initiales du formulaire
  getParty1Name: (data) => string;                        // Nom affiché pour party1
  getParty2Name: (data) => string;                        // Nom affiché pour party2
  getParty1ConsentText: (data) => ReactNode;              // Texte de consentement party1
  getParty2ConsentText: (data) => ReactNode;              // Texte de consentement party2
  Form: FC<FormProps>;      // Composant React du formulaire de saisie
  Document: FC<DocumentProps>;  // Composant React du rendu final du document
}
```

### Créer un template pas à pas

#### 1. Créer le fichier

```
web/src/templates/mon-template.tsx
```

#### 2. Définir l'interface des données

```ts
interface MonTemplateData {
  party1: { name: string; address: string };
  party2: { name: string; address: string };
  effectiveDate: string;
  // ...
}
```

#### 3. Écrire `defaultData`

```ts
function defaultData(): Record<string, unknown> {
  return {
    party1: { name: '', address: '' },
    party2: { name: '', address: '' },
    effectiveDate: new Date().toISOString().split('T')[0],
  };
}
```

#### 4. Écrire le composant `Form`

Le formulaire reçoit `data` et `onChange`. Utilisez les classes CSS existantes (`card`, `field`, `field-label`, `grid-2`, `grid-3`, `section-title`) pour rester cohérent avec le reste de l'UI.

```tsx
function MonTemplateForm({ data, onChange }: FormProps) {
  const d = data as unknown as MonTemplateData;

  const setP1 = (field: keyof MonTemplateData['party1']) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...d, party1: { ...d.party1, [field]: e.target.value } });

  return (
    <>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-title">Première partie</div>
        <div className="field">
          <label className="field-label">Nom *</label>
          <input value={d.party1.name} onChange={setP1('name')} placeholder="Ex : DBYFly" required />
        </div>
      </div>
      {/* ... */}
    </>
  );
}
```

#### 5. Écrire le composant `Document`

Utilisez les helpers partagés de `./shared` pour une mise en page cohérente :

```tsx
import { fmtDate, docStyle, articleTitle, para, ul, li, SignatureBlock } from './shared';

function MonTemplateDocument({ data, party1SignedAt, party2SignedAt }: DocumentProps) {
  const d = data as unknown as MonTemplateData;

  return (
    <div style={docStyle}>
      <h1 style={{ textAlign: 'center', fontWeight: 800, fontSize: '13pt' }}>
        MON CONTRAT
      </h1>
      <hr style={{ border: 'none', borderTop: '2px solid #1a1a1a', marginBottom: '1.75rem' }} />

      <p style={articleTitle}>ARTICLE 1 — OBJET</p>
      <p style={para}>...</p>

      <hr style={{ border: 'none', borderTop: '2px solid #1a1a1a', margin: '2rem 0 1.5rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <SignatureBlock label="Partie 1" name={d.party1.name} signedAt={party1SignedAt} />
        <SignatureBlock label="Partie 2" name={d.party2.name} signedAt={party2SignedAt} />
      </div>
    </div>
  );
}
```

#### 6. Exporter l'objet `Template`

```ts
export const monTemplate: Template = {
  id: 'mon-template',
  category: 'Ma catégorie',
  label: 'Mon template',
  description: 'Description courte affichée dans le picker.',
  party1Label: 'Première partie',
  party2Label: 'Deuxième partie',
  defaultData,
  getParty1Name: (data) => (data as unknown as MonTemplateData).party1.name,
  getParty2Name: (data) => (data as unknown as MonTemplateData).party2.name,
  getParty1ConsentText: (data) => {
    const d = data as unknown as MonTemplateData;
    return <>Je, <strong>{d.party1.name}</strong>, reconnais avoir lu et accepté les termes de ce contrat.</>;
  },
  getParty2ConsentText: (data) => {
    const d = data as unknown as MonTemplateData;
    return <>Je, <strong>{d.party2.name}</strong>, reconnais avoir lu et accepté les termes de ce contrat.</>;
  },
  Form: MonTemplateForm,
  Document: MonTemplateDocument,
};
```

#### 7. Enregistrer le template

Éditez `web/src/templates/index.ts` :

```ts
import { monTemplate } from './mon-template';

export const templates: Record<string, Template> = {
  'nda-dev': ndaDev,
  'nda-generic': ndaGeneric,
  prestation,
  'mon-template': monTemplate,   // ← ajouter ici
};

export const templateList: Template[] = [ndaDev, ndaGeneric, prestation, monTemplate];  // ← et ici
```

C'est tout. Le template apparaît automatiquement dans le picker de création.

### Bonnes pratiques

- **ID kebab-case** unique (`cdi-standard`, `lettre-de-mission`, etc.)
- **Catégories existantes** à réutiliser si pertinent : `"Accord de confidentialité"`, `"Prestation de services"`
- **Placeholders** génériques dans les `<input>` : préférer `"Ex : DBYFly"` à un nom réel
- **Noms de personnes** : utiliser `"Prénom NOM"` comme placeholder
- Le composant `Document` doit rester **imprimable** : pas de couleurs de fond, police serif, marges généreuses
- Les champs libres (textarea) permettent de rendre le template **multi-usage**

### Proposer votre contribution

1. Forkez le dépôt
2. Créez une branche : `git checkout -b template/nom-du-template`
3. Ajoutez votre fichier et enregistrez-le dans `index.ts`
4. Ouvrez une Pull Request en décrivant le cas d'usage couvert

---

## EN — English

Thank you for your interest in **pact.**! The most direct way to contribute is to propose a new contract template. The architecture is designed to make this simple and self-contained: **the backend does not need to be modified**.

### Before you start

Check that a similar template doesn't already exist in `web/src/templates/`. If yours is a variant of an existing one (e.g. a specialised NDA), prefer a new file over modifying an existing one.

### Template structure

Each template is a `.tsx` file in `web/src/templates/` that exports an object conforming to the `Template` interface:

```ts
export interface Template {
  id: string;               // Unique kebab-case identifier (e.g. "nda-dev")
  category: string;         // Category label shown in the picker (e.g. "Non-disclosure agreement")
  label: string;            // Short template name (e.g. "NDA — Development")
  description: string;      // Description shown in the picker (1-2 sentences)
  party1Label: string;      // Name of the first party (e.g. "The Company")
  party2Label: string;      // Name of the second party (e.g. "The Collaborator")
  defaultData: () => Record<string, unknown>;             // Initial form values
  getParty1Name: (data) => string;                        // Display name for party1
  getParty2Name: (data) => string;                        // Display name for party2
  getParty1ConsentText: (data) => ReactNode;              // Consent text for party1
  getParty2ConsentText: (data) => ReactNode;              // Consent text for party2
  Form: FC<FormProps>;      // React component for the input form
  Document: FC<DocumentProps>;  // React component for the final document render
}
```

### Creating a template step by step

#### 1. Create the file

```
web/src/templates/my-template.tsx
```

#### 2. Define the data interface

```ts
interface MyTemplateData {
  party1: { name: string; address: string };
  party2: { name: string; address: string };
  effectiveDate: string;
  // ...
}
```

#### 3. Write `defaultData`

```ts
function defaultData(): Record<string, unknown> {
  return {
    party1: { name: '', address: '' },
    party2: { name: '', address: '' },
    effectiveDate: new Date().toISOString().split('T')[0],
  };
}
```

#### 4. Write the `Form` component

The form receives `data` and `onChange`. Use the existing CSS utility classes (`card`, `field`, `field-label`, `grid-2`, `grid-3`, `section-title`) to stay consistent with the rest of the UI.

```tsx
function MyTemplateForm({ data, onChange }: FormProps) {
  const d = data as unknown as MyTemplateData;

  const setP1 = (field: keyof MyTemplateData['party1']) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...d, party1: { ...d.party1, [field]: e.target.value } });

  return (
    <>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="section-title">First party</div>
        <div className="field">
          <label className="field-label">Name *</label>
          <input value={d.party1.name} onChange={setP1('name')} placeholder="e.g. DBYFly" required />
        </div>
      </div>
      {/* ... */}
    </>
  );
}
```

#### 5. Write the `Document` component

Use the shared helpers from `./shared` for consistent layout:

```tsx
import { fmtDate, docStyle, articleTitle, para, ul, li, SignatureBlock } from './shared';

function MyTemplateDocument({ data, party1SignedAt, party2SignedAt }: DocumentProps) {
  const d = data as unknown as MyTemplateData;

  return (
    <div style={docStyle}>
      <h1 style={{ textAlign: 'center', fontWeight: 800, fontSize: '13pt' }}>
        MY CONTRACT
      </h1>
      <hr style={{ border: 'none', borderTop: '2px solid #1a1a1a', marginBottom: '1.75rem' }} />

      <p style={articleTitle}>ARTICLE 1 — PURPOSE</p>
      <p style={para}>...</p>

      <hr style={{ border: 'none', borderTop: '2px solid #1a1a1a', margin: '2rem 0 1.5rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <SignatureBlock label="Party 1" name={d.party1.name} signedAt={party1SignedAt} />
        <SignatureBlock label="Party 2" name={d.party2.name} signedAt={party2SignedAt} />
      </div>
    </div>
  );
}
```

#### 6. Export the `Template` object

```ts
export const myTemplate: Template = {
  id: 'my-template',
  category: 'My category',
  label: 'My template',
  description: 'Short description shown in the picker.',
  party1Label: 'First party',
  party2Label: 'Second party',
  defaultData,
  getParty1Name: (data) => (data as unknown as MyTemplateData).party1.name,
  getParty2Name: (data) => (data as unknown as MyTemplateData).party2.name,
  getParty1ConsentText: (data) => {
    const d = data as unknown as MyTemplateData;
    return <>I, <strong>{d.party1.name}</strong>, acknowledge having read and accepted the terms of this contract.</>;
  },
  getParty2ConsentText: (data) => {
    const d = data as unknown as MyTemplateData;
    return <>I, <strong>{d.party2.name}</strong>, acknowledge having read and accepted the terms of this contract.</>;
  },
  Form: MyTemplateForm,
  Document: MyTemplateDocument,
};
```

#### 7. Register the template

Edit `web/src/templates/index.ts`:

```ts
import { myTemplate } from './my-template';

export const templates: Record<string, Template> = {
  'nda-dev': ndaDev,
  'nda-generic': ndaGeneric,
  prestation,
  'my-template': myTemplate,   // ← add here
};

export const templateList: Template[] = [ndaDev, ndaGeneric, prestation, myTemplate];  // ← and here
```

That's it. The template appears automatically in the creation picker.

### Best practices

- **Kebab-case ID** that is unique and descriptive (`fixed-term-contract`, `freelance-nda`, etc.)
- **Reuse existing categories** where relevant
- **Generic placeholders** in `<input>` fields — prefer `"e.g. DBYFly"` over real names
- **Person name placeholders**: use `"First LAST"` format
- The `Document` component must remain **print-friendly**: no background colours, serif font, generous margins
- Free-text fields (textarea) help make templates **multi-purpose**

### Submitting your contribution

1. Fork the repository
2. Create a branch: `git checkout -b template/my-template-name`
3. Add your file and register it in `index.ts`
4. Open a Pull Request describing the use case your template covers
