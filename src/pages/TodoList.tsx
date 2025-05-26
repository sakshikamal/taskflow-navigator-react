import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ListTodo, Settings } from 'lucide-react';

export default function TodoList() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-16 bg-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ListTodo size={24} className="text-[rgb(0,74,173)]" />
                <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => window.open('https://todoist.com/app/settings', '_blank')}
                  className="bg-[rgb(0,74,173)] hover:bg-[rgb(93,224,230)] text-white"
                >
                  <Settings size={18} className="mr-2" />
                  Todoist Settings
                </Button>
                <Button
                  onClick={() => window.open('https://todoist.com/app', '_blank')}
                  className="bg-[rgb(0,74,173)] hover:bg-[rgb(93,224,230)] text-white"
                >
                  Open Todoist
                </Button>
              </div>
            </div>
          </header>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            {user?.email ? (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-700 mb-2">Your Todoist Tasks</h2>
                  <p className="text-gray-600">View and manage your tasks directly from CalRoute.</p>
                  <p className="text-sm text-gray-500 mt-2">Connected as: {user.email}</p>
                </div>

                <div className="flex justify-center mb-6">
                  <iframe
                    src="https://todoist.com/app"
                    style={{ border: 0 }}
                    width="100%"
                    height="700"
                    frameBorder="0"
                    scrolling="yes"
                    title="Todoist"
                    className="rounded-lg shadow"
                    allowFullScreen
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Please log in with your Google account to view your tasks.</p>
                <Button
                  onClick={() => window.open('/login', '_self')}
                  className="bg-[rgb(0,74,173)] hover:bg-[rgb(93,224,230)] text-white"
                >
                  Log in with Google
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
