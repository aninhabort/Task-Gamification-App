# 🎮 Task Gamification App

Um aplicativo de **gamificação de tarefas** desenvolvido com **React Native (Expo)** e **Firebase**, criado para transformar o ato de cumprir tarefas em algo divertido, motivador e recompensador.  
Complete atividades, ganhe pontos e desbloqueie recompensas!

---

## 🖼️ Preview

<div align="center">

✨ **Interface do App (Design no Figma)** ✨  

| Tela Inicial | Tela de Tarefas | Tela de Recompensas |
|:-------------:|:---------------:|:-------------------:|
| <img src="assets/preview/home.png" width="250" /> | <img src="assets/preview/tasks.png" width="250" /> | <img src="assets/preview/rewards.png" width="250" /> |

📱 *Design desenvolvido no [Figma](https://www.figma.com/design/npHlGDw3o4MpteiqqpKNzv/Task-Gamification-App)*  

</div>

---

## 🚀 Tecnologias

- ⚛️ **React Native (Expo)** — base do app mobile  
- 🔥 **Firebase** — autenticação, armazenamento e base de dados  
- 💅 **Styled Components** — estilização moderna e reutilizável  
- 🧠 **TypeScript** — tipagem segura e código mais robusto  
- 🧭 **React Navigation** — navegação entre telas  
- 🏗️ **ESLint + Prettier** — padrões e formatação de código  

---

## 🧩 Funcionalidades

- ✅ **Criação de tarefas personalizadas**  
- ⭐ **Sistema de pontos** com base nas tarefas concluídas  
- 🏅 **Níveis e progresso do usuário**  
- 🎁 **Vouchers e recompensas desbloqueáveis**  
- 📊 **Dashboard com estatísticas e desempenho**  
- 🔐 **Login e registro com Firebase Auth**  

---

## 💡 Estrutura do Projeto

src/
├── components/ # Componentes reutilizáveis (botões, cards, modais)
├── screens/ # Telas principais do app (Home, Profile, Tasks, etc.)
├── hooks/ # Hooks personalizados
├── contexts/ # Contextos globais (autenticação, tarefas, pontos)
├── services/ # Configurações do Firebase e outras integrações
├── utils/ # Funções auxiliares
└── assets/ # Ícones, imagens e fontes


---

## 🧠 Lógica de Gamificação

Cada tarefa possui:
- **Categoria** (ex: produtividade, estudo, bem-estar)
- **Pontuação** variável de acordo com a categoria
- **Sistema de progressão** baseado em XP acumulado  
- **Vouchers**: recompensas trocáveis com os pontos conquistados

Exemplo de categorias:
| Categoria     | Pontos |
|----------------|--------|
| Produtividade  | 20     |
| Saúde e Bem-estar | 15  |
| Estudo         | 25     |
| Lazer          | 10     |

---

## 🧭 Como Executar

1. Clone o repositório  
   ```bash
   git clone https://github.com/aninhabort/Task-Gamification-App.git

Acesse o diretório

cd Task-Gamification-App


Instale as dependências

npm install
# ou
pnpm install


Configure o Firebase:

Crie um projeto no Firebase Console

Ative Authentication e Firestore Database

Adicione o arquivo firebaseConfig.ts dentro de src/services/ com suas credenciais.

Execute o projeto

npx expo start

🎨 Design

O design completo está disponível no Figma:
👉 Figma - Task Gamification App

🛠️ Próximas Implementações

 Sistema de ranking entre usuários

 Integração com notificações push

 Modo dark/light

 Exportação de histórico de tarefas

 Melhorias de acessibilidade

💬 Contribuindo

Contribuições são sempre bem-vindas!

Faça um fork do projeto

Crie uma branch: git checkout -b feature/minha-feature

Faça o commit: git commit -m 'Adicionei uma nova feature'

Envie para o repositório: git push origin feature/minha-feature

Abra um Pull Request

📄 Licença

Este projeto está sob a licença MIT — veja o arquivo LICENSE
 para mais detalhes.

✨ Feito com dedicação por @aninhabort