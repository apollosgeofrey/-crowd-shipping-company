import { useState } from "react";
import { FaCalendarAlt, FaArrowLeft, FaArrowRight, FaEllipsisV } from "react-icons/fa";

export default function BookingTrips() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState([6, 7, 8]);

  // Helpers
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: int) => {
    setSelectedDays([day]); // allow single selection (or expand logic for multi)
  };

  return (
    <div className="card shadow-sm rounded p-3" style={{ fontSize: "0.9rem" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold mb-0">Bookings Trips</h6>
        <button className="btn btn-sm btn-outline-secondary rounded">
          <FaCalendarAlt style={{ fontSize: "0.9rem" }} />
        </button>
      </div>

      {/* Calendar Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button className="btn btn-sm btn-primary rounded" onClick={handlePrevMonth}>
          <FaArrowLeft />
        </button>
        <h6 className="fw-bold mb-0">{monthName}, {year}</h6>
        <button className="btn btn-sm btn-primary rounded" onClick={handleNextMonth}>
          <FaArrowRight />
        </button>
      </div>

      {/* Calendar */}
      <div className="text-center mb-2">
        <div className="d-flex justify-content-between fw-bold text-secondary mb-1">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>

        <div className="d-grid gap-1" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isSelected = selectedDays.includes(day);
            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`p-1 text-center rounded-5 ${isSelected ? "bg-primary text-white fw-bold" : "text-secondary"} `}
                style={{ cursor: "pointer", fontSize: "0.85rem" }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-secondary" />

      {/* Trips */}
      <div>
        <h6 className="fw-bold text-secondary d-flex justify-content-between align-items-center mb-3 mt-3">
          Maritime Pathfinder Trips <FaEllipsisV />
        </h6>

        <div className="mb-2">
          <div className="d-flex">
            <span className="fw-bold me-2" style={{ color: "#9b5cff" }}>09:30</span>
            <div>
              <div className="fw-bold">Sally Adams</div>
              <div className="fw-bold text-dark">New York - Los Angelis</div>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <div className="d-flex">
            <span className="fw-bold me-2" style={{ color: "#9b5cff" }}>12:00</span>
            <div>
              <div>Sunny Divine</div>
              <div className="fw-bold text-dark">Texas - Lagos</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h6 className="fw-bold text-secondary d-flex justify-content-between align-items-center mt-3 mb-3">
          Air Pathfinder Trips <FaEllipsisV />
        </h6>

        <div className="mb-2">
          <div className="d-flex">
            <span className="fw-bold me-2" style={{ color: "#9b5cff" }}>09:30</span>
            <div>
              <div>Musty Adamu</div>
              <div className="fw-bold text-dark">Lagos - Canada</div>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <div className="d-flex">
            <span className="fw-bold me-2" style={{ color: "#9b5cff" }}>11:00</span>
            <div>
              <div>Shola Williams</div>
              <div className="fw-bold text-dark">LA - Abuja</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
