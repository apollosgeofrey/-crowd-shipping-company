// components/users/PaymentDetailTab.tsx
export default function PaymentDetailTab({
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

    // other logic (if any)
    
    // Render
    return (
      <div className="row g-4">
        {/* Row 1 */}
        <div className="col-md-6">
          <div className="d-flex flex-column border-bottom pb-2">
            <span className="fw-semibold text-muted small">Card Information</span>
            <span className="fw-bold text-dark">July 14, 1995</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-column border-bottom pb-2">
            <span className="fw-semibold text-muted small">Bank Name</span>
            <span className="fw-bold text-dark">UBA</span>
          </div>
        </div>

        {/* Row 2 */}
        <div className="col-md-6">
          <div className="d-flex flex-column border-bottom pb-2">
            <span className="fw-semibold text-muted small">Account Name</span>
            <span className="fw-bold text-dark">Josh Ashernine</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-column border-bottom pb-2">
            <span className="fw-semibold text-muted small">Account Number</span>
            <span className="fw-bold text-dark">2118727678</span>
          </div>
        </div>
      </div>
  );
}
