# Firestore Security Rules - Guia de Deploy

## Deploy das Regras

Para aplicar as regras de segurança no Firebase:

### Opção 1: Firebase Console (Recomendado para primeira vez)
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: **task-gamification-app**
3. Vá em **Firestore Database** > **Regras**
4. Copie o conteúdo de `firestore.rules`
5. Cole no editor e clique em **Publicar**

### Opção 2: Firebase CLI
```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto (apenas primeira vez)
firebase init firestore

# Deploy das regras
firebase deploy --only firestore:rules
```

## Estrutura das Regras

### Coleções Protegidas:

1. **users/{userId}**
   - Apenas o próprio usuário pode ler/escrever seus dados

2. **tasks/{taskId}**
   - Apenas o dono da task pode acessar/modificar
   - Campo obrigatório: `userId`

3. **vouchers/{voucherId}**
   - Leitura: todos os usuários autenticados
   - Escrita: bloqueada (adicione vouchers manualmente no console)

4. **redeemedVouchers/{voucherId}**
   - Apenas o usuário que resgatou pode acessar
   - Campo obrigatório: `userId`

5. **userStats/{userId}**
   - Apenas o próprio usuário pode ler/atualizar
   - Deleção bloqueada para proteção

### Funções Helper:
- `isAuthenticated()` - Verifica se usuário está logado
- `isOwner(userId)` - Verifica se é o dono do documento
- `isCreatingOwnData()` - Valida userId na criação
- `isOwnData()` - Valida userId em documentos existentes

## Testando as Regras

No Firebase Console > Firestore > Regras > Simulador:

```javascript
// Teste 1: Usuário tentando ler própria task
// Auth: {uid: 'user123'}
// Path: /tasks/task1
// Document: {userId: 'user123'}
// Resultado: ✅ Permitido

// Teste 2: Usuário tentando ler task de outro
// Auth: {uid: 'user123'}
// Path: /tasks/task2
// Document: {userId: 'user456'}
// Resultado: ❌ Negado
```

## Importante

⚠️ **Antes de fazer deploy em produção:**
- Teste as regras no simulador
- Certifique-se que todos os documentos têm o campo `userId`
- Backup dos dados importantes
- Deploy primeiro em modo teste, depois em produção
