# Hellward — Atualização v4 (17 novos monstros)

Projeto estático, sem frameworks e sem conexão com servidor. Pronto para GitHub Pages.

## Como atualizar sem perder seu save

1. Faça **Exportar Save (.json)** dentro do jogo antes de atualizar (backup recomendado).
2. Extraia este ZIP e envie para a **raiz do mesmo repositório** no GitHub Pages, **substituindo** `index.html`, `styles.css` e `game.js` e enviando toda a pasta `assets/monsters/`.
3. Mantenha a mesma URL do site e abra a página normalmente. O navegador continuará lendo as mesmas chaves de `localStorage`; os perfis, itens, habilidades, níveis, regiões e prestígio são preservados.
4. Atualize a página com **Ctrl + F5** para carregar o JavaScript novo (se necessário).

Não precisa importar o save depois de uma atualização no mesmo domínio/navegador, mas o JSON é uma proteção importante. Se mudar de domínio ou navegador, importe o JSON manualmente.

## Monstros personalizados — 17 PNGs recebidos

| Região | Comuns substituídos | Miniboss (fase 5) | Boss (fase 10) |
|---|---|---|---|
| I — Campos de Cinza | Guerreiro Esquelético; Zumbi Errante | Espadachim Corrompido | Cavaleiro Decapitado |
| II — Bosque Profanado | Lobo Sombrio; Ratazana Pestilenta; Goblin Selvagem | Rei das Ratazanas | Hidra Profanada |
| III — Criptas Afogadas | Criaturas SVG originais | Bruxa das Criptas | Rei Lich |
| IV — Fortaleza de Ferro | Orc Carniceiro | Ogro do Ferro | Cavaleiro do Abismo |
| V — Fendas Infernais | Criaturas SVG originais | Devorador Mórbido | Dragão das Fendas |
| VI — Trono do Crepúsculo | Criaturas SVG originais | Medusa do Eclipse | Imperador do Crepúsculo (SVG existente) |

São **17 novos PNGs transparentes** com imagem individual, mais **25 SVGs existentes**, somando 42 entradas no bestiário (7 em cada uma das seis regiões). Todos estão em `assets/monsters/`. `CREATURES.json` mostra a alocação detalhada dos 17 arquivos e pode ser editado como referência (o jogo não depende dele para carregar).

## Progressão e salvamento

- Cada região: 10 fases, 10 inimigos comuns por fase, miniboss obrigatório na fase 5, chefão obrigatório na fase 10.
- Diário de combate com altura fixa e rolagem interna.
- Autosave a cada 10 segundos em `localStorage` (continuam as chaves `cinzas_profiles_v1` e `cinzas_save_v1_...`).
- Exportação e importação JSON; limite de 12 horas de ganhos offline, respeitando as barreiras dos chefes.
- Ouro, XP, drops, equipamento, árvore de ascensão e eventos temporários continuam implementados.

## Arquivos

```
index.html
styles.css
game.js
CREATURES.json   # Referência humana/técnica de 17 imagens
assets/
  monsters/
    17 imagens PNG personalizadas
    25 imagens SVG anteriores (para os monstros ainda sem arte nova)
```

Não renomeie nem remova `assets/monsters/`: o jogo procura as imagens em caminhos relativos ao `index.html`.

## Hospedagem

GitHub > Settings > Pages > Deploy from branch > `main` / `(root)`.

Não requer build, node_modules, npm ou CDN. Também funciona abrindo `index.html` localmente em navegadores que permitem localStorage com `file://` (o comportamento de storage em `file://` varia conforme o navegador).

## Nome oficial e compatibilidade

O jogo agora se chama **Hellward**. As chaves antigas de `localStorage` (`cinzas_profiles_v1` e `cinzas_save_v1_...`) e o identificador técnico de exportação JSON (`cinzas-do-crepusculo`) foram mantidos propositalmente para preservar perfis, progresso e backups anteriores. A mudança do nome é visual e não apaga os saves existentes.
