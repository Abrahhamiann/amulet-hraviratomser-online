import Template from '../models/Template.js';
import { hasTemplateDeletionMarker } from './templateDeletion.js';
import { templateCategoryForDesign } from './templateDesign.js';

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
    title: 'Տիեզերական տարեդարձ',
    slug: 'birthday-space',
    category: 'birth',
    editorType: 'birth',
    price: 29000,
    description: 'Ջրաներկ տիեզերական ոճով ծննդյան հրավիրատոմս՝ օրացույցով, վայրով, հետհաշվարկով, երաժշտությամբ և RSVP բաժնով։',
    features: ['Հայերեն responsive ձևավորում', 'Օրացույց և հետհաշվարկ', 'Քարտեզ', 'Երաժշտություն', 'RSVP ձև'],
    designKey: 'birthday-space',
    mainImage: 'asset:curated/birthday-space/final-reference.png',
    gallery: ['asset:curated/birthday-space/final-reference.png'],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Ջրաներկ տարեդարձ',
    slug: 'birthday-watercolor',
    category: 'birth',
    editorType: 'birth',
    price: 29000,
    description: 'Ջրաներկ ծաղկային ոճով ծննդյան հրավիրատոմս՝ օրացույցով, հետհաշվարկով, օրվա ծրագրով, երաժշտությամբ և RSVP բաժնով։',
    features: ['Հայերեն responsive ձևավորում', 'Օրացույց և հետհաշվարկ', 'Օրվա ծրագիր և քարտեզ', 'Երաժշտություն', 'RSVP ձև'],
    designKey: 'birthday-watercolor',
    mainImage: 'asset:curated/birthday-watercolor/background.png',
    gallery: [
      'asset:curated/birthday-watercolor/background.png',
      'asset:curated/birthday-watercolor/flowers.png'
    ],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Կարմիր տարեդարձ',
    slug: 'birthday-crimson',
    category: 'birth',
    editorType: 'birth',
    price: 29000,
    description: 'Կարմիր և վարդագույն ձեռագիր ոճով ծննդյան հրավիրատոմս՝ ամսաթվով, հետհաշվարկով, օրվա ծրագրով, dress code-ով, երաժշտությամբ և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Ամսաթիվ և հետհաշվարկ', 'Օրվա ծրագիր և քարտեզ', 'Dress code', 'Երաժշտություն', 'RSVP ձև'],
    designKey: 'birthday-crimson',
    mainImage: 'asset:curated/birthday-crimson/cocktails.png',
    gallery: [
      'asset:curated/birthday-crimson/cocktails.png',
      'asset:curated/birthday-crimson/cake.png',
      'asset:curated/birthday-crimson/dinner.png',
      'asset:curated/birthday-crimson/music.png',
      'asset:curated/birthday-crimson/martini.png'
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
  },
  {
    title: 'Forever Vows',
    slug: 'forever-vows',
    category: 'engagement',
    editorType: 'engagement',
    price: 39000,
    description: 'Նրբաճաշակ նշանադրության հրավեր՝ սիրո պատմությամբ, օրացույցով, ծրագրով, պատկերասրահով, դրես կոդով և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Նշանադրության ծրագիր', 'Պատկերասրահ', 'Դրես կոդ', 'Քարտեզ', 'RSVP ձև'],
    designKey: 'forever-vows',
    mainImage: 'asset:curated/forever-vows/engagement-smile.jpg',
    gallery: [
      'asset:curated/forever-vows/engagement-smile.jpg',
      'asset:curated/forever-vows/wedding-forest-optimized.jpg',
      'asset:curated/forever-vows/wedding-temple.jpg'
    ],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Մետաքսե երդումներ',
    slug: 'silk-vows',
    category: 'wedding',
    editorType: 'wedding',
    price: 39000,
    description: 'Նրբագեղ սև-սպիտակ հարսանեկան հրավեր՝ մետաքսե ոճով, հետհաշվարկով, երկու վայրով, քարտեզներով և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Հետհաշվարկ', 'Երկու և ավելի վայր', 'Քարտեզի հղումներ', 'Երաժշտություն', 'RSVP ձև'],
    designKey: 'silk-vows',
    mainImage: 'asset:curated/silk-vows/hero.jpg',
    gallery: [
      'asset:curated/silk-vows/hero.jpg',
      'asset:curated/silk-vows/church.jpg',
      'asset:curated/silk-vows/hall.jpg',
      'asset:curated/silk-vows/quote.jpg'
    ],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Գինեգույն ճանապարհ',
    slug: 'burgundy-roadmap',
    category: 'wedding',
    editorType: 'wedding',
    price: 39000,
    description: 'Գինեգույն հարսանեկան հրավեր՝ անիմացված օրվա ճանապարհով, օրացույցով, լուսանկարներով, հետհաշվարկով, երաժշտությամբ և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Անիմացված օրվա ճանապարհ', 'Հետհաշվարկ', 'Մինչև 4 վայր և քարտեզ', 'Պատկերասրահ', 'Երաժշտություն', 'RSVP ձև'],
    designKey: 'burgundy-roadmap',
    mainImage: 'asset:curated/burgundy-roadmap/hero.jpg',
    gallery: [
      'asset:curated/burgundy-roadmap/hero.jpg',
      'asset:curated/burgundy-roadmap/portrait.jpg',
      'asset:curated/burgundy-roadmap/rings.jpg'
    ],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Մոնոխրոմ հրավեր',
    slug: 'monochrome-envelope',
    category: 'wedding',
    editorType: 'wedding',
    price: 39000,
    description: 'Ժամանակակից մոնոխրոմ հարսանեկան հրավեր՝ բացվող ծրարով, տեսանյութով, հետհաշվարկով, չորս վայրով, լուսանկարներով, երաժշտությամբ, դրես կոդով և RSVP բաժնով։',
    features: ['Բացվող ծրար և տեսանյութ', 'Responsive ձևավորում', 'Հետհաշվարկ', 'Մինչև 4 վայր և քարտեզ', 'Պատկերասրահ', 'Երաժշտություն', 'Դրես կոդ', 'RSVP ձև'],
    designKey: 'monochrome-envelope',
    mainImage: 'asset:curated/monochrome-envelope/hero.jpg',
    gallery: [
      'asset:curated/monochrome-envelope/hero.jpg',
      'asset:curated/monochrome-envelope/rings.jpg',
      'asset:curated/monochrome-envelope/portrait.jpg'
    ],
    galleryConfigured: false,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Սիրո քարտեզ', slug: 'love-map-wedding', category: 'wedding', editorType: 'wedding', price: 39000,
    description: 'Ռոմանտիկ հարսանեկան հրավեր՝ սիրո ժապավենով, օրացույցով, հետհաշվարկով, օրվա ճանապարհով, երաժշտությամբ և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Օրացույց և հետհաշվարկ', 'Մինչև 3 վայր և քարտեզ', 'Պատկերասրահ', 'Երաժշտություն', 'Դրես կոդ', 'RSVP ձև'],
    designKey: 'love-map-wedding', mainImage: 'asset:curated/love-map-wedding/couple-one.jpg',
    gallery: ['asset:curated/love-map-wedding/couple-one.jpg', 'asset:curated/love-map-wedding/couple-two.jpg'],
    galleryConfigured: false, isFeatured: true, isActive: true
  },
  {
    title: 'Հրեշտակային մկրտություն', slug: 'angelic-baptism', category: 'baptism', editorType: 'baptism', price: 39000,
    description: 'Նուրբ մկրտության հրավեր՝ օրացույցով, երկու վայրով, հետհաշվարկով, երաժշտությամբ, գունապնակով և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Օրացույց և հետհաշվարկ', 'Մինչև 2 վայր և քարտեզ', 'Երաժշտություն', 'Դրես կոդ', 'RSVP ձև'],
    designKey: 'angelic-baptism', mainImage: 'asset:curated/angelic-baptism/baby.jpg',
    gallery: ['asset:curated/angelic-baptism/baby.jpg'], galleryConfigured: false, isFeatured: true, isActive: true
  },
  {
    title: 'Պոլարոիդ նշանադրություն', slug: 'polaroid-engagement', category: 'engagement', editorType: 'engagement', price: 39000,
    description: 'Պոլարոիդ լուսանկարներով նշանադրության հրավեր՝ օրացույցով, վայրով, հետհաշվարկով, երաժշտությամբ և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Օրացույց և հետհաշվարկ', 'Վայր և քարտեզ', 'Պատկերասրահ', 'Երաժշտություն', 'RSVP ձև'],
    designKey: 'polaroid-engagement', mainImage: 'asset:curated/polaroid-engagement/couple-1.jpg',
    gallery: ['asset:curated/polaroid-engagement/couple-1.jpg', 'asset:curated/polaroid-engagement/couple-2.jpg', 'asset:curated/polaroid-engagement/restaurant.png'],
    galleryConfigured: false, isFeatured: true, isActive: true
  },
  {
    title: 'Ոսկե սիրտ', slug: 'golden-heart-engagement', category: 'engagement', editorType: 'engagement', price: 39000,
    description: 'Ոսկեգույն սրտով նշանադրության հրավեր՝ բացվող շերտով, օրացույցով, հետհաշվարկով, երաժշտությամբ, դրես կոդով և RSVP բաժնով։',
    features: ['Բացվող ինտերակտիվ շերտ', 'Responsive ձևավորում', 'Օրացույց և հետհաշվարկ', 'Վայր և քարտեզ', 'Երաժշտություն', 'Դրես կոդ', 'RSVP ձև'],
    designKey: 'golden-heart-engagement', mainImage: 'asset:curated/golden-heart-engagement/couple-mountain.jpg',
    gallery: ['asset:curated/golden-heart-engagement/couple-mountain.jpg', 'asset:curated/golden-heart-engagement/couple-flowers.jpg'],
    galleryConfigured: false, isFeatured: true, isActive: true
  },
  {
    title: 'Կինոժապավեն', slug: 'cinematic-engagement', category: 'engagement', editorType: 'engagement', price: 39000,
    description: 'Կինոժապավենի ոճով նշանադրության հրավեր՝ օրացույցով, ծրագրով, լուսանկարներով, հետհաշվարկով, երաժշտությամբ և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Օրացույց և հետհաշվարկ', 'Մինչև 4 ծրագրային կետ', 'Պատկերասրահ', 'Երաժշտություն', 'Դրես կոդ', 'RSVP ձև'],
    designKey: 'cinematic-engagement', mainImage: 'asset:curated/cinematic-engagement/couple-1.jpg',
    gallery: ['asset:curated/cinematic-engagement/couple-1.jpg', 'asset:curated/cinematic-engagement/couple-2.jpg', 'asset:curated/cinematic-engagement/couple-3.jpg', 'asset:curated/cinematic-engagement/couple-4.jpg', 'asset:curated/cinematic-engagement/couple-5.jpg', 'asset:curated/cinematic-engagement/restaurant.png'],
    galleryConfigured: false, isFeatured: true, isActive: true
  },
  {
    title: 'Վերջին զանգ', slug: 'last-bell', category: 'corporate', editorType: 'corporate', price: 39000,
    description: 'Դպրոցական վերջին զանգի հրավեր՝ օրացույցով, երկու միջոցառմամբ, հետհաշվարկով, երաժշտությամբ և RSVP բաժնով։',
    features: ['Responsive ձևավորում', 'Օրացույց և հետհաշվարկ', 'Մինչև 2 վայր և քարտեզ', 'Պատկերասրահ', 'Երաժշտություն', 'RSVP ձև'],
    designKey: 'last-bell', mainImage: 'asset:curated/last-bell/bell-photo.jpg',
    gallery: ['asset:curated/last-bell/bell-photo.jpg', 'asset:curated/last-bell/school.jpg', 'asset:curated/last-bell/venue.jpg'],
    galleryConfigured: false, isFeatured: true, isActive: true
  }
];

