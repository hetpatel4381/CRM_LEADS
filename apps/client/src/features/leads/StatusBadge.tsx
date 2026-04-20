import { LeadStatus } from '@crm/shared';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<LeadStatus, { dot: string; badge: string }> = {
  [LeadStatus.New]:       { dot: 'bg-blue-500',   badge: 'bg-blue-50   text-blue-700   border-blue-200'   },
  [LeadStatus.Contacted]: { dot: 'bg-amber-500',  badge: 'bg-amber-50  text-amber-700  border-amber-200'  },
  [LeadStatus.SiteVisit]: { dot: 'bg-violet-500', badge: 'bg-violet-50 text-violet-700 border-violet-200' },
  [LeadStatus.Closed]:    { dot: 'bg-emerald-500',badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  [LeadStatus.Lost]:      { dot: 'bg-red-400',    badge: 'bg-red-50    text-red-600    border-red-200'    },
};

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const { dot, badge } = STATUS_CONFIG[status] ?? STATUS_CONFIG[LeadStatus.New];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        badge,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', dot)} />
      {status}
    </span>
  );
}
