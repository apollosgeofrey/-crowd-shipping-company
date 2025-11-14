// hooks/useUserData.js
import { useSelector } from 'react-redux';


// Optional: More robust version
export function useUserData() {
    const localUser = localStorage.getItem('authUser');    
    return {
        user: useSelector((state: any) => state.authUser) || (localUser ? JSON.parse(localUser) : null),
    };
}