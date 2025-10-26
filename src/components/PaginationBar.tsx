interface PaginationBarProps {
	page: number;
	perPage: number;
	totalPages: number;
	onPageChange: (newPage: number) => void;
	onPerPageChange: (newPerPage: number) => void;
}

export default function PaginationBar({
	page,
	perPage,
	totalPages,
	onPageChange,
	onPerPageChange,
}: PaginationBarProps) {
  	// Helper: generate smart page numbers
  	const getPageNumbers = () => {
	    const pages: (number | string)[] = [];
	   	if (totalPages <= 5) {
	    	for (let i = 1; i <= totalPages; i++) pages.push(i); // show all pages if total is small
	    } else {
	      	pages.push(1); // Always show first page
	     	if (page > 3) pages.push("..."); // Show neighbors around first page

	     	for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i); // Show neighbors around current page
	     	if (page < totalPages - 2) pages.push("..."); // Show neighbors around last page

	     	pages.push(totalPages); // Always show last page
	    }
	    return pages; // return array of page numbers
  	};

	return (
	    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
			{/* Left: Per page selector */}
			<select className="form-select form-select-sm rounded border-primary fw-bold" style={{ width: "auto" }} value={perPage}
			onChange={(e) => onPerPageChange(Number(e.target.value))} >
				<option value={10}>10</option>
				<option value={25}>25</option>
				<option value={50}>50</option>
				<option value={100}>100</option>
			</select>

			{/* Right: Pagination controls */}
			<div className="d-flex flex-wrap align-items-center gap-1">
				{/* Info (hidden on xs) */}
				<span className="fw-bold small d-none d-sm-block">
					Page <span className="badge bg-light text-primary">{page}</span> of {totalPages}
				</span>

				{/* Previous Button */}
				<button className="btn btn-outline-primary btn-sm fw-semibold d-flex align-items-center gap-1" disabled={page === 1}
				onClick={() => onPageChange(page - 1)} >
					<i className="fa fa-angle-double-left"></i> <span className="d-none d-sm-inline">Previous</span>
				</button>

				{/* Smart page numbers */}
				{getPageNumbers().map((p, i) => p === "..." ? ( <span key={i} className="px-2">...</span> ) : (
					<button key={i} className={`btn btn-sm fw-bold ${ page === p ? "btn-primary text-white" : "btn-outline-secondary" }`}
					onClick={() => onPageChange(p as number)}>
						{p}
					</button>
				))}

				{/* Next Button */}
				<button className="btn btn-outline-primary btn-sm fw-semibold d-flex align-items-center gap-1" disabled={page === totalPages}
				onClick={() => onPageChange(page + 1)}>
					<span className="d-none d-sm-inline">Next</span> <i className="fa fa-angle-double-right"></i>
				</button>
			</div>
	    </div>
	);
}
