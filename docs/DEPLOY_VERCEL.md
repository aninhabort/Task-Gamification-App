# Guia de Deploy Vercel - Task Gamification App

## 🚀 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Projeto configurado com Firebase
- Variáveis de ambiente definidas

---

## 📦 Deploy via Vercel CLI

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Login na Vercel
```bash
vercel login
```

### 3. Deploy do projeto
```bash
# Na raiz do projeto
vercel

# Ou para produção diretamente
vercel --prod
```

### 4. Configurar no prompt:
- **Set up and deploy?** → `Y`
- **Which scope?** → Sua conta/organização
- **Link to existing project?** → `N` (primeira vez)
- **Project name?** → `task-gamification-app`
- **Directory?** → `./`
- **Build Command:** → `npx expo export --platform web`
- **Output Directory:** → `dist`
- **Development Command:** → `npx expo start --web`

---

## 🌐 Deploy via Dashboard Vercel

### 1. Conectar repositório
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe seu repositório GitHub
3. Configure conforme abaixo

### 2. Configurações de Build
```
Framework Preset: Other
Build Command: npx expo export --platform web
Output Directory: dist
Install Command: npm install
```

### 3. Variáveis de Ambiente
Adicione no Vercel Dashboard > Settings > Environment Variables:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

⚠️ **Importante:** Variáveis devem começar com `EXPO_PUBLIC_` para serem acessíveis no client

---

## ⚙️ Configurações do Projeto

### package.json
```json
{
  "scripts": {
    "web": "expo start --web",
    "build:web": "expo export --platform web"
  }
}
```

### vercel.json (já configurado)
```json
{
  "buildCommand": "npm run build:web",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🔧 Compatibilidade Web

### ✅ Funcionalidades que funcionam na web:
- 🟢 **Firebase Auth** - Login/Signup/Logout
- 🟢 **Firestore** - CRUD de tasks e vouchers
- 🟢 **Firebase Analytics** - Rastreamento de eventos
- 🟢 **AsyncStorage** - Convertido para localStorage
- 🟢 **Navegação** - Expo Router com URLs
- 🟢 **Contextos** - UserStats, FeaturedVouchers
- 🟢 **UI Components** - Totalmente compatíveis

### ⚠️ Limitações conhecidas:
- ❌ **Haptics** - Feedback tátil não disponível
- ⚠️ **Gestos** - Swipe pode ter comportamento diferente
- ⚠️ **Push Notifications** - Requer configuração adicional

---

## 🌍 URLs de Deploy

Após o deploy:
- **Production:** `https://task-gamification-app.vercel.app`
- **Preview:** URLs únicas para cada branch/PR
- **Development:** Deploy de preview para branches de desenvolvimento

---

## 🔄 Deploy Automático

### Configuração Git:
- **Push para `main/master`** → Deploy automático em produção
- **Push para outras branches** → Deploy de preview
- **Pull Requests** → Deploy de preview com URL única

### Proteções:
- Production deploy requer aprovação (configurável)
- Preview deploy automático para todas as branches
- Rollback disponível no dashboard

---

## 📊 Pós-Deploy

### 1. Configure Firebase
No [Firebase Console](https://console.firebase.google.com):

**Authentication > Domínios autorizados:**
```
task-gamification-app.vercel.app
*.vercel.app (para previews)
```

**Firestore > Regras:**
- Verifique se as regras de segurança estão aplicadas
- Consulte `firestore.rules` no projeto

### 2. Teste a aplicação
```bash
# Acesse sua URL de produção
https://task-gamification-app.vercel.app

# Teste:
- Login/Signup
- Criar task
- Completar task
- Resgatar voucher
- Navegação entre tabs
```

### 3. Monitore no Dashboard
- **Analytics:** Métricas Core Web Vitals
- **Logs:** Erros e warnings em tempo real
- **Performance:** Tempo de build e deploy

---

## 🐛 Troubleshooting

### Build falha com erro de TypeScript
```bash
# Limpe o cache e reinstale
rm -rf node_modules .expo dist
npm install
```

### Variáveis de ambiente não funcionam
- Verifique se começam com `EXPO_PUBLIC_`
- Redeploy após adicionar novas variáveis
- Verifique `app.json` > `extra` para fallback

### Firebase Auth não funciona
- Adicione domínio Vercel nos domínios autorizados
- Verifique se credenciais estão corretas
- Veja logs do console do navegador (F12)

### 404 ao navegar
- Verifique se `vercel.json` tem o rewrite correto
- SPA precisa de fallback para `index.html`

---

## 🚀 Otimizações de Performance

### 1. Configurar Headers de Cache
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    }
  ]
}
```

### 2. Code Splitting
Expo já otimiza automaticamente com:
- Lazy loading de rotas
- Tree shaking
- Minificação

### 3. Monitoramento
Use Vercel Analytics para:
- Core Web Vitals
- Real User Monitoring (RUM)
- Performance insights

---

## 📚 Recursos Adicionais

- [Expo Web Docs](https://docs.expo.dev/workflow/web/)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

✨ **Deploy realizado com sucesso!**