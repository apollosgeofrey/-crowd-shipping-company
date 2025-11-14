import { useState } from "react";
import WalletTab from "./partials/WalletTab.tsx";
import TransactionTab from "./partials/TransactionTab.tsx";
import PaymentDetailTab from "./partials/PaymentDetailTab.tsx";
import { FaWallet, FaCreditCard, FaExchangeAlt } from "react-icons/fa";

export default function BookingTabIndex({ user }: any) {
    // logic
    // props destructuring (if any)

    // helper functions (if any)

    // state (if any)

    // side effects (if any)

    // constants (if any)

    // computed values (if any)

    // event handlers (if any)    
    
    const [activePaymentTab, setActivePaymentTab] = useState("wallet");
    const paymentTabs = [
        { id: "wallet", label: "Wallet", icon: <FaWallet /> },
        { id: "payment-details", label: "Payment Details", icon: <FaCreditCard /> },
        { id: "transactions", label: "Transactions", icon: <FaExchangeAlt /> },
    ];

    // other logic (if any)
    
    // Render
    return (
        <div className="">
            {/* Wallet Tabs */}
            <div className="col-sm-12">{user?.fullName}</div>
            <ul className="nav nav-tabs mb-3">
                {paymentTabs.map((tab) => (
                    <li key={tab.id} className="nav-item">
                        <button type="button" onClick={() => setActivePaymentTab(tab.id)} className={`nav-link fw-semibold d-inline-flex align-items-center gap-2 border-0 border-bottom
                        ${activePaymentTab === tab.id ? "border-primary text-primary active" : "border-transparent text-dark"}`}>
                            {tab.icon} <span>{tab.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Wallet Tab Content */}
            {activePaymentTab === "wallet" && (<WalletTab />)}

            {/* Payment Details Tab Content */}
            {activePaymentTab === "payment-details" && (<PaymentDetailTab />)}

            {/* Transactions Tab Content */}
            {activePaymentTab === "transactions" && (<TransactionTab />)}
        </div>
    );
}
