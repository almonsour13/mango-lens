import { Home, Users, Leaf, Image, Settings, FileText,TreeDeciduous, Scan, GalleryHorizontal, LucideIcon, Trees, LayoutDashboard, Trash, Trash2 } from 'lucide-react';

interface SidebarItem {
    href: string;
    icon: LucideIcon;
    label: string;
}

export const sidebarItems = (role: number|undefined):SidebarItem[] => {
    const baseItems: SidebarItem[] = [
        { href: '/user', icon: Home, label: 'Home' },
        { href: '/user/scan', icon: Scan, label: 'New Scan' }, 
        { href: '/user/gallery', icon: Image, label: 'Gallery' },
        { href: '/user/tree', icon: TreeDeciduous, label: 'Tree' },
        { href: '/user/pending', icon: GalleryHorizontal, label: 'Pending Scan' },
        { href: '/user/trash', icon: Trash2, label: 'Trash' },
        { href: '/user/settings', icon: Settings, label: 'Settings' },
    ];

    const adminSidebarItems: SidebarItem[] = [
        { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' }, 
        { href: '/admin/scan', icon: Scan, label: 'New Scan' }, 
        { href: '/admin/all-scan', icon: Image, label: 'All Scans' },
        { href: '/admin/users', icon: Users, label: 'Users' },
        { href: '/admin/trees', icon: Trees, label: 'Trees' },
        { href: '/admin/diseases', icon: Leaf, label: 'Diseases' },
        { href: '/admin/pending', icon: GalleryHorizontal, label: 'Pending Scan' },
        { href: '/admin/logs', icon: FileText, label: 'Activity Logs' },
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return role === 1 ? adminSidebarItems : role === 2 ? baseItems : [];
};
