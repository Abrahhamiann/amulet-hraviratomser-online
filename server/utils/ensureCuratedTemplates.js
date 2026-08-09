import Template from '../models/Template.js';

const curatedTemplates = [
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

export const ensureCuratedTemplates = async () => {
  await Promise.all(curatedTemplates.map((template) => Template.updateOne(
    { slug: template.slug },
    { $setOnInsert: template },
    { upsert: true }
  )));
};

export default curatedTemplates;
