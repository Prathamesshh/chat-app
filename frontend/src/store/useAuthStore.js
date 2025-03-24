import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client'; // <-- Add this!

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null, // <-- Add this to your state!

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      console.log('CheckAuth res:', res);
      set({ authUser: res.data });
      get().connectSocket(); // Optional: Connect if logged in
    } catch (error) {
      console.error('Error in checkAuth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      console.log("Signup payload --->", data);

      const res = await axiosInstance.post("/auth/signup", data);
      console.log("Signup response --->", res);

      set({ authUser: res.data });
      toast.success("Account created successfully");

      get().connectSocket(); // <-- Connect socket on signup!
    } catch (error) {
      console.error("Signup error --->", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket(); // <-- Connect socket on login!
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket(); // <-- Disconnect socket on logout!
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // --- SOCKET.IO CONNECTIONS ---
  connectSocket: () => {
    const { socket, authUser } = get();

    if (socket || !authUser) return; // Prevent multiple connections

    const newSocket = io("http://localhost:5000", {
      query: { userId: authUser._id }, // Send user info if needed
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();

    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log("Socket manually disconnected");
    }
  },
}));
