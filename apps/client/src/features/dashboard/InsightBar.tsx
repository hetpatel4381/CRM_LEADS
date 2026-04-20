import { TrendingUp, AlertCircle, Trophy, Flame } from 'lucide-react';
import { DashboardSummary, LeadStatus } from '@crm/shared';

interface InsightBarProps {
  data: DashboardSummary;
}

export default function InsightBar({ data }: InsightBarProps) {
  const insights: { icon: React.ElementType; text: string; color: string }[] = [];

  const topSource = [...data.bySource]
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)[0];

  if (topSource) {
    insights.push({
      icon: Flame,
      text: `${topSource.source} is your top lead source with ${topSource.count} lead${topSource.count !== 1 ? 's' : ''}`,
      color: 'text-orange-600',
    });
  }

  if (data.conversionRate > 0) {
    insights.push({
      icon: TrendingUp,
      text: `${data.conversionRate}% conversion rate — ${data.byStatus.find((s) => s.status === LeadStatus.Closed)?.count ?? 0} deal${(data.byStatus.find((s) => s.status === LeadStatus.Closed)?.count ?? 0) !== 1 ? 's' : ''} closed`,
      color: 'text-emerald-600',
    });
  } else if (data.totalLeads > 0) {
    insights.push({
      icon: AlertCircle,
      text: 'No closed deals yet — push active leads toward site visits',
      color: 'text-amber-600',
    });
  }

  const siteVisits = data.byStatus.find((s) => s.status === LeadStatus.SiteVisit)?.count ?? 0;
  if (siteVisits > 0) {
    insights.push({
      icon: Trophy,
      text: `${siteVisits} lead${siteVisits !== 1 ? 's' : ''} at site visit stage — strong pipeline`,
      color: 'text-violet-600',
    });
  }

  if (insights.length === 0) return null;

  const shown = insights.slice(0, 2);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {shown.map(({ icon: Icon, text, color }, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-lg border bg-card px-4 py-3 flex-1 text-sm"
        >
          <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} />
          <span className="text-muted-foreground">{text}</span>
        </div>
      ))}
    </div>
  );
}
