import "@/app/globals.css";
import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Animated, {
  Layout,
  ZoomOut,
  ZoomIn,
} from "react-native-reanimated";

import Toast from "react-native-toast-message";

interface Task {
  id: string;
  text: string;
  description: string;
  completed: boolean;
}

export default function App() {
  const [task,setTask] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
    if (task.trim() === "") return Toast.show({
      type: "error",
      text1: "Task Title  required",
      text2: "Please enter a task title",
    });
    const newTask: Task = {
      id: Date.now().toString(),
      text: task,
      description: description,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setTask("");
    setDescription("");

    Toast.show({
      type: "success",
      text1: "Task Added",
      text2: `"${newTask.text}" has been added ✅`,
    });
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      const updatedTask = updated.find((t) => t.id === id);
      const taskName = updatedTask?.text;
      const isNowComplete = updatedTask?.completed;

      Toast.show({
        type: isNowComplete ? "success" : "info",
        text1: isNowComplete ? "Task Completed" : "Task Marked Incomplete",
        text2: `"${taskName}" ${isNowComplete ? "is done 🎉" : "was undone ❌"}`,
      });

      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const deletedTask = prev.find((t) => t.id === id);
      const next = prev.filter((t) => t.id !== id);

      Toast.show({
        type: "error",
        text1: "Task Deleted",
        text2: `"${deletedTask?.text}" was removed 🗑️`,
      });

      return next;
    });
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Animated.View
      entering={ZoomIn}
      exiting={ZoomOut}
      layout={Layout.springify()}
      className={`flex-row justify-between items-center rounded-xl px-4 py-3 mb-2 border ${
        item.completed
          ? "bg-green-100 border-green-300"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Task text & description */}
      <TouchableOpacity
        onPress={() => toggleComplete(item.id)}
        className="flex-1"
      >
        <Text
          className={`text-base font-semibold ${
            item.completed ? "line-through text-green-600" : "text-black"
          }`}
        >
          {item.text}
        </Text>
        {item.description ? (
          <Text
            className={`text-sm ${
              item.completed ? "text-green-500" : "text-gray-500"
            }`}
          >
            {item.description}
          </Text>
        ) : null}
      </TouchableOpacity>

      {/* Completion icon */}
      {item.completed && (
        <Text className="text-green-600 text-lg mr-3">✅</Text>
      )}

      {/* Delete button */}
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text className="text-red-500 text-lg">🗑️</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold text-center mb-5">
        📋 Task Manager
      </Text>

      {/* Input fields */}
      <View className="mb-3">
        <Text className="text-sm font-bold  mb-2">Task Title</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white mb-2"
          placeholder="Enter task title..."
          value={task}
          onChangeText={setTask}
        />
        <Text className="text-sm font-bold  mb-2">Task Description</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
          placeholder="Enter description (optional)..."
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Add button */}
      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-3 mb-5"
        onPress={addTask}
      >
        <Text className="text-white text-center font-bold text-lg">
          ＋ Add Task
        </Text>
      </TouchableOpacity>

      {/* Task List */}
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />

    </View>
  );
}
