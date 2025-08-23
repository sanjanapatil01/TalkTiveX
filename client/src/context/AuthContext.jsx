import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Add loading state

  const navigate = useNavigate();

  // ✅ Check auth when refreshing
  const checkAuth = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      } else {
        setAuthUser(null);
        localStorage.removeItem("token");
        setToken(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthUser(null);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login / signup
  const login = async (state, credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        
        // ✅ Set authorization header properly
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);
      delete axios.defaults.headers.common["Authorization"];
      
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ✅ Fixed updateProfile function
  const updateProfile = async (body) => {
    try {
      setLoading(true);
      const { data } = await axios.put("/api/auth/update-profile", body);
      
      if (data.success) {
        // ✅ Update authUser state immediately to reflect changes
        setAuthUser(data.user);
        toast.success(data.message || "Profile updated successfully");
        return data.user; // ✅ Return updated user data
      } else {
        toast.error(data.message || "Profile update failed");
        throw new Error(data.message || "Profile update failed");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
      throw error; // ✅ Re-throw error for component handling
    } finally {
      setLoading(false);
    }
  };

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    
    try {
      const newSocket = io(backendUrl, {
        query: { userId: userData._id },
      });
      
      newSocket.connect();
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (userIds) => {
        setOnlineUsers(userIds);
      });

      // ✅ Handle socket errors
      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    } catch (error) {
      console.error("Socket setup error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false); // ✅ Set loading false if no token
    }
  }, [token]);

  // ✅ Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    loading, // ✅ Include loading state
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};