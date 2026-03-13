"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/edyen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type Province = { id: string; name: string; sortOrder: number; _count?: { cities: number } };

export default function AdminProvincesPage() {
  const [data, setData] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Province | null>(null);
  const [form, setForm] = useState({ name: "", sortOrder: 0 });

  const load = async () => {
    const { data: res, error } = await api.admin.provinces.get();
    if (error) return;
    setData(res?.data ?? []);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", sortOrder: data.length });
    setDialogOpen(true);
  };

  const openEdit = (p: Province) => {
    setEditing(p);
    setForm({ name: p.name, sortOrder: p.sortOrder });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const { error } = await api.admin.provinces({ id: editing.id }).put({
        name: form.name,
        sortOrder: form.sortOrder,
      });
      if (!error) {
        setDialogOpen(false);
        load();
      }
    } else {
      const { error } = await api.admin.provinces.post({
        name: form.name,
        sortOrder: form.sortOrder,
      });
      if (!error) {
        setDialogOpen(false);
        load();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف این استان و شهرهای مرتبط؟")) return;
    const { error } = await api.admin.provinces({ id }).delete();
    if (!error) load();
  };

  if (loading)
    return (
      <div className="p-6" dir="rtl">
        در حال بارگذاری...
      </div>
    );

  return (
    <div dir="rtl" className="text-start">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">استان‌ها</h1>
        <Button onClick={openCreate}>
          <Plus className="me-2 h-4 w-4" />
          افزودن استان
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست استان‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>ترتیب</TableHead>
                <TableHead className="w-24">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell dir="ltr">{p.sortOrder}</TableCell>
                  <TableCell>
                    <div className="flex justify-start gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="text-start">
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش استان" : "افزودن استان"}</DialogTitle>
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
              <Label>ترتیب</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                dir="ltr"
                className="text-left"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="submit">{editing ? "ذخیره" : "افزودن"}</Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                انصراف
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
