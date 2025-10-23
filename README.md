# AliasManager UI

Interface graphique moderne pour gérer vos alias de terminal avec AliasManager.

## Fonctionnalités

- ✅ **Visualisation complète** : Voir tous vos alias organisés par groupes
- ✅ **Création d'alias** : Interface intuitive pour ajouter de nouveaux alias
- ✅ **Modification** : Éditer le nom, la commande et le groupe d'un alias
- ✅ **Suppression** : Supprimer les alias obsolètes
- ✅ **Activation/Désactivation** : Activer ou désactiver des alias sans les supprimer
- ✅ **Gestion de groupes** : Organisation logique des alias
- ✅ **Synchronisation Git** : Synchronisation automatique avec votre AliasManager existant

## Prérequis

- macOS
- Node.js 16+
- AliasManager installé dans `../AliasManager/`

## Installation et utilisation

### 1. Installation des dépendances

```bash
# Dépendances principales (Electron)
npm install

# Dépendances de l'interface React
cd src/renderer
npm install
cd ../..
```

### 2. Développement

```bash
# Terminal 1: Démarrer React en mode développement
npm run dev:renderer

# Terminal 2: Démarrer Electron (attendre que React soit prêt)
npm run dev
```

### 3. Build pour production

```bash
# Build de l'interface React
npm run build:react

# Build de l'application Electron
npm run build
```

## Architecture

```
AliasManagerUI/
├── src/
│   ├── main.js              # Process principal Electron
│   ├── preload.js           # Script de préchargement sécurisé
│   ├── shared/
│   │   └── alias-manager-bridge.js  # Bridge vers AliasManager
│   └── renderer/            # Application React
│       ├── src/
│       │   ├── App.tsx      # Composant principal
│       │   ├── types/       # Types TypeScript
│       │   └── components/  # Composants React
│       │       ├── AliasForm.tsx
│       │       ├── AliasTable.tsx
│       │       └── EditAliasDialog.tsx
│       └── build/           # Build React (généré)
├── assets/                  # Icônes et ressources
└── dist/                    # Build final Electron (généré)
```

## Intégration avec AliasManager

Cette interface utilise directement votre installation AliasManager existante :

- **Lecture** : Charge les alias depuis `../AliasManager/data/aliases.json`
- **Écriture** : Utilise les modules `DataManager` et `Validator` d'AliasManager
- **Synchronisation** : Respecte le système de synchronisation Git existant

## Fonctionnalités techniques

### Sécurité
- Communication sécurisée entre les processus via IPC
- Validation côté backend avec les règles d'AliasManager
- Protection contre les conflits avec les commandes système

### Interface
- Design Material-UI moderne et réactif
- Tableau interactif avec tri et filtrage
- Notifications de succès/erreur
- Interface adaptée à macOS

### Performance
- Chargement asynchrone des données
- Gestion d'état optimisée
- Build optimisé pour la production

## Développement

### Structure des données

Les alias suivent la structure d'AliasManager :

```json
{
  "groups": {
    "default": {
      "alias_name": {
        "cmd": "commande shell",
        "disabled": false,
        "description": "optionnel"
      }
    }
  }
}
```

### API Electron

L'interface communique avec AliasManager via ces méthodes :

- `getAllAliases()` - Récupère tous les alias
- `addAlias(name, command, group)` - Ajoute un alias
- `updateAlias(oldName, newName, command, group)` - Modifie un alias
- `removeAlias(name, group)` - Supprime un alias
- `toggleAlias(name, group, disabled)` - Active/désactive un alias

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## License

MIT