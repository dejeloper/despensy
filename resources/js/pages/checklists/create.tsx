import { Head, router } from '@inertiajs/react';

import { Pagination } from '@/components/shared/pagination.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Category } from '@/types/business/category';
import { PaginatedProduct } from '@/types/business/product';
import { Edit2, LoaderCircle, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

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

export default function ChecklistCreate({ products }: { products: PaginatedProduct }) {
    const [selectedProducts, setSelectedProducts] = useState<Map<number, SelectedProduct>>(new Map());
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<{ id?: number; name?: string; stock?: number; price?: number } | null>(null);
    const [modalData, setModalData] = useState({ reported_stock: 0, quantity_planned: 1 });

    // Extraer categorías únicas de los productos
    const categories = useMemo(() => {
        const categoryMap = new Map<number, Category>();
        products.data.forEach((product) => {
            if (product.category) {
                categoryMap.set(product.category.id!, product.category);
            }
        });
        return Array.from(categoryMap.values());
    }, [products]);

    // Filtrar productos (solo por búsqueda en frontend, la paginación es en backend)
    const filteredProducts = useMemo(() => {
        return products.data.filter((product) => {
            const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category_id?.toString() === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, categoryFilter]);

    // Calcular totales del carrito
    const cartSummary = useMemo(() => {
        const items = Array.from(selectedProducts.values()).filter((item) => item.to_buy);
        return {
            count: items.length,
            totalItems: selectedProducts.size,
            total: items.reduce((sum, item) => {
                const product = products.data.find((p) => p.id === item.product_id);
                return sum + (product?.price || 0) * item.quantity_planned;
            }, 0),
        };
    }, [selectedProducts, products]);

    const openProductModal = (product: { id?: number; name?: string; stock?: number; price?: number }) => {
        const existing = selectedProducts.get(product.id!);
        setCurrentProduct(product);
        setModalData({
            reported_stock: existing?.reported_stock ?? product.stock ?? 0,
            quantity_planned: existing?.quantity_planned ?? 1,
        });
        setIsModalOpen(true);
    };

    const confirmProductSelection = () => {
        if (!currentProduct) return;

        const newMap = new Map(selectedProducts);
        newMap.set(currentProduct.id!, {
            product_id: currentProduct.id!,
            reported_stock: modalData.reported_stock,
            to_buy: false,
            quantity_planned: modalData.quantity_planned,
        });
        setSelectedProducts(newMap);
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    const removeProduct = (productId: number) => {
        const newMap = new Map(selectedProducts);
        newMap.delete(productId);
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

    const removeFromCart = (productId: number) => {
        const newMap = new Map(selectedProducts);
        const product = newMap.get(productId);
        if (product) {
            newMap.set(productId, { ...product, to_buy: false });
            setSelectedProducts(newMap);
        }
    };

    const addToCart = (productId: number) => {
        const newMap = new Map(selectedProducts);
        const product = newMap.get(productId);
        if (product) {
            newMap.set(productId, { ...product, to_buy: true });
            setSelectedProducts(newMap);
        }
    };

    const submit = () => {
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

    const renderCartContent = () => {
        const cartItems = Array.from(selectedProducts.values());
        const itemsToShow = cartItems.filter((item) => item.to_buy);

        if (cartItems.length === 0) {
            return <p className="py-8 text-center text-sm text-muted-foreground">No hay productos seleccionados</p>;
        }

        return (
            <div className="space-y-4">
                {/* Productos seleccionados sin comprar */}
                {cartItems.filter((item) => !item.to_buy).length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Productos seleccionados ({cartItems.filter((item) => !item.to_buy).length})</h4>
                        <div className="space-y-2">
                            {cartItems
                                .filter((item) => !item.to_buy)
                                .map((item) => {
                                    const product = products.data.find((p) => p.id === item.product_id);
                                    return (
                                        <Card key={item.product_id}>
                                            <CardContent className="p-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h5 className="text-sm font-medium">{product?.name}</h5>
                                                        <p className="mt-1 text-xs text-muted-foreground">Stock: {item.reported_stock}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => product && openProductModal(product)}
                                                            title="Editar"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => addToCart(item.product_id)}
                                                            title="Agregar al carrito"
                                                        >
                                                            <ShoppingCart className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeProduct(item.product_id)}
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                        </div>
                    </div>
                )}

                {/* Productos para comprar */}
                {itemsToShow.length === 0 ? (
                    <div className="border-t pt-4">
                        <p className="text-center text-sm text-muted-foreground">No hay productos para comprar</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Para comprar ({itemsToShow.length})</h4>
                        <div className="max-h-[400px] space-y-2 overflow-y-auto">
                            {itemsToShow.map((item) => {
                                const product = products.data.find((p) => p.id === item.product_id);
                                return (
                                    <Card key={item.product_id}>
                                        <CardContent className="p-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 space-y-2">
                                                    <h5 className="text-sm font-medium">{product?.name}</h5>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground">Stock: {item.reported_stock}</p>
                                                        <div>
                                                            <Label htmlFor={`qty-${item.product_id}`} className="text-xs">
                                                                Cantidad
                                                            </Label>
                                                            <Input
                                                                id={`qty-${item.product_id}`}
                                                                type="number"
                                                                min={1}
                                                                value={item.quantity_planned}
                                                                onChange={(e) =>
                                                                    updateProduct(
                                                                        item.product_id,
                                                                        'quantity_planned',
                                                                        Math.max(1, parseInt(e.target.value) || 1),
                                                                    )
                                                                }
                                                                className="mt-1 h-8"
                                                            />
                                                        </div>
                                                        {product?.price && (
                                                            <p className="text-xs font-semibold">
                                                                Total: ${((product.price || 0) * item.quantity_planned).toFixed(2)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => product && openProductModal(product)}
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFromCart(item.product_id)}
                                                        title="Quitar del carrito"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {cartSummary.total > 0 && (
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between text-lg font-semibold">
                                    <span>Total estimado:</span>
                                    <span>${cartSummary.total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Checklist" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header con título y botón de guardar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Crear Checklist</h1>
                    <div className="flex gap-2">
                        {/* Botón de carrito móvil */}
                        <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setIsCartModalOpen(true)}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Carrito
                            {cartSummary.count > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {cartSummary.count}
                                </Badge>
                            )}
                        </Button>
                        {/* Botón de guardar - visible si hay productos seleccionados */}
                        {selectedProducts.size > 0 && (
                            <Button onClick={submit} disabled={processing} size="sm">
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {processing ? 'Guardando...' : 'Guardar Checklist'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filtros */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="search">Buscar producto</Label>
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Buscar por nombre..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Todas las categorías" />
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
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Lista de productos */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Productos ({filteredProducts.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Vista de tabla para pantallas grandes */}
                                <div className="hidden overflow-x-auto md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Producto</TableHead>
                                                <TableHead>Categoría</TableHead>
                                                <TableHead className="text-center">Acción</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProducts.map((product) => {
                                                const selected = selectedProducts.get(product.id!);
                                                const isSelected = !!selected;

                                                return (
                                                    <TableRow key={product.id} className={isSelected ? 'bg-muted/50' : ''}>
                                                        <TableCell className="font-medium">{product.name}</TableCell>
                                                        <TableCell>
                                                            {product.category ? (
                                                                <Badge
                                                                    style={{
                                                                        backgroundColor: product.category.bg_color || undefined,
                                                                        color: product.category.text_color || undefined,
                                                                    }}
                                                                >
                                                                    {product.category.name}
                                                                </Badge>
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Button
                                                                type="button"
                                                                variant={isSelected ? 'secondary' : 'outline'}
                                                                size="sm"
                                                                onClick={() => openProductModal(product)}
                                                            >
                                                                {isSelected ? 'Seleccionado' : 'Seleccionar'}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Vista de cards para pantallas pequeñas */}
                                <div className="block space-y-4 md:hidden">
                                    {filteredProducts.map((product) => {
                                        const selected = selectedProducts.get(product.id!);
                                        const isSelected = !!selected;

                                        return (
                                            <Card key={product.id} className={isSelected ? 'border-primary' : ''}>
                                                <CardContent className="p-4">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h3 className="font-semibold">{product.name}</h3>
                                                            {product.category && (
                                                                <Badge
                                                                    className="mt-2"
                                                                    style={{
                                                                        backgroundColor: product.category.bg_color || undefined,
                                                                        color: product.category.text_color || undefined,
                                                                    }}
                                                                >
                                                                    {product.category.name}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant={isSelected ? 'secondary' : 'outline'}
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() => openProductModal(product)}
                                                        >
                                                            {isSelected ? 'Seleccionado' : 'Seleccionar'}
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                    {filteredProducts.length === 0 && (
                                        <div className="py-8 text-center text-muted-foreground">No se encontraron productos</div>
                                    )}
                                </div>

                                {/* Paginación */}
                                {products.data.length > 0 && <Pagination links={products.links} />}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Carrito de compras - Desktop */}
                    <div className="hidden lg:col-span-1 lg:block">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Carrito
                                    {cartSummary.count > 0 && (
                                        <Badge variant="secondary" className="ml-auto">
                                            {cartSummary.count}
                                        </Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>{renderCartContent()}</CardContent>
                        </Card>
                    </div>
                </div>

                {/* Modal de confirmación de producto */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar Stock - {currentProduct?.name}</DialogTitle>
                            <DialogDescription>Verifique el stock actual y la cantidad planificada para este producto</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="modal-stock">Stock actual en sistema</Label>
                                <p className="text-sm text-muted-foreground">Stock registrado: {currentProduct?.stock || 0}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-reported">Stock reportado (verificado)</Label>
                                <Input
                                    id="modal-reported"
                                    type="number"
                                    min={0}
                                    value={modalData.reported_stock}
                                    onChange={(e) =>
                                        setModalData({
                                            ...modalData,
                                            reported_stock: Math.max(0, parseInt(e.target.value) || 0),
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-planned">Cantidad planificada a comprar</Label>
                                <Input
                                    id="modal-planned"
                                    type="number"
                                    min={1}
                                    value={modalData.quantity_planned}
                                    onChange={(e) =>
                                        setModalData({
                                            ...modalData,
                                            quantity_planned: Math.max(1, parseInt(e.target.value) || 1),
                                        })
                                    }
                                />
                                {currentProduct?.price && (
                                    <p className="text-sm text-muted-foreground">
                                        Costo estimado: ${((currentProduct.price || 0) * modalData.quantity_planned).toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="button" onClick={confirmProductSelection}>
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Modal del carrito - Mobile */}
                <Dialog open={isCartModalOpen} onOpenChange={setIsCartModalOpen}>
                    <DialogContent className="max-h-[90vh] max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Carrito de Compras
                                {cartSummary.count > 0 && (
                                    <Badge variant="secondary" className="ml-auto">
                                        {cartSummary.count}
                                    </Badge>
                                )}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="overflow-y-auto">{renderCartContent()}</div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
