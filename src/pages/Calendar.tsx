import { AppSidebar } from '@/components/AppSidebar';

export default function Calendar() {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      
      <div className="flex-1 ml-16">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 pt-6">
            <h1 className="text-3xl font-bold">Calendar</h1>
          </header>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-center">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=en.indian%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York"
                style={{ border: 0 }}
                width="800"
                height="600"
                frameBorder="0"
                scrolling="no"
                title="Google Calendar Demo"
                className="rounded-lg shadow"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
