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
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuStar, LuTrash2, LuUpload, LuGripVertical } from "react-icons/lu";
import {
  uploadImage,
  setCover,
  reorderMedia,
  deleteImage,
  type MediaItem,
} from "@/lib/media-actions";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];
const MAX = 5 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

function Thumb({ m, onCover, onDelete }: { m: MediaItem; onCover: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: m.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="relative overflow-hidden rounded-lg border border-base-200 bg-base-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m.url} alt="" className="aspect-square w-full object-cover" />
      {m.is_cover ? <span className="badge badge-primary badge-sm absolute left-1 top-1">ปก</span> : null}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="btn btn-xs btn-circle absolute right-1 top-1 cursor-grab"
        aria-label="ลากเพื่อจัดลำดับ"
      >
        <LuGripVertical size={14} />
      </button>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-base-100/85 px-1 py-0.5">
        {m.is_cover ? (
          <span className="text-xs text-base-content/50">ภาพหน้าปก</span>
        ) : (
          <button type="button" onClick={onCover} className="btn btn-ghost btn-xs gap-1">
            <LuStar size={12} /> ตั้งปก
          </button>
        )}
        <button type="button" onClick={onDelete} className="btn btn-ghost btn-xs text-error" aria-label="ลบ">
          <LuTrash2 size={12} />
        </button>
      </div>
    </div>
  );
}

export default function MediaManager({ propertyId, initial }: { propertyId: string; initial: MediaItem[] }) {
  const [items, setItems] = useState<MediaItem[]>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setBusy(true);
    for (const file of Array.from(files)) {
      if (items.length >= 20) {
        setError("อัปได้สูงสุด 20 รูปต่อทรัพย์");
        break;
      }
      if (!ACCEPT.includes(file.type)) {
        setError(`${file.name}: รองรับเฉพาะ jpg/png/webp`);
        continue;
      }
      if (file.size > MAX) {
        setError(`${file.name}: ไฟล์เกิน 5MB`);
        continue;
      }
      try {
        const dataBase64 = await fileToBase64(file);
        const res = await uploadImage(propertyId, { filename: file.name, contentType: file.type, dataBase64 });
        if ("error" in res) setError(res.error);
        else setItems((prev) => [...prev, res.media]);
      } catch {
        setError(`${file.name}: อ่านไฟล์ไม่สำเร็จ`);
      }
    }
    setBusy(false);
  }

  function onCover(id: string) {
    setItems((prev) => prev.map((m) => ({ ...m, is_cover: m.id === id })));
    startTransition(() => setCover(propertyId, id));
  }

  function onDelete(id: string) {
    setItems((prev) => {
      const removed = prev.find((m) => m.id === id);
      let next = prev.filter((m) => m.id !== id);
      if (removed?.is_cover && next.length && !next.some((m) => m.is_cover)) {
        next = next.map((m, i) => (i === 0 ? { ...m, is_cover: true } : m));
      }
      return next;
    });
    startTransition(() => deleteImage(propertyId, id));
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((m) => m.id === active.id);
    const newIndex = items.findIndex((m) => m.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    startTransition(() => reorderMedia(propertyId, next.map((m) => m.id)));
  }

  return (
    <div className="card border border-base-200 bg-base-100">
      <div className="card-body space-y-3">
        <h2 className="font-semibold">
          รูปภาพ <span className="text-sm font-normal text-base-content/50">({items.length}/20)</span>
        </h2>
        <label className={`btn btn-outline btn-sm w-fit gap-1 ${busy ? "btn-disabled" : ""}`}>
          <LuUpload size={16} /> {busy ? "กำลังอัปโหลด…" : "อัปโหลดรูป"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        {items.length ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map((m) => m.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {items.map((m) => (
                  <Thumb key={m.id} m={m} onCover={() => onCover(m.id)} onDelete={() => onDelete(m.id)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-sm text-base-content/50">ยังไม่มีรูป</p>
        )}
        <p className="text-xs text-base-content/50">ลากที่มุมขวาบนเพื่อจัดลำดับ · jpg/png/webp ≤ 5MB · สูงสุด 20 รูป</p>
      </div>
    </div>
  );
}
