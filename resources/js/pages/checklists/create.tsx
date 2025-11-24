import { Head, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Product } from '@/types/business/product';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/',
    },
    {
        title: 'Checklists',
        href: '/checklists',
    },
    {
        title: 'Crear',
        href: '#',
    },
];

interface SelectedProduct {
    product_id: number;
    reported_stock: number;
    to_buy: boolean;
    quantity_planned: number;
    [key: string]: number | boolean;
}

export default function ChecklistCreate({ products }: { products: Product[] }) {
    const [selectedProducts, setSelectedProducts] = useState<Map<number, SelectedProduct>>(new Map());
    const [processing, setProcessing] = useState(false);

    const toggleProduct = (productId: number, checked: boolean) => {
        const newMap = new Map(selectedProducts);
        if (checked) {
            const product = products.find((p) => p.id === productId);
            newMap.set(productId, {
                product_id: productId,
                reported_stock: product?.stock || 0,
                to_buy: false,
                quantity_planned: 1,
            });
        } else {
            newMap.delete(productId);
        }
        setSelectedProducts(newMap);
    };

    const updateProduct = (productId: number, field: keyof SelectedProduct, value: number | boolean) => {
        const newMap = new Map(selectedProducts);
        const product = newMap.get(productId);
        if (product) {
            newMap.set(productId, { ...product, [field]: value });
            setSelectedProducts(newMap);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const items = Array.from(selectedProducts.values());
        setProcessing(true);
        router.post(
            route('checklists.store'),
            { items },
            {
                onSuccess: () => router.visit(route('checklists.index')),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Checklist" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-semibold tracking-tight">Crear Checklist</h1>

                <Card>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">Seleccionar</TableHead>
                                            <TableHead>Producto</TableHead>
                                            <TableHead>Stock Actual</TableHead>
                                            <TableHead>¿Comprar?</TableHead>
                                            <TableHead>Cantidad Planificada</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product) => {
                                            const selected = selectedProducts.get(product.id!);
                                            const isChecked = !!selected;

                                            return (
                                                <TableRow key={product.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => toggleProduct(product.id!, !!checked)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{product.name}</TableCell>
                                                    <TableCell>
                                                        {isChecked ? (
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                value={selected.reported_stock}
                                                                onChange={(e) =>
                                                                    updateProduct(
                                                                        product.id!,
                                                                        'reported_stock',
                                                                        Math.max(0, parseInt(e.target.value) || 0),
                                                                    )
                                                                }
                                                                className="w-20"
                                                            />
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {isChecked && (
                                                            <Checkbox
                                                                checked={selected.to_buy}
                                                                onCheckedChange={(checked) => updateProduct(product.id!, 'to_buy', !!checked)}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {isChecked && selected.to_buy ? (
                                                            <Input
                                                                type="number"
                                                                min={1}
                                                                value={selected.quantity_planned}
                                                                onChange={(e) =>
                                                                    updateProduct(
                                                                        product.id!,
                                                                        'quantity_planned',
                                                                        Math.max(1, parseInt(e.target.value) || 1),
                                                                    )
                                                                }
                                                                className="w-20"
                                                            />
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            <Button type="submit" className="mx-auto mt-4 w-fit" disabled={processing || selectedProducts.size === 0}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {processing ? 'Creando...' : 'Crear Checklist'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
