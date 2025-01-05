'use client'

import { useEffect, useState } from 'react'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from 'lucide-react'
import ModalDrawer from './modal-drawer-wrapper'
import { toast } from "@/hooks/use-toast"
import { User } from '@/type/types'

const formSchema = z.object({
    fName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }).optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }).optional(),
    confirmPassword: z.string().optional(),
    role: z.enum(["Admin", "User"], {
        required_error: "Please select a role.",
    }),
    status: z.enum(["Active", "Inactive"], {
        required_error: "Please select a Status.",
    }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

interface UserModalProps {
    openDialog: boolean
    setOpenDialog: (value: boolean) => void
    editingUser: User | null
    setEditingUser: (value: User | null) => void
    fetchUsers: () => void
}
export default function UserModal({openDialog, setOpenDialog, editingUser, setEditingUser, fetchUsers}: UserModalProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fName: "",
            lName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: undefined,
            status:undefined
        },
    })
    
    useEffect(()=>{
        if(editingUser){
            form.reset({
                fName: editingUser.fName,
                lName: editingUser.lName,
                email: editingUser.email,
                password: undefined,
                confirmPassword: undefined,
                role: editingUser.role == 1? "Admin":"User",
                status:editingUser.status == 1? "Active":"Inactive",
            })
        }else{
            form.reset({
              fName: "",
              lName: "",
              email: "",
              password: "",
              confirmPassword: "",
              role: undefined,
              status: undefined
            });
        }
    },[editingUser])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const method = editingUser ? 'PUT' : 'POST';
        const payload = editingUser 
            ? { userID: editingUser.userID, ...values } 
            : values;

        try {
            const response = await fetch('/api/users',{
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if(response.ok){
                toast({
                    title: `User ${editingUser ? 'updated' : 'added'} successfully.`,
                    variant: "default",
                })
                setOpenDialog(false)
                fetchUsers()
                form.reset()
            }else{
                const errorData = await response.json();
                toast({
                    title: "Error",
                    description: errorData.error,
                    variant: "destructive",
                })
                console.log(errorData.error)
            }
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }
    const handleCancel = () => {
        if(editingUser){
            setEditingUser(null)
        }
        form.reset()
        setOpenDialog(false)
    }

    return(
        <ModalDrawer open={openDialog} onOpenChange={setOpenDialog}>
                <DialogHeader className='justify-start'>
                    <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                    <DialogDescription>
                        {editingUser ? 'Update the details of the user here.' : 'Enter the details of the user here.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="fName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {!editingUser && openDialog && (
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe@example.com" {...field} type="email"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        )}
                        {!editingUser && openDialog && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input 
                                                        placeholder="Enter Password" 
                                                        {...field} 
                                                        type={showPassword ? "text" : "password"}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input 
                                                        placeholder="Confirm Password" 
                                                        {...field} 
                                                        type={showConfirmPassword ? "text" : "password"}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="User">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {editingUser && openDialog && (
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className={`${field.value === "Active" ? ' text-green-500' : ' text-yellow-500'}`}>
                                                <SelectValue placeholder="Select Role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem className='text-green-500' value="Active">Active</SelectItem>
                                            <SelectItem className='text-yellow-500' value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter>
                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Save
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </ModalDrawer>
    )
}

