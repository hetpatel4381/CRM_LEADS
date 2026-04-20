import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LEAD_SOURCE_OPTIONS, LEAD_STATUS_OPTIONS } from '@/constants';
import { LeadFilters as ILeadFilters } from '@crm/shared';

interface LeadFiltersProps {
  filters: ILeadFilters;
  onChange: (key: keyof ILeadFilters, value: string | undefined) => void;
  onReset: () => void;
}

export default function LeadFiltersBar({ filters, onChange, onReset }: LeadFiltersProps) {
  const hasActiveFilters = filters.search || filters.source || filters.status;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by name or phone..."
          value={filters.search || ''}
          onChange={(e) => onChange('search', e.target.value || undefined)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <Select
          value={filters.source || 'all'}
          onValueChange={(v) => onChange('source', v === 'all' ? undefined : v)}
        >
          <SelectTrigger className="w-36">
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {LEAD_SOURCE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status || 'all'}
          onValueChange={(v) => onChange('status', v === 'all' ? undefined : v)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {LEAD_STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={`${filters.sortBy || 'createdAt'}_${filters.sortOrder || 'desc'}`}
          onValueChange={(v) => {
            const [sortBy, sortOrder] = v.split('_');
            onChange('sortBy', sortBy);
            onChange('sortOrder', sortOrder);
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt_desc">Newest first</SelectItem>
            <SelectItem value="createdAt_asc">Oldest first</SelectItem>
            <SelectItem value="budget_desc">Budget: High–Low</SelectItem>
            <SelectItem value="budget_asc">Budget: Low–High</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={onReset} title="Clear filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
