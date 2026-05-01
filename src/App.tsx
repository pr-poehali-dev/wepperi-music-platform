import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Upload from "./pages/Upload";
import Playlists from "./pages/Playlists";
import Likes from "./pages/Likes";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

function getSavedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('wavely_user');
    const token = localStorage.getItem('wavely_token');
    if (raw && token) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<AuthUser | null>(getSavedUser);

  const handleAuth = (u: AuthUser) => setUser(u);

  const handleLogout = () => {
    localStorage.removeItem('wavely_token');
    localStorage.removeItem('wavely_user');
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth"
              element={
                user
                  ? <Navigate to="/" replace />
                  : <Auth onAuth={handleAuth} />
              }
            />
            {user ? (
              <Route element={<Layout user={user} onLogout={handleLogout} />}>
                <Route path="/" element={<Home />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/upload" element={<Upload user={user} />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/likes" element={<Likes />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="/search" element={<Search />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/auth" replace />} />
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </PlayerProvider>
    </QueryClientProvider>
  );
};

export default App;