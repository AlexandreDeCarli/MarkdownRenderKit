/**
 * Conteúdo inicial do editor ao abrir o app pela primeira vez.
 * @type {string}
 */
export const starterMarkdown = `# Documento formatado em Markdown

Use este editor para colar seu **Markdown**, ajustar estilos e exportar como PDF.

## Destaques coloridos

Você pode marcar trechos com destaque usando ==texto destacado==.

> Também é possível usar citações, listas, tabelas e blocos de código.

### Tabela de exemplo

| Recurso | Status | Observação |
|---|---:|---|
| Fonte personalizada | ✅ | Texto, títulos e código |
| Cores dos títulos | ✅ | Escolha no painel lateral |
| Quebra de página | ✅ | Use \`<!-- pagebreak -->\` |

\`\`\`js
function gerarPDF() {
  window.print();
}
\`\`\`

\`\`\`sql
SELECT u.nome, u.email, COUNT(p.id) AS total_pedidos
FROM usuarios u
LEFT JOIN pedidos p ON p.usuario_id = u.id
WHERE u.ativo = TRUE
GROUP BY u.nome, u.email
HAVING COUNT(p.id) > 5
ORDER BY total_pedidos DESC
LIMIT 10;
\`\`\`

### Fluxograma

\`\`\`mermaid
flowchart TD
    A[Colar Markdown] --> B{Tem código?}
    B -->|Sim| C[Syntax Highlight]
    B -->|Não| D[Renderizar HTML]
    C --> D
    D --> E[Preview ao vivo]
    E --> F[Exportar PDF]
\`\`\`

<!-- pagebreak -->

# Segunda página

Esta seção começa em uma nova página no PDF.

- Copiar HTML formatado
- Abrir preview em outra janela
- Exportar para PDF com as quebras preservadas
`;
