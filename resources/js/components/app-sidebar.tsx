import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Box, ClipboardList, Folder, LayoutGrid, Store, Tags, Weight } from 'lucide-react';
import AppLogo from './app-logo';

function useMainNavItems(): NavItem[] {
    const { openChecklistItemsCount } = usePage<SharedData>().props;

    return [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Productos',
            href: '/dashboard/products',
            icon: Box,
        },
        {
            title: 'Mi Lista',
            href: '/dashboard/checklists/active',
            icon: ClipboardList,
            badge: openChecklistItemsCount || undefined,
        },
        {
            title: 'Categorías',
            href: '/dashboard/categories',
            icon: Tags,
        },
        {
            title: 'Lugares',
            href: '/dashboard/places',
            icon: Store,
        },
        {
            title: 'Unidades',
            href: '/dashboard/units',
            icon: Weight,
        },
    ];
}

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const mainNavItems = useMainNavItems();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
