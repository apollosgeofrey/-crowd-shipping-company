// SystemSettings.tsx
import Swal from 'sweetalert2';
import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";
import systemPreferencesApi, {type UpdatePreferences } from "../services/systemPreferencesApi.ts";

export default function SystemSettings() {
    const [preferences, setPreferences] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Fetch system preferences from API
    useEffect(() => {
        async function fetchPreferences() {
            setIsLoading(true);
            try {
                const response = await systemPreferencesApi.getPreferences();
                if (response.code === 200) {
                    setPreferences(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch system preferences:", err);
                setSaveMessage({ type: 'error', message: 'Failed to load system preferences' });
            } finally {
                setIsLoading(false);
            }
        }
        fetchPreferences();
    }, []);

    // Update preference
    const updatePreference = async (updates: UpdatePreferences) => {
        if (!preferences) return;
        setIsSaving(true);
        setSaveMessage(null);
        try {
            const response = await systemPreferencesApi.updatePreferences(updates);
            if (response.code === 200) {
                setPreferences(response.data);
                setSaveMessage({ type: 'success', message: 'Settings updated successfully!' });
                
                // Clear success message after 3 seconds
                setTimeout(() => setSaveMessage(null), 3000);
            }
        } catch (err) {
            console.error("Failed to update preferences:", err);
            setSaveMessage({ type: 'error', message: 'Failed to update settings' });
        } finally {
            setIsSaving(false);
        }
    };

    // Toggle boolean setting
    const toggleSetting = (key: keyof SystemPreferences) => {
        if (!preferences) return;
        
        const currentValue = preferences[key];
        if (typeof currentValue === 'boolean') updatePreference({ [key]: !currentValue });
    };

    // Update select setting
    const updateSelectSetting = (key: keyof SystemPreferences, value: string) => {
        updatePreference({ [key]: value });
    };

    // Reset to defaults with SweetAlert
    const handleResetDefaults = async () => {
        const result = await Swal.fire({
            title: 'Reset Settings?',
            text: 'Are you sure you want to reset all settings to default values?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, reset!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            }
        });

        if (result.isConfirmed) {
            setIsSaving(true);
            try {
                const response = await systemPreferencesApi.resetPreferences();
                if (response.code === 200) {
                    setPreferences(response.data);
                    
                    // Show success message with SweetAlert
                    await Swal.fire({
                        title: 'Reset Successful!',
                        text: 'All settings have been reset to default values.',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-primary'
                        }
                    });
                    
                    // Also show the inline success message
                    setSaveMessage({ type: 'success', message: 'Settings reset to defaults!' });
                    setTimeout(() => setSaveMessage(null), 3000);
                }
            } catch (err) {
                console.error("Failed to reset preferences:", err);
                
                // Show error message with SweetAlert
                await Swal.fire({
                    title: 'Reset Failed',
                    text: 'Failed to reset settings. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    }
                });
                
                setSaveMessage({ type: 'error', message: 'Failed to reset settings' });
            } finally {
                setIsSaving(false);
            }
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="card border-0 shadow-sm rounded">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3 py-3">
                            <h3 className="fw-bold mb-0 ps-0">
                                <span className="fa fa-cog pe-3"></span>System Settings
                            </h3>
                        </div>
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-muted">Loading system settings...</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!preferences) {
        return (
            <DashboardLayout>
                <div className="card border-0 shadow-sm rounded">
                    <div className="card-body">
                        <div className="text-center py-5">
                            <i className="fa fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                            <h4>Unable to Load Settings</h4>
                            <p className="text-muted">Failed to load system preferences. Please try again.</p>
                            <button 
                                className="btn btn-primary"
                                onClick={() => window.location.reload()}
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="card border-0 shadow-sm rounded">
                <div className="card-body">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3 py-3">
                        <h3 className="fw-bold mb-0 ps-0">
                            <span className="fa fa-cog pe-3"></span>System Settings
                        </h3>
                        <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={handleResetDefaults}
                            disabled={isSaving}
                        >
                            <i className="fa fa-undo me-1"></i> Reset Defaults
                        </button>
                    </div>

                    {/* Save Message */}
                    {saveMessage && (
                        <div className={`alert alert-${saveMessage.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}>
                            {saveMessage.message}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setSaveMessage(null)}
                            ></button>
                        </div>
                    )}

                    {/* Settings List */}
                    <div className="list-group border rounded shadow-sm">
                        {/* Appearance Theme */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Appearance Theme</h6>
                                <p className="text-muted mb-0 small">Customize how your theme looks on your device</p>
                            </div>
                            <select 
                                className="form-select form-select-sm w-auto fw-semibold" 
                                value={preferences.theme}
                                onChange={(e) => updateSelectSetting('theme', e.target.value)}
                                disabled={isSaving}
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System Default</option>
                            </select>
                        </div>

                        {/* Language */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Language</h6>
                                <p className="text-muted mb-0 small">Select your preferred language</p>
                            </div>
                            <select 
                                className="form-select form-select-sm w-auto fw-semibold" 
                                value={preferences.language}
                                onChange={(e) => updateSelectSetting('language', e.target.value)}
                                disabled={isSaving}
                            >
                                <option value="en">English</option>
                                <option value="fr">French</option>
                                <option value="es">Spanish</option>
                                <option value="de">German</option>
                                <option value="pt">Portuguese</option>
                            </select>
                        </div>

                        {/* Timezone */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Timezone</h6>
                                <p className="text-muted mb-0 small">Set your local timezone</p>
                            </div>
                            <select 
                                className="form-select form-select-sm w-auto fw-semibold" 
                                value={preferences.timezone}
                                onChange={(e) => updateSelectSetting('timezone', e.target.value)}
                                disabled={isSaving}
                            >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="Europe/London">London (GMT)</option>
                                <option value="Europe/Paris">Paris (CET)</option>
                                <option value="Asia/Tokyo">Tokyo (JST)</option>
                                <option value="Asia/Dubai">Dubai (GST)</option>
                                <option value="Africa/Lagos">Lagos (WAT)</option>
                            </select>
                        </div>

                        {/* Two-factor Authentication */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Two-factor Authentication</h6>
                                <p className="text-muted mb-0 small">Keep your account secure by enabling 2FA</p>
                            </div>
                            <div className="form-check form-switch">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={preferences.twoFactorEnabled} 
                                    onChange={() => toggleSetting('twoFactorEnabled')}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        {/* Email Notifications */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Email Notifications</h6>
                                <p className="text-muted mb-0 small">Receive important updates via email</p>
                            </div>
                            <div className="form-check form-switch">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={preferences.enableEmail} 
                                    onChange={() => toggleSetting('enableEmail')}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        {/* SMS Notifications */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">SMS Notifications</h6>
                                <p className="text-muted mb-0 small">Receive SMS alerts for critical updates</p>
                            </div>
                            <div className="form-check form-switch">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={preferences.enableSms} 
                                    onChange={() => toggleSetting('enableSms')}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        {/* Mobile Push Notifications */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Mobile Push Notifications</h6>
                                <p className="text-muted mb-0 small">Receive push notifications on mobile devices</p>
                            </div>
                            <div className="form-check form-switch">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={preferences.enablePushMobile} 
                                    onChange={() => toggleSetting('enablePushMobile')}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        {/* Desktop Push Notifications */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Desktop Push Notifications</h6>
                                <p className="text-muted mb-0 small">Receive push notifications on desktop</p>
                            </div>
                            <div className="form-check form-switch">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={preferences.enablePushDesktop} 
                                    onChange={() => toggleSetting('enablePushDesktop')}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        {/* Marketing Communications */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Marketing Communications</h6>
                                <p className="text-muted mb-0 small">Receive promotional emails and updates</p>
                            </div>
                            <div className="form-check form-switch">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={preferences.receiveMarketing} 
                                    onChange={() => toggleSetting('receiveMarketing')}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Status */}
                    {isSaving && (
                        <div className="mt-3 text-center">
                            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                                <span className="visually-hidden">Saving...</span>
                            </div>
                            <span className="text-muted">Saving changes...</span>
                        </div>
                    )}

                    {/* Last Updated */}
                    <div className="mt-4 text-center text-muted small">
                        <i className="fa fa-clock me-1"></i>
                        Last updated: {new Date(preferences.updatedAt).toLocaleString()}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}