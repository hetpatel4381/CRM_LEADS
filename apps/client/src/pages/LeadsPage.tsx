import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, AlertCircle } from 'lucide-react';
import { leadsApi } from '@/api/leads';
import LeadTable from '@/features/leads/LeadTable';
import LeadFiltersBar from '@/features/leads/LeadFilters';
import { Button } from '@/components/ui/button';
import { LeadFilters } from '@crm/shared';

const DEFAULT_FILTERS: LeadFilters = {
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

export default function LeadsPage() {
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadsApi.getAll(filters),
    placeholderData: (prev) => prev,
  });

  const handleFilterChange = (key: keyof LeadFilters, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' ? { page: 1 } : {}),
    }));
  };

  const handleReset = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {data ? `${data.total} lead${data.total !== 1 ? 's' : ''} total` : 'Manage your leads'}
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/leads/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Link>
        </Button>
      </div>

      <LeadFiltersBar filters={filters} onChange={handleFilterChange} onReset={handleReset} />

      {isError ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground rounded-lg border">
          <AlertCircle className="h-10 w-10 text-destructive/60" />
          <p className="text-sm">Failed to load leads.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <LeadTable
          leads={data?.leads ?? []}
          total={data?.total ?? 0}
          page={filters.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          isLoading={isLoading}
          onPageChange={(page) => handleFilterChange('page', String(page))}
        />
      )}
    </div>
  );
}
