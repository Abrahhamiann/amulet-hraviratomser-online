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
  },
  {
    title: 'Աստվածային օրհնություն',
    slug: 'divine-blessing',
    category: 'baptism',
    editorType: 'baptism',
    price: 32000,
    description: 'Լուսավոր և հանդիսավոր մկրտության հրավիրատոմս՝ ծրագրով, պատկերասրահով, քարտեզով և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Օրվա ծրագիր', 'Պատկերասրահ', 'Քարտեզ', 'RSVP ձև'],
    designKey: 'divine-blessing',
    mainImage: 'asset:curated/divine/baby-1.jpg',
    gallery: ['asset:curated/divine/baby-1.jpg', 'asset:curated/divine/baby-2.jpg', 'asset:curated/divine/baby-3.jpg', 'asset:curated/divine/church.jpg'],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Elevate',
    slug: 'elevate-invite',
    category: 'corporate',
    editorType: 'corporate',
    price: 39000,
    description: 'Ժամանակակից կորպորատիվ միջոցառման հրավեր՝ օրակարգով, խոսնակներով, ցուցանիշներով, պատկերասրահով և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Միջոցառման օրակարգ', 'Խոսնակների բաժին', 'Պատկերասրահ', 'RSVP ձև'],
    designKey: 'elevate-invite',
    mainImage: 'asset:curated/elevate/hero-bg.jpg',
    gallery: ['asset:curated/elevate/hero-bg.jpg', 'asset:curated/elevate/gallery-1.jpg', 'asset:curated/elevate/gallery-2.jpg', 'asset:curated/elevate/gallery-3.jpg', 'asset:curated/elevate/gallery-4.jpg', 'asset:curated/elevate/gallery-5.jpg', 'asset:curated/elevate/gallery-6.jpg'],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Ever After',
    slug: 'ever-after',
    category: 'engagement',
    editorType: 'engagement',
    price: 35000,
    description: 'Նուրբ նշանադրության հրավիրատոմս՝ զույգի պատմությամբ, ծրագրով, վայրով, պատկերասրահով և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Զույգի պատմություն', 'Օրվա ծրագիր', 'Պատկերասրահ', 'RSVP ձև'],
    designKey: 'ever-after',
    mainImage: 'asset:curated/ever-after/hero-floral.jpg',
    gallery: ['asset:curated/ever-after/hero-floral.jpg', 'asset:curated/ever-after/bride.jpg', 'asset:curated/ever-after/groom.jpg', 'asset:curated/ever-after/map.jpg', 'asset:curated/ever-after/gallery-1.jpg', 'asset:curated/ever-after/gallery-2.jpg', 'asset:curated/ever-after/gallery-3.jpg', 'asset:curated/ever-after/gallery-4.jpg', 'asset:curated/ever-after/gallery-5.jpg', 'asset:curated/ever-after/gallery-6.jpg'],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Everlasting Vows',
    slug: 'everlasting-vows',
    category: 'wedding',
    editorType: 'wedding',
    price: 39000,
    description: 'Ռոմանտիկ հարսանեկան հրավիրատոմս՝ պատմությամբ, երկու վայրերով, ժամանակացույցով, պատկերասրահով և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Զույգի պատմություն', 'Երկու վայր', 'Պատկերասրահ', 'RSVP ձև'],
    designKey: 'everlasting-vows',
    mainImage: 'asset:curated/everlasting/hero.jpg',
    gallery: ['asset:curated/everlasting/hero.jpg', 'asset:curated/everlasting/bride.jpg', 'asset:curated/everlasting/groom.jpg', 'asset:curated/everlasting/gallery-1.jpg', 'asset:curated/everlasting/gallery-2.jpg', 'asset:curated/everlasting/gallery-3.jpg', 'asset:curated/everlasting/gallery-4.jpg', 'asset:curated/everlasting/gallery-5.jpg', 'asset:curated/everlasting/gallery-6.jpg'],
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
