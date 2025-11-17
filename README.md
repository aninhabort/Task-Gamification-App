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

- ⚛️ **React Native (Expo)** — framework multiplataforma (iOS, Android, Web)
- 🔥 **Firebase Auth** — autenticação segura com persistência AsyncStorage
- 📦 **Firebase Firestore** — banco de dados em tempo real com regras de segurança
- 📊 **Firebase Analytics** — rastreamento de eventos (web)
- 🧠 **TypeScript** — tipagem estática para código robusto
- 🧭 **Expo Router** — navegação baseada em arquivos
- 🎨 **React Native Components** — biblioteca de UI reutilizável
- 🛡️ **Error Boundaries** — tratamento gracioso de erros
- 🔐 **Environment Variables** — configuração segura via expo-constants

---

## 🧩 Funcionalidades

### ✅ Implementadas
- ✅ **Criação e gerenciamento de tarefas** com categorias e urgência
- ⭐ **Sistema de pontos** baseado em urgência das tarefas
- 🎁 **Vouchers resgatáveis** com sistema de featured vouchers
- 📊 **Dashboard com estatísticas** (tasks completadas, total de pontos)
- 🔐 **Autenticação completa** (Login/Signup/Logout) com Firebase Auth
- 💾 **Persistência de dados** com AsyncStorage + Firestore
- 🛡️ **Error Boundaries** para recuperação de erros
- 📊 **Analytics básico** integrado (web + preparado para mobile)
- 🔒 **Regras de segurança** Firestore configuradas
- 🌐 **Suporte Web** via Expo Web

### 📝 Componentes UI Reutilizáveis
- **Button** — Botões com variantes (primary, secondary, danger)
- **Chip** — Seleção de categorias e filtros
- **Input** — Campos de texto estilizados
- **Modal** — Modais padronizados
- **EmptyState** — Placeholder para listas vazias
- **StatCard** — Cards de estatísticas
- **TaskItem** — Item de tarefa com ações
- **LoadingState** — Indicador de carregamento

---

## 💡 Estrutura do Projeto

```
task-gamification-app/
├── app/
│   ├── (tabs)/              # Telas principais (Home, Rewards, Profile, Settings)
│   ├── components/          # Componentes específicos (Login, Signup, ErrorBoundary)
│   ├── ui/                  # Biblioteca de componentes reutilizáveis
│   └── _layout.tsx          # Layout principal com providers
├── contexts/                # Contextos globais (UserStats, FeaturedVouchers)
├── utils/                   # Utilitários (analytics.ts)
├── docs/                    # Documentação técnica
├── FirebaseConfig.ts        # Configuração Firebase com env variables
├── firestore.rules          # Regras de segurança Firestore
└── .env.example             # Template de variáveis de ambiente
```

---

## 🧠 Lógica de Gamificação

Cada tarefa possui:
- **Categoria** (study, work, health, personal, other)
- **Urgência** que determina a pontuação:

| Urgência  | Pontos |
|-----------|--------|
| High      | 100    |
| Medium    | 70     |
| Normal    | 50     |

**Vouchers:** Use pontos acumulados para resgatar recompensas personalizadas

---

## 🧭 Como Executar

### 1. Clone o repositório
```bash
git clone https://github.com/aninhabort/Task-Gamification-App.git
cd Task-Gamification-App
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Firebase

#### 3.1 Crie um projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative **Authentication** (Email/Password)
4. Ative **Firestore Database**
5. Ative **Analytics** (opcional)

#### 3.2 Configure variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite .env com suas credenciais Firebase
```

Adicione suas credenciais Firebase em `app.json` na seção `extra`:
```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": "sua-api-key",
      "firebaseAuthDomain": "seu-project.firebaseapp.com",
      "firebaseProjectId": "seu-project-id",
      // ...
    }
  }
}
```

#### 3.3 Configure regras do Firestore
Copie o conteúdo de `firestore.rules` e aplique no Firebase Console:
- Firestore Database > Regras > Cole e Publique

Consulte [docs/FIRESTORE_RULES.md](docs/FIRESTORE_RULES.md) para instruções detalhadas.

### 4. Execute o projeto

```bash
# Desenvolvimento
npx expo start

# iOS
npx expo start --ios

# Android
npx expo start --android

# Web
npx expo start --web
```

---

## 📚 Documentação

- **[ANALYTICS.md](docs/ANALYTICS.md)** — Sistema de analytics e eventos rastreados
- **[FIRESTORE_RULES.md](docs/FIRESTORE_RULES.md)** — Guia de regras de segurança
- **[DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md)** — Deploy da versão web
- **[UI Components](app/ui/README.md)** — Documentação dos componentes

---

## 🔒 Segurança

### ✅ Implementado
- 🔐 Regras Firestore com validação de `userId`
- 🔑 Variáveis de ambiente para credenciais
- 🛡️ Error Boundaries para proteção contra crashes
- 💾 Persistência segura com AsyncStorage

### ⚠️ Para Produção
- Revise e ajuste `firestore.rules` conforme necessário
- Configure domínios autorizados no Firebase Auth
- Implemente rate limiting para APIs
- Configure backup automático do Firestore

---

## 🛠️ Próximas Implementações

- [ ] Sistema de ranking entre usuários
- [ ] Integração com notificações push
- [ ] Modo dark/light completo
- [ ] Exportação de histórico de tarefas
- [ ] Melhorias de acessibilidade
- [ ] Analytics mobile (expo-firebase-analytics)
- [ ] Sincronização offline avançada
- [ ] Testes unitários e E2E

---

## 💬 Contribuindo

Contribuições são sempre bem-vindas!

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Faça o commit: `git commit -m 'Adicionei uma nova feature'`
4. Envie para o repositório: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT — veja o arquivo LICENSE para mais detalhes.

---

## 🙏 Agradecimentos

- [Expo](https://expo.dev/) pela plataforma incrível
- [Firebase](https://firebase.google.com/) pelos serviços backend
- Comunidade React Native pelo suporte

---

✨ **Feito com dedicação por [@aninhabort](https://github.com/aninhabort)**