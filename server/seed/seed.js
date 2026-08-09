import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import ContactMessage from '../models/ContactMessage.js';
import Invitation from '../models/Invitation.js';
import Order from '../models/Order.js';
import RSVP from '../models/RSVP.js';
import Template from '../models/Template.js';
import User from '../models/User.js';

dotenv.config();

const templates = [
  {
    title: 'Սուրբ սկիզբ',
    slug: 'sacred-beginnings',
    category: 'baptism',
    price: 29000,
    description: 'Լուսավոր և նրբաճաշակ մկրտության հրավեր՝ օրվա ծրագրով, լուսանկարներով, քարտեզով և մասնակցության հաստատմամբ։',
    features: ['Հայերեն responsive ձևավորում', 'Օրվա ծրագիր', 'Լուսանկարների պատկերասրահ', 'RSVP ձև', 'Քարտեզի հղումներ'],
    designKey: 'sacred-beginnings',
    mainImage: 'asset:curated/sacred/child-portrait.jpg',
    gallery: [
      'asset:curated/sacred/child-portrait.jpg',
      'asset:curated/sacred/gallery-1.jpg',
      'asset:curated/sacred/gallery-2.jpg',
      'asset:curated/sacred/gallery-3.jpg',
      'asset:curated/sacred/gallery-4.jpg',
      'asset:curated/sacred/gallery-5.jpg'
    ],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Փայլուն տարեդարձ',
    slug: 'birthday-sparkle',
    category: 'birth',
    price: 29000,
    description: 'Ջերմ ու տոնական ծննդյան հրավեր՝ փայլուն տեսքով, ծրագրով, նկարներով, հագուստի ոճով և RSVP բաժնով։',
    features: ['Հայերեն responsive ձևավորում', 'Տոնական ծրագիր', 'Պատկերասրահ', 'Հագուստի ոճ', 'RSVP ձև'],
    designKey: 'birthday-sparkle',
    mainImage: 'asset:curated/birthday/portrait.jpg',
    gallery: [
      'asset:curated/birthday/portrait.jpg',
      'asset:curated/birthday/venue.jpg',
      'asset:curated/birthday/gallery-1.jpg',
      'asset:curated/birthday/gallery-2.jpg',
      'asset:curated/birthday/gallery-3.jpg',
      'asset:curated/birthday/gallery-4.jpg',
      'asset:curated/birthday/gallery-5.jpg'
    ],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Փղոսկրե երդումներ',
    slug: 'ivory-vows',
    category: 'wedding',
    price: 35000,
    description: 'Նրբաճաշակ փղոսկրագույն հարսանեկան հրավեր՝ օրակարգով, վայրերով, պատկերասրահով, dress code-ով և RSVP բաժնով։',
    features: ['Հայերեն responsive ձևավորում', 'Հարսանյաց օրակարգ', 'Վայրերի քարտեր', 'Պատկերասրահ', 'RSVP ձև'],
    designKey: 'ivory-vows',
    mainImage: 'asset:curated/ivory/hero.jpg',
    gallery: [
      'asset:curated/ivory/hero.jpg',
      'asset:curated/ivory/church.jpg',
      'asset:curated/ivory/hall.jpg',
      'asset:curated/ivory/gallery-1.jpg',
      'asset:curated/ivory/gallery-2.jpg',
      'asset:curated/ivory/gallery-3.jpg',
      'asset:curated/ivory/gallery-4.jpg'
    ],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  }
];

const run = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Template.deleteMany(),
    Order.deleteMany(),
    Invitation.deleteMany(),
    RSVP.deleteMany(),
    ContactMessage.deleteMany()
  ]);
  await User.create({
    name: 'Admin',
    email: 'admin@einvite.local',
    password: 'Admin123!',
    role: 'super_admin',
    isEmailVerified: true
  });
  const createdTemplates = await Template.insertMany(templates);
  await Invitation.create({
    slug: 'sample-sacred-beginnings',
    templateId: createdTemplates[0]._id,
    eventType: 'wedding',
    names: 'Aram & Lilit',
    date: new Date('2026-09-14T18:00:00.000Z'),
    time: '18:00',
    location: 'Elegant Hall, Yerevan',
    mapLink: 'https://maps.google.com',
    message: 'Together with our families, we invite you to share a warm evening of love, music, and celebration.',
    gallery: createdTemplates[0].gallery,
    language: 'en',
    isPublished: true
  });
  console.log('Seed complete');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
