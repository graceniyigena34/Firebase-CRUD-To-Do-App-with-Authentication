"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task } from "@/types/task";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    const q = query(collection(db, "tasks"), where("userEmail", "==", user.email));
    const snapshot = await getDocs(q);
    const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    setTasks(tasksData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title) return;

    if (editingId) {
      await updateDoc(doc(db, "tasks", editingId), { title, description, priority });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        completed: false,
        priority,
        userEmail: user.email,
      });
    }
    setTitle("");
    setDescription("");
    setPriority("Low");
    fetchTasks();
  };

  const toggleComplete = async (task: Task) => {
    await updateDoc(doc(db, "tasks", task.id), { completed: !task.completed });
    fetchTasks();
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setEditingId(task.id);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks();
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Hello, {user.email}</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Task" : "Add Task"}</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-3"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-3"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")} className="border p-2 w-full mb-3">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Add"} Task
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setTitle(""); setDescription(""); setPriority("Low"); }} className="ml-2 bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${task.completed ? "line-through" : ""}`}>{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <span className={`inline-block mt-2 px-2 py-1 text-sm rounded ${task.priority === "High" ? "bg-red-200" : task.priority === "Medium" ? "bg-yellow-200" : "bg-green-200"}`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                  className="w-5 h-5"
                />
                <button onClick={() => handleEdit(task)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(task.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
