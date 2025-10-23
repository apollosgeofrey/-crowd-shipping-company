// hooks/useLogout.ts
import Swal from 'sweetalert2';
import { useCallback } from 'react';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store';

export const useLogout = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleLogout = useCallback(async () => {
		try {
			const result = await Swal.fire({ // Show confirmation dialog
				title: 'Are you sure?',
				text: 'You will be logged out of your account',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, logout!',
				cancelButtonText: 'Cancel'
			});
			if (!result.isConfirmed) return; // User cancelled

			// Show loading with custom HTML
		    Swal.fire({
		        title: 'Logging out...',
		        html: `<div style="text-align: center;">
		            <div class="spinner-border text-primary mb-3" role="status">
		              	<span class="visually-hidden">Loading...</span>
		            </div>
		            <p class="mb-0">Cleaning up your session</p>
		            <small class="text-muted">This will just take a moment</small>
		        </div>`,
		        showConfirmButton: false,
		        allowOutsideClick: false,
		        width: 400,
		        customClass: { popup: 'border-radius-12' }
		    });


			// Dispatch logout thunk
			const resultAction = await dispatch(logout());
			console.log('Logout result:', resultAction.payload);
      		Swal.close(); // Close loading and show success
			Swal.fire({ // Show success message
				title: 'Logged out!',
				text: logout.fulfilled.match(resultAction) ? resultAction.payload.message : 'You have been logged out successfully',
				icon: 'success',
				timer: 2000,
				showConfirmButton: false
			});
			navigate('/login', { replace: true }); // Redirect to login

		} catch (error) {
			console.error('Logout error:', error);
      		Swal.close(); // Close loading and show success
			Swal.fire({ // Fallback
				title: 'Logged out!',
				text: 'You have been logged out',
				icon: 'info',
				timer: 2000,
				showConfirmButton: false
			});
			navigate('/login', { replace: true });
		}
	}, [dispatch, navigate]);

	return handleLogout;
};