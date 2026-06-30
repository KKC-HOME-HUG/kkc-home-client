"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical, LuPlus, LuPencil, LuX } from "react-icons/lu";
import type { CreateInput, UpdateInput, Result } from "@/lib/settings-actions";

export type EditorItem = {
  key: string | number;
  nameTh: string;
  nameEn: string;
  meta: string;
  meta2?: string;
  meta2Text?: string | null;
  isActive: boolean;
};
type Option = { value: string; label: string };

function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function Row({
  item,
  metaLabelOf,
  onEdit,
  onToggle,
  pending,
}: {
  item: EditorItem;
  metaLabelOf: (v: string) => string;
  onEdit: (it: EditorItem) => void;
  onToggle: (it: EditorItem) => void;
  pending: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: String(item.key) });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 rounded-lg border border-base-200 bg-base-100 p-2">
      <button type="button" {...attributes} {...listeners} className="btn btn-ghost btn-xs btn-square cursor-grab" aria-label="ลาก">
        <LuGripVertical size={14} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{item.nameTh}</div>
        <div className="truncate text-xs text-base-content/50">{item.nameEn}</div>
      </div>
      {item.meta2Text ? <span className="badge badge-ghost badge-sm">{item.meta2Text}</span> : null}
      <span className="badge badge-ghost badge-sm">{metaLabelOf(item.meta)}</span>
      <span className="hidden font-mono text-xs text-base-content/40 sm:inline">{item.key}</span>
      <input
        type="checkbox"
        className="toggle toggle-success toggle-sm"
        checked={item.isActive}
        disabled={pending}
        onChange={() => onToggle(item)}
        aria-label="เปิด/ปิดใช้งาน"
      />
      <button type="button" className="btn btn-ghost btn-xs btn-square" onClick={() => onEdit(item)} aria-label="แก้ไข">
        <LuPencil size={13} />
      </button>
    </div>
  );
}

