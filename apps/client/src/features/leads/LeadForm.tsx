import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createLeadSchema, LeadSource, PropertyType, CreateLeadDto } from '@crm/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LEAD_SOURCE_OPTIONS, PROPERTY_TYPE_OPTIONS } from '@/constants';

type FormData = z.infer<typeof createLeadSchema>;

interface LeadFormProps {
  onSubmit: (data: CreateLeadDto) => void;
  isSubmitting: boolean;
}

export default function LeadForm({ onSubmit, isSubmitting }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      source: LeadSource.Other,
      propertyType: PropertyType.TwoBHK,
    },
  });

  const handleFormSubmit = (data: FormData) => {
    const dto: CreateLeadDto = {
      ...data,
      email: data.email || undefined,
    };
    onSubmit(dto);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input id="name" placeholder="e.g. Rahul Sharma" autoFocus {...register('name')} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input id="phone" placeholder="e.g. 9876543210" {...register('phone')} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="e.g. rahul@email.com" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">
            Budget (₹) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="budget"
            type="number"
            placeholder="e.g. 5000000"
            {...register('budget', { valueAsNumber: true })}
          />
          {errors.budget && <p className="text-xs text-destructive">{errors.budget.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input id="location" placeholder="e.g. Baner, Pune" {...register('location')} />
          {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyType">
            Property Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={watch('propertyType')}
            onValueChange={(v) => setValue('propertyType', v as PropertyType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPE_OPTIONS.map((pt) => (
                <SelectItem key={pt} value={pt}>{pt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.propertyType && (
            <p className="text-xs text-destructive">{errors.propertyType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">
            Lead Source <span className="text-destructive">*</span>
          </Label>
          <Select
            value={watch('source')}
            onValueChange={(v) => setValue('source', v as LeadSource)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {LEAD_SOURCE_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.source && <p className="text-xs text-destructive">{errors.source.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? 'Saving...' : 'Add Lead'}
        </Button>
      </div>
    </form>
  );
}
