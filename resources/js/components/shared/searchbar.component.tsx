import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
}

export function SearchBar({ searchTerm, onSearchChange, placeholder = 'Buscar...' }: SearchBarProps) {
    const handleClear = () => {
        onSearchChange('');
    };

    return (
        <div className="relative w-full md:w-96">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="text" placeholder={placeholder} value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="pr-9 pl-9" />
            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    title="Limpiar búsqueda"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
