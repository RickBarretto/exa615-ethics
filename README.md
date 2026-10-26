# Entre Pares · Ética em Computação

Jogo educativo de memória e reflexão, desenvolvido para a disciplina de Ética em Computação (EXA615). Crianças e adolescentes conectam histórias a dilemas do mundo digital e discutem suas escolhas em conjunto.

**Status:** primeira versão funcional. O baralho incluído é demonstrativo, com histórias autorais. Referências de cultura pop e conteúdo definitivo ainda dependem da revisão da equipe acadêmica.

## Jogar

- 12 cartas, formando 6 pares de **história + escolha ética**.
- Cada par encontrado abre uma pergunta de múltipla escolha.
- O gabarito não aparece durante a partida. Uma resposta incorreta não desfaz o par.
- No final: tempo, tentativas, respostas e explicações das seis perguntas.
- Partidas independentes por dispositivo, sem sincronização ou competição online.
- Não há limite de tempo. A duração esperada é de 5–10 minutos.
- Cartas diferentes ficam abertas até selecionar **Continuar**, para que todos tenham tempo de ler.

Use toque, mouse ou Tab + Enter/Espaço. O conteúdo de cartas ocultas também fica oculto para leitores de tela. A interface respeita movimento reduzido, anuncia mudanças relevantes e utiliza diálogos com foco contido. Acessibilidade ainda deve ser validada com leitores de tela reais.

## Rodar localmente

Requer Bun 1.3.12+ e Node.js 22.12+ para as ferramentas de build.

```bash
bun install --frozen-lockfile
bun run dev
```

Abra o endereço informado pelo Vite, incluindo `/exa615-ethics/`.

```bash
bun run test       # Regras do jogo e validação do conteúdo
bun run check  # TypeScript, TOML, referências de imagens
bun run build  # Validação + build + service worker
bun run preview
```

## Editar cartas e baralhos

**Edite apenas [`content/decks.toml`](content/decks.toml).** Não é necessário alterar React ou TypeScript. No GitHub, abra o arquivo, selecione o lápis, faça as alterações e salve um commit. Depois da configuração inicial do Pages, cada push em `main` publica uma nova versão automaticamente.

O arquivo contém uma coleção de baralhos. Cada `[[decks]]` deve ter exatamente seis `[[decks.pairs]]`. Para criar outro baralho, copie um bloco completo de baralho com seus seis pares, altere o `id`, título e conteúdo. O novo baralho aparece automaticamente na seleção inicial.

Exemplo de **um par**, para inserir dentro de um baralho com seis pares:

```toml
[[decks.pairs]]
id = "compartilhar-foto"
topic = "Privacidade e dados"

[decks.pairs.reference]
title = "A foto da equipe"
description = "Uma personagem quer publicar uma foto dos amigos."
icon = "camera"
# image = "images/foto-da-equipe.webp"
# alt = "Grupo de amigos reunido depois de uma aventura."
# credit = "Ilustração: nome do autor — licença e origem"

[decks.pairs.dilemma]
title = "Perguntar faz parte"
description = "Respeitar a decisão de quem aparece em uma foto."
icon = "eye"

[decks.pairs.question]
prompt = "O que fazer antes de publicar uma foto de um amigo?"
options = [
  "Publicar sem avisar.",
  "Perguntar e respeitar sua decisão.",
  "Marcar o perfil depois."
]
answer = 2
explanation = "Converse antes de publicar a imagem de outra pessoa e respeite sua escolha."

# Referências opcionais: repita este bloco para adicionar outras fontes.
[[decks.pairs.sources]]
title = "Título da fonte revisada pela equipe"
url = "https://exemplo.org/referencia"
```

### Campos e regras

| Campo | Como preencher |
| --- | --- |
| `version` | Versão do formato; mantenha `1` no começo do arquivo. |
| `decks.id` | Identificador único do baralho. Ex.: `privacidade`. |
| `decks.title` / `description` | Nome e apresentação exibidos na seleção. |
| `decks.status` | `demo` durante produção; `reviewed` após revisão acadêmica. |
| `pairs.id` | Identificador único do par dentro do baralho. |
| `pairs.topic` | Tema apresentado na pergunta e nos resultados. |
| `reference` | A carta com a história ou referência cultural. |
| `dilemma` | A carta com a escolha ou dilema correspondente. |
| `title` / `description` | Textos curtos, simples e adequados ao público. |
| `icon` | Ícone usado quando a carta não tem imagem. |
| `image` | Opcional: caminho relativo a `public/`, começando com `images/`. |
| `alt` | Obrigatório se houver imagem: descrição alternativa. |
| `credit` | Crédito e condições de uso da imagem, apresentados na revisão final. |
| `question.options` | De 2 a 5 alternativas diferentes. |
| `question.answer` | Número da alternativa correta, **começando em 1**. |
| `question.explanation` | Explicação educativa apresentada apenas ao final. |
| `sources` | Lista opcional de fontes HTTPS para aprofundamento. |

