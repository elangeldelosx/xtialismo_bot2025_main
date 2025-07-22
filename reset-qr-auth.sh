#!/bin/bash

# Script para reiniciar la autenticacion de xtialismo_bot2025

echo "xtialismo_bot2025 - Reinicio de Autenticacion"
echo "====================================="
echo ""

if [ ! -d "assets" ]; then
    echo "Error: Debes ejecutar este script en el directorio raiz de xtialismo_bot2025"
    echo "   Asegurate de estar en la carpeta donde estan las carpetas 'assets' y 'src'"
    exit 1
fi

if [ ! -d "assets/auth/baileys" ]; then
    echo "Advertencia: La carpeta de autenticacion no existe o ya fue eliminada"
    echo "   Ruta: ./assets/auth/baileys"
    exit 0
fi

echo "Advertencia: Esta accion eliminara todos los archivos de autenticacion del bot!"
echo "   Despues de ejecutar este script, necesitaras:"
echo "   1. Eliminar el dispositivo antiguo en \"dispositivos conectados\" en la configuracion de WhatsApp"
echo "   2. Iniciar el bot nuevamente desde aqui (npm start)"
echo "   3. Colocar el numero de telefono del bot nuevamente"
echo ""
read -p "Deseas continuar? (s/N): " confirm

case $confirm in
    [sS]|[sS][iI][mM])
        echo ""
        echo "Eliminando archivos de autenticacion..."
        
        rm -rf ./assets/auth/baileys
        
        if [ $? -eq 0 ]; then
            echo "Archivos de autenticacion eliminados con exito!"
            echo ""
            echo "Proximos pasos:"
            echo "   1. Ejecuta 'npm start' para iniciar el bot"
            echo "   2. Escribe tu numero de telefono cuando se te solicite"
            echo "   3. Usa el codigo de emparejamiento en WhatsApp"
        else
            echo "Error al eliminar los archivos de autenticacion"
            exit 1
        fi
        ;;
    *)
        echo "Operacion cancelada por el usuario"
        exit 0
        ;;
esac

echo ""
echo "¡Script ejecutado con exito!"
