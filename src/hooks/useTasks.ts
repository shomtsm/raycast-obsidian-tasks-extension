import { useState, useEffect } from "react";
import {
  getHighestPriorityTask,
  markTaskDone,
  deleteTask,
  updateTask,
  getAllUncompletedTasks,
} from "../utils/taskOperations";
import { Preferences, Priority, Task } from "../types";
import { priorityToValue } from "../utils/priority";

const sortTasks = (tasks: Task[], preferences: Preferences): Task[] => {
  const { sortByDueDate, sortByPriority } = preferences;
  if (!sortByDueDate && !sortByPriority) return tasks;

  const dueTime = (t: Task) => (t.dueDate ? t.dueDate.getTime() : Number.POSITIVE_INFINITY);

  return [...tasks].sort((a, b) => {
    if (sortByDueDate) {
      const at = dueTime(a);
      const bt = dueTime(b);
      if (at !== bt) return at - bt;
    }
    if (sortByPriority) {
      const ap = priorityToValue(a.priority);
      const bp = priorityToValue(b.priority);
      if (ap !== bp) return ap - bp;
    }
    return 0;
  });
};

export const useTasks = (preferences: Preferences) => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [topTask, setTopTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const highestPriorityTask = await getHighestPriorityTask();
      setTopTask(highestPriorityTask);
      const tasks = await getAllUncompletedTasks();
      setAllTasks(sortTasks(tasks, preferences));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTopTask(null);
      setAllTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTaskList = async () => {
    setAllTasks(sortTasks(await getAllUncompletedTasks(), preferences));
    setTopTask(await getHighestPriorityTask());
  };

  const handleMarkDone = async (task: Task | null) => {
    if (!task) return;
    await markTaskDone(task);
    setTopTask(null);
    refreshTaskList();
  };

  const handleDeleteTask = async (task: Task) => {
    await deleteTask(task);
    refreshTaskList();
  };

  const handleSetPriority = async (task: Task, priority: Priority) => {
    await updateTask({ ...task, priority });
    refreshTaskList();
  };

  useEffect(() => {
    fetchTasks();

    const refreshIntervalInMinutes = parseInt(preferences.refreshIntervalInMinutes) || 1;
    const interval = setInterval(fetchTasks, refreshIntervalInMinutes * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    allTasks,
    topTask,
    isLoading,
    refreshTaskList,
    handleMarkDone,
    handleDeleteTask,
    handleSetPriority,
  };
};
