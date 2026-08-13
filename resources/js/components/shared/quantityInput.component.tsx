import { Input } from '@/components/ui/input';

interface QuantityInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    decimals?: number;
    id?: string;
}
export function QuantityInput({ value, onChange, placeholder = 'Cantidad', className, required, decimals = 2, id }: QuantityInputProps) {
    const handleChange = (raw: string) => {
        if (raw !== '' && !new RegExp(`^\\d*[.,]?\\d{0,${decimals}}$`).test(raw)) return;

        onChange(raw);
    };

    return (
        <Input
            id={id}
            type="text"
            inputMode="decimal"
            placeholder={placeholder}
            className={className}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            required={required}
        />
    );
}
