#!/bin/bash

# Script pour arrêter AliasManager UI
# Usage: stopam

echo "🛑 Arrêt d'AliasManager UI..."

# Arrêter React (port 3000)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "🔴 Arrêt de React (port 3000)..."
    # Tuer les processus sur le port 3000
    lsof -ti:3000 | xargs kill -9 2>/dev/null

    # Tuer via PID si disponible
    if [ -f /tmp/aliasmanager-react.pid ]; then
        kill -9 $(cat /tmp/aliasmanager-react.pid) 2>/dev/null
        rm /tmp/aliasmanager-react.pid
    fi

    # Tuer tous les processus react-scripts
    pkill -f "react-scripts start" 2>/dev/null

    echo "✅ React arrêté"
else
    echo "ℹ️  React n'était pas en cours d'exécution"
fi

# Arrêter Electron
if pgrep -f "electron.*AliasManagerUI" > /dev/null; then
    echo "🔴 Arrêt d'Electron..."
    # Tuer Electron par nom de processus
    pkill -f "electron.*AliasManagerUI" 2>/dev/null

    # Tuer via PID si disponible
    if [ -f /tmp/aliasmanager-electron.pid ]; then
        kill -9 $(cat /tmp/aliasmanager-electron.pid) 2>/dev/null
        rm /tmp/aliasmanager-electron.pid
    fi

    echo "✅ Electron arrêté"
else
    echo "ℹ️  Electron n'était pas en cours d'exécution"
fi

# Nettoyer tous les processus Node.js liés à AliasManagerUI
pkill -f "npm.*run.*dev.*AliasManagerUI" 2>/dev/null
pkill -f "node.*AliasManagerUI" 2>/dev/null

# Attendre un peu et vérifier
sleep 1

# Vérification finale
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null && ! pgrep -f "electron.*AliasManagerUI" > /dev/null; then
    echo "🎉 AliasManager UI complètement arrêté !"
else
    echo "⚠️  Certains processus pourraient encore être en cours..."
    echo "Processus restants sur le port 3000:"
    lsof -Pi :3000 -sTCP:LISTEN 2>/dev/null || echo "Aucun"
    echo "Processus Electron restants:"
    pgrep -f "electron.*AliasManagerUI" 2>/dev/null || echo "Aucun"
fi