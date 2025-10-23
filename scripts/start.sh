#!/bin/bash

# Script pour démarrer AliasManager UI
# Usage: startam

echo "🚀 Démarrage d'AliasManager UI..."

# Aller dans le dossier du projet
cd "/Users/mactb/Desktop/MacCode/AliasManagerUI"

# Vérifier si React est déjà en cours d'exécution
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  React est déjà en cours d'exécution sur le port 3000"
else
    echo "📦 Démarrage de React..."
    cd src/renderer
    nohup npm start > /dev/null 2>&1 &
    echo $! > /tmp/aliasmanager-react.pid
    cd ../..

    # Attendre que React soit prêt
    echo "⏳ Attente que React soit prêt..."
    timeout=30
    while [ $timeout -gt 0 ]; do
        if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
            echo "✅ React est prêt sur http://localhost:3000"
            break
        fi
        sleep 1
        timeout=$((timeout - 1))
    done

    if [ $timeout -eq 0 ]; then
        echo "❌ Timeout: React n'a pas démarré dans les temps"
        exit 1
    fi
fi

# Vérifier si Electron est déjà en cours d'exécution
if pgrep -f "electron.*AliasManagerUI" > /dev/null; then
    echo "⚠️  Electron est déjà en cours d'exécution"
    echo "🎉 AliasManager UI est déjà démarré !"
else
    echo "🖥️  Démarrage d'Electron..."
    nohup npm run dev > /dev/null 2>&1 &
    echo $! > /tmp/aliasmanager-electron.pid

    sleep 2
    echo "🎉 AliasManager UI démarré avec succès !"
    echo ""
    echo "📱 Interface accessible via l'application Electron"
    echo "🌐 React dev server: http://localhost:3000"
    echo "⛔ Pour arrêter: stopam"
fi