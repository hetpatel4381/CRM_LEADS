import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Lead } from '../models/Lead.model';
import { Note } from '../models/Note.model';
import { LeadStatus, LeadSource, PropertyType } from '@crm/shared';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const leads = [
  {
    name: 'Arjun Mehta',
    phone: '9823456701',
    email: 'arjun.mehta@gmail.com',
    budget: 8500000,
    location: 'Baner, Pune',
    propertyType: PropertyType.TwoBHK,
    source: LeadSource.Facebook,
    status: LeadStatus.Closed,
  },
  {
    name: 'Priya Kapoor',
    phone: '9871234560',
    email: 'priya.k@outlook.com',
    budget: 15000000,
    location: 'Worli, Mumbai',
    propertyType: PropertyType.ThreeBHK,
    source: LeadSource.Referral,
    status: LeadStatus.SiteVisit,
  },
  {
    name: 'Rahul Desai',
    phone: '9765432180',
    email: 'rahul.desai@yahoo.com',
    budget: 4500000,
    location: 'Kothrud, Pune',
    propertyType: PropertyType.OneBHK,
    source: LeadSource.Website,
    status: LeadStatus.Contacted,
  },
  {
    name: 'Sneha Joshi',
    phone: '9654321079',
    budget: 25000000,
    location: 'Juhu, Mumbai',
    propertyType: PropertyType.Villa,
    source: LeadSource.Google,
    status: LeadStatus.Contacted,
  },
  {
    name: 'Vikram Nair',
    phone: '9543210968',
    email: 'vikram.nair@gmail.com',
    budget: 6000000,
    location: 'Hinjewadi, Pune',
    propertyType: PropertyType.TwoBHK,
    source: LeadSource.Facebook,
    status: LeadStatus.New,
  },
  {
    name: 'Kavita Sharma',
    phone: '9432109857',
    email: 'kavita.s@gmail.com',
    budget: 9000000,
    location: 'Andheri West, Mumbai',
    propertyType: PropertyType.TwoBHK,
    source: LeadSource.Referral,
    status: LeadStatus.New,
  },
  {
    name: 'Deepak Verma',
    phone: '9321098746',
    budget: 3500000,
    location: 'Wakad, Pune',
    propertyType: PropertyType.OneBHK,
    source: LeadSource.WalkIn,
    status: LeadStatus.Lost,
  },
  {
    name: 'Anita Pillai',
    phone: '9210987635',
    email: 'anita.pillai@gmail.com',
    budget: 18000000,
    location: 'Powai, Mumbai',
    propertyType: PropertyType.ThreeBHK,
    source: LeadSource.Google,
    status: LeadStatus.Closed,
  },
  {
    name: 'Rohan Gupta',
    phone: '9109876524',
    email: 'rohan.g@outlook.com',
    budget: 12000000,
    location: 'Viman Nagar, Pune',
    propertyType: PropertyType.ThreeBHK,
    source: LeadSource.Website,
    status: LeadStatus.SiteVisit,
  },
  {
    name: 'Meera Iyer',
    phone: '9098765413',
    budget: 7500000,
    location: 'Bandra East, Mumbai',
    propertyType: PropertyType.TwoBHK,
    source: LeadSource.Facebook,
    status: LeadStatus.New,
  },
  {
    name: 'Suresh Patil',
    phone: '8987654302',
    email: 'suresh.patil@gmail.com',
    budget: 50000000,
    location: 'Koregaon Park, Pune',
    propertyType: PropertyType.Commercial,
    source: LeadSource.Referral,
    status: LeadStatus.Contacted,
  },
  {
    name: 'Lakshmi Reddy',
    phone: '8876543291',
    email: 'lakshmi.r@gmail.com',
    budget: 11000000,
    location: 'Goregaon West, Mumbai',
    propertyType: PropertyType.TwoBHK,
    source: LeadSource.Other,
    status: LeadStatus.New,
  },
];

const noteContents: Record<string, string[]> = {
  'Arjun Mehta': [
    'Client signed agreement. Preferred 4th floor or above.',
    'Visited the Baner project. Very satisfied with amenities.',
    'Initial call — serious buyer, ready in 30 days.',
  ],
  'Priya Kapoor': [
    'Site visit scheduled for Saturday 10am.',
    'Interested in sea-view units only. Budget flexible up to 1.6Cr.',
    'Referred by Anita Pillai. High intent.',
  ],
  'Rohan Gupta': [
    'Visited 2 units. Shortlisted 3rd floor corner unit.',
    'Wants vastu-compliant layout. Follow up on east-facing availability.',
  ],
};

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lead-crm';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Lead.deleteMany({});
  await Note.deleteMany({});
  console.log('Cleared existing data');

  const createdLeads = await Lead.insertMany(
    leads.map((l, i) => ({
      ...l,
      email: l.email || undefined,
      createdAt: new Date(Date.now() - (leads.length - i) * 2 * 24 * 60 * 60 * 1000),
      statusUpdatedAt: [LeadStatus.Contacted, LeadStatus.SiteVisit, LeadStatus.Closed, LeadStatus.Lost].includes(l.status)
        ? new Date()
        : undefined,
    }))
  );
  console.log(`Inserted ${createdLeads.length} leads`);

  const noteEntries = [];
  for (const lead of createdLeads) {
    const contents = noteContents[lead.name];
    if (contents) {
      for (let i = 0; i < contents.length; i++) {
        noteEntries.push({
          leadId: lead._id,
          content: contents[i],
          createdAt: new Date(Date.now() - (contents.length - i) * 60 * 60 * 1000),
        });
      }
    }
  }
  if (noteEntries.length) {
    await Note.insertMany(noteEntries);
    console.log(`Inserted ${noteEntries.length} notes`);
  }

  console.log('\n✅ Seed complete. Summary:');
  const stats = await Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  stats.forEach((s) => console.log(`  ${s._id}: ${s.count}`));

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
