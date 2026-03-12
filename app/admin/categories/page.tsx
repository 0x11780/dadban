"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/edyen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: string;
  sortOrder: number;
  isActive: boolean;
  parentId: string | null;
};

export default function AdminCategoriesPage() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    type: "report",
    sortOrder: 0,
    isActive: true,
    parentId: null as string | null,
  });

  const load = async () => {
    const { data: res, error } = await api.admin.categories.get();
    if (error) return;
    setData(res?.data ?? []);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      type: "report",
      sortOrder: data.length,
      isActive: true,
      parentId: null,
    });
    setDialogOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      type: c.type,
      sortOrder: c.sortOrder,
      isActive: c.isActive,
      parentId: c.parentId,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const { error } = await api.admin.categories({ id: editing.id }).put({
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        type: form.type,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
        parentId: form.parentId,
      });
      if (!error) {
        setDialogOpen(false);
        load();
      }
    } else {
      const { error } = await api.admin.categories.post({
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        type: form.type,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
        parentId: form.parentId || undefined,
      });
      if (!error) {
        setDialogOpen(false);
        load();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف این دسته‌بندی؟")) return;
    const { error } = await api.admin.categories({ id }).delete();
    if (!error) load();
  };

  const parents = data.filter((c) => !c.parentId);

  if (loading) return <div className="p-6">در حال بارگذاری...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">دسته‌بندی‌ها</h1>
        <Button onClick={openCreate}>
          <Plus className="ml-2 h-4 w-4" />
          افزودن
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست دسته‌بندی‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>اسلاگ</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>ترتیب</TableHead>
                <TableHead>فعال</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.slug}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>{c.sortOrder}</TableCell>
                  <TableCell>{c.isActive ? "✓" : "✗"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>نام</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>اسلاگ</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
                dir="ltr"
                className="text-left"
              />
            </div>
            <div>
              <Label>توضیحات</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <Label>نوع</Label>
              <Input
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              />
            </div>
            <div>
              <Label>ترتیب</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: !!v }))}
              />
              <Label>فعال</Label>
            </div>
            <div>
              <Label>والد (اختیاری)</Label>
              <select
                className="border-input h-9 w-full rounded-md border px-3"
                value={form.parentId ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value || null }))}
              >
                <option value="">بدون والد</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                انصراف
              </Button>
              <Button type="submit">{editing ? "ذخیره" : "افزودن"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
