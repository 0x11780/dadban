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
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Image as ImageIcon } from "lucide-react";

type Person = {
  id: string;
  firstName: string;
  lastName: string;
  nationalCode?: string | null;
  imageUrl?: string | null;
  title?: string | null;
  isFamous: boolean;
};

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [famousOnly, setFamousOnly] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Person | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nationalCode: "",
    imageUrl: "",
    title: "",
    isFamous: false,
  });

  const fetchPeople = async () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (famousOnly !== null) params.famous = String(famousOnly);
    const { data } = await api.admin.people.get(params);
    setPeople(data?.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPeople();
  }, [search, famousOnly]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      firstName: "",
      lastName: "",
      nationalCode: "",
      imageUrl: "",
      title: "",
      isFamous: false,
    });
    setDialogOpen(true);
  };

  const openEdit = (p: Person) => {
    setEditing(p);
    setForm({
      firstName: p.firstName,
      lastName: p.lastName,
      nationalCode: p.nationalCode ?? "",
      imageUrl: p.imageUrl ?? "",
      title: p.title ?? "",
      isFamous: p.isFamous,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await api.admin.people({ id: editing.id }).put({
        firstName: form.firstName,
        lastName: form.lastName,
        nationalCode: form.nationalCode || undefined,
        imageUrl: form.imageUrl || undefined,
        title: form.title || undefined,
        isFamous: form.isFamous,
      });
    } else {
      await api.admin.people.post({
        firstName: form.firstName,
        lastName: form.lastName,
        nationalCode: form.nationalCode || undefined,
        imageUrl: form.imageUrl || undefined,
        title: form.title || undefined,
        isFamous: form.isFamous,
      });
    }
    setDialogOpen(false);
    fetchPeople();
  };

  const toggleFamous = async (p: Person) => {
    await api.admin.people({ id: p.id }).put({ isFamous: !p.isFamous });
    fetchPeople();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">افراد</h1>
        <Button onClick={openCreate}>
          <Plus className="ml-2 h-4 w-4" />
          افزودن
        </Button>
      </div>

      <div className="mb-4 flex gap-4">
        <Input
          placeholder="جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <label className="flex items-center gap-2">
          <Switch
            checked={famousOnly === true}
            onCheckedChange={(c) => setFamousOnly(c ? true : null)}
          />
          فقط افراد معروف
        </label>
      </div>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>آواتار</TableHead>
              <TableHead>نام</TableHead>
              <TableHead>عنوان</TableHead>
              <TableHead>معروف</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={p.imageUrl ?? undefined}
                      alt={`${p.firstName} ${p.lastName}`}
                    />
                    <AvatarFallback>
                      {p.firstName[0]}
                      {p.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  {p.firstName} {p.lastName}
                </TableCell>
                <TableCell>{p.title ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={p.isFamous ? "default" : "secondary"}>
                    {p.isFamous ? "معروف" : "عادی"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2"
                    onClick={() => toggleFamous(p)}
                  >
                    تغییر
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش شخص" : "افزودن شخص"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>نام</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>نام خانوادگی</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <Label>عنوان (سمت)</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <Label>کد ملی</Label>
              <Input
                value={form.nationalCode}
                onChange={(e) => setForm((f) => ({ ...f, nationalCode: e.target.value }))}
              />
            </div>
            <div>
              <Label>لینک آواتار (URL)</Label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isFamous}
                onCheckedChange={(c) => setForm((f) => ({ ...f, isFamous: c }))}
              />
              <Label>شخص معروف (عمومی)</Label>
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
