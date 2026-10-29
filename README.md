# Cinzas do Crepúsculo — Idle RPG

Jogo completo de fantasia sombria feito em **HTML, CSS e JavaScript puro**, sem frameworks, CDN, imagens externas ou backend. Projetado para funcionar em um site estático no **GitHub Pages**.

## Arquivos do projeto

| Arquivo | Função |
|---|---|
| `index.html` | Interface, acessibilidade, login local, abas e janelas de diálogo |
| `styles.css` | Layout responsivo, arte do cenário em CSS, temas, bordas e animações |
| `game.js` | Estados do jogo, combate, inventário, loot, eventos, ascensão, persistência e SVGs originais |
| `README.md` | Instruções de uso e publicação |

## Jogar imediatamente

Abra **`index.html`** em um navegador moderno. Para o comportamento mais consistente do `localStorage`, prefira abrir via GitHub Pages ou um servidor HTTP local (por exemplo, `python -m http.server 8000` na pasta do jogo e acessar `http://localhost:8000`).

Digite um nome na tela inicial. É um **perfil local**, não um login online: não há senha nem conta em servidor. É possível criar até 35 perfis no mesmo navegador. Cada perfil possui um save independente.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie `index.html`, `styles.css` e `game.js` **à raiz** do repositório (o `README.md` é opcional).
3. Abra **Settings → Pages → Build and deployment**.
4. Selecione **Deploy from a branch**, escolha a branch `main` e a pasta **`/(root)`**; salve.
5. Use a URL de GitHub Pages disponibilizada pelo repositório. Não é necessário configurar serviços, tokens nem API.

## Como jogar

- **Combate:** clique no inimigo (ou pressione **Espaço** quando nenhum botão/input estiver em foco) para causar dano ativo. Compre **Ritual Arcano** para causar DPS automático.
- **Melhorias:** evolua Lâmina Afiada, Ritual Arcano, Estandarte Dourado e Olhar do Predador. Selecione `x1`, `x10` ou `MÁX` para a quantidade de compras, limitada ao ouro disponível.
- **Loot:** inimigos podem derrubar equipamentos comuns, incomuns, raros, épicos e lendários. Equipe armas, armaduras, anéis e relíquias. O inventário armazena até **80 itens**.
- **Regiões:** seis regiões, com desbloqueio por nível e total de abates da jornada. As regiões avançadas concedem recompensas maiores e apresentam inimigos mais resistentes.
- **Eventos:** goblins e baús podem aparecer aleatoriamente após abates e por tempo. Seu contador é baseado no relógio real; **apenas cliques** danificam o evento. Ao vencer, você recebe ouro extra, XP, fragmentos de alma e item épico/lendário garantido. Se o inventário estiver cheio, o item de evento substitui o equipamento não utilizado de menor valor.
- **Almas:** a cada 10 fragmentos, receba 1 alma permanente. A partir do nível **15** e **100 abates na jornada**, você pode renascer para obter mais almas.
- **Ascensão:** reinicia nível, experiência, ouro, melhorias e regiões. Mantém inventário, equipamentos, habilidades, almas, fragmentos, total histórico de abates e contador de renascimentos.
- **Árvore:** os caminhos Guerreiro, Sábio e Saqueador possuem quatro nodos cada, com vários graus e pré-requisitos; seus bônus persistem após renascer.

## Salvamento e progresso offline

- O jogo usa **`localStorage`**, com chave de índice `cinzas_profiles_v1` e saves individuais `cinzas_save_v1_<id>`.
- **Auto-save:** a cada 10 segundos, em troca de perfil, ao sair da página e quando a aba muda de visibilidade.
- **Exportar JSON:** o botão no rodapé cria um backup com `type`, `format`, `exportedAt` e `state`.
- **Importar JSON:** valida o tipo/versão do backup e os dados recebidos. Dentro de um perfil aberto, a importação solicita confirmação antes de substituir o progresso atual. Na tela inicial, importa para um perfil novo.
- **Offline:** o cálculo considera o DPS automático, usa timestamps e limita a recompensa a **12 horas** por período de ausência, com limite adicional de simulação. O DPS de clique não conta no offline.
- **Segurança dos dados:** os números e campos de arquivos importados são normalizados; saves de versão futura são rejeitados. Se o navegador bloquear o armazenamento, o jogo funciona temporariamente, mas exibe um aviso para exportar um backup.

**Importante:** o `localStorage` não sincroniza automaticamente entre navegadores ou dispositivos; o JSON exportado é o mecanismo manual de transferência/backup. Limpar os dados do navegador ou usar navegação privada pode apagar os perfis locais.

## Limites e escolhas técnicas

- Game loop com `requestAnimationFrame`, timestamps `Date.now()` e avanço de período oculto usando a fórmula offline, sem depender de uma contagem fixa de frames.
- Valores de economia limitados para permanecerem finitos, exponenciação protegida e níveis máximos explícitos.
- Arte e efeitos gerados localmente por CSS/SVG; **nenhuma chamada HTTP externa**.
- Arquitetura de save versionada, leitura defensiva de JSON, renderização do log via `textContent` e nomes de itens importados escapados no HTML.
- Sem pagamentos, anúncios, tracking, contas remotas ou dependências externas.

## Verificação

O projeto foi verificado com `node --check` e exercitado em navegador automatizado com os fluxos de criação de perfil, combate ativo, recuperação offline, ouro/XP, equipamento, viagem, evento de tesouro, árvore, renascimento, exportação JSON, tela de perfis e viewport móvel.
