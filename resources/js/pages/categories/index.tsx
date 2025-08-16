import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';
import { Category } from '@/types/business/category';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: '/' },
    { title: 'Categorías', href: '#' },
];

export default function CategoryIndex({ categories }: { categories: Category[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorías" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header con botón de acción */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Categorías</h1>
                    <Button asChild size="sm">
                        <Link href={route('categories.create')}>
                            <Plus className="mr-1 h-4 w-4" /> Crear Categoría
                        </Link>
                    </Button>
                </div>

                {/* Tabla */}
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="relative overflow-x-auto">
                        <Table className="w-full text-left text-sm">
                            <TableCaption>Lista de todas las categorías</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">Nombre</TableHead>
                                    <TableHead className="text-center">Color de fondo</TableHead>
                                    <TableHead className="text-center">Color de texto</TableHead>
                                    <TableHead className="text-center">Vista previa</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length > 0 ? (
                                    categories.map((category: Category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: category.bg_color }} />
                                                    {category.bg_color}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: category.text_color }} />
                                                    {category.text_color}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center">
                                                    <Badge
                                                        variant="secondary"
                                                        className="flex min-w-[120px] items-center gap-2 px-4 py-2"
                                                        style={{
                                                            backgroundColor: category.bg_color,
                                                            color: category.text_color,
                                                        }}
                                                    >
                                                        <span>{category.icon}</span> {category.name}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    {/* Ver */}
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={route('categories.show', category.id)}>
                                                            <Eye className="mr-1 h-4 w-4" /> Ver
                                                        </Link>
                                                    </Button>

                                                    {/* Editar */}
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={route('categories.edit', category.id)}>
                                                            <Pencil className="mr-1 h-4 w-4" /> Editar
                                                        </Link>
                                                    </Button>

                                                    {/* Eliminar */}
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (confirm(`¿Seguro que deseas eliminar la categoría "${category.name}"?`)) {
                                                                // Aquí va la acción de Inertia delete
                                                                // ej: router.delete(route('categories.destroy', category.id))
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="mr-1 h-4 w-4" /> Eliminar
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No hay categorías registradas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
