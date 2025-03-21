// eslint-disable-next-line react/prop-types
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div>
      {totalPages > 1 && (
        <nav aria-label="Courses" className="d-flex justify-content-end">
          <ul className="pagination m-0">
            {/* Previous Page */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link pagination"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous"
                style={{
                  backgroundColor: "#fff",
                  color: "black",
                  boxShadow: "0 0 0 0",
                }}
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>

            {/* Pages Number */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                >
                  <button
                    className={`page-link ${
                      currentPage === pageNumber ? "border-warning" : ""
                    }`}
                    onClick={() => onPageChange(pageNumber)}
                    style={{
                      backgroundColor: "#fff",
                      color: "black",
                      boxShadow: "0 0 0 0",
                    }}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            })}

            {/* Next Page */}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next"
                style={{
                  backgroundColor: "#fff",
                  color: "black",
                  boxShadow: "0 0 0 0",
                }}
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Pagination;
