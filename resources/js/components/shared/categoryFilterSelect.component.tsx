import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Category } from '@/types/business/category';

interface CategoryFilterSelectProps {
    categories: Category[];
    value: string;
    onValueChange: (value: string) => void;
}

export function CategoryFilterSelect({ categories, value, onValueChange }: CategoryFilterSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-auto whitespace-nowrap">
                <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id!.toString()}>
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
