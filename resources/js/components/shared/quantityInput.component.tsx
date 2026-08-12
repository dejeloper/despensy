import { Input } from '@/components/ui/input';

interface QuantityInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

/**
 * Input de cantidad que admite fracciones ("1,64 kg") sin obligar a escribir
 * decimales ("2" sigue siendo válido). No usa `type="number"` porque el input
 * nativo descarta la coma decimal en los locales que la usan; acepta coma o
 * punto y el formulario normaliza a punto con `normalizeDecimal()` al enviar.
 */
export function QuantityInput({ value, onChange, placeholder = 'Cantidad', className, required }: QuantityInputProps) {
    const handleChange = (raw: string) => {
        // Dígitos y un único separador decimal (coma o punto) con hasta 2 decimales.
        if (raw !== '' && !/^\d*[.,]?\d{0,2}$/.test(raw)) return;

        onChange(raw);
    };

    return (
        <Input
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
