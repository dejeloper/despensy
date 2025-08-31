import { Link, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { CustomTextarea } from '@/components/ui/customTextarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { Category } from '@/types/business/category';
import { Place } from '@/types/business/place';
import { Product } from '@/types/business/product';
import { Unit } from '@/types/business/unit';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

type ProductForm = {
    name: string;
    description: string;
    image: string;
    category_id: number;
    place_id: number;
    unit_id: number;
    enabled: boolean;
    _method: 'POST' | 'PUT';
};

interface ProductFormProps {
    product?: Product;
    categories: Category[];
    places: Place[];
    units: Unit[];
    isEdit: boolean;
}

export default function ProductForm({ product, categories, places, units, isEdit }: ProductFormProps) {
    const { data, setData, post, processing, reset, errors } = useForm<Required<ProductForm>>({
        name: product?.name || '',
        description: product?.description || '',
        image: product?.image || '',
        category_id: product?.category_id || 0,
        place_id: product?.place_id || 0,
        unit_id: product?.unit_id || 0,
        enabled: product?.enabled || true,
        _method: isEdit ? 'PUT' : 'POST',
    });

    const categoryItems: ComboboxItem[] = categories.map((category) => ({
        value: category.id!.toString(),
        label: category.name,
        searchText: `${category.name} ${category.icon}`,
    }));

    const placeItems: ComboboxItem[] = places.map((place) => ({
        value: place.id!.toString(),
        label: place.name,
        searchText: `${place.name} ${place.short_name || ''}`,
    }));

    const unitItems: ComboboxItem[] = units.map((unit) => ({
        value: unit.id!.toString(),
        label: unit.name,
        searchText: `${unit.name} ${unit.short_name}`,
    }));

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            post(route('products.update', product!.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('products.store'), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="grid gap-0 sm:grid-cols-2 sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center justify-between gap-2">
                    <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight xl:text-4xl">{isEdit ? 'Actualizar' : 'Crear'} Producto</h1>

                    <Button asChild size={'sm'} title="Volver a Productos">
                        <Link href={route('products.index')} className="text-muted-foreground hover:text-foreground sm:hidden">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center justify-self-end">
                    <Button variant="ghost" size="sm" className="hidden px-2 text-sm text-muted-foreground hover:text-foreground sm:flex" asChild>
                        <Link href={route('products.index')}>
                            <ArrowLeft className="mr-1 h-4 w-4" /> Volver a Productos
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
                                    autoFocus
                                    autoComplete="off"
                                    tabIndex={1}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Supermercado Ejemplo"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <CustomTextarea
                                    id="description"
                                    required
                                    autoComplete="off"
                                    tabIndex={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    disabled={processing}
                                    placeholder="Descripción del lugar"
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Imagen (URL)</Label>
                                <Input
                                    id="image"
                                    type="text"
                                    required
                                    autoComplete="off"
                                    tabIndex={4}
                                    value={data.image}
                                    onChange={(e) => setData('image', e.target.value)}
                                    disabled={processing}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                <InputError message={errors.image} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Combobox
                                    items={categoryItems}
                                    value={data.category_id > 0 ? data.category_id.toString() : ''}
                                    onValueChange={(value) => setData('category_id', parseInt(value))}
                                    placeholder="Selecciona una categoría"
                                    searchPlaceholder="Buscar categoría..."
                                    emptyText="No se encontraron categorías"
                                    disabled={processing}
                                    renderItem={(item) => {
                                        const category = categories.find((c) => c.id!.toString() === item.value);
                                        return (
                                            <div className="flex w-full items-center gap-2">
                                                <span>{category?.icon}</span>
                                                <span>{category?.name}</span>
                                            </div>
                                        );
                                    }}
                                />
                                <InputError message={errors.category_id} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="place">Lugar</Label>
                                <Combobox
                                    items={placeItems}
                                    value={data.place_id > 0 ? data.place_id.toString() : ''}
                                    onValueChange={(value) => setData('place_id', parseInt(value))}
                                    placeholder="Selecciona un lugar"
                                    searchPlaceholder="Buscar lugar..."
                                    emptyText="No se encontraron lugares"
                                    disabled={processing}
                                    renderItem={(item) => {
                                        const place = places.find((p) => p.id!.toString() === item.value);
                                        return (
                                            <div className="flex items-center gap-2">
                                                <span>{place?.name}</span>
                                                {place?.short_name && <span className="text-muted-foreground">({place.short_name})</span>}
                                            </div>
                                        );
                                    }}
                                />
                                <InputError message={errors.place_id} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="unit">Unidad</Label>
                                <Combobox
                                    items={unitItems}
                                    value={data.unit_id > 0 ? data.unit_id.toString() : ''}
                                    onValueChange={(value) => setData('unit_id', parseInt(value))}
                                    placeholder="Selecciona una unidad"
                                    searchPlaceholder="Buscar unidad..."
                                    emptyText="No se encontraron unidades"
                                    disabled={processing}
                                    renderItem={(item) => {
                                        const unit = units.find((u) => u.id!.toString() === item.value);
                                        return (
                                            <div className="flex items-center gap-2">
                                                <span>{unit?.name}</span>
                                                <span className="text-muted-foreground">({unit?.short_name})</span>
                                            </div>
                                        );
                                    }}
                                />
                                <InputError message={errors.unit_id} className="mt-1" />
                            </div>

                            <div className="grid justify-start gap-2">
                                <Label htmlFor="enabled">Estado</Label>
                                <Switch
                                    id="enabled"
                                    tabIndex={5}
                                    checked={!!data.enabled}
                                    onCheckedChange={(value) => setData('enabled', value)}
                                    disabled={processing}
                                />
                                <Label htmlFor="enabled">{!data.enabled ? 'Desactivado' : 'Activado'}</Label>
                            </div>

                            <Button type="submit" className="mx-auto mt-4 w-fit cursor-pointer" tabIndex={6}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {processing ? (isEdit ? 'Actualizando ' : 'Creando ') : isEdit ? 'Actualizar' : 'Crear'} Producto
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
