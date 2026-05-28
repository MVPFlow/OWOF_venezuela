# Flujo de IA — OpenCode CLI + DeepSeek

## Stack
- **Modelo:** DeepSeek Chat (deepseek/deepseek-chat)
- **CLI:** OpenCode CLI
- **Modo:** CLI interactivo local (no web)

## Instalación
```bash
npm install -g @opencodeai/cli
```

## Configurar y ejecutar
La API Key se pasa al iniciar el CLI:

```bash
opencode --model deepseek/deepseek-chat --api-key <tu-api-key>
```

O bien se define como variable de entorno permanente:
```bash
setx OPENCODE_API_KEY "<tu-api-key>"   # Windows
```

## Comandos útiles
| Comando | Descripción |
|---------|-------------|
| `opencode` | Inicia sesión interactiva |
| `/help` | Ayuda dentro de la sesión |
| `opencode --model <modelo>` | Especificar modelo al inicio |

## Notas
- No usa web UI; todo el flujo es por terminal
- DeepSeek Chat no es el modelo más potente (vs Claude Sonnet) pero es económico
- La sesión recuerda el contexto del proyecto mientras esté activa
- Para salir: `Ctrl+C` o escribir `exit`
