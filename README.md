# 🏎️ F1 Grid Pro

Aplicativo móvel desenvolvido em **React Native (Expo)** com **TypeScript** para listar e visualizar detalhes dos pilotos da Fórmula 1, consumindo dados reais da API OpenF1.

## Sobre o Projeto

Este projeto foi desenvolvido como uma atividade prática para consolidar conhecimentos em desenvolvimento mobile. O objetivo principal foi criar uma aplicação que consome uma **API REST pública**, trata os dados e os exibe em uma interface fluida e interativa.

### Principais Funcionalidades
- **Listagem de Pilotos:** Consumo da endpoint `drivers` da API OpenF1.
- **Busca em Tempo Real:** Filtro por nome do piloto ou nome da equipe.
- **Interface Dinâmica:** Cores dos cards mudam automaticamente de acordo com a cor oficial da escuderia (Hex).
- **Modal de Detalhes:** Visualização expandida com foto do piloto e bandeira do país.
- **Tratamento de Dados:** Lógica para remover duplicatas e ordenar a lista por equipes.
- **Pull to Refresh:** Atualização da lista ao puxar a tela para baixo.

---

## Tecnologias Utilizadas

* [React Native](https://reactnative.dev/) - Framework principal.
* [Expo](https://expo.dev/) - Plataforma para desenvolvimento e build.
* [TypeScript](https://www.typescriptlang.org/) - Tipagem estática para maior segurança no código.
* [OpenF1 API](https://openf1.org/) - Fonte de dados gratuita.
* [FlagCDN](https://flagcdn.com/) - API auxiliar para bandeiras dos países.

---

## Como Rodar o Projeto

Pré-requisitos: Você precisa ter o **Node.js** instalado na sua máquina e o aplicativo **Expo Go** no seu celular (ou um emulador configurado).

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU-USUARIO/NOME-DO-REPO.git](https://github.com/SEU-USUARIO/NOME-DO-REPO.git)
   cd NOME-DO-REPO
