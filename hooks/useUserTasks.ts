import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { Task, UserDataService } from "../services/UserDataService";

export const useUserTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar tasks do usuário autenticado
  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setLoading(true);
          const isConnected = await UserDataService.testConnection();
          if (!isConnected) {
            console.error(
              "useUserTasks - Firestore connection failed, but will attempt to load tasks anyway",
            );
          }

          const userTasks = await UserDataService.getUserTasks(user.uid);
          setTasks(userTasks);
        } catch (error: any) {
          console.error("useUserTasks - Error loading user tasks:", error);
          console.error("useUserTasks - Error details:", {
            code: error?.code,
            message: error?.message,
            stack: error?.stack,
          });

          // Em caso de erro, ainda assim continuar com array vazio
          setTasks([]);
        } finally {
          setLoading(false);
        }
      } else {
        // Usuário não autenticado - limpar tasks
        setTasks([]);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const addTask = async (taskData: {
    title: string;
    points: number;
    type: string;
    urgency: string;
  }) => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      console.error("useUserTasks - Cannot add task: user not authenticated");
      return;
    }

    try {
      const taskId = await UserDataService.addTask(user.uid, taskData);

      const newTask: Task = {
        id: taskId,
        ...taskData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        completed: false,
      };
      setTasks((prev) => [newTask, ...prev]);
    } catch (error: any) {
      console.error("useUserTasks - Error adding task:", error);
      console.error("useUserTasks - Add task error details:", {
        code: error?.code,
        message: error?.message,
      });

      // Tratamento específico para erros de permissão
      let userMessage = "Erro desconhecido";

      if (error?.code === "permission-denied") {
        userMessage =
          "Acesso negado. Por favor, faça logout e login novamente na aba Profile.";
      } else if (error?.code === "unauthenticated") {
        userMessage =
          "Você não está autenticado. Por favor, faça login na aba Profile.";
      } else if (error?.code === "unavailable") {
        userMessage =
          "Serviço temporariamente indisponível. Tente novamente em alguns segundos.";
      } else if (error?.message) {
        userMessage = error.message;
      }

      // Mostrar alerta com mensagem apropriada
      alert(`❌ ${userMessage}`);
    }
  };

  const completeTask = async (taskId: string) => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      console.error(
        "useUserTasks - Cannot complete task: user not authenticated",
      );
      return;
    }

    try {
      await UserDataService.completeTask(taskId, user.uid);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error: any) {
      console.error("useUserTasks - Error completing task:", error);
      // Mesmo com erro, remover da lista local para melhor UX
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }
  };

  const reloadTasks = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        setLoading(true);
        const userTasks = await UserDataService.getUserTasks(user.uid);
        setTasks(userTasks);
      } catch (error) {
        console.error("Error reloading tasks:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para adicionar tasks de exemplo para teste
  const addSampleTasks = async () => {
    await addTask({
      title: "Estudar React Native",
      points: 100,
      type: "study",
      urgency: "high",
    });
    await addTask({
      title: "Fazer exercícios",
      points: 70,
      type: "health",
      urgency: "medium",
    });
    await addTask({
      title: "Ler um livro",
      points: 50,
      type: "study",
      urgency: "normal",
    });
  };

  return {
    tasks,
    loading,
    addTask,
    completeTask,
    reloadTasks,
    addSampleTasks,
  };
};
