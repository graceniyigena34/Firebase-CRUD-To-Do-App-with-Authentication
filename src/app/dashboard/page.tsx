"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task } from "@/types/task";

export default function Dashboard() {
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

    try {
      if (editingId) {
        const taskExists = tasks.find(t => t.id === editingId);
        if (taskExists) {
          await updateDoc(doc(db, "tasks", editingId), { title, description, priority });
        }
      } else {
        await addDoc(collection(db, "tasks"), {
          title,
          description,
          completed: false,
          priority,
          userEmail: user.email,
        });
      }
      setEditingId(null);
      setTitle("");
      setDescription("");
      setPriority("Low");
      await fetchTasks();
    } catch (error) {
      console.error("Error adding/updating task:", error);
      alert("Error: " + (error as any).message);
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      await updateDoc(doc(db, "tasks", task.id), { completed: !task.completed });
      await fetchTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
      await fetchTasks();
    }
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setEditingId(task.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      await fetchTasks();
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500">
      <div className="text-2xl text-white font-semibold">Loading...</div>
    </div>
  );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Welcome Back! 👋</h1>
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-lg truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 md:p-6 rounded-xl md:rounded-2xl shadow-lg text-white">
              <div className="text-2xl md:text-4xl font-bold">{tasks.length}</div>
              <div className="mt-1 md:mt-2 text-xs md:text-base text-blue-100">📋 Total</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 md:p-6 rounded-xl md:rounded-2xl shadow-lg text-white">
              <div className="text-2xl md:text-4xl font-bold">{tasks.filter(t => t.completed).length}</div>
              <div className="mt-1 md:mt-2 text-xs md:text-base text-green-100">✅ Done</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 md:p-6 rounded-xl md:rounded-2xl shadow-lg text-white">
              <div className="text-2xl md:text-4xl font-bold">{tasks.filter(t => !t.completed).length}</div>
              <div className="mt-1 md:mt-2 text-xs md:text-base text-orange-100">⏳ Pending</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {editingId ? "✏️ Edit Task" : "➕ Create New Task"}
          </h2>
          <div className="space-y-3 md:space-y-5">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">📝 Task Title</label>
              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-2 border-gray-200 p-3 md:p-4 w-full rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base md:text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">📄 Description</label>
              <textarea
                placeholder="Add task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-2 border-gray-200 p-3 md:p-4 w-full rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all h-24 md:h-28 resize-none text-base md:text-lg"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">🎯 Priority Level</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")} 
                className="border-2 border-gray-200 p-3 md:p-4 w-full rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base md:text-lg"
              >
                <option value="Low">🟢 Low Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="High">🔴 High Priority</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
              <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all shadow-lg flex-1">
                {editingId ? "💾 Update" : "➕ Add Task"}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setTitle(""); setDescription(""); setPriority("Low"); }} 
                  className="bg-gray-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-gray-600 transition-all shadow-lg"
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="bg-white/95 backdrop-blur-sm p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">📋 Your Tasks</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="text-6xl md:text-8xl mb-4">📝</div>
              <p className="text-gray-500 text-base md:text-xl">No tasks yet. Create your first task above!</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gradient-to-r from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-100">
                  <div className="flex items-start gap-3 md:gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                      className="w-5 h-5 md:w-7 md:h-7 mt-1 cursor-pointer accent-green-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg md:text-2xl font-bold mb-1 md:mb-2 ${task.completed ? "line-through text-gray-400" : "text-gray-800"} break-words`}>
                        {task.title}
                      </h3>
                      <p className={`mb-2 md:mb-3 text-sm md:text-lg ${task.completed ? "text-gray-400" : "text-gray-600"} break-words`}>
                        {task.description || "No description"}
                      </p>
                      <span className={`inline-block px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-bold rounded-full ${
                        task.priority === "High" ? "bg-red-100 text-red-700" : 
                        task.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : 
                        "bg-green-100 text-green-700"
                      }`}>
                        {task.priority === "High" ? "🔴" : task.priority === "Medium" ? "🟡" : "🟢"} {task.priority}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3 flex-shrink-0">
                      <button 
                        onClick={() => handleEdit(task)} 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md whitespace-nowrap"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(task.id)} 
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-md whitespace-nowrap"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
