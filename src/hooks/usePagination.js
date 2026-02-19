import { useState, useMemo, useCallback, useEffect } from 'react'

/**
 * Custom hook for managing pagination
 * Follows Single Responsibility Principle - handles only pagination logic
 * 
 * @param {Array} items - Array of items to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} - Pagination state and handlers
 */
export const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Reset to page 1 when items change
  useEffect(() => {
    setCurrentPage(1)
  }, [items.length])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / itemsPerPage))
  }, [items.length, itemsPerPage])

  const safePage = useMemo(() => {
    return Math.min(currentPage, totalPages)
  }, [currentPage, totalPages])

  const paginatedItems = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }, [items, safePage, itemsPerPage])

  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(pageNumber)
  }, [totalPages])

  const nextPage = useCallback(() => {
    if (safePage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }, [safePage, totalPages])

  const previousPage = useCallback(() => {
    if (safePage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }, [safePage])

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages)
  }, [totalPages])

  const hasNextPage = safePage < totalPages
  const hasPreviousPage = safePage > 1

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage,
    hasPreviousPage,
    startIndex: (safePage - 1) * itemsPerPage,
    endIndex: Math.min(safePage * itemsPerPage, items.length),
    totalItems: items.length
  }
}
