# Servidor MCP para Repositorios de GitHub

[![Versión de Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](https://nodejs.org/)
[![Protocolo MCP](https://img.shields.io/badge/MCP-1.7.0-blue)](https://modelcontextprotocol.io)

Un servidor del Model Context Protocol (MCP) que proporciona información de repositorios de GitHub mediante herramientas accesibles para IA, compatible con WindSurf Editor y otros clientes MCP.

## 📖 Descripción

Este servidor implementa el protocolo MCP para exponer la herramienta `get-repo-info`, que recupera información detallada de repositorios de GitHub. Diseñado para integrarse con flujos de trabajo de desarrollo asistidos por IA, permite:

- Consultas en lenguaje natural sobre repositorios
- Acceso estructurado a datos mediante clientes MCP
- Validación de respuestas de la API usando esquemas Zod

## ✨ Características

- **Herramienta única**: `get-repo-info` para información detallada de repositorios
- **Integración con GitHub API**: Manejo seguro de solicitudes con límites de tasa
- **Sistema de validación**: Esquemas Zod para entradas y salidas
- **Tolerancia a fallos**: Manejo exhaustivo de errores y registro
- **Soporte para MCP 1.7.0**: Compatibilidad total con la última versión del protocolo

## ⚙️ Requisitos

- Node.js 16.x o superior
- npm 7.x o superior
- Cuenta de GitHub (opcional para acceso repos privados)
- Cliente MCP (ej. [Cursor](https://cursor.sh), [Claude Desktop](https://www.anthropic.com/product), [WindSurf Editor](https://codeium.com/windsurf))

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/ArlandMv/CustomMcpAI-ModelContextProtocol-GithubApi-TS
cd CustomMcpAI-ModelContextProtocol-GithubApi-TS

# Instalar dependencias
npm install

# Compilar proyecto y dar permisos de ejecución
npm run build

# No esnecesario ejecutarlo manualmente, Salir
Ctrl+C
```

## 🔧 Configuración

### Token de GitHub (opcional)

Para límites de API más altos, crea un archivo `.env`:

```bash
echo "GITHUB_TOKEN=tu_token_de_acceso_personal" > .env
```

Añade a tu configuración a tu cliente (Cursor, Claude Desktop, WindSurf Editor)

## 🔌 Integración con Herramientas

### Cursor

1. Abre la configuración de la herramienta
2. Navega a la sección **MCP Servers**
3. Haz clic en **Add Custom Server**
4. Completa los campos:
   ```yaml
   - Name: mcp-repos
   - Type: Command
   - Command: node
   - Arguments: [ruta_absoluta/build/index.js]
     # Ejemplo Windows: C:/Users/tuusuario/proyecto/build/index.js
     # Ejemplo Linux/macOS: /home/tuusuario/proyecto/build/index.js
   ```

### Claude Desktop

1. Edita el archivo de configuración (claude.conf.json) siguiendo la [guía oficial](https://modelcontextprotocol.io/quickstart/user):

```bash
{
    "mcpServers": {
        "repos": {
            "command": "node",
            "args": [
                "ruta/absoluta/al/proyecto/build/index.js"
            ]
        }
    }
}
```

### Windsurf

Configura el archivo (mcp_config.json) según la [documentación oficial](https://docs.codeium.com/windsurf/mcp#mcp):

```bash
{
    "servers": [
        {
            "name": "mcp-repos",
            "type": "stdio",
            "command": "node",
            "args": ["{BuildPath}/build/index.js"],
            "environment": {}
        }
    ]
}
```

## 🛠️ Uso

### Prueba tu servidor MCP desde tu cliente:

```bash
tell me about a repo named "typescript" by microsoft
```

### Ejemplo de solicitud desde cliente

```javascript
// En cliente MCP (ej. WindSurf Editor)
const response = await mcpClient.callTool({
  name: "get-repo-info",
  arguments: {
    owner: "microsoft",
    repo: "typescript",
  },
});
```

### Salida de ejemplo

```
🏷️ microsoft/typescript
📝 TypeScript es un superconjunto de JavaScript que compila a código JavaScript limpio.
🌐 https://github.com/microsoft/typescript

📊 Estadísticas:
  🌟 Estrellas: 94700
  🍴 Bifuraciones: 12280
  👀 Visibilidad: public

💻 Lenguaje: TypeScript
📅 Actualizado: 15/2/2024
```

## 📚 Referencia de API

### Herramienta `get-repo-info`

**Endpoint**: `GET https://api.github.com/repos/{owner}/{repo}`

| Parámetro | Tipo   | Descripción                    |
| --------- | ------ | ------------------------------ |
| `owner`   | string | Usuario/organización en GitHub |
| `repo`    | string | Nombre del repositorio         |

## 📄 Licencia

Licencia MIT - ver [LICENCIA](LICENSE) para detalles

---

**Desarrollado con**:

- [Model Context Protocol](https://modelcontextprotocol.io)
- [GitHub REST API](https://docs.github.com/es/rest)
- [Validación Zod](https://zod.dev)

```

```

<!--

Check on the following:
1. MCP Server new server vs new McpServer

enhance documentation, add Claude Desktop support, and refine build process
- Revamped the README.md to provide comprehensive documentation on setup, usage, and integration with tools like Cursor, Claude Desktop, and WindSurf.
- Added claude_desktop_conf.json for easier MCP server setup with Claude Desktop.
- Modified the package.json build and dev scripts to improve the build process and ensure executable permissions for index.js.
- Updated a comment in src/index.ts for clarity."

-->
