import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ChevronLeft, Phone, Mail, MapPin, Home, Tag, Clock,
  MessageSquare, Trash2, AlertCircle, Plus,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { leadsApi } from '@/api/leads';
import StatusBadge from '@/features/leads/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { LEAD_STATUS_OPTIONS } from '@/constants';
import { LeadStatus, createNoteSchema } from '@crm/shared';

type NoteFormData = z.infer<typeof createNoteSchema>;

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(createNoteSchema),
  });

  const { data: lead, isLoading, isError } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getById(id!),
    enabled: !!id,
  });

  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['notes', id],
    queryFn: () => leadsApi.getNotes(id!),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: LeadStatus) => leadsApi.updateStatus(id!, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Status updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const addNoteMutation = useMutation({
    mutationFn: (data: NoteFormData) => leadsApi.createNote(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', id] });
      reset();
      toast.success('Note added');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => leadsApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Lead deleted');
      navigate('/leads');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12 text-destructive/60" />
        <p className="text-sm">Lead not found or failed to load.</p>
        <Button variant="outline" asChild>
          <Link to="/leads">Back to Leads</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/leads">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{lead.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={lead.status} />
              <span className="text-xs text-muted-foreground">
                Added {formatDate(lead.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: lead info + notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Lead Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={Phone} label="Phone" value={lead.phone} />
                <InfoRow icon={Mail} label="Email" value={lead.email || '—'} />
                <InfoRow icon={MapPin} label="Location" value={lead.location} />
                <InfoRow
                  icon={Tag}
                  label="Budget"
                  value={formatCurrency(lead.budget)}
                  valueClass="text-emerald-600 font-semibold"
                />
                <InfoRow icon={Home} label="Property Type" value={lead.propertyType} />
                <InfoRow icon={Tag} label="Source" value={lead.source} />
                {lead.statusUpdatedAt && (
                  <InfoRow
                    icon={Clock}
                    label="Status Updated"
                    value={formatDateTime(lead.statusUpdatedAt)}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Notes
                {notes.length > 0 && (
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    ({notes.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add note form */}
              <form
                onSubmit={handleSubmit((data) => addNoteMutation.mutate(data))}
                className="space-y-2"
              >
                <Textarea
                  placeholder="Write a note..."
                  {...register('content')}
                  rows={3}
                />
                {errors.content && (
                  <p className="text-xs text-destructive">{errors.content.message}</p>
                )}
                <Button
                  type="submit"
                  size="sm"
                  disabled={addNoteMutation.isPending}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {addNoteMutation.isPending ? 'Adding...' : 'Add Note'}
                </Button>
              </form>

              <Separator />

              {notesLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No notes yet. Add one above.
                </p>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="rounded-lg bg-muted/50 border px-4 py-3 space-y-1"
                    >
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(note.createdAt)}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: status update */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Current: <StatusBadge status={lead.status} className="ml-1" />
              </div>
              <Select
                value={lead.status}
                onValueChange={(v) => updateStatusMutation.mutate(v as LeadStatus)}
                disabled={updateStatusMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {updateStatusMutation.isPending && (
                <p className="text-xs text-muted-foreground">Updating...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Created</span>
                <span className="font-medium text-foreground">{formatDate(lead.createdAt)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-muted-foreground">
                <span>Updated</span>
                <span className="font-medium text-foreground">{formatDate(lead.updatedAt)}</span>
              </div>
              {lead.statusUpdatedAt && (
                <>
                  <Separator />
                  <div className="flex justify-between text-muted-foreground">
                    <span>Status changed</span>
                    <span className="font-medium text-foreground">
                      {formatDate(lead.statusUpdatedAt)}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirm dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{lead.name}</strong>? This action cannot
              be undone and will remove all associated notes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium truncate ${valueClass ?? ''}`}>{value}</p>
      </div>
    </div>
  );
}
