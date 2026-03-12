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

type Province = { id: string; name: string; sortOrder: number };
type City = {
  id: string;
  name: string;
  provinceId: string;
  sortOrder: number;
  province: { id: string; name: string };
};

export default function AdminCitiesPage() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [data, setData] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<City | null>(null);
  const [form, setForm] = useState({ name: "", provinceId: "", sortOrder: 0 });
  const [filterProvinceId, setFilterProvinceId] = useState<string>("");

  const loadProvinces = async () => {
    const { data: res } = await api.admin.provinces.get();
    setProvinces(res?.data ?? []);
  };

  const loadCities = async () => {
    const { data: res, error } = await api.admin.cities.get({
      query: filterProvinceId ? { provinceId: filterProvinceId } : {},
    });
    if (error) return;
    setData(res?.data ?? []);
  };

  useEffect(() => {
    loadProvinces();
  }, []);

  useEffect(() => {
    loadCities().finally(() => setLoading(false));
  }, [filterProvinceId]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      provinceId: filterProvinceId || provinces[0]?.id || "",
      sortOrder: data.length,
    });
    setDialogOpen(true);
  };

  const openEdit = (c: City) => {
    setEditing(c);
    setForm({
      name: c.name,
      provinceId: c.provinceId,
      sortOrder: c.sortOrder,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.provinceId) return;
    if (editing) {
      const { error } = await api.admin.cities({ id: editing.id }).put({
        name: form.name,
        provinceId: form.provinceId,
        sortOrder: form.sortOrder,
      });
      if (!error) {
        setDialogOpen(false);
        loadCities();
      }
    } else {
      const { error } = await api.admin.cities.post({
        name: form.name,
        provinceId: form.provinceId,
        sortOrder: form.sortOrder,
      });
      if (!error) {
        setDialogOpen(false);
        loadCities();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف این شهر؟")) return;
    const { error } = await api.admin.cities({ id }).delete();
    if (!error) loadCities();
  };

  if (loading && data.length === 0)
    return (
      <div className="p-6" dir="rtl">
        در حال بارگذاری...
      </div>
    );

  return (
    <div dir="rtl" className="text-right">
      <div className="mb-6 flex flex-row-reverse flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">شهرها</h1>
        <div className="flex flex-row-reverse items-center gap-2">
          <select
            value={filterProvinceId}
            onChange={(e) => setFilterProvinceId(e.target.value)}
            className="border-input h-9 rounded-md border px-3"
            dir="rtl"
          >
            <option value="">همه استان‌ها</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <Button onClick={openCreate}>
            <Plus className="me-2 h-4 w-4" />
            افزودن شهر
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست شهرها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-end">نام</TableHead>
                <TableHead className="text-end">استان</TableHead>
                <TableHead className="text-end">ترتیب</TableHead>
                <TableHead className="w-24 text-end">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-end">{c.name}</TableCell>
                  <TableCell className="text-end">{c.province.name}</TableCell>
                  <TableCell className="text-end">{c.sortOrder}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}>
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
        <DialogContent dir="rtl" className="text-right">
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش شهر" : "افزودن شهر"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>نام شهر</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>استان</Label>
              <select
                value={form.provinceId}
                onChange={(e) => setForm((f) => ({ ...f, provinceId: e.target.value }))}
                className="border-input h-9 w-full rounded-md border px-3"
                dir="rtl"
                required
              >
                <option value="">انتخاب استان</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
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
            <DialogFooter className="flex-row-reverse gap-2 sm:gap-0">
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
