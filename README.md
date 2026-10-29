# HELLWARD V7.1 — Sistema de vida, defesa, contra-ataques e Parallax refinado

**Site estático, pronto para GitHub Pages.** O projeto usa HTML, CSS e JavaScript puro, não precisa de backend, CDN, npm ou builds. Inclui os 42 PNGs de monstros, o herói em PNG e os 100 ícones dos itens das regiões.

## Começar do zero — importante

Esta versão **reinicia a campanha** como solicitado. Na primeira inicialização, ela remove exclusivamente as entradas antigas do jogo `cinzas_profiles_v1`, `cinzas_save_v1_*`, `hellward_profiles_v6` e `hellward_save_v6_*` do `localStorage` neste domínio. Não apaga armazenamento de outros sites ou aplicações. Usa as novas chaves `hellward_profiles_v7` e `hellward_save_v7_*`, com save `version: 3`.

- Todos criam um personagem novo no **nível 1, Campos de Cinza, fase 1, sem ouro, itens ou habilidades**.
- O primeiro carregamento faz a limpeza apenas uma vez; saves criados na V7 persistem normalmente.
- **JSONs de versões anteriores não podem ser importados** na V7 (evita recuperar a progressão antiga por engano). Apenas JSONs exportados nesta versão podem ser restaurados.
- A limpeza não pode ser desfeita no navegador após a atualização. Guarde o backup anterior **fora do jogo**, se quiser arquivá-lo.

## Novo combate e sobrevivência

- **Vida máxima**: começa em 110; aumenta com nível, melhoria Vigor do Errante e equipamentos.
- **Defesa**: começa em 3; aumenta com nível, Postura Defensiva, armaduras e capacetes. Redução: `dano sofrido = máx(1, arredondar(dano bruto × 100 / (100 + defesa × 4)))`.
- **Ataques dos inimigos**: criaturas comuns atacam a cada 2,75 s; minibosses a cada 3,05 s; chefões a cada 3,6 s. Danos escalam por região e fase. A arena exibe o dano previsto e contagem para o próximo golpe.
- **Regeneração**: vida recuperada continuamente enquanto se está vivo, melhorada com Sangue Renovado.
- **Derrota**: aos zero HP, herói para de atacar, o monstro atual volta com HP cheio, eventos ativos desaparecem; **ressurge após 8 s**, com vida cheia, sem perder equipamentos, ouro, XP ou progresso nas fases.
- **Poções**: agora **curam vida**, não aumentam o DPS. Poções posteriores restauram uma proporção maior de HP. Não podem ser desperdiçadas com a vida já cheia.
- **Progresso offline**: o DPS continua rendendo recompensas durante ausências (até 12 h), sem contra-ataques inesperados enquanto a aba está em segundo plano. Como antes, ele não atravessa os checkpoints de miniboss/chefão. Se o herói estiver derrotado ao sair, não recebe recompensas offline até se recuperar.
- **Ataques ativos e DPS** preservados, incluindo críticos, eventos de goblins/baús, recompensas, 10 fases por região e prestígio. Renascimentos restauram o HP e zeram melhorias básicas.

## Interface

Nova barra de vida do herói no painel esquerdo e na arena, cartões de Vida Máxima e Defesa, dano por golpe recebido, relógio de ataque, efeitos de dano/cura, derrota e retorno. Layout responsivo e registro de combate com rolagem interna.

## Conteúdo

- `index.html` — interface e importação de scripts.
- `styles.css` — tema Dark Fantasy, combate lateral e efeitos visuais.
- `game.js` — motor do combate, progressão, loot, salvamento e fases.
- `item-catalog.js` e `CATALOGO_ITENS.json` — catálogo com 100 itens individuais.
- `CREATURES.json` — bestiário das 42 criaturas.
- `assets/hero/` — sprite do protagonista.
- `assets/monsters/` — 42 sprites com orientação lateral, inclusive boss final.
- `assets/items/` — 100 ícones de equipamentos, consumíveis e materiais.

## Publicar no GitHub Pages

Envie **todo o conteúdo** do ZIP à raiz do repositório, preservando pastas, e configure GitHub **Settings → Pages → Deploy from a branch → main → /(root)**. Recarregue o navegador com Ctrl+F5 se ainda mostrar uma versão em cache. O jogo salva automaticamente a cada 10 s e permite exportar/importar os novos saves JSON.

## Testes de regressão

Foram executados testes locais de lógica no Chromium com o jogo injetado em uma página de testes (o ambiente de teste bloqueia navegação via URL): ataques inimigos, dano e defesa, melhorias de vitalidade, cura com poções, morte/retorno, recuperação do HP de minibosses e verificação de erros JavaScript. O projeto ainda pode exigir ajustes de balanceamento com jogadores reais.


## Novo: cenários Parallax 2.5D

Esta edição acrescenta **6 cenários de regiões**, com **5 camadas PNG independentes** por região (total: 30 PNGs RGBA com transparência real onde necessário):
`assets/backgrounds/<nome-da-regiao>/background_far.png`, `background_mid.png`, `battle_ground.png`, `foreground.png` e `atmosphere.png`.

A arena alterna automaticamente a arte pelo índice da região (zone-0 a zone-5). A câmera desloca as camadas conforme o ponteiro se movimenta, com leve neblina animada. Funciona sem frameworks ou serviços externos. O script `parallax.js` é isolado e não altera o save nem a lógica de combate da V7.

**Origem da arte:** as cinco camadas foram separadas de uma prancha original gerada por IA; o padrão quadriculado da transparência representada na prancha foi retirado por processamento de imagem. Podem restar pequenos artefatos nos contornos, e a arte é uma primeira versão passível de refinamento — não é um sprite sheet criado manualmente pixel a pixel.

Para hospedar no GitHub Pages, inclua a pasta completa `assets/backgrounds/` e o arquivo `parallax.js`, além dos demais arquivos da versão.


## Refinamentos visuais rápidos desta revisão

- camadas de parallax com bordas suavizadas para reduzir artefatos de recorte;
- movimento do parallax ligeiramente mais estável;
- leve vinheta e ajuste de contraste para destacar herói e inimigo;
- manutenção total do sistema de save da V7.

- Corrigida a inclusão de `parallax.js` no HTML (agora o efeito de movimento realmente executa).
- Removida a máscara do céu para evitar bordas escuras indevidas.
