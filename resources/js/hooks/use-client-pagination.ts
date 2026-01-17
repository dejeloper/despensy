import {useMemo, useState, useEffect} from 'react';

interface UseClientPaginationOptions<T> {
	data: T[];
	itemsPerPage?: number;
	searchTerm: string;
}

export function useClientPagination<T>({data, itemsPerPage = 10, searchTerm}: UseClientPaginationOptions<T>) {
	const [currentPage, setCurrentPage] = useState(1);

	// Búsqueda en todos los campos del objeto
	const filteredData = useMemo(() => {
		if (!searchTerm.trim()) return data;

		const term = searchTerm.toLowerCase();

		return data.filter((item) => {
			// Buscar en todos los valores del objeto
			return Object.values(item as Record<string, unknown>).some((value) => {
				if (value === null || value === undefined) return false;

				// Convertir a string y buscar
				return String(value).toLowerCase().includes(term);
			});
		});
	}, [data, searchTerm]);

	// Paginación en el cliente
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return filteredData.slice(startIndex, endIndex);
	}, [filteredData, currentPage, itemsPerPage]);

	// Calcular total de páginas
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	// Generar links de paginación
	const paginationLinks = useMemo(() => {
		if (totalPages <= 1) return [];

		const links = [
			{
				url: currentPage > 1 ? '#' : null,
				label: '&laquo; Anterior',
				active: false,
			},
		];

		for (let i = 1; i <= totalPages; i++) {
			links.push({
				url: '#',
				label: String(i),
				active: i === currentPage,
			});
		}

		links.push({
			url: currentPage < totalPages ? '#' : null,
			label: 'Siguiente &raquo;',
			active: false,
		});

		return links;
	}, [currentPage, totalPages]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({top: 0, behavior: 'smooth'});
	};

	// Resetear a página 1 cuando cambia la búsqueda
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	return {
		paginatedData,
		paginationLinks,
		handlePageChange,
		currentPage,
		totalPages,
		filteredCount: filteredData.length,
	};
}
