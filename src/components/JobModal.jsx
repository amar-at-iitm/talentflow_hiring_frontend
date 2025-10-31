// src/components/JobModal.jsx
import React, { useEffect, useState } from "react";
import slugify from "../utils/slugify";
import { db } from "../db/database";

export default function JobModal({ open, onClose, initial, onSave }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") || "");
  const [status, setStatus] = useState(initial?.status || "active");
  const [error, setError] = useState("");

  useEffect(()=> {
    if (open) {
      setTitle(initial?.title || "");
      setSlug(initial?.slug || "");
      setTags(initial?.tags?.join(", ") || "");
      setStatus(initial?.status || "active");
      setError("");
    }
  }, [open, initial]);

  useEffect(()=> {
    setSlug(slugify(title));
  }, [title]);

  const validateUniqueSlug = async (value) => {
    // check Dexie for existing slug other than current id
    const existing = await db.jobs.where("slug").equals(value).first();
    if (existing && (!initial || String(existing.id) !== String(initial.id))) {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    const ok = await validateUniqueSlug(slug);
    if (!ok) { setError("Slug must be unique; please change the title"); return; }
    const payload = { title: title.trim(), slug, tags: tags.split(",").map(t=>t.trim()).filter(Boolean), status };
    await onSave(payload);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded p-6 w-[600px]">
        <h2 className="text-lg font-semibold mb-4">{initial ? "Edit Job" : "Create Job"}</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="space-y-3">
          <div>
            <label className="block text-sm">Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Slug (auto)</label>
            <input value={slug} onChange={e=>setSlug(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Tags (comma separated)</label>
            <input value={tags} onChange={e=>setTags(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Status</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full border px-3 py-2 rounded">
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
