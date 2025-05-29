import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  
  // if (isAuthenticated) {
  //   return <Navigate to="/homepage" replace />;
  // }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Logo section - Full width on mobile, 1/2 on desktop */}
      <div className="w-full md:w-1/2 bg-[linear-gradient(90deg,rgb(93,224,230),rgb(0,74,173))] flex flex-col items-center justify-center p-12 text-white">
        <img 
          src="/uploads/logo.png" 
          alt="CalRoute Logo" 
          className="w-48 md:w-64 rounded-lg"
        />
        <h1 className="text-4xl font-bold mt-2">CalRoute</h1>
        <p className="text-center text-xl mt-1">Optimize your day, effortlessly.</p>
      </div>
      
      {/* Login form section - Full width on mobile, flex-1 on desktop */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Login with your Google account to continue.</p>
          </div>
          
          <div className="mt-8 flex flex-col items-center">
            <Button
              onClick={login}
              className="w-full max-w-xs bg-calroute-blue hover:bg-blue-600 text-white flex items-center justify-center gap-2 py-5 px-4 text-base"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="fill-current text-white">
                <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" />
              </svg>
              Login with Google
            </Button>
            
            <p className="mt-8 text-sm text-gray-500 text-center px-4">
              By logging in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
