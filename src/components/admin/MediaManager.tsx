"use client";

import { useEffect, useRef, useState, useTransition } from "react";
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
import { LuStar, LuTrash2, LuUpload, LuGripVertical, LuImageOff } from "react-icons/lu";
import {
  uploadImage,
  setCover,
  reorderMedia,
  deleteImage,
  type MediaItem,
} from "@/lib/media-actions";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];
const MAX = 5 * 1024 * 1024;
const LIMIT = 20;

// A grid item may be a real stored image or a temporary one still uploading.
type UIItem = MediaItem & { pending?: boolean };

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

function Thumb({ m, disabled, onCover, onDelete }: { m: UIItem; disabled: boolean; onCover: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: m.id,
    disabled: disabled || m.pending,
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const [broken, setBroken] = useState(false);

  return (
    <div ref={setNodeRef} style={style} className="relative overflow-hidden rounded-lg border border-base-200 bg-base-100">
      {broken ? (
        <div className="flex aspect-square w-full items-center justify-center bg-base-200 text-base-content/30">
          <LuImageOff size={24} />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.url} alt="" className="aspect-square w-full object-cover" onError={() => setBroken(true)} />
      )}

      {m.pending ? (
        <div className="absolute inset-0 flex items-center justify-center bg-base-100/50">
          <span className="loading loading-spinner text-primary" />
        </div>
      ) : (
        <>
          {m.is_cover ? <span className="badge badge-primary badge-sm absolute left-1 top-1">ปก</span> : null}
          <button
            type="button"
            {...attributes}
            {...listeners}
            disabled={disabled}
            className="btn btn-xs btn-circle absolute right-1 top-1 cursor-grab"
            aria-label="ลากเพื่อจัดลำดับ"
          >
            <LuGripVertical size={14} />
          </button>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-base-100/85 px-1 py-0.5">
            {m.is_cover ? (
              <span className="text-xs text-base-content/50">ภาพหน้าปก</span>
            ) : (
              <button type="button" onClick={onCover} disabled={disabled} className="btn btn-ghost btn-xs gap-1">
                <LuStar size={12} /> ตั้งปก
              </button>
            )}
            <button type="button" onClick={onDelete} disabled={disabled} className="btn btn-ghost btn-xs text-error" aria-label="ลบ">
              <LuTrash2 size={12} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function MediaManager({ propertyId, initial }: { propertyId: string; initial: MediaItem[] }) {
  const [items, setItems] = useState<UIItem[]>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();
  const tmpRef = useRef(0);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Warn before a hard leave (refresh / close / external) while an upload is in flight.
  useEffect(() => {
    if (!busy) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [busy]);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setBusy(true);
    let count = items.length;
    for (const file of Array.from(files)) {
      if (count >= LIMIT) {
        setError(`อัปได้สูงสุด ${LIMIT} รูปต่อทรัพย์`);
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

      count += 1;
      const tmpId = `tmp-${tmpRef.current++}`;
      const localUrl = URL.createObjectURL(file);
      setItems((prev) => [...prev, { id: tmpId, url: localUrl, is_cover: false, sort_order: count, pending: true }]);

      try {
        const dataBase64 = await fileToBase64(file);
        const res = await uploadImage(propertyId, { filename: file.name, contentType: file.type, dataBase64 });
        URL.revokeObjectURL(localUrl);
        if ("error" in res) {
          setItems((prev) => prev.filter((m) => m.id !== tmpId));
          setError(res.error);
        } else {
          setItems((prev) => prev.map((m) => (m.id === tmpId ? res.media : m)));
        }
      } catch {
        URL.revokeObjectURL(localUrl);
        setItems((prev) => prev.filter((m) => m.id !== tmpId));
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
          รูปภาพ <span className="text-sm font-normal text-base-content/50">({items.length}/{LIMIT})</span>
        </h2>
        <label className={`btn btn-outline btn-sm w-fit gap-1 ${busy ? "btn-disabled" : ""}`}>
          <LuUpload size={16} /> {busy ? "กำลังอัปโหลด…" : "อัปโหลดรูป"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            disabled={busy}
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        {items.length ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map((m) => m.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {items.map((m) => (
                  <Thumb key={m.id} m={m} disabled={busy} onCover={() => onCover(m.id)} onDelete={() => onDelete(m.id)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-sm text-base-content/50">ยังไม่มีรูป</p>
        )}
        <p className="text-xs text-base-content/50">ลากที่มุมขวาบนเพื่อจัดลำดับ · jpg/png/webp ≤ 5MB · สูงสุด {LIMIT} รูป</p>
      </div>
    </div>
  );
}
