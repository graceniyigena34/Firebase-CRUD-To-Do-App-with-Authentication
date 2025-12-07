import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 overflow-hidden fixed top-0 left-0">
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center w-full px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Welcome To Do App Task Manager
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 md:mb-12">
            Organize your tasks efficiently and boost your productivity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-green-600 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg"
            >
              Get Started 
            </Link>
            <Link
              href="/login"
              className="bg-green-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-green-700 transform hover:scale-105 transition-all shadow-lg border-2 border-white"
            >
              Login 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
