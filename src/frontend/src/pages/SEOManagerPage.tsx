import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Globe, Loader2, Plus, Search, Tag, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { SEOEntry } from "../backend";
import {
  useCreateSEOEntry,
  useDeleteSEOEntry,
  useGetAllSEOEntries,
  useUpdateSEOEntry,
} from "../hooks/useQueries";

interface SEOFormData {
  pageUrl: string;
  targetKeywords: string;
  metaTitle: string;
  metaDescription: string;
}

const defaultForm: SEOFormData = {
  pageUrl: "",
  targetKeywords: "",
  metaTitle: "",
  metaDescription: "",
};

export default function SEOManagerPage() {
  const { data: seoEntries = [], isLoading } = useGetAllSEOEntries();
  const createSEOEntry = useCreateSEOEntry();
  const updateSEOEntry = useUpdateSEOEntry();
  const deleteSEOEntry = useDeleteSEOEntry();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SEOEntry | null>(null);
  const [formData, setFormData] = useState<SEOFormData>(defaultForm);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const filteredEntries = seoEntries.filter(
    (entry) =>
      entry.pageUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.metaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.targetKeywords.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const totalKeywords = seoEntries.reduce(
    (sum, e) => sum + e.targetKeywords.length,
    0,
  );
  const optimizedCount = seoEntries.filter(
    (e) => e.metaTitle && e.metaDescription,
  ).length;

  const openCreate = () => {
    setEditingEntry(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const openEdit = (entry: SEOEntry) => {
    setEditingEntry(entry);
    setFormData({
      pageUrl: entry.pageUrl,
      targetKeywords: entry.targetKeywords.join(", "),
      metaTitle: entry.metaTitle,
      metaDescription: entry.metaDescription,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.pageUrl.trim()) {
      toast.error("Page URL is required");
      return;
    }
    const keywords = formData.targetKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      if (editingEntry) {
        await updateSEOEntry.mutateAsync({
          id: editingEntry.id,
          pageUrl: formData.pageUrl,
          targetKeywords: keywords,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
        });
        toast.success("SEO entry updated");
      } else {
        await createSEOEntry.mutateAsync({
          pageUrl: formData.pageUrl,
          targetKeywords: keywords,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
        });
        toast.success("SEO entry created");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save SEO entry";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteSEOEntry.mutateAsync(deleteId);
      toast.success("SEO entry deleted");
      setDeleteId(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete SEO entry";
      toast.error(message);
    }
  };

  const isSaving = createSEOEntry.isPending || updateSEOEntry.isPending;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SEO Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage meta tags and keywords for your pages
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Add SEO Entry
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold">{seoEntries.length}</div>
            <div className="text-sm text-muted-foreground">Total Pages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold">{totalKeywords}</div>
            <div className="text-sm text-muted-foreground">Total Keywords</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold">{optimizedCount}</div>
            <div className="text-sm text-muted-foreground">Optimized Pages</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search pages or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Entries */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Globe className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No SEO entries found. Add your first page!</p>
          <Button onClick={openCreate} className="mt-4 gap-2">
            <Plus className="w-4 h-4" />
            Add SEO Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <Card
              key={entry.id.toString()}
              className="hover:shadow-sm transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-medium text-sm truncate">
                        {entry.pageUrl}
                      </span>
                    </div>
                    {entry.metaTitle && (
                      <p className="text-sm font-medium text-foreground">
                        {entry.metaTitle}
                      </p>
                    )}
                    {entry.metaDescription && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {entry.metaDescription}
                      </p>
                    )}
                    {entry.targetKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        <Tag className="w-3 h-3 text-muted-foreground mt-0.5" />
                        {entry.targetKeywords.map((kw) => (
                          <Badge
                            key={kw}
                            variant="secondary"
                            className="text-xs px-1.5 py-0"
                          >
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(entry)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? "Edit SEO Entry" : "Add SEO Entry"}
            </DialogTitle>
            <DialogDescription>
              {editingEntry
                ? "Update the SEO details below."
                : "Add meta information for a page."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Page URL *</Label>
              <Input
                value={formData.pageUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, pageUrl: e.target.value }))
                }
                placeholder="https://example.com/page"
              />
            </div>
            <div className="space-y-1">
              <Label>Meta Title</Label>
              <Input
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaTitle: e.target.value,
                  }))
                }
                placeholder="Page title for search engines"
              />
            </div>
            <div className="space-y-1">
              <Label>Meta Description</Label>
              <Textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                placeholder="Brief description for search results..."
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label>Target Keywords (comma-separated)</Label>
              <Input
                value={formData.targetKeywords}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    targetKeywords: e.target.value,
                  }))
                }
                placeholder="seo, marketing, digital"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingEntry ? "Update Entry" : "Save Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete SEO Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this SEO entry? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleteSEOEntry.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteSEOEntry.isPending}
            >
              {deleteSEOEntry.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
