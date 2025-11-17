import { logEvent as firebaseLogEvent, getAnalytics, setUserId, setUserProperties } from 'firebase/analytics';
import { Platform } from 'react-native';
import { FIREBASE_APP } from '../FirebaseConfig';

// Analytics é suportado apenas na web
const analytics = Platform.OS === 'web' ? getAnalytics(FIREBASE_APP) : null;

// Tipos de eventos
export type AnalyticsEvent = 
  | 'task_created'
  | 'task_completed'
  | 'task_deleted'
  | 'voucher_redeemed'
  | 'profile_updated'
  | 'login'
  | 'signup'
  | 'logout'
  | 'screen_view';

export interface AnalyticsParams {
  [key: string]: string | number | boolean;
}

/**
 * Registra um evento de analytics
 */
export const logEvent = (eventName: AnalyticsEvent, params?: AnalyticsParams) => {
  if (__DEV__) {
    console.log('📊 Analytics Event:', eventName, params);
  }

  // Web: usa Firebase Analytics
  if (analytics) {
    firebaseLogEvent(analytics, eventName as string, params);
  }
  
  // Mobile: você pode integrar com outro serviço (ex: Amplitude, Mixpanel)
  // ou usar Firebase Analytics para React Native (requer expo-firebase-analytics)
};

/**
 * Define o ID do usuário para rastreamento
 */
export const setAnalyticsUserId = (userId: string | null) => {
  if (__DEV__) {
    console.log('📊 Analytics User ID:', userId);
  }

  if (analytics && userId) {
    setUserId(analytics, userId);
  }
};

/**
 * Define propriedades do usuário
 */
export const setAnalyticsUserProperties = (properties: AnalyticsParams) => {
  if (__DEV__) {
    console.log('📊 Analytics User Properties:', properties);
  }

  if (analytics) {
    setUserProperties(analytics, properties);
  }
};

/**
 * Helper para registrar visualização de tela
 */
export const logScreenView = (screenName: string, screenClass?: string) => {
  logEvent('screen_view', {
    screen_name: screenName,
    screen_class: screenClass || screenName,
  });
};

/**
 * Events específicos do app
 */
export const Analytics = {
  // Tasks
  taskCreated: (taskTitle: string, points: number) => {
    logEvent('task_created', { task_title: taskTitle, points });
  },

  taskCompleted: (taskTitle: string, points: number) => {
    logEvent('task_completed', { task_title: taskTitle, points });
  },

  taskDeleted: (taskTitle: string) => {
    logEvent('task_deleted', { task_title: taskTitle });
  },

  // Vouchers
  voucherRedeemed: (voucherTitle: string, cost: number) => {
    logEvent('voucher_redeemed', { voucher_title: voucherTitle, cost });
  },

  // Auth
  login: (method: string = 'email') => {
    logEvent('login', { method });
  },

  signup: (method: string = 'email') => {
    logEvent('signup', { method });
  },

  logout: () => {
    logEvent('logout');
  },

  // Profile
  profileUpdated: (fields: string[]) => {
    logEvent('profile_updated', { fields: fields.join(',') });
  },

  // Screen views
  viewScreen: (screenName: string) => {
    logScreenView(screenName);
  },
};
