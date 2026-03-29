import { ref } from 'vue';


const userSession = ref(null);
const isLoggedIn = ref(false);

const stored = localStorage.getItem('userSession');
if (stored) {
  try {
    userSession.value = JSON.parse(stored);
    isLoggedIn.value = true;
  } catch (e) {
    localStorage.removeItem('userSession');
  }
}

export function useAuth() {
  const login = (userData) => {
    userSession.value = userData;
    isLoggedIn.value = true;
    localStorage.setItem('userSession', JSON.stringify(userData));
  };

  const logout = () => {
    userSession.value = null;
    isLoggedIn.value = false;
    localStorage.removeItem('userSession');
    window.location.reload(); 
  };

  return { userSession, isLoggedIn, login, logout };
}