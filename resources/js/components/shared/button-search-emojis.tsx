import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface Emoji {
    slug: string;
    character: string;
    unicodeName: string;
    codePoint: string;
    group: string;
    subGroup: string;
}

interface ButtonSearchEmojisProps {
    onSelect: (emoji: string) => void;
    disabled?: boolean;
}

export default function ButtonSearchEmojis({ onSelect, disabled = false }: ButtonSearchEmojisProps) {
    const [search, setSearch] = useState('');
    const [emojis, setEmojis] = useState<Emoji[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchEmojis = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/emojis`);
                const data = await res.json();
                setEmojis(data);
            } catch (error) {
                console.error('Error cargando emojis', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmojis();
    }, []);

    const filtered = emojis.filter((e) => e.unicodeName.toLowerCase().includes(search.toLowerCase()));

    const onSelectEmoji = (e: Emoji) => {
        onSelect(e.character);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={'outline'} disabled={disabled}>
                    {' '}
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : '😀'}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-96 p-3">
                <Input placeholder="Buscar emoji..." value={search} onChange={(e) => setSearch(e.target.value)} />

                {loading && <p className="mt-3 text-sm text-gray-500">Cargando...</p>}

                {!loading && filtered.length === 0 && <p className="mt-3 text-sm text-gray-500">No se encontraron emojis</p>}

                <div className="mt-3 grid max-h-64 grid-cols-8 gap-2 overflow-y-auto text-xl">
                    {filtered.map((e, i) => (
                        <button key={i} className="rounded p-1 hover:bg-gray-200" onClick={() => onSelectEmoji(e)}>
                            {e.character}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