Ícones disponíveis: `shield`, `key`, `sparkles`, `eye`, `message`, `palette`, `gamepad`, `bot`, `camera`, `globe`, `book`, `heart`.

Use aspas triplas `"""` para textos com várias linhas. Mantenha o bloco de cada par completo antes de iniciar o próximo. Não publique nomes de alunos, senhas ou informações pessoais nos baralhos.

### Adicionar imagens

1. Envie a imagem para `public/images/` (pelo GitHub, **Add file → Upload files**).
2. Use nome sem espaços, por exemplo `aventura-espacial.webp`.
3. No TOML, adicione `image = "images/aventura-espacial.webp"` e `alt = "..."` na carta correspondente.
4. Informe o crédito e verifique a licença ou autorização antes de publicar.
5. Mantenha cada arquivo abaixo de 2 MiB; prefira WebP e tamanhos pequenos.

As imagens são locais, incluídas no cache offline. Links externos de imagem e caminhos com `..` são rejeitados. O build falha para TOML inválido, campos desconhecidos, IDs repetidos, baralhos sem seis pares, gabaritos inválidos, alternativas duplicadas, imagens ausentes ou sem descrição alternativa.

### Revisão editorial

Cada questão deve ter uma única alternativa esperada no contexto apresentado. Evite transformar dilemas ambíguos em perguntas com gabarito arbitrário. Revise adequação etária, relação entre as duas cartas, explicação, fontes e permissões visuais antes de mudar `status` para `reviewed`. Essa marcação é editorial; o aplicativo não faz revisão acadêmica automática.

## GitHub Pages

O workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) executa os testes e o build em pushes e pull requests. Apenas a branch `main` publica o site.

Configuração inicial no repositório: **Settings → Pages → Build and deployment → Source → GitHub Actions**. Depois, acompanhe a publicação na aba **Actions**. O workflow possui as permissões necessárias de Pages e OIDC, limitadas ao job de deploy.

O caminho padrão é `/exa615-ethics/`. O workflow deriva o caminho do nome do repositório. Para um domínio próprio ou hospedagem na raiz, configure `BASE_PATH=/` no build e ajuste a configuração de domínio do provedor. Evite mudar o escopo de uma PWA já instalada sem orientar quem a utiliza.

## Offline e atualizações

O service worker é gerado no build e armazena os arquivos do aplicativo, conteúdo e imagens. Aguarde o aviso **“Pronto para jogar sem internet”** no primeiro acesso. Depois, o aplicativo pode ser reaberto offline **no mesmo navegador**, enquanto o cache existir. A instalação como PWA depende do navegador.

Quando houver uma atualização, o aplicativo avisa e oferece **Atualizar** fora da partida. Durante uma partida, o botão fica indisponível para evitar a perda do progresso. A pessoa precisa conectar novamente para receber conteúdo atualizado. O cache é uma cópia pública do conteúdo; não inclua segredos no TOML.

Para verificar offline: faça `bun run build`, use `bun run preview`, abra o jogo, aguarde o aviso, ative o modo offline nas ferramentas do navegador, recarregue e conclua uma partida. O modo de desenvolvimento não registra o service worker.

## Arquitetura

React + TypeScript + Vite, com CSS responsivo, `smol-toml` para leitura, Zod para validação e `vite-plugin-pwa`/Workbox para offline. Lucide fornece os ícones. O projeto não tem backend, banco, autenticação, editor público ou analytics.

```text
content/decks.toml            # Fonte única de todos os baralhos
public/images/               # Imagens das cartas
src/content.ts               # Modelo e validação editorial
src/engine.ts                # Regras puras e embaralhamento Fisher–Yates
src/engine.test.ts            # Testes de regras e conteúdo
src/App.tsx                  # Início, tabuleiro, perguntas e resultados
src/styles.css               # Identidade visual e layout responsivo
scripts/validate-content.ts  # Verificação de conteúdo e imagens no build
.github/workflows/pages.yml # Testes e publicação
```

A configuração original propunha virar cartas automaticamente após um intervalo. Esta implementação exige **Continuar** após um erro de associação para oferecer tempo de leitura suficiente. Não há penalização adicional.

## Privacidade

O estado da partida existe apenas na memória da página e é perdido ao fechar ou recarregar. Nenhuma resposta é transmitida. O cache armazena apenas o aplicativo e conteúdo público. Não usamos cookies, fontes remotas nem recursos de rastreamento. A hospedagem pode manter registros técnicos de acesso próprios; consulte as políticas do GitHub Pages.

## Contribuições e licença

Contribuições são bem-vindas por issues e pull requests. Execute `bun run test` e `bun run build` antes de enviar uma alteração. Faça revisão acadêmica das mudanças de conteúdo.

Código, textos demonstrativos e ícone original deste projeto: [MIT](LICENSE). Ícones: [Lucide](https://lucide.dev/license), licença ISC. Dependências mantêm suas próprias licenças. Recursos de terceiros adicionados posteriormente devem ter suas licenças e créditos documentados separadamente; a MIT do código não concede direitos sobre obras externas.
