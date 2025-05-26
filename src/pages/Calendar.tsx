import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Calendar() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-16 bg-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 pt-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
              <Button
                onClick={() => window.open('https://calendar.google.com/calendar/u/0/r/settings', '_blank')}
                className="bg-[rgb(0,74,173)] hover:bg-[rgb(93,224,230)] text-white"
              >
                Calendar Settings
              </Button>
            </div>
          </header>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            {user?.email ? (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-700 mb-2">Your Google Calendar</h2>
                  <p className="text-gray-600">View and manage your calendar events directly from CalRoute.</p>
                  <p className="text-sm text-gray-500 mt-2">Connected as: {user.email}</p>
                </div>

                <div className="flex justify-center mb-6">
                  <iframe
                    src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(user.email)}&showTitle=0&showNav=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FNew_York`}
                    style={{ border: 0 }}
                    width="100%"
                    height="600"
                    frameBorder="0"
                    scrolling="no"
                    title="Google Calendar"
                    className="rounded-lg shadow"
                    allowFullScreen
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Please log in with your Google account to view your calendar.</p>
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
