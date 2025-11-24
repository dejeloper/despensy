import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Consumer } from '@/types/business/consumer';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

type ConsumerFormData = {
    name: string;
    type: string;
    _method: 'POST' | 'PUT';
};

interface ConsumerFormProps {
    consumer?: Consumer;
    isEdit?: boolean;
}

export default function ConsumerForm({ consumer, isEdit }: ConsumerFormProps) {
    const initialValues: Required<ConsumerFormData> = {
        name: consumer?.name || '',
        type: consumer?.type || 'human',
        _method: isEdit ? 'PUT' : 'POST',
    };

    const { data, setData, post, processing, reset, errors } = useForm<Required<ConsumerFormData>>(initialValues);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && consumer?.id) {
            post(route('consumers.update', consumer.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('consumers.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="grid gap-0 sm:grid-cols-2 sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center justify-between gap-2">
                    <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight xl:text-4xl">
                        {isEdit ? 'Actualizar' : 'Crear'} Consumidor
                    </h1>

                    <Button asChild size={'sm'} title="Volver a Consumidores">
                        <Link href={route('consumers.index')} className="text-muted-foreground hover:text-foreground sm:hidden">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center justify-self-end">
                    <Button variant="ghost" size="sm" className="hidden px-2 text-sm text-muted-foreground hover:text-foreground sm:flex" asChild>
                        <Link href={route('consumers.index')}>
                            <ArrowLeft className="mr-1 h-4 w-4" /> Volver a Consumidores
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent>
                    <form onSubmit={submit} className="mx-auto flex w-full flex-col gap-4 sm:w-3/5" autoComplete="off">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    maxLength={50}
                                    autoFocus
                                    autoComplete="off"
                                    tabIndex={1}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Familia"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="type">Tipo</Label>
                                <Select value={data.type} onValueChange={(value) => setData('type', value)} disabled={processing}>
                                    <SelectTrigger id="type" tabIndex={2}>
                                        <SelectValue placeholder="Selecciona un tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="human">Humano</SelectItem>
                                        <SelectItem value="pet">Mascota</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} className="mt-1" />
                            </div>

                            <Button type="submit" className="mx-auto mt-4 w-fit cursor-pointer" tabIndex={3}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {processing ? (isEdit ? 'Actualizando ' : 'Creando ') : isEdit ? 'Actualizar' : 'Crear'} Consumidor
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