export default function MasterListEditor({
  initial,
  metaLabel,
  metaOptions,
  identMode,
  identLabel,
  meta2Label,
  meta2Optional,
  loadMeta2,
  onCreate,
  onUpdate,
  onReorder,
}: {
  initial: EditorItem[];
  metaLabel: string;
  metaOptions: Option[];
  identMode: "code" | "slug-auto";
  identLabel: string;
  meta2Label?: string;
  meta2Optional?: boolean;
  loadMeta2?: (meta1: string) => Promise<Option[]>;
  onCreate: (i: CreateInput) => Promise<Result>;
  onUpdate: (key: string | number, p: UpdateInput) => Promise<Result | void>;
  onReorder: (keys: (string | number)[]) => Promise<void>;
}) {
  const [items, setItems] = useState<EditorItem[]>(initial);
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<EditorItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ nameTh: "", nameEn: "", meta: metaOptions[0]?.value ?? "", meta2: "", ident: "" });
  const [meta2Options, setMeta2Options] = useState<Option[]>([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const hasMeta2 = !!loadMeta2;
  const metaLabelOf = (v: string) => metaOptions.find((o) => o.value === v)?.label ?? v;
  const meta2LabelOf = (v: string) => meta2Options.find((o) => o.value === v)?.label ?? null;
  const formOpen = adding || editing !== null;
  const identValue = identMode === "slug-auto" && !slugTouched && adding ? slugify(form.nameEn) : form.ident;

  async function loadFor(amphoe: string) {
    if (!loadMeta2) return;
    setMeta2Options(await loadMeta2(amphoe));
  }

  async function openAdd() {
    const meta = metaOptions[0]?.value ?? "";
    setEditing(null);
    setAdding(true);
    setForm({ nameTh: "", nameEn: "", meta, meta2: "", ident: "" });
    setSlugTouched(false);
    setError("");
    await loadFor(meta);
  }
  async function openEdit(it: EditorItem) {
    setAdding(false);
    setEditing(it);
    setForm({ nameTh: it.nameTh, nameEn: it.nameEn, meta: it.meta, meta2: it.meta2 ?? "", ident: String(it.key) });
    setError("");
    await loadFor(it.meta);
  }
  function close() {
    setAdding(false);
    setEditing(null);
    setError("");
  }

  async function onMetaChange(value: string) {
    setForm((f) => ({ ...f, meta: value, meta2: "" }));
    await loadFor(value);
  }

  function submit() {
    setError("");
    const meta2 = hasMeta2 ? form.meta2 : undefined;
    if (editing) {
      start(async () => {
        const r = await onUpdate(editing.key, { nameTh: form.nameTh, nameEn: form.nameEn, meta: form.meta, meta2 });
        if (r && "error" in r && r.error) {
          setError(r.error);
          return;
        }
        setItems((prev) =>
          prev.map((x) =>
            x.key === editing.key
              ? { ...x, nameTh: form.nameTh, nameEn: form.nameEn, meta: form.meta, meta2, meta2Text: meta2 ? meta2LabelOf(meta2) : null }
              : x,
          ),
        );
        close();
      });
    } else {
      const ident = (identMode === "code" ? form.ident : identValue).trim();
      start(async () => {
        const r = await onCreate({ nameTh: form.nameTh, nameEn: form.nameEn, meta: form.meta, meta2, ident: ident || undefined });
        if (r.error) {
          setError(r.error);
          return;
        }
        const key = (r.id ?? ident) as string | number;
        setItems((prev) => [
          ...prev,
          { key, nameTh: form.nameTh, nameEn: form.nameEn, meta: form.meta, meta2, meta2Text: meta2 ? meta2LabelOf(meta2) : null, isActive: true },
        ]);
        close();
      });
    }
  }

  function onToggle(it: EditorItem) {
    const next = !it.isActive;
    setItems((prev) => prev.map((x) => (x.key === it.key ? { ...x, isActive: next } : x)));
    start(() => {
      onUpdate(it.key, { isActive: next });
    });
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldI = items.findIndex((x) => String(x.key) === active.id);
    const newI = items.findIndex((x) => String(x.key) === over.id);
    const next = arrayMove(items, oldI, newI);
    setItems(next);
    start(() => {
      onReorder(next.map((x) => x.key));
    });
  }

  return (
    <div className="space-y-3">
      {!formOpen ? (
        <div className="flex justify-end">
          <button type="button" className="btn btn-primary btn-sm gap-1" onClick={openAdd}>
            <LuPlus size={14} /> เพิ่ม
          </button>
        </div>
      ) : null}

      {formOpen ? (
        <div className="card border border-base-200 bg-base-100">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{editing ? "แก้ไข" : "เพิ่มใหม่"}</h3>
              <button type="button" className="btn btn-ghost btn-xs btn-square" onClick={close} aria-label="ปิด">
                <LuX size={14} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">ชื่อ (ไทย)</span>
                <input value={form.nameTh} onChange={(e) => setForm({ ...form, nameTh: e.target.value })} className="input input-bordered input-sm w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">ชื่อ (อังกฤษ)</span>
                <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="input input-bordered input-sm w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">{metaLabel}</span>
                <select value={form.meta} onChange={(e) => onMetaChange(e.target.value)} className="select select-bordered select-sm w-full">
                  {metaOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
              {hasMeta2 ? (
                <label className="block">
                  <span className="mb-1 block text-xs text-base-content/60">{meta2Label}</span>
                  <select value={form.meta2} onChange={(e) => setForm({ ...form, meta2: e.target.value })} className="select select-bordered select-sm w-full">
                    {meta2Optional ? <option value="">— ไม่ระบุ —</option> : null}
                    {meta2Options.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
              ) : null}
              <label className="block">
                <span className="mb-1 block text-xs text-base-content/60">{identLabel}{editing ? " (แก้ไม่ได้)" : ""}</span>
                <input
                  value={editing ? String(editing.key) : identValue}
                  disabled={!!editing}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm({ ...form, ident: e.target.value });
                  }}
                  className="input input-bordered input-sm w-full font-mono"
                />
              </label>
            </div>
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <div>
              <button type="button" className="btn btn-primary btn-sm" disabled={pending || !form.nameTh.trim() || !form.nameEn.trim()} onClick={submit}>
                {pending ? "กำลังบันทึก…" : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((x) => String(x.key))} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((it) => (
              <Row key={String(it.key)} item={it} metaLabelOf={metaLabelOf} onEdit={openEdit} onToggle={onToggle} pending={pending} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {!items.length ? <p className="text-sm text-base-content/50">ยังไม่มีรายการ</p> : null}
    </div>
  );
}
