// src/components/common/Pagination.tsx
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import { FC } from "react";

// Interface para las props del componente
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

// Función utilitaria para generar rangos de números
const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1
}) => {
  // Genera los números de página con ellipsis
  const generatePageNumbers = (): (number | string)[] => {
    const totalNumbers = siblingCount * 2 + 5;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - siblingCount);
      const endPage = Math.min(totalPages - 1, currentPage + siblingCount);
      
      let pages: (number | string)[] = [];
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = (totalPages - endPage) > 1;
      const spillOffset = totalNumbers - (endPage - startPage + 3);

      if (hasLeftSpill && !hasRightSpill) {
        const extraPages = range(startPage - spillOffset, startPage - 1);
        pages = [1, '...', ...extraPages, ...range(endPage, totalPages)];
      } else if (!hasLeftSpill && hasRightSpill) {
        const extraPages = range(endPage + 1, endPage + spillOffset);
        pages = [...range(1, startPage), ...extraPages, '...', totalPages];
      } else {
        pages = [1, '...', ...range(startPage, endPage), '...', totalPages];
      }
      
      return pages;
    }
    
    return range(1, totalPages);
  };

  // Manejadores de navegación
  const handlePrevious = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

  // No renderizar si hay menos de 2 páginas
  if (totalPages <= 1) return null;

  const pages = generatePageNumbers();

  return (
    <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex justify-between items-center">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="text-sm text-gray-700">
            Mostrando{" "}
            <span className="font-medium">{currentPage}</span> de{" "}
            <span className="font-medium">{totalPages}</span> páginas
          </div>
          
          <nav aria-label="Paginación">
            <ul className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {/* Botón Anterior */}
              <li>
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                  className="px-2 py-2 rounded-l-lg border bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
              </li>

              {/* Números de página */}
              {pages.map((page, index) => (
                <li key={`${page}-${index}`}>
                  {typeof page === 'number' ? (
                    <button
                      onClick={() => onPageChange(page)}
                      aria-current={currentPage === page ? 'page' : undefined}
                      className={`px-3 py-2 border ${
                        currentPage === page
                          ? "bg-blue-50 text-blue-600"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span className="px-3 py-2 border bg-white text-gray-500">
                      {page}
                    </span>
                  )}
                </li>
              ))}

              {/* Botón Siguiente */}
              <li>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  aria-label="Página siguiente"
                  className="px-2 py-2 rounded-r-lg border bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;