export const ensureCuratedTemplates = async () => {
  await Promise.all(curatedTemplates.map(async (template) => {
    // An administrator's deletion is permanent across process restarts. The
    // separate marker also prevents an accidental hard delete from allowing
    // startup provisioning to recreate the curated template.
    if (await hasTemplateDeletionMarker(template.slug)) return;

    const category = templateCategoryForDesign(template.designKey) || template.category;
    const { category: _category, editorType: _editorType, designKey, ...insertDefaults } = template;
    await Template.updateOne(
      { slug: template.slug },
      {
        $set: { category, editorType: category, designKey },
        $setOnInsert: insertDefaults
      },
      { upsert: true }
    );
    if (['forever-vows', 'silk-vows', 'burgundy-roadmap', 'monochrome-envelope', 'love-map-wedding', 'angelic-baptism', 'polaroid-engagement', 'golden-heart-engagement', 'cinematic-engagement', 'last-bell'].includes(template.designKey)) {
      await Template.updateOne(
        { slug: template.slug, galleryConfigured: { $ne: true } },
        { $set: { mainImage: template.mainImage, gallery: template.gallery } }
      );
    }
    if (['burgundy-roadmap', 'monochrome-envelope', 'love-map-wedding', 'angelic-baptism', 'polaroid-engagement', 'golden-heart-engagement', 'cinematic-engagement', 'last-bell'].includes(template.designKey)) {
      await Template.updateOne(
        { slug: template.slug },
        { $set: { description: template.description, features: template.features } }
      );
    }
  }));
};

export default curatedTemplates;
