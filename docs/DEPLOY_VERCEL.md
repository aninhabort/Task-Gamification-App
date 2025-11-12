# Guia de Deploy Vercel - Task Gamification App

## 🚀 Passos para Deploy

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Fazer login na Vercel
```bash
vercel login
```

### 3. Deploy do projeto
```bash
vercel
```

### 4. Seguir as configurações:
- **Set up and deploy?** → Y
- **Which scope?** → Sua conta
- **Link to existing project?** → N  
- **Project name?** → task-gamification-app
- **Directory?** → ./
- **Want to override settings?** → Y
- **Build Command:** → npm run build
- **Output Directory:** → dist
- **Development Command:** → npm run web

## ⚙️ Configurações Aplicadas

### package.json
✅ Adicionado script de build: `"build": "expo export --platform web"`

### vercel.json  
✅ Criado com configurações de roteamento SPA

### Dependências Web
✅ React Native Web já instalado

## 🔧 Possíveis Ajustes Necessários

### 1. Problemas de Compatibilidade Web
Algumas funcionalidades podem não funcionar perfeitamente na web:
- **Haptics** (vibração)
- **Notificações push**
- **Câmera/Galeria**
- **Gestos nativos**

### 2. Ajustes de UI para Web
```jsx
// Usar Platform para diferentes comportamentos
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
```

### 3. Variáveis de Ambiente
Criar arquivo `.env.local` para produção:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
```

## 📱 Limitações da Versão Web

- **Swipe Gestures:** Podem funcionar diferente no desktop
- **Firebase Auth:** Funciona normalmente
- **AsyncStorage:** É convertido para localStorage
- **Navigation:** Funciona com URLs

## 🌍 URLs de Deploy

- **Production:** https://task-gamification-app.vercel.app
- **Preview:** URLs temporárias para cada PR/commit

## 🔄 Atualizações Automáticas

Após o deploy inicial:
- **Push para main/master** → Deploy automático em produção
- **Push para outras branches** → Deploy de preview
- **Pull Requests** → Deploy de preview automático

## 📊 Monitoramento

- **Analytics:** Incluído automaticamente na Vercel
- **Performance:** Métricas Core Web Vitals
- **Logs:** Disponíveis no dashboard Vercel