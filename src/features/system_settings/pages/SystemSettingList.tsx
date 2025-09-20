import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout.tsx";

export default function SupportDataList() {

    const [settings, setSettings] = useState({
        theme: "Light",
        language: "English",
        twoFactorAuth: true,
        pushNotification: true,
        desktopNotification: true,
        emailNotification: true,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    useEffect(() => {
        // Example: fetch from API in real use
        // fetch("/api/settings").then(...)
    }, []);

    return (
        <DashboardLayout>
            <div className="card border-0 shadow-sm rounded">
                <div className="card-body">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3 py-3">
                        <h3 className="fw-bold mb-0 ps-0">
                            <span className="fa fa-cog pe-3"></span>System Settings
                        </h3>
                    </div>

                    {/* Settings List */}
                    <div className="list-group border rounded shadow-sm">
                        {/* Appearance */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Appearance</h6>
                                <p className="text-muted mb-0 small">Customize how your theme looks on your device</p>
                            </div>
                            <select className="form-select form-select-sm w-auto fw-semibold" value={settings.theme}
                            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}>
                                <option>Light</option>
                                <option>Dark</option>
                            </select>
                        </div>

                        {/* Language */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Language</h6>
                                <p className="text-muted mb-0 small">Select your language</p>
                            </div>
                            <select className="form-select form-select-sm w-auto fw-semibold" value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value }) }>
                                <option>English</option>
                                <option>French</option>
                                <option>Spanish</option>
                            </select>
                        </div>

                        {/* Two-factor Authentication */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Two-factor Authentication</h6>
                                <p className="text-muted mb-0 small">Keep your account secure by enabling 2FA via mail</p>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" checked={settings.twoFactorAuth} onChange={() => toggleSetting("twoFactorAuth")}/>
                            </div>
                        </div>

                        {/* Mobile Push Notifications */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Mobile Push Notifications</h6>
                                <p className="text-muted mb-0 small">Receive push notification</p>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" checked={settings.pushNotification} onChange={() => toggleSetting("pushNotification")}/>
                            </div>
                        </div>

                        {/* Desktop Notification */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Desktop Notification</h6>
                                <p className="text-muted mb-0 small">Receive push notification in desktop</p>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" checked={settings.desktopNotification} onChange={() => toggleSetting("desktopNotification")}/>
                            </div>
                        </div>

                        {/* Email Notifications */}
                        <div className="py-4 list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-semibold mb-1">Email Notifications</h6>
                                <p className="text-muted mb-0 small">Receive email notification</p>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" checked={settings.emailNotification} onChange={() => toggleSetting("emailNotification")}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
