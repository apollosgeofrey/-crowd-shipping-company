// pages/users/tabs/DocumentsTab.tsx
// import React from "react";
import { FaEye, FaDownload } from "react-icons/fa";

export default function DocumentsTab({
    // props
}: {
    // props types
}) {
    // logic
    // props destructuring (if any)

    // helper functions (if any)

    // state (if any)

    // side effects (if any)

    // constants (if any)

    // computed values (if any)

    // event handlers (if any)

    // Demo data
    const documents = [
        {
            id: 1,
            title: "Vehicle Picture",
            img: "https://via.placeholder.com/400x250?text=Vehicle+Image",
        }, {
            id: 2,
            title: "Identification Picture",
            img: "https://via.placeholder.com/400x250?text=ID+Card",
        }, {
            id: 3,
            title: "Driver Picture",
            img: "https://via.placeholder.com/400x250?text=Driver+Image",
        },
    ];

    // Render
    return (
        <div className="card border-0 shadow-sm rounded">
            <div className="card-body">
                <div className="row g-4">
                    {documents.map((doc) => (
                        <div key={doc.id} className="col-md-6">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="fw-semibold mb-0">{doc.title}</h6>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-secondary">
                                        <FaEye />
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger">
                                        <FaDownload />
                                    </button>
                                </div>
                            </div>
                            <div className="border rounded overflow-hidden shadow-sm text-center">
                                <img src={doc.img} alt={doc.title} className="img-fluid w-100" style={{ height: "200px", objectFit: "cover" }}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}