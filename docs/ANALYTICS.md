# Analytics - Guia de Uso

## Visão Geral

Sistema de analytics integrado com Firebase Analytics (web) e preparado para integração mobile.

## Eventos Rastreados

### Autenticação
- **login** - Quando usuário faz login
- **signup** - Quando usuário cria conta
- **logout** - Quando usuário faz logout

### Tasks
- **task_created** - Quando uma nova task é criada
  - Parâmetros: `task_title`, `points`
- **task_completed** - Quando uma task é completada
  - Parâmetros: `task_title`, `points`
- **task_deleted** - Quando uma task é deletada
  - Parâmetros: `task_title`

### Vouchers
- **voucher_redeemed** - Quando um voucher é resgatado
  - Parâmetros: `voucher_title`, `cost`

### Navegação
- **screen_view** - Visualização de telas
  - Parâmetros: `screen_name`, `screen_class`

## Como Usar

### Importar o Analytics
```typescript
import { Analytics } from "../../utils/analytics";
```

### Registrar Eventos

#### Tasks
```typescript
// Criar task
Analytics.taskCreated("Estudar React", 50);

// Completar task
Analytics.taskCompleted("Estudar React", 50);

// Deletar task
Analytics.taskDeleted("Estudar React");
```

#### Vouchers
```typescript
// Resgatar voucher
Analytics.voucherRedeemed("Netflix 1 mês", 500);
```

#### Autenticação
```typescript
// Login
Analytics.login('email'); // ou 'google', 'facebook', etc

// Signup
Analytics.signup('email');

// Logout
Analytics.logout();
```

#### Navegação
```typescript
// Visualizar tela
Analytics.viewScreen("HomeScreen");
```

### Rastreamento de Usuário

```typescript
import { setAnalyticsUserId, setAnalyticsUserProperties } from "../../utils/analytics";

// Definir ID do usuário (já implementado no auth)
setAnalyticsUserId(user.uid);

// Definir propriedades do usuário
setAnalyticsUserProperties({
  plan: 'premium',
  signup_date: '2024-01-15',
  total_tasks: 150
});
```

## Plataformas

### Web
- ✅ Firebase Analytics totalmente funcional
- Events aparecem no Firebase Console em tempo real
- Dashboards automáticos disponíveis

### Mobile (iOS/Android)
- 📝 Logs no console em modo desenvolvimento
- Para produção, instale: `expo install expo-firebase-analytics`
- Ou integre com: Amplitude, Mixpanel, Segment

## Verificar Analytics

### Firebase Console
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Analytics** > **Events**
4. Veja eventos em tempo real no **DebugView**

### Debug Local
- No modo desenvolvimento (`__DEV__`), todos os eventos são logados no console
- Formato: `📊 Analytics Event: event_name { params }`

## Próximos Passos

### Para Mobile
```bash
# Instalar Firebase Analytics para React Native
expo install expo-firebase-analytics

# Atualizar utils/analytics.ts
# Substituir a condição Platform.OS === 'web' para suportar mobile
```

### Custom Events
```typescript
import { logEvent } from "../../utils/analytics";

// Evento customizado
logEvent('custom_event_name', {
  param1: 'value1',
  param2: 123,
  param3: true
});
```

## Boas Práticas

1. **Nomes de eventos**: Use snake_case (task_created, voucher_redeemed)
2. **Parâmetros**: Mantenha consistência nos nomes
3. **Dados sensíveis**: Nunca envie senhas, emails completos, etc
4. **Volume**: Não exagere - foque em eventos que importam para o negócio

## Eventos Importantes para Adicionar

- [ ] Tempo de sessão por tela
- [ ] Taxa de conclusão de tasks
- [ ] Categorias de tasks mais criadas
- [ ] Vouchers mais resgatados
- [ ] Erros e crashes (já capturado pelo ErrorBoundary)
