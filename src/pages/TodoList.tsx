
import { AppSidebar } from '@/components/AppSidebar';

export default function TodoList() {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      
      <div className="flex-1 ml-16">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 pt-6">
            <h1 className="text-3xl font-bold">Todo List</h1>
          </header>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-center text-gray-500 my-12">TodoList feature coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
