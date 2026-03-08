"use client";

import { useState } from "react";
import {
    Users,
    Search,
    Plus,
    MoreVertical,
    Mail,
    Shield,
    UserCheck,
    UserX,
    Edit,
    Trash2,
    Filter,
    Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";

interface UserData {
    id: number;
    name: string;
    email: string;
    role: "Rover" | "Guardian" | "Medical" | "Admin";
    status: "active" | "inactive" | "suspended";
    lastLogin: string;
    createdAt: string;
}

const usersData: UserData[] = [
    { id: 1, name: "Sarah Johnson", email: "sarah@example.com", role: "Rover", status: "active", lastLogin: "2 min ago", createdAt: "Jan 15, 2026" },
    { id: 2, name: "John Doe", email: "john@example.com", role: "Guardian", status: "active", lastLogin: "15 min ago", createdAt: "Jan 20, 2026" },
    { id: 3, name: "Dr. Smith", email: "drsmith@hospital.com", role: "Medical", status: "active", lastLogin: "1 hour ago", createdAt: "Feb 1, 2026" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Rover", status: "active", lastLogin: "3 hours ago", createdAt: "Feb 5, 2026" },
    { id: 5, name: "Robert Williams", email: "robert@example.com", role: "Rover", status: "inactive", lastLogin: "2 days ago", createdAt: "Feb 10, 2026" },
    { id: 6, name: "Alice Chen", email: "alice@example.com", role: "Guardian", status: "active", lastLogin: "5 min ago", createdAt: "Feb 18, 2026" },
    { id: 7, name: "Dr. Patel", email: "drpatel@hospital.com", role: "Medical", status: "active", lastLogin: "4 hours ago", createdAt: "Feb 22, 2026" },
    { id: 8, name: "Mark Taylor", email: "mark@example.com", role: "Guardian", status: "suspended", lastLogin: "1 week ago", createdAt: "Mar 1, 2026" },
    { id: 9, name: "System Admin", email: "admin@novacare.ai", role: "Admin", status: "active", lastLogin: "Just now", createdAt: "Jan 1, 2026" },
];

export default function AdminUsersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<number | null>(null);

    const filteredUsers = usersData.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const roleBadgeVariant = {
        Rover: "info" as const,
        Guardian: "success" as const,
        Medical: "warning" as const,
        Admin: "danger" as const,
    };

    const statusConfig = {
        active: { color: "text-success", bg: "bg-success", label: "Active" },
        inactive: { color: "text-text-muted", bg: "bg-gray-400", label: "Inactive" },
        suspended: { color: "text-accent", bg: "bg-accent", label: "Suspended" },
    };

    const roles = ["Rover", "Guardian", "Medical", "Admin"];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text-primary dark:text-white">
                        User Management
                    </h1>
                    <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                        Manage user accounts and permissions
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add User
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {roles.map((role) => {
                    const count = usersData.filter(u => u.role === role).length;
                    return (
                        <Card
                            key={role}
                            className={cn(
                                "border cursor-pointer transition-all",
                                roleFilter === role
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-gray-100 dark:border-gray-700 hover:border-primary/50"
                            )}
                            onClick={() => setRoleFilter(roleFilter === role ? null : role)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-text-primary dark:text-white">{count}</p>
                                    <p className="text-sm text-text-muted dark:text-gray-400">{role}s</p>
                                </div>
                                <Badge variant={roleBadgeVariant[role as keyof typeof roleBadgeVariant]}>{role}</Badge>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search users by name or email..."
                        leftIcon={<Search className="w-5 h-5" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {roleFilter && (
                    <button
                        onClick={() => setRoleFilter(null)}
                        className="px-4 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary font-medium text-sm hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                    >
                        Clear filter: {roleFilter}
                    </button>
                )}
            </div>

            {/* Users Table */}
            <Card padding="none" className="border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary dark:text-gray-300">User</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary dark:text-gray-300">Role</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary dark:text-gray-300">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary dark:text-gray-300">Last Login</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary dark:text-gray-300">Created</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => {
                                const status = statusConfig[user.status];
                                return (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-100 dark:border-gray-700 last:border-none hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary font-semibold flex items-center justify-center text-sm">
                                                    {user.name.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-text-primary dark:text-white">{user.name}</p>
                                                    <p className="text-xs text-text-muted dark:text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={roleBadgeVariant[user.role]}>{user.role}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={cn("w-2 h-2 rounded-full", status.bg)} />
                                                <span className={cn("text-sm font-medium", status.color)}>{status.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-text-muted dark:text-gray-400">{user.lastLogin}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-text-muted dark:text-gray-400">{user.createdAt}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                    <Edit className="w-4 h-4 text-text-muted dark:text-gray-400" />
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <MoreVertical className="w-4 h-4 text-text-muted dark:text-gray-400" />
                                                    </button>
                                                    {openMenu === user.id && (
                                                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-elevated py-1 z-10 animate-fade-in">
                                                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                                <UserCheck className="w-4 h-4" />
                                                                Activate
                                                            </button>
                                                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                                <UserX className="w-4 h-4" />
                                                                Suspend
                                                            </button>
                                                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                                <Mail className="w-4 h-4" />
                                                                Send Email
                                                            </button>
                                                            <hr className="my-1 border-gray-200 dark:border-gray-700" />
                                                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-gray-50 dark:hover:bg-gray-700">
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add User Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size="md">
                <ModalHeader>Add New User</ModalHeader>
                <ModalBody className="space-y-4">
                    <Input label="Full Name" placeholder="Enter full name" />
                    <Input label="Email Address" placeholder="Enter email" type="email" />
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">
                            Role
                        </label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                            <option value="Rover">Rover (Primary User)</option>
                            <option value="Guardian">Guardian (Caregiver)</option>
                            <option value="Medical">Medical (Doctor)</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <Input label="Temporary Password" placeholder="Set a temporary password" type="password" />
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setIsAddModalOpen(false)}>Create User</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
