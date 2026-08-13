export const languages = [
  { code: 'hy', label: 'Հայերեն' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' }
];

const common = {
  brand: 'Amulet',
  contactPhoneValue: '041 401415',
  contactEmailValue: 'amulet.invitation@gmail.com',
  contactAddressValue: 'Yerevan, Armenia',
  contactInstagramValue: '@amulet_invite',
  phoneWeddingDate: '26.08.26',
  phoneCorporate: 'AMULET'
};

const en = {
  ...common,
  home: 'Home',
  templates: 'Invitations',
  about: 'About',
  contact: 'Contact',
  orderNow: 'Buy',
  viewTemplates: 'View invitations',
  orderCustom: 'Buy a custom invitation',
  heroTitle: '1 invitation instead of 1000 calls',
  heroDevice: 'Wedding invitation',
  heroRsvp: 'RSVP',
  hashtags: ['# Web invitations', '# Wedding', '# Baptism', '# Birthday'],
  storiesKicker: 'Welcome to Amulet',
  storiesTitle: 'Every celebration begins with a beautiful invitation',

  viewAllStories: 'View all stories',
  invitationGallery: 'Invitation gallery',
  morphTitle: 'Your story begins with the right invitation',
  eventsKicker: 'Events',
  eventsTitle: 'Choose the invitation for your event',
  featured: 'Featured invitations',
  faq: 'FAQ',
  faqTitle: 'Frequently Asked Questions',
  faqSubtitle: 'Everything you need to know about creating, personalizing, and sharing your invitation.',
  templateCodeLabel: 'Code',
  eventTestimonials: [
    { name: 'Wedding and engagement', designation: 'Wedding / Engagement', quote: 'Wedding, engagement, and love stories begin with a carefully chosen invitation.', image: 'wedding' },
    { name: 'Baptism', designation: 'Baptism', quote: 'A warm digital invitation for a sacred day that family and guests will remember.', image: 'baptism' },
    { name: 'Birthday', designation: 'Birthday', quote: 'Bright, personal invitations for birthdays that feel festive before the party starts.', image: 'birth' },
    { name: 'Corporate', designation: 'Corporate event', quote: 'Send a polished invitation, save time, and keep every guest detail in one flow.', image: 'corporate' },
    { name: 'Partners', designation: 'Event partners', quote: 'A refined presentation for partners, venues, decorators, and event teams.', image: 'partners' }
  ],
  chooseInvitation: 'Choose invitation',
  menuPartners: 'For partners',
  menuPrivacy: 'Privacy policy',
  menuLogin: 'Login',
  partnerTitle: 'For partners',
  partnerSubtitle: 'How to become a partner',
  partnerLogin: 'Enter',
  wedding: 'Wedding',
  baptism: 'Baptism',
  birth: 'Birthday',
  corporate: 'Corporate',
  engagement: 'Engagement',
  weddingTitle: 'Wedding and engagement',
  weddingSubtitle: 'The most precious moments begin with an invitation',
  baptismTitle: 'Baptism',
  baptismSubtitle: 'Send an invitation that will be remembered',
  birthTitle: 'Birthday',
  birthSubtitle: 'Stand out from everyone',
  corporateTitle: 'Corporate',
  corporateSubtitle: 'Save your time',
  phoneWeddingNames: 'Aram & Lilit',
  phoneBaptismName: 'Narek',
  phoneBlessedDay: 'Blessed day',
  phoneBirthday: 'Happy Birthday',
  search: 'Search',
  sort: 'Sort',
  newest: 'Newest',
  priceAsc: 'Price low to high',
  priceDesc: 'Price high to low',
  all: 'All',
  preview: 'Preview',
  order: 'Buy',
  livePreview: 'Live preview',
  orderThis: 'Buy this invitation',
  features: 'Features',
  gallery: 'Gallery',
  fullName: 'Full name',
  phone: 'Phone number',
  email: 'Email',
  eventType: 'Event type',
  selectedTemplate: 'Selected invitation',
  eventDate: 'Event date',
  eventTime: 'Event time',
  eventLocation: 'Event location',
  mapLink: 'Google Maps link',
  mainNames: 'Main names',
  eventMessage: 'Invitation text',
  preferredLanguage: 'Preferred language',
  notes: 'Additional notes',
  submit: 'Submit',
  successOrder: 'Your order was sent successfully.',
  orderErrorDetails: 'Please check the required fields and try again.',
  orderConnectionError: 'Could not connect to the server. Please restart the server and try again.',
  checkoutError: 'Could not open payment. Please try again.',
  invitationPrice: 'Invitation price',
  paymentSuccessTitle: 'Payment completed',
  paymentSuccessText: 'Your online invitation is ready and saved in your profile.',
  paymentSuccessErrorTitle: 'Payment confirmation failed',
  paymentSuccessErrorText: 'We could not confirm this payment. Please open your profile or try again.',
  paymentInvitationLink: 'Your invitation link',
  copyInvitationLink: 'Copy invitation link',
  invitationQrCode: 'Invitation QR code',
  successContact: 'Your message was sent successfully.',
  successContactDetails: 'Thank you for reaching out. We will review your request and reply to your email soon.',
  rsvp: 'RSVP',
  guestName: 'Guest name',
  attendance: 'Attendance',
  attending: 'I will attend',
  declined: 'I cannot attend',
  unsure: 'I am not sure',
  guestCount: 'Number of guests',
  message: 'Message',
  openMap: 'Open map',
  share: 'Share invitation',
  addCalendar: 'Add to calendar',
  login: 'Login',
  password: 'Password',
  dashboard: 'Dashboard',
  logout: 'Logout',
  loading: 'Loading...',
  error: 'Something went wrong',
  required: 'Please fill required fields',
  customDesign: 'Custom design',
  catalogIntro: 'Browse original designs and choose a starting point for your event.',
  orderIntro: 'Send the event details and our team will prepare a personalized online invitation.',
  contactIntro: 'Tell us what you are planning and we will help shape the invitation.',
  aboutTitle: 'About Amulet',
  aboutIntro: 'A modern platform for online invitations.',
  aboutP1: 'Amulet is a modern online invitation platform created to make the important and memorable days of your life more beautiful and unique.',
  aboutP2: 'Through our platform, you can choose a ready-made design, personalize the invitation, add all event information, and easily send it to your guests. Amulet is designed for weddings, engagements, baptisms, birthdays, corporate events, and other important occasions.',
  aboutP3: 'We combine refined design, modern technology, and ease of use to create invitations that not only inform guests about the event, but also convey its mood and story.',
  aboutParagraphs: [
    'Amulet is a modern online invitation platform created to make the important and memorable days of your life more beautiful and unique.',
    'Through our platform, you can choose a ready-made design, personalize the invitation, add all event information, and easily send it to your guests. Amulet is designed for weddings, engagements, baptisms, birthdays, corporate events, and other important occasions.',
    'We combine refined design, modern technology, and ease of use to create invitations that not only inform guests about the event, but also convey its mood and story.',
    'Our goal is to help you save time, reduce printing costs, and create an invitation that will remain in your and your guests’ memory for a long time.'
  ],
  aboutSignature: 'Amulet — the first beautiful step of your memorable day.',
  aboutBenefitsTitle: 'Why choose Amulet',
  aboutBenefits: [
    'Modern and refined designs',
    'Wide personalization options',
    'Comfortable viewing on all devices',
    'Online RSVP confirmation from guests',
    'Fast and simple sharing through a link',
    'Multilingual invitation options',
    'Personal approach and technical support'
  ],
  aboutCompanyCredit: 'Amulet was created by R’SOFT Development Company with love, attention to detail, and the desire to make every event unique.',
  contactName: 'Name',
  footerText: 'Digital invitations with RSVP, maps, galleries, and personal details.',
  daysToGo: 'days to go',
  rsvpSaved: 'Thank you. Your RSVP was saved.',
  faqItems: [
    ['What is included in the price?', 'Photos, event schedule, addresses, map, RSVP form, countdown, and all required texts.'],
    ['How long does preparation take?', 'Usually 3-4 days. A custom design may take longer depending on its complexity.'],
    ['How can I send the web invitation?', 'You can share it via WhatsApp, Instagram, Viber, Telegram, Email, SMS, or any other platform.'],
    ['What languages are available?', 'Invitations can be prepared in Armenian, English, Russian, Spanish, French, German, Italian, and other languages.'],
    ['Can I edit the invitation after purchase?', 'Yes. From your account, you can update the texts, photos, date, time, location, and other editable details.'],
    ['Does the invitation work on every device?', 'Yes. Every invitation is responsive and adapts to phones, tablets, laptops, and desktop screens.'],
    ['How does RSVP confirmation work?', 'Guests submit the RSVP form in the invitation, and you can view their responses and guest counts in your account.'],
    ['Can I add a location and map?', 'Yes. You can add one or more event addresses and Google Maps links so guests can easily find each venue.'],
    ['Can I replace the photos?', 'Yes. You can upload your own cover and gallery photos, replace them, or remove them whenever the template allows.'],
    ['How long will my invitation link remain active?', 'The link remains active for the period included in your selected service or package.'],
    ['Who can view my invitation?', 'Anyone who has the private link can open it, so share the link only with the guests you intend to invite.'],
    ['Can I order a fully custom design?', 'Yes. Contact our team and we will create a personalized invitation based on your event and preferences.']
  ]
};

const hy = {
  ...en,
  home: 'Գլխավոր',
  templates: 'Հրավերներ',
  about: 'Մեր մասին',
  contact: 'Կապ',
  orderNow: 'Գնել',
  viewTemplates: 'Դիտել հրավերները',
  orderCustom: 'Գնել անհատական հրավեր',
  heroTitle: '1 հրավեր՝ 1000 զանգի փոխարեն',
  heroDevice: 'Հարսանեկան հրավեր',
  hashtags: ['# Վեբ հրավիրատոմսեր', '# Հարսանիք', '# Մկրտություն', '# Ծնունդ'],
  storiesKicker: 'Բարի գալուստ Ամուլետ',
  storiesTitle: 'Յուրաքանչյուր տոն սկսվում է գեղեցիկ հրավերից',
  viewAllStories: 'Դիտել բոլոր պատմությունները',
  invitationGallery: 'Հրավերների պատկերասրահ',
  morphTitle: 'Քո պատմությունը սկսվում է ճիշտ հրավերից',
  eventsKicker: 'Միջոցառումներ',
  eventsTitle: 'Ընտրիր քո միջոցառման հրավերը',
  featured: 'Ընտրված հրավերներ',
  faq: 'Հարցեր',
  faqTitle: 'Հաճախ տրվող հարցեր',
  faqSubtitle: 'Այստեղ կգտնեք հրավերի ստեղծման, անհատականացման և տարածման ամենակարևոր պատասխանները։',
  templateCodeLabel: 'Կոդ',
  eventTestimonials: [
    { name: 'Հարսանեկան եւ նշանադրության', designation: 'Հարսանիք / Նշանադրություն', quote: 'Հարսանիք, նշանադրություն եւ սիրո պատմություն՝ ամենաթանկ ակնթարթները սկսվում են հրավերից։', image: 'wedding' },
    { name: 'Մկրտության', designation: 'Մկրտություն', quote: 'Սուրբ օրվա համար ջերմ թվային հրավեր, որը կմնա ընտանիքի եւ հյուրերի հիշողության մեջ։', image: 'baptism' },
    { name: 'Ծննդյան', designation: 'Ծնունդ', quote: 'Պայծառ եւ անհատական հրավերներ, որոնք տոնական տրամադրությունը սկսում են դեռ մինչեւ օրը։', image: 'birth' },
    { name: 'Կորպորատիվ', designation: 'Կորպորատիվ միջոցառում', quote: 'Ուղարկիր հստակ ու գեղեցիկ հրավեր, խնայիր ժամանակ եւ պահիր հյուրերի տվյալները մեկ հոսքում։', image: 'corporate' },
    { name: 'Գործընկերների համար', designation: 'Միջոցառման գործընկերներ', quote: 'Նրբաճաշակ ներկայացում սրահների, դեկորատորների, կազմակերպիչների եւ գործընկերների համար։', image: 'partners' }
  ],
  chooseInvitation: 'Ընտրել հրավեր',
  menuPartners: 'Գործընկերների համար',
  menuPrivacy: 'Գաղտնիության քաղաքականություն',
  menuLogin: 'Մուտք',
  partnerTitle: 'Գործընկերների համար',
  partnerSubtitle: 'Ինչպես դառնալ գործընկեր',
  partnerLogin: 'Մուտք',
  wedding: 'Հարսանիք',
  baptism: 'Մկրտություն',
  birth: 'Ծնունդ',
  corporate: 'Կորպորատիվ',
  engagement: 'Նշանադրություն',
  weddingTitle: 'Հարսանեկան եւ նշանադրության',
  weddingSubtitle: 'Ամենաթանկ ակնթարթները սկսվում են հրավերից',
  baptismTitle: 'Մկրտության',
  baptismSubtitle: 'Ուղարկիր հրավեր, որը չի մոռացվի',
  birthTitle: 'Ծննդյան',
  birthSubtitle: 'Տարբերվիր բոլորից',
  corporateTitle: 'Կորպորատիվ',
  corporateSubtitle: 'Խնայիր ժամանակդ',
  phoneWeddingNames: 'Արամ & Լիլիթ',
  phoneBaptismName: 'Նարեկ',
  phoneBlessedDay: 'Սուրբ օր',
  phoneBirthday: 'Ծնունդ',
  search: 'Փնտրել',
  sort: 'Դասավորել',
  newest: 'Նորերը',
  priceAsc: 'Գին՝ ցածրից բարձր',
  priceDesc: 'Գին՝ բարձրից ցածր',
  all: 'Բոլորը',
  preview: 'Դիտել',
  order: 'Գնել',
  livePreview: 'Կենդանի դիտում',
  orderThis: 'Գնել այս հրավերը',
  features: 'Հնարավորություններ',
  gallery: 'Պատկերասրահ',
  fullName: 'Անուն ազգանուն',
  phone: 'Հեռախոսահամար',
  email: 'Էլ. հասցե',
  eventType: 'Միջոցառման տեսակ',
  selectedTemplate: 'Ընտրված հրավեր',
  eventDate: 'Միջոցառման օր',
  eventTime: 'Ժամ',
  eventLocation: 'Վայր',
  mapLink: 'Google Maps հղում',
  mainNames: 'Գլխավոր անուններ',
  eventMessage: 'Հրավերի տեքստ',
  preferredLanguage: 'Նախընտրելի լեզու',
  notes: 'Լրացուցիչ նշումներ',
  submit: 'Ուղարկել',
  successOrder: 'Ձեր պատվերը հաջողությամբ ուղարկվեց։',
  orderErrorDetails: 'Խնդրում ենք ստուգել պարտադիր դաշտերը և կրկին փորձել։',
  orderConnectionError: 'Չհաջողվեց միանալ սերվերին։ Խնդրում ենք restart անել server-ը և կրկին փորձել։',
  checkoutError: 'Չհաջողվեց բացել վճարման էջը։ Խնդրում ենք կրկին փորձել։',
  invitationPrice: 'Հրավերի արժեքը',
  paymentSuccessTitle: 'Վճարումը հաջողվեց',
  paymentSuccessText: 'Ձեր օնլայն հրավերը պատրաստ է և պահպանվել է ձեր profile-ում։',
  paymentSuccessErrorTitle: 'Չհաջողվեց հաստատել վճարումը',
  paymentSuccessErrorText: 'Չկարողացանք հաստատել այս վճարումը։ Խնդրում ենք բացել profile-ը կամ կրկին փորձել։',
  paymentInvitationLink: 'Ձեր հրավերի հղումը',
  copyInvitationLink: 'Պատճենել հրավերի հղումը',
  invitationQrCode: 'Հրավերի QR կոդ',
  successContact: 'Ձեր նամակը հաջողությամբ ուղարկվեց։',
  successContactDetails: 'Շնորհակալություն կապ հաստատելու համար։ Մենք կկարդանք ձեր նամակը և շուտով կպատասխանենք ձեր email-ին։',
  guestName: 'Հյուրի անունը',
  attendance: 'Մասնակցություն',
  attending: 'Կմասնակցեմ',
  declined: 'Չեմ կարող մասնակցել',
  unsure: 'Դեռ վստահ չեմ',
  guestCount: 'Հյուրերի քանակ',
  message: 'Հաղորդագրություն',
  openMap: 'Բացել քարտեզը',
  share: 'Կիսվել հրավերով',
  addCalendar: 'Ավելացնել օրացույցում',
  login: 'Մուտք',
  password: 'Գաղտնաբառ',
  dashboard: 'Վահանակ',
  logout: 'Ելք',
  loading: 'Բեռնվում է...',
  error: 'Ինչ-որ բան սխալ է',
  required: 'Խնդրում ենք լրացնել պարտադիր դաշտերը',
  customDesign: 'Անհատական դիզայն',
  catalogIntro: 'Դիտիր օրիգինալ դիզայնները եւ ընտրիր քո միջոցառման մեկնարկային տարբերակը։',
  orderIntro: 'Ուղարկիր միջոցառման տվյալները, եւ մեր թիմը կպատրաստի անհատական առցանց հրավեր։',
  contactIntro: 'Պատմիր, թե ինչ ես պլանավորում, եւ մենք կօգնենք ձեւավորել հրավերը։',
  aboutTitle: 'Amulet-ի մասին',
  aboutIntro: 'Օնլայն հրավիրատոմսերի ժամանակակից հարթակ։',
  aboutP1: 'Amulet-ը օնլայն հրավիրատոմսերի ժամանակակից հարթակ է, որը ստեղծվել է ձեր կյանքի կարևոր և հիշարժան օրերը ավելի գեղեցիկ ու յուրահատուկ դարձնելու համար։',
  aboutP2: 'Մեր հարթակի միջոցով կարող եք ընտրել պատրաստի դիզայն, անհատականացնել հրավիրատոմսը, ավելացնել միջոցառման ամբողջ տեղեկատվությունը և հեշտությամբ ուղարկել այն ձեր հյուրերին։ Amulet-ը նախատեսված է հարսանիքների, նշանադրությունների, մկրտությունների, ծննդյան տոների, կորպորատիվ միջոցառումների և այլ կարևոր առիթների համար։',
  aboutP3: 'Մենք համադրում ենք նրբաճաշակ դիզայնը, ժամանակակից տեխնոլոգիաներն ու օգտագործման պարզությունը՝ ստեղծելով հրավիրատոմսեր, որոնք ոչ միայն տեղեկացնում են միջոցառման մասին, այլև փոխանցում են դրա տրամադրությունն ու պատմությունը։',
  aboutParagraphs: [
    'Amulet-ը օնլայն հրավիրատոմսերի ժամանակակից հարթակ է, որը ստեղծվել է ձեր կյանքի կարևոր և հիշարժան օրերը ավելի գեղեցիկ ու յուրահատուկ դարձնելու համար։',
    'Մեր հարթակի միջոցով կարող եք ընտրել պատրաստի դիզայն, անհատականացնել հրավիրատոմսը, ավելացնել միջոցառման ամբողջ տեղեկատվությունը և հեշտությամբ ուղարկել այն ձեր հյուրերին։ Amulet-ը նախատեսված է հարսանիքների, նշանադրությունների, մկրտությունների, ծննդյան տոների, կորպորատիվ միջոցառումների և այլ կարևոր առիթների համար։',
    'Մենք համադրում ենք նրբաճաշակ դիզայնը, ժամանակակից տեխնոլոգիաներն ու օգտագործման պարզությունը՝ ստեղծելով հրավիրատոմսեր, որոնք ոչ միայն տեղեկացնում են միջոցառման մասին, այլև փոխանցում են դրա տրամադրությունն ու պատմությունը։',
    'Մեր նպատակն է օգնել ձեզ խնայել ժամանակը, նվազեցնել տպագրական ծախսերը և ստեղծել հրավիրատոմս, որը երկար կմնա ձեր և ձեր հյուրերի հիշողության մեջ։'
  ],
  aboutSignature: 'Amulet — ձեր հիշարժան օրվա առաջին գեղեցիկ քայլը։',
  aboutBenefitsTitle: 'Ինչո՞ւ ընտրել Amulet-ը',
  aboutBenefits: [
    'Ժամանակակից և նրբաճաշակ դիզայններ',
    'Անհատականացման լայն հնարավորություններ',
    'Հարմարավետ դիտում բոլոր սարքերից',
    'Հյուրերի մասնակցության առցանց հաստատում',
    'Արագ և պարզ տարածում հղման միջոցով',
    'Բազմալեզու հրավիրատոմսերի հնարավորություն',
    'Անհատական մոտեցում և տեխնիկական աջակցություն'
  ],
  aboutCompanyCredit: 'Amulet-ը ստեղծվել է R’SOFT Development Company-ի կողմից՝ սիրով, մանրուքների նկատմամբ ուշադրությամբ և յուրաքանչյուր միջոցառումը յուրահատուկ դարձնելու ցանկությամբ։',
  contactName: 'Անուն',
  footerText: 'Թվային հրավերներ՝ RSVP-ով, քարտեզներով, պատկերասրահով եւ անձնական մանրամասներով։',
  daysToGo: 'օր մնաց',
  rsvpSaved: 'Շնորհակալություն։ Ձեր RSVP-ն պահպանվեց։',
  faqItems: [
    ['Ի՞նչ է ներառված արժեքի մեջ', 'Լուսանկարներ, միջոցառման ծրագիր, հասցեներ, քարտեզ, RSVP ձև, հետհաշվարկ և բոլոր անհրաժեշտ տեքստերը։'],
    ['Որքա՞ն է տևում հրավերի պատրաստումը', 'Սովորաբար 3-4 օր։ Անհատական դիզայնը կարող է ավելի երկար տևել՝ կախված բարդությունից։'],
    ['Ինչպե՞ս կարող եմ ուղարկել վեբ հրավերը', 'Կարող եք այն տարածել WhatsApp-ով, Instagram-ով, Viber-ով, Telegram-ով, էլ․ փոստով, SMS-ով կամ ցանկացած այլ հարթակով։'],
    ['Ի՞նչ լեզուներ են հասանելի', 'Հրավերները կարող են պատրաստվել հայերեն, անգլերեն, ռուսերեն, իսպաներեն, ֆրանսերեն, գերմաներեն, իտալերեն և այլ լեզուներով։'],
    ['Կարո՞ղ եմ գնելուց հետո խմբագրել հրավերը', 'Այո։ Ձեր անձնական էջից կարող եք փոխել տեքստերը, լուսանկարները, ամսաթիվը, ժամը, վայրը և մյուս խմբագրվող տվյալները։'],
    ['Հրավերն աշխատո՞ւմ է բոլոր սարքերում', 'Այո։ Յուրաքանչյուր հրավեր responsive է և հարմարեցվում է հեռախոսներին, պլանշետներին, նոթբուքերին ու մեծ էկրաններին։'],
    ['Ինչպե՞ս է աշխատում RSVP հաստատումը', 'Հյուրերը լրացնում են հրավերի RSVP ձևը, իսկ դուք անձնական էջում տեսնում եք պատասխաններն ու հյուրերի քանակը։'],
    ['Կարո՞ղ եմ ավելացնել վայր և քարտեզ', 'Այո։ Կարող եք ավելացնել մեկ կամ մի քանի հասցե և Google Maps-ի հղումներ, որպեսզի հյուրերը հեշտությամբ գտնեն յուրաքանչյուր վայրը։'],
    ['Կարո՞ղ եմ փոխարինել լուսանկարները', 'Այո։ Կարող եք վերբեռնել ձեր գլխավոր և պատկերասրահի լուսանկարները, փոխարինել կամ ջնջել դրանք, եթե շաբլոնը թույլ է տալիս։'],
    ['Որքա՞ն ժամանակ է ակտիվ մնում հրավերի հղումը', 'Հղումն ակտիվ է մնում ձեր ընտրած ծառայության կամ փաթեթի մեջ ներառված ժամանակահատվածում։'],
    ['Ո՞վ կարող է տեսնել իմ հրավերը', 'Հրավերը կարող է բացել յուրաքանչյուր ոք, ով ունի անձնական հղումը, ուստի այն տարածեք միայն նախատեսված հյուրերի շրջանում։'],
    ['Կարո՞ղ եմ պատվիրել լիովին անհատական դիզայն', 'Այո։ Կապվեք մեր թիմի հետ, և մենք կստեղծենք ձեր միջոցառմանն ու նախասիրություններին համապատասխան անհատական հրավեր։']
  ]
};

const ru = {
  ...en,
  home: 'Главная',
  templates: 'Приглашения',
  about: 'О нас',
  contact: 'Контакты',
  orderNow: 'Купить',
  viewTemplates: 'Смотреть приглашения',
  orderCustom: 'Купить индивидуальное приглашение',
  heroTitle: '1 приглашение вместо 1000 звонков',
  heroDevice: 'Свадебное приглашение',
  hashtags: ['# Веб-приглашения', '# Свадьба', '# Крещение', '# День рождения'],
  storiesKicker: 'Добро пожаловать в Amulet',
  storiesTitle: 'Каждый праздник начинается с красивого приглашения',
  viewAllStories: 'Смотреть все истории',
  invitationGallery: 'Галерея приглашений',
  morphTitle: 'Твоя история начинается с правильного приглашения',
  eventsKicker: 'События',
  eventsTitle: 'Выбери приглашение для своего события',
  featured: 'Избранные приглашения',
  faq: 'Вопросы',
  faqTitle: 'Частые вопросы',
  faqSubtitle: 'Всё важное о создании, персонализации и отправке приглашения — в одном месте.',
  templateCodeLabel: 'Код',
  eventTestimonials: [
    { name: 'Свадьба и помолвка', designation: 'Свадьба / Помолвка', quote: 'Свадьба, помолвка и история любви начинаются с продуманного приглашения.', image: 'wedding' },
    { name: 'Крещение', designation: 'Крещение', quote: 'Теплое цифровое приглашение для святого дня, который запомнят семья и гости.', image: 'baptism' },
    { name: 'День рождения', designation: 'День рождения', quote: 'Яркие персональные приглашения создают настроение еще до начала праздника.', image: 'birth' },
    { name: 'Корпоратив', designation: 'Корпоративное событие', quote: 'Отправь аккуратное приглашение, сэкономь время и держи данные гостей в одном потоке.', image: 'corporate' },
    { name: 'Для партнеров', designation: 'Партнеры событий', quote: 'Элегантная подача для площадок, декораторов, организаторов и партнеров.', image: 'partners' }
  ],
  chooseInvitation: 'Выбрать приглашение',
  menuPartners: 'Для партнеров',
  menuPrivacy: 'Политика конфиденциальности',
  menuLogin: 'Вход',
  partnerTitle: 'Для партнеров',
  partnerSubtitle: 'Как стать партнером',
  wedding: 'Свадьба',
  baptism: 'Крещение',
  birth: 'День рождения',
  corporate: 'Корпоратив',
  engagement: 'Помолвка',
  weddingTitle: 'Свадьба и помолвка',
  weddingSubtitle: 'Самые ценные моменты начинаются с приглашения',
  baptismTitle: 'Крещение',
  baptismSubtitle: 'Отправь приглашение, которое запомнят',
  birthTitle: 'День рождения',
  birthSubtitle: 'Выделись среди всех',
  corporateTitle: 'Корпоратив',
  corporateSubtitle: 'Сэкономь свое время',
  phoneWeddingNames: 'Арам & Лилит',
  phoneBaptismName: 'Нарек',
  phoneBlessedDay: 'Святой день',
  phoneBirthday: 'День рождения'
};

const es = {
  ...en,
  home: 'Inicio',
  templates: 'Invitaciones',
  about: 'Nosotros',
  contact: 'Contacto',
  orderNow: 'Comprar',
  viewTemplates: 'Ver invitaciones',
  orderCustom: 'Comprar invitación personalizada',
  heroTitle: '1 invitación en lugar de 1000 llamadas',
  storiesKicker: 'Bienvenido a Amulet',
  storiesTitle: 'Cada celebración empieza con una invitación hermosa',
  viewAllStories: 'Ver todas las historias',
  invitationGallery: 'Galería de invitaciones',
  morphTitle: 'Tu historia empieza con la invitación correcta',
  eventsKicker: 'Eventos',
  eventsTitle: 'Elige la invitación para tu evento',
  featured: 'Invitaciones destacadas',
  faq: 'Preguntas',
  faqTitle: 'Preguntas frecuentes',
  faqSubtitle: 'Todo lo que necesitas saber para crear, personalizar y compartir tu invitación.',
  templateCodeLabel: 'Código',
  chooseInvitation: 'Elegir invitación',
  menuPartners: 'Para socios',
  menuPrivacy: 'Política de privacidad',
  menuLogin: 'Entrar',
  wedding: 'Boda',
  baptism: 'Bautizo',
  birth: 'Cumpleaños',
  corporate: 'Corporativo',
  engagement: 'Compromiso',
  eventTestimonials: [
    { name: 'Boda y compromiso', designation: 'Boda / Compromiso', quote: 'Las bodas, compromisos e historias de amor empiezan con una invitación cuidada.', image: 'wedding' },
    { name: 'Bautizo', designation: 'Bautizo', quote: 'Una invitación digital cálida para un día sagrado e inolvidable.', image: 'baptism' },
    { name: 'Cumpleaños', designation: 'Cumpleaños', quote: 'Invitaciones personales y alegres que crean ambiente antes de la fiesta.', image: 'birth' },
    { name: 'Corporativo', designation: 'Evento corporativo', quote: 'Envía una invitación elegante, ahorra tiempo y organiza a tus invitados.', image: 'corporate' },
    { name: 'Socios', designation: 'Socios de eventos', quote: 'Una presentación refinada para espacios, decoradores, equipos y socios.', image: 'partners' }
  ]
};

const fr = {
  ...en,
  home: 'Accueil',
  templates: 'Invitations',
  about: 'À propos',
  contact: 'Contact',
  orderNow: 'Acheter',
  viewTemplates: 'Voir les invitations',
  orderCustom: 'Acheter une invitation personnalisée',
  heroTitle: '1 invitation au lieu de 1000 appels',
  storiesKicker: 'Bienvenue chez Amulet',
  storiesTitle: 'Chaque fête commence par une belle invitation',
  viewAllStories: 'Voir toutes les histoires',
  invitationGallery: 'Galerie d’invitations',
  morphTitle: 'Ton histoire commence par la bonne invitation',
  eventsKicker: 'Événements',
  eventsTitle: 'Choisis l’invitation pour ton événement',
  featured: 'Invitations sélectionnées',
  faq: 'Questions',
  faqTitle: 'Questions fréquentes',
  faqSubtitle: 'Tout ce qu’il faut savoir pour créer, personnaliser et partager votre invitation.',
  templateCodeLabel: 'Code',
  chooseInvitation: 'Choisir une invitation',
  menuPartners: 'Pour les partenaires',
  menuPrivacy: 'Politique de confidentialité',
  menuLogin: 'Connexion',
  wedding: 'Mariage',
  baptism: 'Baptême',
  birth: 'Anniversaire',
  corporate: 'Corporate',
  engagement: 'Fiançailles',
  eventTestimonials: [
    { name: 'Mariage et fiançailles', designation: 'Mariage / Fiançailles', quote: 'Les mariages, fiançailles et histoires d’amour commencent par une invitation soignée.', image: 'wedding' },
    { name: 'Baptême', designation: 'Baptême', quote: 'Une invitation digitale chaleureuse pour un jour sacré et mémorable.', image: 'baptism' },
    { name: 'Anniversaire', designation: 'Anniversaire', quote: 'Des invitations personnelles et joyeuses qui donnent le ton avant la fête.', image: 'birth' },
    { name: 'Corporate', designation: 'Événement corporate', quote: 'Envoie une invitation élégante, gagne du temps et organise tes invités.', image: 'corporate' },
    { name: 'Partenaires', designation: 'Partenaires événementiels', quote: 'Une présentation raffinée pour lieux, décorateurs, équipes et partenaires.', image: 'partners' }
  ]
};

const de = {
  ...en,
  home: 'Start',
  templates: 'Einladungen',
  about: 'Über uns',
  contact: 'Kontakt',
  orderNow: 'Kaufen',
  viewTemplates: 'Einladungen ansehen',
  orderCustom: 'Individuelle Einladung kaufen',
  heroTitle: '1 Einladung statt 1000 Anrufen',
  storiesKicker: 'Willkommen bei Amulet',
  storiesTitle: 'Jede Feier beginnt mit einer schönen Einladung',
  viewAllStories: 'Alle Geschichten ansehen',
  invitationGallery: 'Einladungsgalerie',
  morphTitle: 'Deine Geschichte beginnt mit der richtigen Einladung',
  eventsKicker: 'Events',
  eventsTitle: 'Wähle die Einladung für dein Event',
  featured: 'Ausgewählte Einladungen',
  faq: 'Fragen',
  faqTitle: 'Häufige Fragen',
  faqSubtitle: 'Alles Wichtige zum Erstellen, Personalisieren und Teilen Ihrer Einladung.',
  templateCodeLabel: 'Code',
  chooseInvitation: 'Einladung wählen',
  menuPartners: 'Für Partner',
  menuPrivacy: 'Datenschutz',
  menuLogin: 'Login',
  wedding: 'Hochzeit',
  baptism: 'Taufe',
  birth: 'Geburtstag',
  corporate: 'Corporate',
  engagement: 'Verlobung',
  eventTestimonials: [
    { name: 'Hochzeit und Verlobung', designation: 'Hochzeit / Verlobung', quote: 'Hochzeiten, Verlobungen und Liebesgeschichten beginnen mit einer passenden Einladung.', image: 'wedding' },
    { name: 'Taufe', designation: 'Taufe', quote: 'Eine warme digitale Einladung für einen heiligen und unvergesslichen Tag.', image: 'baptism' },
    { name: 'Geburtstag', designation: 'Geburtstag', quote: 'Persönliche und festliche Einladungen, die schon vor der Feier Stimmung machen.', image: 'birth' },
    { name: 'Corporate', designation: 'Firmenevent', quote: 'Sende eine elegante Einladung, spare Zeit und organisiere alle Gäste übersichtlich.', image: 'corporate' },
    { name: 'Partner', designation: 'Eventpartner', quote: 'Eine stilvolle Präsentation für Locations, Dekoration, Teams und Partner.', image: 'partners' }
  ]
};

const it = {
  ...en,
  home: 'Home',
  templates: 'Inviti',
  about: 'Chi siamo',
  contact: 'Contatti',
  orderNow: 'Acquista',
  viewTemplates: 'Vedi inviti',
  orderCustom: 'Acquista un invito personalizzato',
  heroTitle: '1 invito invece di 1000 chiamate',
  storiesKicker: 'Benvenuto in Amulet',
  storiesTitle: 'Ogni festa inizia con un bellissimo invito',
  viewAllStories: 'Vedi tutte le storie',
  invitationGallery: 'Galleria inviti',
  morphTitle: 'La tua storia inizia con l’invito giusto',
  eventsKicker: 'Eventi',
  eventsTitle: 'Scegli l’invito per il tuo evento',
  featured: 'Inviti in evidenza',
  faq: 'Domande',
  faqTitle: 'Domande frequenti',
  faqSubtitle: 'Tutto ciò che serve per creare, personalizzare e condividere il tuo invito.',
  templateCodeLabel: 'Codice',
  chooseInvitation: 'Scegli invito',
  menuPartners: 'Per partner',
  menuPrivacy: 'Privacy policy',
  menuLogin: 'Accesso',
  wedding: 'Matrimonio',
  baptism: 'Battesimo',
  birth: 'Compleanno',
  corporate: 'Corporate',
  engagement: 'Fidanzamento',
  eventTestimonials: [
    { name: 'Matrimonio e fidanzamento', designation: 'Matrimonio / Fidanzamento', quote: 'Matrimoni, fidanzamenti e storie d’amore iniziano con un invito curato.', image: 'wedding' },
    { name: 'Battesimo', designation: 'Battesimo', quote: 'Un invito digitale caldo per un giorno sacro e memorabile.', image: 'baptism' },
    { name: 'Compleanno', designation: 'Compleanno', quote: 'Inviti personali e festosi che creano atmosfera prima della festa.', image: 'birth' },
    { name: 'Corporate', designation: 'Evento corporate', quote: 'Invia un invito elegante, risparmia tempo e organizza tutti gli ospiti.', image: 'corporate' },
    { name: 'Partner', designation: 'Partner eventi', quote: 'Una presentazione raffinata per location, decoratori, team e partner.', image: 'partners' }
  ]
};

Object.assign(ru, {
  search: 'Поиск',
  sort: 'Сортировка',
  newest: 'Новые',
  priceAsc: 'Цена по возрастанию',
  priceDesc: 'Цена по убыванию',
  all: 'Все',
  preview: 'Просмотр',
  order: 'Купить',
  livePreview: 'Живой просмотр',
  orderThis: 'Купить это приглашение',
  features: 'Возможности',
  gallery: 'Галерея',
  fullName: 'Имя и фамилия',
  phone: 'Телефон',
  email: 'Email',
  eventType: 'Тип события',
  selectedTemplate: 'Выбранное приглашение',
  eventDate: 'Дата события',
  eventTime: 'Время',
  eventLocation: 'Место',
  mapLink: 'Ссылка Google Maps',
  mainNames: 'Главные имена',
  eventMessage: 'Текст приглашения',
  preferredLanguage: 'Предпочитаемый язык',
  notes: 'Дополнительные заметки',
  submit: 'Отправить',
  successOrder: 'Ваш заказ успешно отправлен.',
  orderErrorDetails: 'Пожалуйста, проверьте обязательные поля и попробуйте снова.',
  orderConnectionError: 'Не удалось подключиться к серверу. Перезапустите сервер и попробуйте снова.',
  successContact: 'Ваше сообщение успешно отправлено.',
  successContactDetails: 'Спасибо за обращение. Мы прочитаем ваше сообщение и скоро ответим на ваш email.',
  rsvp: 'RSVP',
  guestName: 'Имя гостя',
  attendance: 'Участие',
  attending: 'Я приду',
  declined: 'Я не смогу прийти',
  unsure: 'Пока не уверен',
  guestCount: 'Количество гостей',
  message: 'Сообщение',
  openMap: 'Открыть карту',
  share: 'Поделиться приглашением',
  addCalendar: 'Добавить в календарь',
  login: 'Вход',
  password: 'Пароль',
  dashboard: 'Панель',
  logout: 'Выход',
  loading: 'Загрузка...',
  error: 'Что-то пошло не так',
  required: 'Заполните обязательные поля',
  customDesign: 'Индивидуальный дизайн',
  catalogIntro: 'Просмотрите оригинальные дизайны и выберите основу для своего события.',
  orderIntro: 'Отправьте детали события, и наша команда подготовит персональное онлайн-приглашение.',
  contactIntro: 'Расскажите, что вы планируете, и мы поможем оформить приглашение.',
  aboutTitle: 'Об Amulet',
  aboutIntro: 'Современная платформа для онлайн-приглашений.',
  aboutP1: 'Amulet — это современная платформа онлайн-приглашений, созданная для того, чтобы сделать важные и памятные дни вашей жизни более красивыми и особенными.',
  aboutP2: 'С помощью нашей платформы вы можете выбрать готовый дизайн, персонализировать приглашение, добавить всю информацию о мероприятии и легко отправить его гостям. Amulet подходит для свадеб, помолвок, крещений, дней рождения, корпоративных мероприятий и других важных поводов.',
  aboutP3: 'Мы объединяем изящный дизайн, современные технологии и простоту использования, создавая приглашения, которые не только сообщают о событии, но и передают его настроение и историю.',
  aboutParagraphs: [
    'Amulet — это современная платформа онлайн-приглашений, созданная для того, чтобы сделать важные и памятные дни вашей жизни более красивыми и особенными.',
    'С помощью нашей платформы вы можете выбрать готовый дизайн, персонализировать приглашение, добавить всю информацию о мероприятии и легко отправить его гостям. Amulet подходит для свадеб, помолвок, крещений, дней рождения, корпоративных мероприятий и других важных поводов.',
    'Мы объединяем изящный дизайн, современные технологии и простоту использования, создавая приглашения, которые не только сообщают о событии, но и передают его настроение и историю.',
    'Наша цель — помочь вам сэкономить время, сократить расходы на печать и создать приглашение, которое надолго останется в памяти у вас и ваших гостей.'
  ],
  aboutSignature: 'Amulet — первый красивый шаг вашего памятного дня.',
  aboutBenefitsTitle: 'Почему выбирают Amulet',
  aboutBenefits: [
    'Современные и изящные дизайны',
    'Широкие возможности персонализации',
    'Удобный просмотр на всех устройствах',
    'Онлайн-подтверждение участия гостей',
    'Быстрая и простая отправка по ссылке',
    'Возможность многоязычных приглашений',
    'Индивидуальный подход и техническая поддержка'
  ],
  aboutCompanyCredit: 'Amulet создан компанией R’SOFT Development Company с любовью, вниманием к деталям и желанием сделать каждое мероприятие уникальным.',
  contactName: 'Имя',
  footerText: 'Цифровые приглашения с RSVP, картами, галереями и личными деталями.',
  daysToGo: 'дней осталось',
  rsvpSaved: 'Спасибо. Ваш RSVP сохранен.',
  faqItems: [
    ['Что входит в стоимость?', 'Фотографии, программа события, адреса, карта, RSVP-форма, таймер и все нужные тексты.'],
    ['Сколько времени занимает подготовка?', 'Обычно 3-4 дня. Индивидуальный дизайн может занять больше времени в зависимости от сложности.'],
    ['Как отправить веб-приглашение?', 'Им можно поделиться через WhatsApp, Instagram, Viber, Telegram, Email, SMS или любую другую платформу.'],
    ['Какие языки доступны?', 'Приглашения можно подготовить на армянском, английском, русском, испанском, французском, немецком, итальянском и других языках.'],
    ['Можно ли редактировать приглашение после покупки?', 'Да. В личном кабинете можно изменить тексты, фотографии, дату, время, место и другие редактируемые данные.'],
    ['Работает ли приглашение на всех устройствах?', 'Да. Каждое приглашение адаптируется к телефонам, планшетам, ноутбукам и большим экранам.'],
    ['Как работает подтверждение RSVP?', 'Гости заполняют RSVP-форму в приглашении, а вы видите их ответы и количество гостей в личном кабинете.'],
    ['Можно ли добавить место и карту?', 'Да. Можно добавить один или несколько адресов и ссылки Google Maps, чтобы гости легко нашли каждое место.'],
    ['Можно ли заменить фотографии?', 'Да. Можно загрузить свои обложку и фотографии галереи, заменить или удалить их, если это предусмотрено шаблоном.'],
    ['Как долго ссылка на приглашение остается активной?', 'Ссылка остается активной в течение срока, включенного в выбранную услугу или пакет.'],
    ['Кто может посмотреть мое приглашение?', 'Приглашение может открыть любой, у кого есть приватная ссылка, поэтому делитесь ею только с нужными гостями.'],
    ['Можно ли заказать полностью индивидуальный дизайн?', 'Да. Свяжитесь с нашей командой, и мы создадим персональное приглашение с учетом вашего события и пожеланий.']
  ]
});

Object.assign(es, {
  partnerTitle: 'Para socios', partnerSubtitle: 'Cómo ser socio', partnerLogin: 'Entrar',
  weddingTitle: 'Boda y compromiso', weddingSubtitle: 'Los momentos más valiosos empiezan con una invitación',
  baptismTitle: 'Bautizo', baptismSubtitle: 'Envía una invitación que será recordada',
  birthTitle: 'Cumpleaños', birthSubtitle: 'Destaca entre todos',
  corporateTitle: 'Corporativo', corporateSubtitle: 'Ahorra tiempo',
  phoneWeddingNames: 'Aram & Lilit', phoneBaptismName: 'Narek', phoneBlessedDay: 'Día santo', phoneBirthday: 'Cumpleaños',
  search: 'Buscar', sort: 'Ordenar', newest: 'Más nuevos', priceAsc: 'Precio menor a mayor', priceDesc: 'Precio mayor a menor', all: 'Todos',
  preview: 'Vista previa', order: 'Comprar', livePreview: 'Vista en vivo', orderThis: 'Comprar esta invitación', features: 'Funciones', gallery: 'Galería',
  fullName: 'Nombre completo', phone: 'Teléfono', email: 'Email', eventType: 'Tipo de evento', selectedTemplate: 'Invitación seleccionada',
  eventDate: 'Fecha del evento', eventTime: 'Hora', eventLocation: 'Lugar', mapLink: 'Enlace de Google Maps', mainNames: 'Nombres principales',
  eventMessage: 'Texto de invitación', preferredLanguage: 'Idioma preferido', notes: 'Notas adicionales', submit: 'Enviar',
  successOrder: 'Tu pedido se envió correctamente.', successContact: 'Tu mensaje se envió correctamente.', guestName: 'Nombre del invitado',
  attendance: 'Asistencia', attending: 'Asistiré', declined: 'No puedo asistir', unsure: 'No estoy seguro', guestCount: 'Número de invitados',
  message: 'Mensaje', openMap: 'Abrir mapa', share: 'Compartir invitación', addCalendar: 'Añadir al calendario',
  login: 'Entrar', password: 'Contraseña', dashboard: 'Panel', logout: 'Salir', loading: 'Cargando...', error: 'Algo salió mal',
  required: 'Completa los campos obligatorios', customDesign: 'Diseño personalizado',
  catalogIntro: 'Explora diseños originales y elige un punto de partida para tu evento.',
  orderIntro: 'Envía los detalles del evento y nuestro equipo preparará una invitación online personalizada.',
  contactIntro: 'Cuéntanos qué estás planeando y te ayudaremos a crear la invitación.',
  aboutTitle: 'Sobre Amulet', aboutIntro: 'Una plataforma moderna para invitaciones online.',
  aboutP1: 'Amulet es una plataforma moderna de invitaciones online creada para hacer que los días importantes y memorables de tu vida sean más bellos y únicos.',
  aboutP2: 'Con nuestra plataforma puedes elegir un diseño listo, personalizar la invitación, añadir toda la información del evento y enviarla fácilmente a tus invitados. Amulet está pensado para bodas, compromisos, bautizos, cumpleaños, eventos corporativos y otras ocasiones importantes.',
  aboutP3: 'Combinamos diseño refinado, tecnología moderna y facilidad de uso para crear invitaciones que no solo informan sobre el evento, sino que también transmiten su ambiente y su historia.',
  aboutParagraphs: [
    'Amulet es una plataforma moderna de invitaciones online creada para hacer que los días importantes y memorables de tu vida sean más bellos y únicos.',
    'Con nuestra plataforma puedes elegir un diseño listo, personalizar la invitación, añadir toda la información del evento y enviarla fácilmente a tus invitados. Amulet está pensado para bodas, compromisos, bautizos, cumpleaños, eventos corporativos y otras ocasiones importantes.',
    'Combinamos diseño refinado, tecnología moderna y facilidad de uso para crear invitaciones que no solo informan sobre el evento, sino que también transmiten su ambiente y su historia.',
    'Nuestro objetivo es ayudarte a ahorrar tiempo, reducir los gastos de impresión y crear una invitación que permanezca durante mucho tiempo en tu memoria y en la de tus invitados.'
  ],
  aboutSignature: 'Amulet — el primer paso bello de tu día memorable.',
  aboutBenefitsTitle: 'Por qué elegir Amulet',
  aboutBenefits: [
    'Diseños modernos y refinados',
    'Amplias opciones de personalización',
    'Visualización cómoda en todos los dispositivos',
    'Confirmación online de asistencia de los invitados',
    'Difusión rápida y sencilla mediante un enlace',
    'Posibilidad de invitaciones multilingües',
    'Atención personalizada y soporte técnico'
  ],
  aboutCompanyCredit: 'Amulet fue creado por R’SOFT Development Company con amor, atención a los detalles y el deseo de hacer único cada evento.',
  contactName: 'Nombre', footerText: 'Invitaciones digitales con RSVP, mapas, galerías y detalles personales.',
  daysToGo: 'días restantes', rsvpSaved: 'Gracias. Tu RSVP fue guardado.',
  faqItems: [
    ['¿Qué incluye el precio?', 'Fotos, programa, direcciones, mapa, formulario RSVP, cuenta regresiva y textos necesarios.'],
    ['¿Cuánto tarda la preparación?', 'Normalmente 3-4 días. Un diseño personalizado puede tardar más según su complejidad.'],
    ['¿Cómo envío la invitación web?', 'Puedes compartirla por WhatsApp, Instagram, Viber, Telegram, Email, SMS u otra plataforma.'],
    ['¿Qué idiomas están disponibles?', 'Las invitaciones pueden prepararse en armenio, inglés, ruso, español, francés, alemán, italiano y otros idiomas.'],
    ['¿Puedo editar la invitación después de comprarla?', 'Sí. Desde tu cuenta puedes cambiar los textos, fotos, fecha, hora, lugar y otros datos editables.'],
    ['¿La invitación funciona en todos los dispositivos?', 'Sí. Cada invitación es responsive y se adapta a teléfonos, tabletas, portátiles y pantallas de escritorio.'],
    ['¿Cómo funciona la confirmación RSVP?', 'Los invitados completan el formulario RSVP y tú puedes ver sus respuestas y el número de asistentes en tu cuenta.'],
    ['¿Puedo añadir una ubicación y un mapa?', 'Sí. Puedes añadir una o varias direcciones y enlaces de Google Maps para que los invitados encuentren cada lugar fácilmente.'],
    ['¿Puedo reemplazar las fotos?', 'Sí. Puedes subir tus fotos de portada y galería, sustituirlas o eliminarlas cuando la plantilla lo permita.'],
    ['¿Cuánto tiempo permanece activo el enlace?', 'El enlace permanece activo durante el período incluido en el servicio o paquete elegido.'],
    ['¿Quién puede ver mi invitación?', 'Cualquier persona con el enlace privado puede abrirla, así que compártelo solo con los invitados previstos.'],
    ['¿Puedo encargar un diseño totalmente personalizado?', 'Sí. Contacta con nuestro equipo y crearemos una invitación adaptada a tu evento y preferencias.']
  ]
});

Object.assign(fr, {
  partnerTitle: 'Pour les partenaires', partnerSubtitle: 'Comment devenir partenaire', partnerLogin: 'Entrer',
  weddingTitle: 'Mariage et fiançailles', weddingSubtitle: 'Les moments les plus précieux commencent par une invitation',
  baptismTitle: 'Baptême', baptismSubtitle: 'Envoie une invitation dont on se souviendra',
  birthTitle: 'Anniversaire', birthSubtitle: 'Démarque-toi',
  corporateTitle: 'Corporate', corporateSubtitle: 'Gagne du temps',
  phoneWeddingNames: 'Aram & Lilit', phoneBaptismName: 'Narek', phoneBlessedDay: 'Jour sacré', phoneBirthday: 'Anniversaire',
  search: 'Rechercher', sort: 'Trier', newest: 'Nouveautés', priceAsc: 'Prix croissant', priceDesc: 'Prix décroissant', all: 'Tous',
  preview: 'Aperçu', order: 'Acheter', livePreview: 'Aperçu en direct', orderThis: 'Acheter cette invitation', features: 'Fonctions', gallery: 'Galerie',
  fullName: 'Nom complet', phone: 'Téléphone', email: 'Email', eventType: 'Type d’événement', selectedTemplate: 'Invitation sélectionnée',
  eventDate: 'Date', eventTime: 'Heure', eventLocation: 'Lieu', mapLink: 'Lien Google Maps', mainNames: 'Noms principaux',
  eventMessage: 'Texte de l’invitation', preferredLanguage: 'Langue préférée', notes: 'Notes supplémentaires', submit: 'Envoyer',
  successOrder: 'Votre commande a été envoyée.', successContact: 'Votre message a été envoyé.', guestName: 'Nom de l’invité',
  attendance: 'Présence', attending: 'Je serai présent', declined: 'Je ne peux pas venir', unsure: 'Je ne suis pas sûr', guestCount: 'Nombre d’invités',
  message: 'Message', openMap: 'Ouvrir la carte', share: 'Partager l’invitation', addCalendar: 'Ajouter au calendrier',
  login: 'Connexion', password: 'Mot de passe', dashboard: 'Tableau de bord', logout: 'Déconnexion', loading: 'Chargement...', error: 'Une erreur est survenue',
  required: 'Veuillez remplir les champs obligatoires', customDesign: 'Design personnalisé',
  catalogIntro: 'Parcourez les designs originaux et choisissez une base pour votre événement.',
  orderIntro: 'Envoyez les détails de l’événement et notre équipe préparera une invitation personnalisée.',
  contactIntro: 'Dites-nous ce que vous préparez et nous aiderons à créer l’invitation.',
  aboutTitle: 'À propos d’Amulet', aboutIntro: 'Une plateforme moderne pour invitations en ligne.',
  aboutP1: 'Amulet est une plateforme moderne d’invitations en ligne, créée pour rendre les jours importants et mémorables de votre vie plus beaux et uniques.',
  aboutP2: 'Avec notre plateforme, vous pouvez choisir un design prêt à l’emploi, personnaliser l’invitation, ajouter toutes les informations de l’événement et l’envoyer facilement à vos invités. Amulet est conçu pour les mariages, fiançailles, baptêmes, anniversaires, événements d’entreprise et autres occasions importantes.',
  aboutP3: 'Nous associons design raffiné, technologies modernes et simplicité d’utilisation pour créer des invitations qui ne se contentent pas d’informer sur l’événement, mais en transmettent aussi l’ambiance et l’histoire.',
  aboutParagraphs: [
    'Amulet est une plateforme moderne d’invitations en ligne, créée pour rendre les jours importants et mémorables de votre vie plus beaux et uniques.',
    'Avec notre plateforme, vous pouvez choisir un design prêt à l’emploi, personnaliser l’invitation, ajouter toutes les informations de l’événement et l’envoyer facilement à vos invités. Amulet est conçu pour les mariages, fiançailles, baptêmes, anniversaires, événements d’entreprise et autres occasions importantes.',
    'Nous associons design raffiné, technologies modernes et simplicité d’utilisation pour créer des invitations qui ne se contentent pas d’informer sur l’événement, mais en transmettent aussi l’ambiance et l’histoire.',
    'Notre objectif est de vous aider à gagner du temps, réduire les coûts d’impression et créer une invitation qui restera longtemps dans votre mémoire et celle de vos invités.'
  ],
  aboutSignature: 'Amulet — le premier beau pas de votre journée mémorable.',
  aboutBenefitsTitle: 'Pourquoi choisir Amulet',
  aboutBenefits: [
    'Designs modernes et raffinés',
    'Large choix de personnalisation',
    'Consultation confortable sur tous les appareils',
    'Confirmation de présence en ligne des invités',
    'Partage rapide et simple par lien',
    'Possibilité d’invitations multilingues',
    'Approche personnalisée et support technique'
  ],
  aboutCompanyCredit: 'Amulet a été créé par R’SOFT Development Company avec amour, attention aux détails et l’envie de rendre chaque événement unique.',
  contactName: 'Nom', footerText: 'Invitations digitales avec RSVP, cartes, galeries et détails personnels.',
  daysToGo: 'jours restants', rsvpSaved: 'Merci. Votre RSVP a été enregistré.',
  faqItems: [
    ['Que comprend le prix ?', 'Photos, programme, adresses, carte, formulaire RSVP, compte à rebours et textes nécessaires.'],
    ['Combien de temps faut-il pour la préparation ?', 'Généralement 3-4 jours. Un design sur mesure peut demander plus de temps selon sa complexité.'],
    ['Comment envoyer l’invitation web ?', 'Vous pouvez la partager via WhatsApp, Instagram, Viber, Telegram, Email, SMS ou toute autre plateforme.'],
    ['Quelles langues sont disponibles ?', 'Les invitations peuvent être préparées en arménien, anglais, russe, espagnol, français, allemand, italien et dans d’autres langues.'],
    ['Puis-je modifier l’invitation après l’achat ?', 'Oui. Depuis votre compte, vous pouvez modifier les textes, photos, date, heure, lieu et autres informations éditables.'],
    ['L’invitation fonctionne-t-elle sur tous les appareils ?', 'Oui. Chaque invitation est responsive et s’adapte aux téléphones, tablettes, ordinateurs portables et écrans de bureau.'],
    ['Comment fonctionne la confirmation RSVP ?', 'Les invités remplissent le formulaire RSVP et vous consultez leurs réponses ainsi que le nombre de participants dans votre compte.'],
    ['Puis-je ajouter un lieu et une carte ?', 'Oui. Vous pouvez ajouter une ou plusieurs adresses et des liens Google Maps pour aider les invités à trouver chaque lieu.'],
    ['Puis-je remplacer les photos ?', 'Oui. Vous pouvez importer vos photos de couverture et de galerie, les remplacer ou les supprimer lorsque le modèle le permet.'],
    ['Combien de temps le lien reste-t-il actif ?', 'Le lien reste actif pendant la durée incluse dans le service ou le forfait choisi.'],
    ['Qui peut voir mon invitation ?', 'Toute personne disposant du lien privé peut l’ouvrir. Partagez-le donc uniquement avec les invités concernés.'],
    ['Puis-je commander un design entièrement personnalisé ?', 'Oui. Contactez notre équipe et nous créerons une invitation adaptée à votre événement et à vos préférences.']
  ]
});

Object.assign(de, {
  partnerTitle: 'Für Partner', partnerSubtitle: 'Wie man Partner wird', partnerLogin: 'Eintreten',
  weddingTitle: 'Hochzeit und Verlobung', weddingSubtitle: 'Die wertvollsten Momente beginnen mit einer Einladung',
  baptismTitle: 'Taufe', baptismSubtitle: 'Sende eine Einladung, die in Erinnerung bleibt',
  birthTitle: 'Geburtstag', birthSubtitle: 'Heb dich von allen ab',
  corporateTitle: 'Corporate', corporateSubtitle: 'Spare Zeit',
  phoneWeddingNames: 'Aram & Lilit', phoneBaptismName: 'Narek', phoneBlessedDay: 'Heiliger Tag', phoneBirthday: 'Geburtstag',
  search: 'Suchen', sort: 'Sortieren', newest: 'Neueste', priceAsc: 'Preis aufsteigend', priceDesc: 'Preis absteigend', all: 'Alle',
  preview: 'Vorschau', order: 'Kaufen', livePreview: 'Live-Vorschau', orderThis: 'Diese Einladung kaufen', features: 'Funktionen', gallery: 'Galerie',
  fullName: 'Vollständiger Name', phone: 'Telefon', email: 'E-Mail', eventType: 'Eventtyp', selectedTemplate: 'Gewählte Einladung',
  eventDate: 'Datum', eventTime: 'Uhrzeit', eventLocation: 'Ort', mapLink: 'Google Maps Link', mainNames: 'Hauptnamen',
  eventMessage: 'Einladungstext', preferredLanguage: 'Bevorzugte Sprache', notes: 'Zusätzliche Notizen', submit: 'Senden',
  successOrder: 'Deine Bestellung wurde gesendet.', successContact: 'Deine Nachricht wurde gesendet.', guestName: 'Name des Gastes',
  attendance: 'Teilnahme', attending: 'Ich komme', declined: 'Ich kann nicht kommen', unsure: 'Ich bin nicht sicher', guestCount: 'Anzahl Gäste',
  message: 'Nachricht', openMap: 'Karte öffnen', share: 'Einladung teilen', addCalendar: 'Zum Kalender hinzufügen',
  login: 'Login', password: 'Passwort', dashboard: 'Dashboard', logout: 'Abmelden', loading: 'Lädt...', error: 'Etwas ist schiefgelaufen',
  required: 'Bitte Pflichtfelder ausfüllen', customDesign: 'Individuelles Design',
  catalogIntro: 'Durchsuche originale Designs und wähle eine Basis für dein Event.',
  orderIntro: 'Sende die Eventdetails und unser Team erstellt eine persönliche Online-Einladung.',
  contactIntro: 'Erzähl uns, was du planst, und wir helfen bei der Einladung.',
  aboutTitle: 'Über Amulet', aboutIntro: 'Eine moderne Plattform für Online-Einladungen.',
  aboutP1: 'Amulet ist eine moderne Plattform für Online-Einladungen, geschaffen, um die wichtigen und unvergesslichen Tage Ihres Lebens schöner und einzigartiger zu machen.',
  aboutP2: 'Mit unserer Plattform können Sie ein fertiges Design auswählen, die Einladung personalisieren, alle Informationen zur Veranstaltung hinzufügen und sie einfach an Ihre Gäste senden. Amulet eignet sich für Hochzeiten, Verlobungen, Taufen, Geburtstage, Firmenveranstaltungen und andere wichtige Anlässe.',
  aboutP3: 'Wir verbinden feines Design, moderne Technologie und einfache Nutzung, um Einladungen zu schaffen, die nicht nur über das Ereignis informieren, sondern auch seine Stimmung und Geschichte vermitteln.',
  aboutParagraphs: [
    'Amulet ist eine moderne Plattform für Online-Einladungen, geschaffen, um die wichtigen und unvergesslichen Tage Ihres Lebens schöner und einzigartiger zu machen.',
    'Mit unserer Plattform können Sie ein fertiges Design auswählen, die Einladung personalisieren, alle Informationen zur Veranstaltung hinzufügen und sie einfach an Ihre Gäste senden. Amulet eignet sich für Hochzeiten, Verlobungen, Taufen, Geburtstage, Firmenveranstaltungen und andere wichtige Anlässe.',
    'Wir verbinden feines Design, moderne Technologie und einfache Nutzung, um Einladungen zu schaffen, die nicht nur über das Ereignis informieren, sondern auch seine Stimmung und Geschichte vermitteln.',
    'Unser Ziel ist es, Ihnen Zeit zu sparen, Druckkosten zu reduzieren und eine Einladung zu erstellen, die Ihnen und Ihren Gästen lange in Erinnerung bleibt.'
  ],
  aboutSignature: 'Amulet — der erste schöne Schritt Ihres unvergesslichen Tages.',
  aboutBenefitsTitle: 'Warum Amulet wählen',
  aboutBenefits: [
    'Moderne und feine Designs',
    'Umfangreiche Personalisierungsmöglichkeiten',
    'Komfortable Ansicht auf allen Geräten',
    'Online-Bestätigung der Teilnahme durch Gäste',
    'Schnelles und einfaches Teilen per Link',
    'Möglichkeit mehrsprachiger Einladungen',
    'Persönlicher Ansatz und technischer Support'
  ],
  aboutCompanyCredit: 'Amulet wurde von R’SOFT Development Company mit Liebe, Liebe zum Detail und dem Wunsch geschaffen, jedes Event einzigartig zu machen.',
  contactName: 'Name', footerText: 'Digitale Einladungen mit RSVP, Karten, Galerien und persönlichen Details.',
  daysToGo: 'Tage übrig', rsvpSaved: 'Danke. Dein RSVP wurde gespeichert.',
  faqItems: [
    ['Was ist im Preis enthalten?', 'Fotos, Ablauf, Adressen, Karte, RSVP-Formular, Countdown und alle nötigen Texte.'],
    ['Wie lange dauert die Vorbereitung?', 'Meist 3-4 Tage. Ein individuelles Design kann je nach Aufwand länger dauern.'],
    ['Wie sende ich die Web-Einladung?', 'Du kannst sie über WhatsApp, Instagram, Viber, Telegram, E-Mail, SMS oder andere Plattformen teilen.'],
    ['Welche Sprachen sind verfügbar?', 'Einladungen können auf Armenisch, Englisch, Russisch, Spanisch, Französisch, Deutsch, Italienisch und weiteren Sprachen erstellt werden.'],
    ['Kann ich die Einladung nach dem Kauf bearbeiten?', 'Ja. In deinem Konto kannst du Texte, Fotos, Datum, Uhrzeit, Ort und weitere bearbeitbare Angaben ändern.'],
    ['Funktioniert die Einladung auf allen Geräten?', 'Ja. Jede Einladung ist responsiv und passt sich Smartphones, Tablets, Laptops und Desktop-Bildschirmen an.'],
    ['Wie funktioniert die RSVP-Bestätigung?', 'Gäste füllen das RSVP-Formular aus. Ihre Antworten und die Gästezahl kannst du anschließend in deinem Konto sehen.'],
    ['Kann ich einen Ort und eine Karte hinzufügen?', 'Ja. Du kannst eine oder mehrere Adressen und Google-Maps-Links hinzufügen, damit Gäste jeden Ort leicht finden.'],
    ['Kann ich die Fotos austauschen?', 'Ja. Du kannst eigene Titel- und Galeriefotos hochladen, ersetzen oder löschen, sofern die Vorlage dies unterstützt.'],
    ['Wie lange bleibt der Einladungslink aktiv?', 'Der Link bleibt für den Zeitraum aktiv, der im gewählten Service oder Paket enthalten ist.'],
    ['Wer kann meine Einladung sehen?', 'Jeder mit dem privaten Link kann sie öffnen. Teile ihn deshalb nur mit den vorgesehenen Gästen.'],
    ['Kann ich ein vollständig individuelles Design bestellen?', 'Ja. Kontaktiere unser Team und wir erstellen eine persönliche Einladung passend zu deinem Event und deinen Wünschen.']
  ]
});

Object.assign(it, {
  partnerTitle: 'Per partner', partnerSubtitle: 'Come diventare partner', partnerLogin: 'Entra',
  weddingTitle: 'Matrimonio e fidanzamento', weddingSubtitle: 'I momenti più preziosi iniziano con un invito',
  baptismTitle: 'Battesimo', baptismSubtitle: 'Invia un invito che sarà ricordato',
  birthTitle: 'Compleanno', birthSubtitle: 'Distinguiti da tutti',
  corporateTitle: 'Corporate', corporateSubtitle: 'Risparmia tempo',
  phoneWeddingNames: 'Aram & Lilit', phoneBaptismName: 'Narek', phoneBlessedDay: 'Giorno sacro', phoneBirthday: 'Compleanno',
  search: 'Cerca', sort: 'Ordina', newest: 'Più recenti', priceAsc: 'Prezzo crescente', priceDesc: 'Prezzo decrescente', all: 'Tutti',
  preview: 'Anteprima', order: 'Acquista', livePreview: 'Anteprima live', orderThis: 'Acquista questo invito', features: 'Funzioni', gallery: 'Galleria',
  fullName: 'Nome completo', phone: 'Telefono', email: 'Email', eventType: 'Tipo di evento', selectedTemplate: 'Invito selezionato',
  eventDate: 'Data', eventTime: 'Ora', eventLocation: 'Luogo', mapLink: 'Link Google Maps', mainNames: 'Nomi principali',
  eventMessage: 'Testo invito', preferredLanguage: 'Lingua preferita', notes: 'Note aggiuntive', submit: 'Invia',
  successOrder: 'Il tuo ordine è stato inviato.', successContact: 'Il tuo messaggio è stato inviato.', guestName: 'Nome ospite',
  attendance: 'Partecipazione', attending: 'Parteciperò', declined: 'Non posso partecipare', unsure: 'Non sono sicuro', guestCount: 'Numero ospiti',
  message: 'Messaggio', openMap: 'Apri mappa', share: 'Condividi invito', addCalendar: 'Aggiungi al calendario',
  login: 'Accesso', password: 'Password', dashboard: 'Dashboard', logout: 'Esci', loading: 'Caricamento...', error: 'Qualcosa è andato storto',
  required: 'Compila i campi obbligatori', customDesign: 'Design personalizzato',
  catalogIntro: 'Sfoglia design originali e scegli una base per il tuo evento.',
  orderIntro: 'Invia i dettagli dell’evento e il nostro team preparerà un invito online personalizzato.',
  contactIntro: 'Raccontaci cosa stai organizzando e ti aiuteremo a creare l’invito.',
  aboutTitle: 'Informazioni su Amulet', aboutIntro: 'Una piattaforma moderna per inviti online.',
  aboutP1: 'Amulet è una piattaforma moderna per inviti online, creata per rendere più belli e unici i giorni importanti e memorabili della tua vita.',
  aboutP2: 'Con la nostra piattaforma puoi scegliere un design pronto, personalizzare l’invito, aggiungere tutte le informazioni dell’evento e inviarlo facilmente ai tuoi ospiti. Amulet è pensato per matrimoni, fidanzamenti, battesimi, compleanni, eventi aziendali e altre occasioni importanti.',
  aboutP3: 'Uniamo design raffinato, tecnologie moderne e semplicità d’uso per creare inviti che non solo informano sull’evento, ma ne trasmettono anche l’atmosfera e la storia.',
  aboutParagraphs: [
    'Amulet è una piattaforma moderna per inviti online, creata per rendere più belli e unici i giorni importanti e memorabili della tua vita.',
    'Con la nostra piattaforma puoi scegliere un design pronto, personalizzare l’invito, aggiungere tutte le informazioni dell’evento e inviarlo facilmente ai tuoi ospiti. Amulet è pensato per matrimoni, fidanzamenti, battesimi, compleanni, eventi aziendali e altre occasioni importanti.',
    'Uniamo design raffinato, tecnologie moderne e semplicità d’uso per creare inviti che non solo informano sull’evento, ma ne trasmettono anche l’atmosfera e la storia.',
    'Il nostro obiettivo è aiutarti a risparmiare tempo, ridurre i costi di stampa e creare un invito che rimanga a lungo nella memoria tua e dei tuoi ospiti.'
  ],
  aboutSignature: 'Amulet — il primo bellissimo passo del tuo giorno memorabile.',
  aboutBenefitsTitle: 'Perché scegliere Amulet',
  aboutBenefits: [
    'Design moderni e raffinati',
    'Ampie possibilità di personalizzazione',
    'Visualizzazione comoda su tutti i dispositivi',
    'Conferma online della partecipazione degli ospiti',
    'Condivisione rapida e semplice tramite link',
    'Possibilità di inviti multilingue',
    'Approccio personale e supporto tecnico'
  ],
  aboutCompanyCredit: 'Amulet è stato creato da R’SOFT Development Company con amore, attenzione ai dettagli e il desiderio di rendere unico ogni evento.',
  contactName: 'Nome', footerText: 'Inviti digitali con RSVP, mappe, gallerie e dettagli personali.',
  daysToGo: 'giorni rimasti', rsvpSaved: 'Grazie. Il tuo RSVP è stato salvato.',
  faqItems: [
    ['Cosa include il prezzo?', 'Foto, programma, indirizzi, mappa, modulo RSVP, conto alla rovescia e testi necessari.'],
    ['Quanto tempo richiede la preparazione?', 'Di solito 3-4 giorni. Un design personalizzato può richiedere più tempo in base alla complessità.'],
    ['Come invio l’invito web?', 'Puoi condividerlo via WhatsApp, Instagram, Viber, Telegram, Email, SMS o altra piattaforma.'],
    ['Quali lingue sono disponibili?', 'Gli inviti possono essere preparati in armeno, inglese, russo, spagnolo, francese, tedesco, italiano e altre lingue.'],
    ['Posso modificare l’invito dopo l’acquisto?', 'Sì. Dal tuo account puoi cambiare testi, foto, data, ora, luogo e altri dettagli modificabili.'],
    ['L’invito funziona su tutti i dispositivi?', 'Sì. Ogni invito è responsive e si adatta a telefoni, tablet, laptop e schermi desktop.'],
    ['Come funziona la conferma RSVP?', 'Gli ospiti compilano il modulo RSVP e tu puoi vedere le risposte e il numero dei partecipanti nel tuo account.'],
    ['Posso aggiungere un luogo e una mappa?', 'Sì. Puoi aggiungere uno o più indirizzi e link Google Maps per aiutare gli ospiti a trovare facilmente ogni luogo.'],
    ['Posso sostituire le foto?', 'Sì. Puoi caricare le tue foto di copertina e della galleria, sostituirle o eliminarle quando il modello lo consente.'],
    ['Per quanto tempo rimane attivo il link?', 'Il link rimane attivo per il periodo incluso nel servizio o pacchetto scelto.'],
    ['Chi può vedere il mio invito?', 'Chiunque abbia il link privato può aprirlo, quindi condividilo solo con gli ospiti desiderati.'],
    ['Posso ordinare un design completamente personalizzato?', 'Sì. Contatta il nostro team e creeremo un invito personalizzato in base al tuo evento e alle tue preferenze.']
  ]
});

// Complete keys that previously fell back to English in four supported locales.
Object.assign(es, {
  reviewSubmitError: 'No se pudo enviar la reseña. Inténtalo de nuevo.', reviewSubmitted: 'Reseña enviada', reviewPendingApproval: 'Tu reseña se publicará después de ser aprobada.', addReview: 'Añadir reseña', addReviewHint: 'Comparte tu experiencia con Amulet.', reviewThankYou: 'Gracias por tu opinión', reviewRating: 'Valoración', reviewText: 'Tu reseña', cancel: 'Cancelar', submitReview: 'Enviar reseña',
  authIdentifier: 'Correo o número de teléfono', authForgotPassword: '¿Olvidaste tu contraseña?', authPasswordRules: 'Requisitos de contraseña', authPasswordRulesError: 'Cumple todos los requisitos de contraseña.', authPasswordsMismatch: 'Las contraseñas no coinciden.', authRepeatPassword: 'Repetir contraseña', authSendResetCode: 'Enviar código', authNewPassword: 'Nueva contraseña', authSavePassword: 'Guardar nueva contraseña', authResetCompleteIntro: 'La contraseña se cambió de forma segura. Te llevamos al inicio de sesión.',
  promoQuestionKicker: 'Un detalle especial', promoQuestion: '¿Tienes un código promocional?', promoQuestionText: 'Introdúcelo para ver tu regalo antes de pagar.', promoCodeLabel: 'Código promocional', promoApply: 'Aplicar', promoNoCode: 'Continuar sin código', promoDiscountApplied: 'de descuento aplicado', promoContinue: 'Continuar al pago', inspirationLink: 'Enlace de estilo o inspiración', budgetRange: 'Presupuesto previsto', customRequestNote: 'Describe el estilo, los colores, las secciones y cualquier idea especial.'
});
Object.assign(fr, {
  reviewSubmitError: "Impossible d’envoyer l’avis. Réessayez.", reviewSubmitted: 'Avis envoyé', reviewPendingApproval: 'Votre avis sera publié après validation.', addReview: 'Ajouter un avis', addReviewHint: 'Partagez votre expérience avec Amulet.', reviewThankYou: 'Merci pour votre avis', reviewRating: 'Note', reviewText: 'Votre avis', cancel: 'Annuler', submitReview: "Envoyer l’avis",
  authIdentifier: 'E-mail ou numéro de téléphone', authForgotPassword: 'Mot de passe oublié ?', authPasswordRules: 'Exigences du mot de passe', authPasswordRulesError: 'Respectez toutes les exigences du mot de passe.', authPasswordsMismatch: 'Les mots de passe ne correspondent pas.', authRepeatPassword: 'Répéter le mot de passe', authSendResetCode: 'Envoyer le code', authNewPassword: 'Nouveau mot de passe', authSavePassword: 'Enregistrer le nouveau mot de passe', authResetCompleteIntro: 'Votre mot de passe a été modifié en toute sécurité. Redirection vers la connexion.',
  promoQuestionKicker: 'Une attention spéciale', promoQuestion: 'Avez-vous un code promo ?', promoQuestionText: 'Saisissez-le pour découvrir votre cadeau avant le paiement.', promoCodeLabel: 'Code promo', promoApply: 'Appliquer', promoNoCode: 'Continuer sans code', promoDiscountApplied: 'de réduction appliquée', promoContinue: 'Continuer vers le paiement', inspirationLink: "Lien de style ou d’inspiration", budgetRange: 'Budget prévu', customRequestNote: 'Décrivez le style, les couleurs, les sections et vos idées particulières.'
});
Object.assign(de, {
  reviewSubmitError: 'Die Bewertung konnte nicht gesendet werden. Bitte erneut versuchen.', reviewSubmitted: 'Bewertung gesendet', reviewPendingApproval: 'Ihre Bewertung wird nach der Freigabe veröffentlicht.', addReview: 'Bewertung hinzufügen', addReviewHint: 'Teilen Sie Ihre Erfahrung mit Amulet.', reviewThankYou: 'Vielen Dank für Ihre Bewertung', reviewRating: 'Bewertung', reviewText: 'Ihre Bewertung', cancel: 'Abbrechen', submitReview: 'Bewertung senden',
  authIdentifier: 'E-Mail oder Telefonnummer', authForgotPassword: 'Passwort vergessen?', authPasswordRules: 'Passwortanforderungen', authPasswordRulesError: 'Bitte erfüllen Sie alle Passwortanforderungen.', authPasswordsMismatch: 'Die Passwörter stimmen nicht überein.', authRepeatPassword: 'Passwort wiederholen', authSendResetCode: 'Code senden', authNewPassword: 'Neues Passwort', authSavePassword: 'Neues Passwort speichern', authResetCompleteIntro: 'Das Passwort wurde sicher geändert. Sie werden zur Anmeldung weitergeleitet.',
  promoQuestionKicker: 'Eine besondere Überraschung', promoQuestion: 'Haben Sie einen Aktionscode?', promoQuestionText: 'Geben Sie ihn ein, um Ihr Geschenk vor der Zahlung zu sehen.', promoCodeLabel: 'Aktionscode', promoApply: 'Anwenden', promoNoCode: 'Ohne Code fortfahren', promoDiscountApplied: 'Rabatt angewendet', promoContinue: 'Weiter zur Zahlung', inspirationLink: 'Stil- oder Inspirationslink', budgetRange: 'Geplantes Budget', customRequestNote: 'Beschreiben Sie Stil, Farben, Bereiche und besondere Ideen.'
});
Object.assign(it, {
  reviewSubmitError: 'Impossibile inviare la recensione. Riprova.', reviewSubmitted: 'Recensione inviata', reviewPendingApproval: 'La recensione sarà pubblicata dopo l’approvazione.', addReview: 'Aggiungi recensione', addReviewHint: 'Condividi la tua esperienza con Amulet.', reviewThankYou: 'Grazie per la tua opinione', reviewRating: 'Valutazione', reviewText: 'La tua recensione', cancel: 'Annulla', submitReview: 'Invia recensione',
  authIdentifier: 'Email o numero di telefono', authForgotPassword: 'Password dimenticata?', authPasswordRules: 'Requisiti della password', authPasswordRulesError: 'Soddisfa tutti i requisiti della password.', authPasswordsMismatch: 'Le password non corrispondono.', authRepeatPassword: 'Ripeti password', authSendResetCode: 'Invia codice', authNewPassword: 'Nuova password', authSavePassword: 'Salva nuova password', authResetCompleteIntro: 'La password è stata modificata in modo sicuro. Reindirizzamento al login.',
  promoQuestionKicker: 'Un pensiero speciale', promoQuestion: 'Hai un codice promozionale?', promoQuestionText: 'Inseriscilo per scoprire il regalo prima del pagamento.', promoCodeLabel: 'Codice promozionale', promoApply: 'Applica', promoNoCode: 'Continua senza codice', promoDiscountApplied: 'di sconto applicato', promoContinue: 'Continua al pagamento', inspirationLink: 'Link di stile o ispirazione', budgetRange: 'Budget previsto', customRequestNote: 'Descrivi lo stile, i colori, le sezioni e qualsiasi idea speciale.'
});

Object.assign(hy, { editorCheckBasics: 'Հիմնական տվյալներ', editorCheckVenue: 'Միջոցառման վայր', editorCheckImage: 'Գլխավոր նկար', editorCheckMusic: 'Երաժշտություն', editorCheckRsvp: 'Հյուրերի պատասխաններ', editorPreviewError: 'Չհաջողվեց բացել նախադիտումը։ Խնդրում ենք կրկին փորձել։', editorBuyInvitation: 'Գնել հրավերը', editorBuySubtitle: 'Ստուգեք արդյունքը և անցեք պրոմոկոդի ու վճարման անվտանգ փուլին։', editorPrivateUntilPurchase: 'Անձնական՝ մինչև գնումը', editorPrivateUntilPurchaseText: 'Նախադիտման հղումը հասանելի է միայն Ձեր հաշվին։ Գնումից հետո հրավերը կստանա հանրային հղում։', editorReadinessCheck: 'Պատրաստության ստուգում', editorCheckOnMobile: 'Հեռախոսով ստուգել', editorRefreshing: 'Թարմացվում է...', editorPreparing: 'Պատրաստվում է...', editorPaymentNote: 'Հաջորդ քայլում կարող եք կիրառել պրոմոկոդ, տեսնել նվերը և միայն հետո անցնել Stripe վճարմանը։', editorTemplatesSubtitle: 'Ընտրեք այլ հրավեր և շարունակեք խմբագրումը նոր դիզայնով։', editorSearchTemplate: 'Փնտրել ձևանմուշ...', editorTemplatesLoadError: 'Չհաջողվեց բեռնել ձևանմուշները', editorReopenHint: 'Փակեք և կրկին բացեք խմբագրիչը։', editorTryAnotherSearch: 'Փորձեք այլ որոնման բառ։', editorPaletteSubtitle: 'Ընտրեք այս հրավերի համար պատրաստված {count} ներդաշնակ գունային համակարգերից մեկը։', editorColorSystem: 'Գունային համակարգ', enabled: 'միացված', disabled: 'անջատված' });
Object.assign(en, { editorCheckBasics: 'Basic details', editorCheckVenue: 'Event venue', editorCheckImage: 'Main image', editorCheckMusic: 'Music', editorCheckRsvp: 'Guest responses', editorPreviewError: 'Could not open the preview. Please try again.', editorBuyInvitation: 'Buy invitation', editorBuySubtitle: 'Check the result, then continue securely to promo code and payment.', editorPrivateUntilPurchase: 'Private until purchase', editorPrivateUntilPurchaseText: 'The preview link is available only to your account. After purchase, the invitation receives a public link.', editorReadinessCheck: 'Readiness check', editorCheckOnMobile: 'Check on mobile', editorRefreshing: 'Refreshing...', editorPreparing: 'Preparing...', editorPaymentNote: 'On the next step you can apply a promo code, see your gift, and only then continue to Stripe payment.', editorTemplatesSubtitle: 'Choose another invitation and continue editing with a new design.', editorSearchTemplate: 'Search templates...', editorTemplatesLoadError: 'Could not load templates', editorReopenHint: 'Close and reopen the editor.', editorTryAnotherSearch: 'Try another search term.', editorPaletteSubtitle: 'Choose one of {count} harmonious color systems prepared for this invitation.', editorColorSystem: 'Color system', enabled: 'enabled', disabled: 'disabled' });
Object.assign(ru, { editorCheckBasics: 'Основные данные', editorCheckVenue: 'Место события', editorCheckImage: 'Главное изображение', editorCheckMusic: 'Музыка', editorCheckRsvp: 'Ответы гостей', editorPreviewError: 'Не удалось открыть предпросмотр. Повторите попытку.', editorBuyInvitation: 'Купить приглашение', editorBuySubtitle: 'Проверьте результат и безопасно перейдите к промокоду и оплате.', editorPrivateUntilPurchase: 'Личное до покупки', editorPrivateUntilPurchaseText: 'Ссылка предпросмотра доступна только вашему аккаунту. После покупки приглашение получит публичную ссылку.', editorReadinessCheck: 'Проверка готовности', editorCheckOnMobile: 'Проверить на телефоне', editorRefreshing: 'Обновляется...', editorPreparing: 'Подготовка...', editorPaymentNote: 'На следующем шаге можно применить промокод, увидеть подарок и затем перейти к оплате Stripe.', editorTemplatesSubtitle: 'Выберите другое приглашение и продолжите редактирование с новым дизайном.', editorSearchTemplate: 'Поиск шаблонов...', editorTemplatesLoadError: 'Не удалось загрузить шаблоны', editorReopenHint: 'Закройте и снова откройте редактор.', editorTryAnotherSearch: 'Попробуйте другой поисковый запрос.', editorPaletteSubtitle: 'Выберите одну из {count} гармоничных цветовых схем для этого приглашения.', editorColorSystem: 'Цветовая схема', enabled: 'включено', disabled: 'выключено' });
Object.assign(es, { editorCheckBasics: 'Datos básicos', editorCheckVenue: 'Lugar del evento', editorCheckImage: 'Imagen principal', editorCheckMusic: 'Música', editorCheckRsvp: 'Respuestas de invitados', editorPreviewError: 'No se pudo abrir la vista previa. Inténtalo de nuevo.', editorBuyInvitation: 'Comprar invitación', editorBuySubtitle: 'Comprueba el resultado y continúa de forma segura al código promocional y al pago.', editorPrivateUntilPurchase: 'Privada hasta la compra', editorPrivateUntilPurchaseText: 'El enlace de vista previa solo está disponible para tu cuenta. Tras la compra, la invitación tendrá un enlace público.', editorReadinessCheck: 'Comprobación final', editorCheckOnMobile: 'Comprobar en móvil', editorRefreshing: 'Actualizando...', editorPreparing: 'Preparando...', editorPaymentNote: 'En el siguiente paso podrás aplicar un código promocional, ver tu regalo y después continuar al pago con Stripe.', editorTemplatesSubtitle: 'Elige otra invitación y continúa editando con un nuevo diseño.', editorSearchTemplate: 'Buscar plantillas...', editorTemplatesLoadError: 'No se pudieron cargar las plantillas', editorReopenHint: 'Cierra y vuelve a abrir el editor.', editorTryAnotherSearch: 'Prueba otra búsqueda.', editorPaletteSubtitle: 'Elige uno de los {count} sistemas de color armoniosos preparados para esta invitación.', editorColorSystem: 'Sistema de color', enabled: 'activado', disabled: 'desactivado' });
Object.assign(fr, { editorCheckBasics: 'Informations de base', editorCheckVenue: "Lieu de l’événement", editorCheckImage: 'Image principale', editorCheckMusic: 'Musique', editorCheckRsvp: 'Réponses des invités', editorPreviewError: "Impossible d’ouvrir l’aperçu. Réessayez.", editorBuyInvitation: "Acheter l’invitation", editorBuySubtitle: 'Vérifiez le résultat puis passez en toute sécurité au code promo et au paiement.', editorPrivateUntilPurchase: "Privée jusqu’à l’achat", editorPrivateUntilPurchaseText: "Le lien d’aperçu est réservé à votre compte. Après l’achat, l’invitation recevra un lien public.", editorReadinessCheck: 'Vérification finale', editorCheckOnMobile: 'Vérifier sur mobile', editorRefreshing: 'Actualisation...', editorPreparing: 'Préparation...', editorPaymentNote: "À l’étape suivante, vous pourrez appliquer un code promo, découvrir votre cadeau, puis passer au paiement Stripe.", editorTemplatesSubtitle: 'Choisissez une autre invitation et poursuivez avec un nouveau design.', editorSearchTemplate: 'Rechercher un modèle...', editorTemplatesLoadError: 'Impossible de charger les modèles', editorReopenHint: "Fermez puis rouvrez l’éditeur.", editorTryAnotherSearch: 'Essayez une autre recherche.', editorPaletteSubtitle: 'Choisissez l’une des {count} palettes harmonieuses préparées pour cette invitation.', editorColorSystem: 'Palette de couleurs', enabled: 'activé', disabled: 'désactivé' });
Object.assign(de, { editorCheckBasics: 'Grunddaten', editorCheckVenue: 'Veranstaltungsort', editorCheckImage: 'Hauptbild', editorCheckMusic: 'Musik', editorCheckRsvp: 'Gästeantworten', editorPreviewError: 'Die Vorschau konnte nicht geöffnet werden. Bitte erneut versuchen.', editorBuyInvitation: 'Einladung kaufen', editorBuySubtitle: 'Prüfen Sie das Ergebnis und gehen Sie sicher zu Aktionscode und Zahlung.', editorPrivateUntilPurchase: 'Privat bis zum Kauf', editorPrivateUntilPurchaseText: 'Der Vorschaulink ist nur für Ihr Konto verfügbar. Nach dem Kauf erhält die Einladung einen öffentlichen Link.', editorReadinessCheck: 'Bereitschaftsprüfung', editorCheckOnMobile: 'Auf Mobilgerät prüfen', editorRefreshing: 'Wird aktualisiert...', editorPreparing: 'Wird vorbereitet...', editorPaymentNote: 'Im nächsten Schritt können Sie einen Aktionscode anwenden, Ihr Geschenk sehen und danach zur Stripe-Zahlung wechseln.', editorTemplatesSubtitle: 'Wählen Sie eine andere Einladung und bearbeiten Sie sie mit einem neuen Design weiter.', editorSearchTemplate: 'Vorlagen suchen...', editorTemplatesLoadError: 'Vorlagen konnten nicht geladen werden', editorReopenHint: 'Schließen und öffnen Sie den Editor erneut.', editorTryAnotherSearch: 'Versuchen Sie einen anderen Suchbegriff.', editorPaletteSubtitle: 'Wählen Sie eines von {count} harmonischen Farbsystemen für diese Einladung.', editorColorSystem: 'Farbsystem', enabled: 'aktiviert', disabled: 'deaktiviert' });
Object.assign(it, { editorCheckBasics: 'Dati principali', editorCheckVenue: "Luogo dell’evento", editorCheckImage: 'Immagine principale', editorCheckMusic: 'Musica', editorCheckRsvp: 'Risposte degli invitati', editorPreviewError: "Impossibile aprire l’anteprima. Riprova.", editorBuyInvitation: "Acquista l’invito", editorBuySubtitle: 'Controlla il risultato e procedi in sicurezza al codice promozionale e al pagamento.', editorPrivateUntilPurchase: "Privato fino all’acquisto", editorPrivateUntilPurchaseText: "Il link di anteprima è disponibile solo per il tuo account. Dopo l’acquisto, l’invito avrà un link pubblico.", editorReadinessCheck: 'Controllo finale', editorCheckOnMobile: 'Controlla su telefono', editorRefreshing: 'Aggiornamento...', editorPreparing: 'Preparazione...', editorPaymentNote: 'Nel passaggio successivo potrai applicare un codice promozionale, vedere il regalo e poi procedere al pagamento Stripe.', editorTemplatesSubtitle: 'Scegli un altro invito e continua a modificarlo con un nuovo design.', editorSearchTemplate: 'Cerca modelli...', editorTemplatesLoadError: 'Impossibile caricare i modelli', editorReopenHint: "Chiudi e riapri l’editor.", editorTryAnotherSearch: "Prova un’altra ricerca.", editorPaletteSubtitle: 'Scegli uno dei {count} sistemi di colore armoniosi preparati per questo invito.', editorColorSystem: 'Sistema di colori', enabled: 'attivato', disabled: 'disattivato' });

Object.assign(hy, { editorWeddingTitle: 'Հարսանիքի հրավերի խմբագրում', editorBrideName: 'Հարսի անունը', editorGroomName: 'Փեսայի անունը', editorCoupleNames: 'Զույգի անունների տեսքը', editorWeddingMessage: 'Հարսանեկան հրավերի տեքստ', editorEngagementTitle: 'Նշանադրության հրավերի խմբագրում', editorFirstName: 'Առաջին անունը', editorSecondName: 'Երկրորդ անունը', editorEngagementMessage: 'Նշանադրության հրավերի տեքստ', editorBaptismTitle: 'Մկրտության հրավերի խմբագրում', editorChildName: 'Երեխայի անունը', editorBaptismMessage: 'Մկրտության հրավերի տեքստ', editorBirthdayTitle: 'Ծննդյան հրավերի խմբագրում', editorCelebrantName: 'Հոբելյարի անունը', editorBirthdayMessage: 'Ծննդյան հրավերի տեքստ', editorCorporateTitle: 'Կորպորատիվ հրավերի խմբագրում', editorEventName: 'Միջոցառման անվանումը', editorCorporateMessage: 'Կորպորատիվ հրավերի տեքստ', editorVenue: 'Վայր', editorChurch: 'Եկեղեցի', editorHome: 'Տուն', editorParty: 'Հանդիսություն', editorPhotoSession: 'Ֆոտոսեսիա', editorTemplateTexts: 'Ձևանմուշի տեքստեր', editorText: 'Տեքստ', editorSessionSubtitle: 'Փոփոխությունները ժամանակավոր են և անմիջապես երևում են նախադիտման մեջ։', editorMainScreen: 'Գլխավոր էկրան', editorShowOpening: 'Ցուցադրել բացման հաղորդագրությունը', editorOpeningMessage: 'Բացման հաղորդագրություն', editorFamilies: 'Ընտանիքներ և մասնակիցներ', editorFirstFamilyText: 'Առաջին ընտանիքի տեքստ', editorFamilyText: 'Ընտանիքի տեքստ', editorSecondFamilyText: 'Երկրորդ ընտանիքի տեքստ', optional: 'ըստ ցանկության', editorAllTemplateTexts: 'Ձևանմուշի բոլոր տեքստերը', editorDateTimeSchedule: 'Օր, ժամ և ծրագիր', editorMainTime: 'Հիմնական ժամ', editorEventSchedule: 'Միջոցառման ծրագիր', add: 'Ավելացնել', moveUp: 'Տեղափոխել վեր', moveDown: 'Տեղափոխել վար', show: 'ցուցադրել', editorDeleteVenue: 'Ջնջել վայրը', name: 'Անվանում', time: 'Ժամ', type: 'Տեսակ', subtitle: 'Ենթավերնագիր', address: 'Հասցե', editorGoogleMapsLink: 'Google Maps հղում', editorRsvp: 'Մասնակցության հաստատում', editorSectionTitle: 'Բաժնի վերնագիր', description: 'Բացատրություն', editorResponseDeadline: 'Պատասխանելու վերջնաժամկետ', editorGuestNameHint: 'Հյուրի անվան հուշում', editorAttendingOption: 'Մասնակցելու տարբերակ', editorNotAttendingOption: 'Չմասնակցելու տարբերակ', editorButtonText: 'Կոճակի տեքստ', editorExtraQuestion: 'Լրացուցիչ հարց կամ նշում', editorAskGuestCount: 'Հարցնել հյուրերի թիվը', editorAskMeal: 'Հարցնել սննդի նախընտրությունը', editorMealPreference: 'Սննդի նախընտրություն', editorDressCode: 'Հագուստի կանոնակարգ', editorClosingWords: 'Եզրափակիչ խոսք', editorClosingMessage: 'Եզրափակիչ հաղորդագրություն' });
Object.assign(en, { editorWeddingTitle: 'Edit wedding invitation', editorBrideName: "Bride's name", editorGroomName: "Groom's name", editorCoupleNames: "Couple's name display", editorWeddingMessage: 'Wedding invitation text', editorEngagementTitle: 'Edit engagement invitation', editorFirstName: 'First name', editorSecondName: 'Second name', editorEngagementMessage: 'Engagement invitation text', editorBaptismTitle: 'Edit baptism invitation', editorChildName: "Child's name", editorBaptismMessage: 'Baptism invitation text', editorBirthdayTitle: 'Edit birthday invitation', editorCelebrantName: "Celebrant's name", editorBirthdayMessage: 'Birthday invitation text', editorCorporateTitle: 'Edit corporate invitation', editorEventName: 'Event name', editorCorporateMessage: 'Corporate invitation text', editorVenue: 'Venue', editorChurch: 'Church', editorHome: 'Home', editorParty: 'Celebration', editorPhotoSession: 'Photo session', editorTemplateTexts: 'Template texts', editorText: 'Text', editorSessionSubtitle: 'Changes are temporary and appear in the preview immediately.', editorMainScreen: 'Main screen', editorShowOpening: 'Show opening message', editorOpeningMessage: 'Opening message', editorFamilies: 'Families and participants', editorFirstFamilyText: 'First family text', editorFamilyText: 'Family text', editorSecondFamilyText: 'Second family text', optional: 'optional', editorAllTemplateTexts: 'All template texts', editorDateTimeSchedule: 'Date, time and schedule', editorMainTime: 'Main time', editorEventSchedule: 'Event schedule', add: 'Add', moveUp: 'Move up', moveDown: 'Move down', show: 'show', editorDeleteVenue: 'Delete venue', name: 'Name', time: 'Time', type: 'Type', subtitle: 'Subtitle', address: 'Address', editorGoogleMapsLink: 'Google Maps link', editorRsvp: 'Attendance confirmation', editorSectionTitle: 'Section title', description: 'Description', editorResponseDeadline: 'Response deadline', editorGuestNameHint: 'Guest name placeholder', editorAttendingOption: 'Attending option', editorNotAttendingOption: 'Not attending option', editorButtonText: 'Button text', editorExtraQuestion: 'Additional question or note', editorAskGuestCount: 'Ask for guest count', editorAskMeal: 'Ask for meal preference', editorMealPreference: 'Meal preference', editorDressCode: 'Dress code', editorClosingWords: 'Closing words', editorClosingMessage: 'Closing message' });
Object.assign(ru, { editorWeddingTitle: 'Редактирование свадебного приглашения', editorBrideName: 'Имя невесты', editorGroomName: 'Имя жениха', editorCoupleNames: 'Отображение имён пары', editorWeddingMessage: 'Текст свадебного приглашения', editorEngagementTitle: 'Редактирование приглашения на помолвку', editorFirstName: 'Первое имя', editorSecondName: 'Второе имя', editorEngagementMessage: 'Текст приглашения на помолвку', editorBaptismTitle: 'Редактирование приглашения на крещение', editorChildName: 'Имя ребёнка', editorBaptismMessage: 'Текст приглашения на крещение', editorBirthdayTitle: 'Редактирование приглашения на день рождения', editorCelebrantName: 'Имя именинника', editorBirthdayMessage: 'Текст приглашения на день рождения', editorCorporateTitle: 'Редактирование корпоративного приглашения', editorEventName: 'Название мероприятия', editorCorporateMessage: 'Текст корпоративного приглашения', editorVenue: 'Место', editorChurch: 'Церковь', editorHome: 'Дом', editorParty: 'Торжество', editorPhotoSession: 'Фотосессия', editorTemplateTexts: 'Тексты шаблона', editorText: 'Текст', editorSessionSubtitle: 'Изменения временные и сразу видны в предпросмотре.', editorMainScreen: 'Главный экран', editorShowOpening: 'Показывать вступительное сообщение', editorOpeningMessage: 'Вступительное сообщение', editorFamilies: 'Семьи и участники', editorFirstFamilyText: 'Текст первой семьи', editorFamilyText: 'Текст семьи', editorSecondFamilyText: 'Текст второй семьи', optional: 'необязательно', editorAllTemplateTexts: 'Все тексты шаблона', editorDateTimeSchedule: 'Дата, время и программа', editorMainTime: 'Основное время', editorEventSchedule: 'Программа мероприятия', add: 'Добавить', moveUp: 'Переместить вверх', moveDown: 'Переместить вниз', show: 'показывать', editorDeleteVenue: 'Удалить место', name: 'Название', time: 'Время', type: 'Тип', subtitle: 'Подзаголовок', address: 'Адрес', editorGoogleMapsLink: 'Ссылка Google Maps', editorRsvp: 'Подтверждение участия', editorSectionTitle: 'Заголовок раздела', description: 'Описание', editorResponseDeadline: 'Срок ответа', editorGuestNameHint: 'Подсказка для имени гостя', editorAttendingOption: 'Вариант участия', editorNotAttendingOption: 'Вариант отказа', editorButtonText: 'Текст кнопки', editorExtraQuestion: 'Дополнительный вопрос или примечание', editorAskGuestCount: 'Спросить количество гостей', editorAskMeal: 'Спросить предпочтение в еде', editorMealPreference: 'Предпочтение в еде', editorDressCode: 'Дресс-код', editorClosingWords: 'Заключительные слова', editorClosingMessage: 'Заключительное сообщение' });
Object.assign(es, { editorWeddingTitle: 'Editar invitación de boda', editorBrideName: 'Nombre de la novia', editorGroomName: 'Nombre del novio', editorCoupleNames: 'Presentación de los nombres', editorWeddingMessage: 'Texto de invitación de boda', editorEngagementTitle: 'Editar invitación de compromiso', editorFirstName: 'Primer nombre', editorSecondName: 'Segundo nombre', editorEngagementMessage: 'Texto de invitación de compromiso', editorBaptismTitle: 'Editar invitación de bautizo', editorChildName: 'Nombre del niño', editorBaptismMessage: 'Texto de invitación de bautizo', editorBirthdayTitle: 'Editar invitación de cumpleaños', editorCelebrantName: 'Nombre del homenajeado', editorBirthdayMessage: 'Texto de invitación de cumpleaños', editorCorporateTitle: 'Editar invitación corporativa', editorEventName: 'Nombre del evento', editorCorporateMessage: 'Texto de invitación corporativa', editorVenue: 'Lugar', editorChurch: 'Iglesia', editorHome: 'Casa', editorParty: 'Celebración', editorPhotoSession: 'Sesión de fotos', editorTemplateTexts: 'Textos de la plantilla', editorText: 'Texto', editorSessionSubtitle: 'Los cambios son temporales y aparecen de inmediato en la vista previa.', editorMainScreen: 'Pantalla principal', editorShowOpening: 'Mostrar mensaje de apertura', editorOpeningMessage: 'Mensaje de apertura', editorFamilies: 'Familias y participantes', editorFirstFamilyText: 'Texto de la primera familia', editorFamilyText: 'Texto de la familia', editorSecondFamilyText: 'Texto de la segunda familia', optional: 'opcional', editorAllTemplateTexts: 'Todos los textos de la plantilla', editorDateTimeSchedule: 'Fecha, hora y programa', editorMainTime: 'Hora principal', editorEventSchedule: 'Programa del evento', add: 'Añadir', moveUp: 'Subir', moveDown: 'Bajar', show: 'mostrar', editorDeleteVenue: 'Eliminar lugar', name: 'Nombre', time: 'Hora', type: 'Tipo', subtitle: 'Subtítulo', address: 'Dirección', editorGoogleMapsLink: 'Enlace de Google Maps', editorRsvp: 'Confirmación de asistencia', editorSectionTitle: 'Título de la sección', description: 'Descripción', editorResponseDeadline: 'Fecha límite de respuesta', editorGuestNameHint: 'Indicación para el nombre', editorAttendingOption: 'Opción de asistencia', editorNotAttendingOption: 'Opción de no asistencia', editorButtonText: 'Texto del botón', editorExtraQuestion: 'Pregunta o nota adicional', editorAskGuestCount: 'Preguntar número de invitados', editorAskMeal: 'Preguntar preferencia de comida', editorMealPreference: 'Preferencia de comida', editorDressCode: 'Código de vestimenta', editorClosingWords: 'Palabras finales', editorClosingMessage: 'Mensaje final' });
Object.assign(fr, { editorWeddingTitle: "Modifier l’invitation de mariage", editorBrideName: 'Nom de la mariée', editorGroomName: 'Nom du marié', editorCoupleNames: 'Affichage des noms du couple', editorWeddingMessage: "Texte de l’invitation de mariage", editorEngagementTitle: "Modifier l’invitation de fiançailles", editorFirstName: 'Premier prénom', editorSecondName: 'Deuxième prénom', editorEngagementMessage: "Texte de l’invitation de fiançailles", editorBaptismTitle: "Modifier l’invitation de baptême", editorChildName: "Nom de l’enfant", editorBaptismMessage: "Texte de l’invitation de baptême", editorBirthdayTitle: "Modifier l’invitation d’anniversaire", editorCelebrantName: 'Nom de la personne célébrée', editorBirthdayMessage: "Texte de l’invitation d’anniversaire", editorCorporateTitle: "Modifier l’invitation professionnelle", editorEventName: "Nom de l’événement", editorCorporateMessage: "Texte de l’invitation professionnelle", editorVenue: 'Lieu', editorChurch: 'Église', editorHome: 'Domicile', editorParty: 'Célébration', editorPhotoSession: 'Séance photo', editorTemplateTexts: 'Textes du modèle', editorText: 'Texte', editorSessionSubtitle: "Les modifications sont temporaires et apparaissent immédiatement dans l’aperçu.", editorMainScreen: 'Écran principal', editorShowOpening: "Afficher le message d’ouverture", editorOpeningMessage: "Message d’ouverture", editorFamilies: 'Familles et participants', editorFirstFamilyText: 'Texte de la première famille', editorFamilyText: 'Texte de la famille', editorSecondFamilyText: 'Texte de la deuxième famille', optional: 'facultatif', editorAllTemplateTexts: 'Tous les textes du modèle', editorDateTimeSchedule: 'Date, heure et programme', editorMainTime: 'Heure principale', editorEventSchedule: "Programme de l’événement", add: 'Ajouter', moveUp: 'Monter', moveDown: 'Descendre', show: 'afficher', editorDeleteVenue: 'Supprimer le lieu', name: 'Nom', time: 'Heure', type: 'Type', subtitle: 'Sous-titre', address: 'Adresse', editorGoogleMapsLink: 'Lien Google Maps', editorRsvp: 'Confirmation de présence', editorSectionTitle: 'Titre de la section', description: 'Description', editorResponseDeadline: 'Date limite de réponse', editorGuestNameHint: 'Indication pour le nom', editorAttendingOption: 'Option de présence', editorNotAttendingOption: "Option d’absence", editorButtonText: 'Texte du bouton', editorExtraQuestion: 'Question ou note supplémentaire', editorAskGuestCount: "Demander le nombre d’invités", editorAskMeal: 'Demander la préférence de repas', editorMealPreference: 'Préférence de repas', editorDressCode: 'Code vestimentaire', editorClosingWords: 'Mot de clôture', editorClosingMessage: 'Message de clôture' });
Object.assign(de, { editorWeddingTitle: 'Hochzeitseinladung bearbeiten', editorBrideName: 'Name der Braut', editorGroomName: 'Name des Bräutigams', editorCoupleNames: 'Darstellung der Paarnamen', editorWeddingMessage: 'Text der Hochzeitseinladung', editorEngagementTitle: 'Verlobungseinladung bearbeiten', editorFirstName: 'Erster Name', editorSecondName: 'Zweiter Name', editorEngagementMessage: 'Text der Verlobungseinladung', editorBaptismTitle: 'Taufeinladung bearbeiten', editorChildName: 'Name des Kindes', editorBaptismMessage: 'Text der Taufeinladung', editorBirthdayTitle: 'Geburtstagseinladung bearbeiten', editorCelebrantName: 'Name des Geburtstagskindes', editorBirthdayMessage: 'Text der Geburtstagseinladung', editorCorporateTitle: 'Firmeneinladung bearbeiten', editorEventName: 'Name der Veranstaltung', editorCorporateMessage: 'Text der Firmeneinladung', editorVenue: 'Ort', editorChurch: 'Kirche', editorHome: 'Zuhause', editorParty: 'Feier', editorPhotoSession: 'Fotoshooting', editorTemplateTexts: 'Vorlagentexte', editorText: 'Text', editorSessionSubtitle: 'Änderungen sind vorübergehend und sofort in der Vorschau sichtbar.', editorMainScreen: 'Hauptbildschirm', editorShowOpening: 'Eröffnungsnachricht anzeigen', editorOpeningMessage: 'Eröffnungsnachricht', editorFamilies: 'Familien und Beteiligte', editorFirstFamilyText: 'Text der ersten Familie', editorFamilyText: 'Familientext', editorSecondFamilyText: 'Text der zweiten Familie', optional: 'optional', editorAllTemplateTexts: 'Alle Vorlagentexte', editorDateTimeSchedule: 'Datum, Uhrzeit und Ablauf', editorMainTime: 'Hauptzeit', editorEventSchedule: 'Veranstaltungsablauf', add: 'Hinzufügen', moveUp: 'Nach oben', moveDown: 'Nach unten', show: 'anzeigen', editorDeleteVenue: 'Ort löschen', name: 'Name', time: 'Uhrzeit', type: 'Typ', subtitle: 'Untertitel', address: 'Adresse', editorGoogleMapsLink: 'Google-Maps-Link', editorRsvp: 'Teilnahmebestätigung', editorSectionTitle: 'Bereichsüberschrift', description: 'Beschreibung', editorResponseDeadline: 'Antwortfrist', editorGuestNameHint: 'Hinweis für den Gästenamen', editorAttendingOption: 'Teilnahmeoption', editorNotAttendingOption: 'Absageoption', editorButtonText: 'Buttontext', editorExtraQuestion: 'Zusätzliche Frage oder Notiz', editorAskGuestCount: 'Anzahl der Gäste abfragen', editorAskMeal: 'Essenswunsch abfragen', editorMealPreference: 'Essenswunsch', editorDressCode: 'Dresscode', editorClosingWords: 'Schlussworte', editorClosingMessage: 'Schlussnachricht' });
Object.assign(it, { editorWeddingTitle: "Modifica invito di nozze", editorBrideName: 'Nome della sposa', editorGroomName: 'Nome dello sposo', editorCoupleNames: 'Visualizzazione dei nomi', editorWeddingMessage: "Testo dell’invito di nozze", editorEngagementTitle: "Modifica invito di fidanzamento", editorFirstName: 'Primo nome', editorSecondName: 'Secondo nome', editorEngagementMessage: "Testo dell’invito di fidanzamento", editorBaptismTitle: "Modifica invito di battesimo", editorChildName: 'Nome del bambino', editorBaptismMessage: "Testo dell’invito di battesimo", editorBirthdayTitle: "Modifica invito di compleanno", editorCelebrantName: 'Nome del festeggiato', editorBirthdayMessage: "Testo dell’invito di compleanno", editorCorporateTitle: "Modifica invito aziendale", editorEventName: "Nome dell’evento", editorCorporateMessage: "Testo dell’invito aziendale", editorVenue: 'Luogo', editorChurch: 'Chiesa', editorHome: 'Casa', editorParty: 'Celebrazione', editorPhotoSession: 'Servizio fotografico', editorTemplateTexts: 'Testi del modello', editorText: 'Testo', editorSessionSubtitle: "Le modifiche sono temporanee e appaiono subito nell’anteprima.", editorMainScreen: 'Schermata principale', editorShowOpening: 'Mostra messaggio iniziale', editorOpeningMessage: 'Messaggio iniziale', editorFamilies: 'Famiglie e partecipanti', editorFirstFamilyText: 'Testo della prima famiglia', editorFamilyText: 'Testo della famiglia', editorSecondFamilyText: 'Testo della seconda famiglia', optional: 'facoltativo', editorAllTemplateTexts: 'Tutti i testi del modello', editorDateTimeSchedule: 'Data, ora e programma', editorMainTime: 'Ora principale', editorEventSchedule: "Programma dell’evento", add: 'Aggiungi', moveUp: 'Sposta su', moveDown: 'Sposta giù', show: 'mostra', editorDeleteVenue: 'Elimina luogo', name: 'Nome', time: 'Ora', type: 'Tipo', subtitle: 'Sottotitolo', address: 'Indirizzo', editorGoogleMapsLink: 'Link Google Maps', editorRsvp: 'Conferma di partecipazione', editorSectionTitle: 'Titolo della sezione', description: 'Descrizione', editorResponseDeadline: 'Scadenza risposta', editorGuestNameHint: 'Suggerimento per il nome', editorAttendingOption: 'Opzione di partecipazione', editorNotAttendingOption: 'Opzione di non partecipazione', editorButtonText: 'Testo del pulsante', editorExtraQuestion: 'Domanda o nota aggiuntiva', editorAskGuestCount: 'Chiedi il numero di invitati', editorAskMeal: 'Chiedi la preferenza del pasto', editorMealPreference: 'Preferenza del pasto', editorDressCode: 'Codice di abbigliamento', editorClosingWords: 'Parole finali', editorClosingMessage: 'Messaggio finale' });

Object.assign(hy, { editorMySong: 'Իմ երգը', editorUploadedSong: 'Վերբեռնված երգ', editorAudioPlayError: 'Երգը չհաջողվեց նվագարկել։', editorMaxSongsError: 'Կարելի է վերբեռնել առավելագույնը 3 երգ։', editorAudioTypeError: 'Օգտագործեք MP3, WAV, OGG կամ M4A երգ։', editorAudioSizeError: 'Երգի առավելագույն չափը 5 MB է։', editorYourSong: 'Ձեր երգը', editorAudioUploadError: 'Երգը չհաջողվեց վերբեռնել։', editorImageUploadError: 'Նկարը չհաջողվեց վերբեռնել։', editorMediaMusic: 'Մեդիա և երաժշտություն', editorMediaSubtitle: 'Վերբեռնեք լուսանկարներ և ընտրեք ֆոնային երգ։', editorImageOrder: 'Նկարների հերթականություն', editorInvitationImage: 'Հրավերի նկար', replace: 'Փոխարինել', upload: 'Վերբեռնել', image: 'Նկար', editorUploadNewImage: 'Վերբեռնել նոր նկար', editorReplaceDeletedImage: 'Սեղմեք՝ ջնջված նկարը փոխարինելու համար', delete: 'Ջնջել', editorImageOrderHint: 'Նկարները ցուցադրված են հրավերի հերթականությամբ։ Սեղմեք նկարի կամ դատարկ տեղի վրա՝ այն անմիջապես փոխարինելու համար։', music: 'Երաժշտություն', editorSearchMusic: 'Որոնել երաժշտություն', editorSearchMusicPlaceholder: 'Գրել երգի կամ կատարողի անունը...', pause: 'Դադարեցնել', listen: 'Լսել', editorNoSongFound: 'Երգ չի գտնվել', editorTryOrUploadSong: 'Փորձեք այլ անուն կամ վերբեռնեք Ձեր երգը։', editorYourUploads: 'Ձեր վերբեռնումները', songs: 'երգ', editorUploadSong: 'Վերբեռնել երգ', editorAudioRequirements: 'MP3, WAV, OGG կամ M4A · մինչև 5 MB', mediaFileReadError: 'Ֆայլը չհաջողվեց կարդալ։', mediaImageTypeError: 'Օգտագործեք JPG, PNG կամ WEBP նկար։', mediaImageSizeError: 'Նկարի առավելագույն չափը 5 MB է։', mediaImageProcessError: 'Նկարը չհաջողվեց մշակել։', mediaImageStorageError: 'Նկարը չափազանց մեծ է պահպանելու համար։' });
Object.assign(en, { editorMySong: 'My song', editorUploadedSong: 'Uploaded song', editorAudioPlayError: 'The song could not be played.', editorMaxSongsError: 'You can upload up to 3 songs.', editorAudioTypeError: 'Use an MP3, WAV, OGG, or M4A file.', editorAudioSizeError: 'The maximum song size is 5 MB.', editorYourSong: 'Your song', editorAudioUploadError: 'The song could not be uploaded.', editorImageUploadError: 'The image could not be uploaded.', editorMediaMusic: 'Media and music', editorMediaSubtitle: 'Upload photos and choose background music.', editorImageOrder: 'Image order', editorInvitationImage: 'Invitation image', replace: 'Replace', upload: 'Upload', image: 'Image', editorUploadNewImage: 'Upload a new image', editorReplaceDeletedImage: 'Click to replace the removed image', delete: 'Delete', editorImageOrderHint: 'Images appear in invitation order. Click an image or empty area to replace it immediately.', music: 'Music', editorSearchMusic: 'Search music', editorSearchMusicPlaceholder: 'Enter a song or artist name...', pause: 'Pause', listen: 'Listen to', editorNoSongFound: 'No song found', editorTryOrUploadSong: 'Try another name or upload your song.', editorYourUploads: 'Your uploads', songs: 'songs', editorUploadSong: 'Upload song', editorAudioRequirements: 'MP3, WAV, OGG, or M4A · up to 5 MB', mediaFileReadError: 'The file could not be read.', mediaImageTypeError: 'Use a JPG, PNG, or WEBP image.', mediaImageSizeError: 'The maximum image size is 5 MB.', mediaImageProcessError: 'The image could not be processed.', mediaImageStorageError: 'The image is too large to store.' });
Object.assign(ru, { editorMySong: 'Моя песня', editorUploadedSong: 'Загруженная песня', editorAudioPlayError: 'Не удалось воспроизвести песню.', editorMaxSongsError: 'Можно загрузить не более 3 песен.', editorAudioTypeError: 'Используйте MP3, WAV, OGG или M4A.', editorAudioSizeError: 'Максимальный размер песни — 5 МБ.', editorYourSong: 'Ваша песня', editorAudioUploadError: 'Не удалось загрузить песню.', editorImageUploadError: 'Не удалось загрузить изображение.', editorMediaMusic: 'Медиа и музыка', editorMediaSubtitle: 'Загрузите фотографии и выберите фоновую музыку.', editorImageOrder: 'Порядок изображений', editorInvitationImage: 'Изображение приглашения', replace: 'Заменить', upload: 'Загрузить', image: 'Изображение', editorUploadNewImage: 'Загрузить новое изображение', editorReplaceDeletedImage: 'Нажмите, чтобы заменить удалённое изображение', delete: 'Удалить', editorImageOrderHint: 'Изображения показаны в порядке приглашения. Нажмите на изображение или пустое место, чтобы сразу заменить его.', music: 'Музыка', editorSearchMusic: 'Поиск музыки', editorSearchMusicPlaceholder: 'Введите название песни или исполнителя...', pause: 'Остановить', listen: 'Слушать', editorNoSongFound: 'Песня не найдена', editorTryOrUploadSong: 'Попробуйте другое название или загрузите свою песню.', editorYourUploads: 'Ваши загрузки', songs: 'песен', editorUploadSong: 'Загрузить песню', editorAudioRequirements: 'MP3, WAV, OGG или M4A · до 5 МБ', mediaFileReadError: 'Не удалось прочитать файл.', mediaImageTypeError: 'Используйте JPG, PNG или WEBP.', mediaImageSizeError: 'Максимальный размер изображения — 5 МБ.', mediaImageProcessError: 'Не удалось обработать изображение.', mediaImageStorageError: 'Изображение слишком велико для хранения.' });
Object.assign(es, { editorMySong: 'Mi canción', editorUploadedSong: 'Canción subida', editorAudioPlayError: 'No se pudo reproducir la canción.', editorMaxSongsError: 'Puedes subir un máximo de 3 canciones.', editorAudioTypeError: 'Usa un archivo MP3, WAV, OGG o M4A.', editorAudioSizeError: 'El tamaño máximo es de 5 MB.', editorYourSong: 'Tu canción', editorAudioUploadError: 'No se pudo subir la canción.', editorImageUploadError: 'No se pudo subir la imagen.', editorMediaMusic: 'Multimedia y música', editorMediaSubtitle: 'Sube fotos y elige música de fondo.', editorImageOrder: 'Orden de imágenes', editorInvitationImage: 'Imagen de la invitación', replace: 'Reemplazar', upload: 'Subir', image: 'Imagen', editorUploadNewImage: 'Subir una imagen nueva', editorReplaceDeletedImage: 'Pulsa para reemplazar la imagen eliminada', delete: 'Eliminar', editorImageOrderHint: 'Las imágenes aparecen en el orden de la invitación. Pulsa una imagen o un espacio vacío para reemplazarla.', music: 'Música', editorSearchMusic: 'Buscar música', editorSearchMusicPlaceholder: 'Escribe una canción o artista...', pause: 'Pausar', listen: 'Escuchar', editorNoSongFound: 'No se encontró ninguna canción', editorTryOrUploadSong: 'Prueba otro nombre o sube tu canción.', editorYourUploads: 'Tus archivos', songs: 'canciones', editorUploadSong: 'Subir canción', editorAudioRequirements: 'MP3, WAV, OGG o M4A · hasta 5 MB', mediaFileReadError: 'No se pudo leer el archivo.', mediaImageTypeError: 'Usa una imagen JPG, PNG o WEBP.', mediaImageSizeError: 'El tamaño máximo de imagen es de 5 MB.', mediaImageProcessError: 'No se pudo procesar la imagen.', mediaImageStorageError: 'La imagen es demasiado grande para guardarla.' });
Object.assign(fr, { editorMySong: 'Ma chanson', editorUploadedSong: 'Chanson importée', editorAudioPlayError: 'Impossible de lire la chanson.', editorMaxSongsError: 'Vous pouvez importer jusqu’à 3 chansons.', editorAudioTypeError: 'Utilisez un fichier MP3, WAV, OGG ou M4A.', editorAudioSizeError: 'La taille maximale est de 5 Mo.', editorYourSong: 'Votre chanson', editorAudioUploadError: 'Impossible d’importer la chanson.', editorImageUploadError: 'Impossible d’importer l’image.', editorMediaMusic: 'Médias et musique', editorMediaSubtitle: 'Importez des photos et choisissez une musique de fond.', editorImageOrder: 'Ordre des images', editorInvitationImage: "Image de l’invitation", replace: 'Remplacer', upload: 'Importer', image: 'Image', editorUploadNewImage: 'Importer une nouvelle image', editorReplaceDeletedImage: "Cliquez pour remplacer l’image supprimée", delete: 'Supprimer', editorImageOrderHint: "Les images suivent l’ordre de l’invitation. Cliquez sur une image ou un espace vide pour la remplacer.", music: 'Musique', editorSearchMusic: 'Rechercher de la musique', editorSearchMusicPlaceholder: 'Saisissez une chanson ou un artiste...', pause: 'Pause', listen: 'Écouter', editorNoSongFound: 'Aucune chanson trouvée', editorTryOrUploadSong: 'Essayez un autre nom ou importez votre chanson.', editorYourUploads: 'Vos imports', songs: 'chansons', editorUploadSong: 'Importer une chanson', editorAudioRequirements: 'MP3, WAV, OGG ou M4A · jusqu’à 5 Mo', mediaFileReadError: 'Impossible de lire le fichier.', mediaImageTypeError: 'Utilisez une image JPG, PNG ou WEBP.', mediaImageSizeError: "La taille maximale de l’image est de 5 Mo.", mediaImageProcessError: "Impossible de traiter l’image.", mediaImageStorageError: "L’image est trop volumineuse pour être enregistrée." });
Object.assign(de, { editorMySong: 'Mein Lied', editorUploadedSong: 'Hochgeladenes Lied', editorAudioPlayError: 'Das Lied konnte nicht abgespielt werden.', editorMaxSongsError: 'Sie können bis zu 3 Lieder hochladen.', editorAudioTypeError: 'Verwenden Sie MP3, WAV, OGG oder M4A.', editorAudioSizeError: 'Die maximale Größe beträgt 5 MB.', editorYourSong: 'Ihr Lied', editorAudioUploadError: 'Das Lied konnte nicht hochgeladen werden.', editorImageUploadError: 'Das Bild konnte nicht hochgeladen werden.', editorMediaMusic: 'Medien und Musik', editorMediaSubtitle: 'Laden Sie Fotos hoch und wählen Sie Hintergrundmusik.', editorImageOrder: 'Bildreihenfolge', editorInvitationImage: 'Einladungsbild', replace: 'Ersetzen', upload: 'Hochladen', image: 'Bild', editorUploadNewImage: 'Neues Bild hochladen', editorReplaceDeletedImage: 'Klicken, um das entfernte Bild zu ersetzen', delete: 'Löschen', editorImageOrderHint: 'Die Bilder erscheinen in Einladungsreihenfolge. Klicken Sie auf ein Bild oder eine leere Stelle, um es zu ersetzen.', music: 'Musik', editorSearchMusic: 'Musik suchen', editorSearchMusicPlaceholder: 'Lied oder Interpret eingeben...', pause: 'Pause', listen: 'Anhören', editorNoSongFound: 'Kein Lied gefunden', editorTryOrUploadSong: 'Versuchen Sie einen anderen Namen oder laden Sie Ihr Lied hoch.', editorYourUploads: 'Ihre Uploads', songs: 'Lieder', editorUploadSong: 'Lied hochladen', editorAudioRequirements: 'MP3, WAV, OGG oder M4A · bis 5 MB', mediaFileReadError: 'Die Datei konnte nicht gelesen werden.', mediaImageTypeError: 'Verwenden Sie ein JPG-, PNG- oder WEBP-Bild.', mediaImageSizeError: 'Die maximale Bildgröße beträgt 5 MB.', mediaImageProcessError: 'Das Bild konnte nicht verarbeitet werden.', mediaImageStorageError: 'Das Bild ist zu groß zum Speichern.' });
Object.assign(it, { editorMySong: 'La mia canzone', editorUploadedSong: 'Canzone caricata', editorAudioPlayError: 'Impossibile riprodurre la canzone.', editorMaxSongsError: 'Puoi caricare fino a 3 canzoni.', editorAudioTypeError: 'Usa un file MP3, WAV, OGG o M4A.', editorAudioSizeError: 'La dimensione massima è 5 MB.', editorYourSong: 'La tua canzone', editorAudioUploadError: 'Impossibile caricare la canzone.', editorImageUploadError: "Impossibile caricare l’immagine.", editorMediaMusic: 'Media e musica', editorMediaSubtitle: 'Carica foto e scegli la musica di sottofondo.', editorImageOrder: 'Ordine delle immagini', editorInvitationImage: "Immagine dell’invito", replace: 'Sostituisci', upload: 'Carica', image: 'Immagine', editorUploadNewImage: 'Carica una nuova immagine', editorReplaceDeletedImage: "Fai clic per sostituire l’immagine rimossa", delete: 'Elimina', editorImageOrderHint: "Le immagini seguono l’ordine dell’invito. Fai clic su un’immagine o uno spazio vuoto per sostituirla.", music: 'Musica', editorSearchMusic: 'Cerca musica', editorSearchMusicPlaceholder: 'Inserisci una canzone o un artista...', pause: 'Pausa', listen: 'Ascolta', editorNoSongFound: 'Nessuna canzone trovata', editorTryOrUploadSong: 'Prova un altro nome o carica la tua canzone.', editorYourUploads: 'I tuoi caricamenti', songs: 'canzoni', editorUploadSong: 'Carica canzone', editorAudioRequirements: 'MP3, WAV, OGG o M4A · fino a 5 MB', mediaFileReadError: 'Impossibile leggere il file.', mediaImageTypeError: 'Usa un’immagine JPG, PNG o WEBP.', mediaImageSizeError: "La dimensione massima dell’immagine è 5 MB.", mediaImageProcessError: "Impossibile elaborare l’immagine.", mediaImageStorageError: "L’immagine è troppo grande per essere salvata." });

Object.assign(hy, { map: 'Քարտեզ', editorChangeImage: 'Փոխել նկարը', editorEditMap: 'Խմբագրել քարտեզը', editorEditSection: 'Խմբագրել այս հատվածը', editorHeroImage: 'Գլխավոր բաժնի նկար', editorGalleryImage: 'Պատկերասրահի նկար', editorParticipantImage: 'Մասնակցի կամ ընտանիքի նկար', editorVenueImage: 'Միջոցառման վայրի նկար', editorClosingImage: 'Եզրափակիչ բաժնի նկար' });
Object.assign(en, { map: 'Map', editorChangeImage: 'Change image', editorEditMap: 'Edit map', editorEditSection: 'Edit this section', editorHeroImage: 'Main section image', editorGalleryImage: 'Gallery image', editorParticipantImage: 'Participant or family image', editorVenueImage: 'Event venue image', editorClosingImage: 'Closing section image' });
Object.assign(ru, { map: 'Карта', editorChangeImage: 'Изменить изображение', editorEditMap: 'Редактировать карту', editorEditSection: 'Редактировать этот раздел', editorHeroImage: 'Изображение главного раздела', editorGalleryImage: 'Изображение галереи', editorParticipantImage: 'Фото участника или семьи', editorVenueImage: 'Изображение места события', editorClosingImage: 'Изображение заключительного раздела' });
Object.assign(es, { map: 'Mapa', editorChangeImage: 'Cambiar imagen', editorEditMap: 'Editar mapa', editorEditSection: 'Editar esta sección', editorHeroImage: 'Imagen de la sección principal', editorGalleryImage: 'Imagen de galería', editorParticipantImage: 'Imagen del participante o familia', editorVenueImage: 'Imagen del lugar del evento', editorClosingImage: 'Imagen de la sección final' });
Object.assign(fr, { map: 'Carte', editorChangeImage: "Changer l’image", editorEditMap: 'Modifier la carte', editorEditSection: 'Modifier cette section', editorHeroImage: 'Image de la section principale', editorGalleryImage: 'Image de galerie', editorParticipantImage: 'Image du participant ou de la famille', editorVenueImage: "Image du lieu de l’événement", editorClosingImage: 'Image de la section finale' });
Object.assign(de, { map: 'Karte', editorChangeImage: 'Bild ändern', editorEditMap: 'Karte bearbeiten', editorEditSection: 'Diesen Bereich bearbeiten', editorHeroImage: 'Bild des Hauptbereichs', editorGalleryImage: 'Galeriebild', editorParticipantImage: 'Teilnehmer- oder Familienbild', editorVenueImage: 'Bild des Veranstaltungsorts', editorClosingImage: 'Bild des Schlussbereichs' });
Object.assign(it, { map: 'Mappa', editorChangeImage: 'Cambia immagine', editorEditMap: 'Modifica mappa', editorEditSection: 'Modifica questa sezione', editorHeroImage: 'Immagine della sezione principale', editorGalleryImage: 'Immagine della galleria', editorParticipantImage: 'Immagine del partecipante o della famiglia', editorVenueImage: "Immagine del luogo dell’evento", editorClosingImage: 'Immagine della sezione finale' });

Object.assign(hy, { editorCarouselImages: 'Կարուսելի նկարներ', editorCarouselImagesHint: 'Այս նկարները հերթով ցուցադրվում են պատկերասրահում կամ carousel-ում։ Կարող եք առանձին փոխարինել, ջնջել կամ ավելացնել։', editorAddCarouselImages: 'Ավելացնել կարուսելի նկարներ', editorImageRequirements: 'JPG, PNG կամ WEBP · մինչև 5 MB', editorOtherImages: 'Այլ նկարներ', editorOtherImagesHint: 'Գլխավոր և ձևավորման նկարները առանձնացված են կարուսելից։' });
Object.assign(en, { editorCarouselImages: 'Carousel images', editorCarouselImagesHint: 'These images appear in the gallery or carousel. Replace, remove, or add each one separately.', editorAddCarouselImages: 'Add carousel images', editorImageRequirements: 'JPG, PNG, or WEBP · up to 5 MB', editorOtherImages: 'Other images', editorOtherImagesHint: 'Main and decorative images are kept separate from the carousel.' });
Object.assign(ru, { editorCarouselImages: 'Изображения карусели', editorCarouselImagesHint: 'Эти изображения показываются в галерее или карусели. Их можно отдельно заменить, удалить или добавить.', editorAddCarouselImages: 'Добавить изображения в карусель', editorImageRequirements: 'JPG, PNG или WEBP · до 5 МБ', editorOtherImages: 'Другие изображения', editorOtherImagesHint: 'Главные и декоративные изображения отделены от карусели.' });
Object.assign(es, { editorCarouselImages: 'Imágenes del carrusel', editorCarouselImagesHint: 'Estas imágenes aparecen en la galería o carrusel. Puedes reemplazarlas, eliminarlas o añadirlas por separado.', editorAddCarouselImages: 'Añadir imágenes al carrusel', editorImageRequirements: 'JPG, PNG o WEBP · hasta 5 MB', editorOtherImages: 'Otras imágenes', editorOtherImagesHint: 'Las imágenes principales y decorativas están separadas del carrusel.' });
Object.assign(fr, { editorCarouselImages: 'Images du carrousel', editorCarouselImagesHint: 'Ces images apparaissent dans la galerie ou le carrousel. Vous pouvez les remplacer, les supprimer ou en ajouter séparément.', editorAddCarouselImages: 'Ajouter des images au carrousel', editorImageRequirements: 'JPG, PNG ou WEBP · jusqu’à 5 Mo', editorOtherImages: 'Autres images', editorOtherImagesHint: 'Les images principales et décoratives sont séparées du carrousel.' });
Object.assign(de, { editorCarouselImages: 'Karussellbilder', editorCarouselImagesHint: 'Diese Bilder erscheinen in der Galerie oder im Karussell. Sie können einzeln ersetzt, gelöscht oder hinzugefügt werden.', editorAddCarouselImages: 'Karussellbilder hinzufügen', editorImageRequirements: 'JPG, PNG oder WEBP · bis 5 MB', editorOtherImages: 'Andere Bilder', editorOtherImagesHint: 'Haupt- und Dekorationsbilder sind vom Karussell getrennt.' });
Object.assign(it, { editorCarouselImages: 'Immagini del carosello', editorCarouselImagesHint: 'Queste immagini appaiono nella galleria o nel carosello. Puoi sostituirle, eliminarle o aggiungerle separatamente.', editorAddCarouselImages: 'Aggiungi immagini al carosello', editorImageRequirements: 'JPG, PNG o WEBP · fino a 5 MB', editorOtherImages: 'Altre immagini', editorOtherImagesHint: 'Le immagini principali e decorative sono separate dal carosello.' });

Object.assign(hy, { editorDressCodeColors: 'Դրես կոդի գույներ', editorDressColor: 'Գույն', editorNewColor: 'Նոր գույն' });
Object.assign(en, { editorDressCodeColors: 'Dress code colors', editorDressColor: 'Color', editorNewColor: 'New color' });
Object.assign(ru, { editorDressCodeColors: 'Цвета дресс-кода', editorDressColor: 'Цвет', editorNewColor: 'Новый цвет' });
Object.assign(es, { editorDressCodeColors: 'Colores del código de vestimenta', editorDressColor: 'Color', editorNewColor: 'Nuevo color' });
Object.assign(fr, { editorDressCodeColors: 'Couleurs du code vestimentaire', editorDressColor: 'Couleur', editorNewColor: 'Nouvelle couleur' });
Object.assign(de, { editorDressCodeColors: 'Dresscode-Farben', editorDressColor: 'Farbe', editorNewColor: 'Neue Farbe' });
Object.assign(it, { editorDressCodeColors: 'Colori del dress code', editorDressColor: 'Colore', editorNewColor: 'Nuovo colore' });
Object.assign(hy, { editorResponsivePreview: 'Հրավերի responsive նախադիտում' });
Object.assign(en, { editorResponsivePreview: 'Responsive invitation preview' });
Object.assign(ru, { editorResponsivePreview: 'Адаптивный предпросмотр приглашения' });
Object.assign(es, { editorResponsivePreview: 'Vista previa adaptable de la invitación' });
Object.assign(fr, { editorResponsivePreview: "Aperçu adaptatif de l’invitation" });
Object.assign(de, { editorResponsivePreview: 'Responsive Vorschau der Einladung' });
Object.assign(it, { editorResponsivePreview: "Anteprima responsive dell’invito" });
Object.assign(hy, { familyInformation: 'Ընտանեկան տեղեկատվություն', guestQuestion: 'Հյուրերի հարց', thankYouMessage: 'Շնորհակալական նամակ', guestRelation: 'Հյուրի կապը', guestSide: 'Հյուրի կողմը', familyGuest: 'Ընտանիքի հյուր', brideSide: 'Հարսի կողմ', godparentGuest: 'Կնքահոր / կնքամոր հյուր', groomSide: 'Փեսայի կողմ', gladlyAttending: 'Սիրով կմասնակցենք', regretfullyDeclining: 'Ցավոք, չենք կարող ներկա լինել', rsvpSentTitle: 'Ձեր պատասխանը ուղարկվել է', rsvpSentText: 'Շնորհակալություն, հրավիրողը կտեսնի Ձեր անունը, հյուրերի քանակը և մեկնաբանությունը իր էջում։' });
Object.assign(en, { familyInformation: 'Family information', guestQuestion: 'Guest question', thankYouMessage: 'Thank-you message', guestRelation: 'Guest relation', guestSide: 'Guest side', familyGuest: 'Family guest', brideSide: "Bride's side", godparentGuest: "Godparent's guest", groomSide: "Groom's side", gladlyAttending: 'We will gladly attend', regretfullyDeclining: 'Unfortunately, we cannot attend', rsvpSentTitle: 'Your response has been sent', rsvpSentText: 'Thank you. The host will see your name, guest count, and comment on their page.' });
Object.assign(ru, { familyInformation: 'Семейная информация', guestQuestion: 'Вопрос гостям', thankYouMessage: 'Благодарственное сообщение', guestRelation: 'Связь гостя', guestSide: 'Сторона гостя', familyGuest: 'Гость семьи', brideSide: 'Сторона невесты', godparentGuest: 'Гость крёстных', groomSide: 'Сторона жениха', gladlyAttending: 'С радостью примем участие', regretfullyDeclining: 'К сожалению, не сможем присутствовать', rsvpSentTitle: 'Ваш ответ отправлен', rsvpSentText: 'Спасибо. Организатор увидит ваше имя, количество гостей и комментарий на своей странице.' });
Object.assign(es, { familyInformation: 'Información familiar', guestQuestion: 'Pregunta para invitados', thankYouMessage: 'Mensaje de agradecimiento', guestRelation: 'Relación del invitado', guestSide: 'Parte del invitado', familyGuest: 'Invitado de la familia', brideSide: 'Parte de la novia', godparentGuest: 'Invitado de los padrinos', groomSide: 'Parte del novio', gladlyAttending: 'Asistiremos con mucho gusto', regretfullyDeclining: 'Lamentablemente, no podremos asistir', rsvpSentTitle: 'Tu respuesta se ha enviado', rsvpSentText: 'Gracias. El anfitrión verá tu nombre, el número de invitados y el comentario en su página.' });
Object.assign(fr, { familyInformation: 'Informations familiales', guestQuestion: 'Question aux invités', thankYouMessage: 'Message de remerciement', guestRelation: "Lien de l’invité", guestSide: "Côté de l’invité", familyGuest: 'Invité de la famille', brideSide: 'Côté de la mariée', godparentGuest: 'Invité des parrains', groomSide: 'Côté du marié', gladlyAttending: 'Nous participerons avec plaisir', regretfullyDeclining: 'Malheureusement, nous ne pourrons pas être présents', rsvpSentTitle: 'Votre réponse a été envoyée', rsvpSentText: "Merci. L’hôte verra votre nom, le nombre d’invités et votre commentaire sur sa page." });
Object.assign(de, { familyInformation: 'Familieninformationen', guestQuestion: 'Gästefrage', thankYouMessage: 'Dankesnachricht', guestRelation: 'Beziehung des Gastes', guestSide: 'Seite des Gastes', familyGuest: 'Familiengast', brideSide: 'Seite der Braut', godparentGuest: 'Gast der Paten', groomSide: 'Seite des Bräutigams', gladlyAttending: 'Wir nehmen sehr gerne teil', regretfullyDeclining: 'Leider können wir nicht teilnehmen', rsvpSentTitle: 'Ihre Antwort wurde gesendet', rsvpSentText: 'Vielen Dank. Der Gastgeber sieht Ihren Namen, die Gästezahl und Ihren Kommentar auf seiner Seite.' });
Object.assign(it, { familyInformation: 'Informazioni familiari', guestQuestion: 'Domanda agli invitati', thankYouMessage: 'Messaggio di ringraziamento', guestRelation: "Legame dell’invitato", guestSide: "Parte dell’invitato", familyGuest: 'Invitato della famiglia', brideSide: 'Parte della sposa', godparentGuest: 'Invitato dei padrini', groomSide: 'Parte dello sposo', gladlyAttending: 'Parteciperemo con piacere', regretfullyDeclining: 'Purtroppo non potremo partecipare', rsvpSentTitle: 'La tua risposta è stata inviata', rsvpSentText: "Grazie. L’host vedrà il tuo nome, il numero di invitati e il commento nella sua pagina." });
Object.assign(hy, { date: 'Ամսաթիվ', birthday: 'Ծնունդ', nothingFound: 'Ոչինչ չի գտնվել' });
Object.assign(en, { date: 'Date', birthday: 'Birthday', nothingFound: 'Nothing found' });
Object.assign(ru, { date: 'Дата', birthday: 'День рождения', nothingFound: 'Ничего не найдено' });
Object.assign(es, { date: 'Fecha', birthday: 'Cumpleaños', nothingFound: 'No se encontró nada' });
Object.assign(fr, { date: 'Date', birthday: 'Anniversaire', nothingFound: 'Aucun résultat' });
Object.assign(de, { date: 'Datum', birthday: 'Geburtstag', nothingFound: 'Nichts gefunden' });
Object.assign(it, { date: 'Data', birthday: 'Compleanno', nothingFound: 'Nessun risultato' });
Object.assign(hy, { editorPalette: 'Գունային տարբերակ', editorPaletteHint: 'Այս ձևանմուշի համար ընտրված ներդաշնակ գույներ', editorAmuletSelection: 'Amulet ընտրանի' });
Object.assign(en, { editorPalette: 'Color option', editorPaletteHint: 'Harmonious colors selected for this template', editorAmuletSelection: 'Amulet selection' });
Object.assign(ru, { editorPalette: 'Цветовой вариант', editorPaletteHint: 'Гармоничные цвета для этого шаблона', editorAmuletSelection: 'Выбор Amulet' });
Object.assign(es, { editorPalette: 'Opción de color', editorPaletteHint: 'Colores armoniosos para esta plantilla', editorAmuletSelection: 'Selección de Amulet' });
Object.assign(fr, { editorPalette: 'Option de couleur', editorPaletteHint: 'Couleurs harmonieuses pour ce modèle', editorAmuletSelection: 'Sélection Amulet' });
Object.assign(de, { editorPalette: 'Farboption', editorPaletteHint: 'Harmonische Farben für diese Vorlage', editorAmuletSelection: 'Amulet-Auswahl' });
Object.assign(it, { editorPalette: 'Opzione colore', editorPaletteHint: 'Colori armoniosi per questo modello', editorAmuletSelection: 'Selezione Amulet' });

const privacySectionsHy = [
  {
    title: '1. Ինչ տվյալներ կարող ենք հավաքել',
    text: ['Amulet-ից օգտվելիս կարող ենք ստանալ հետևյալ տվյալները՝'],
    items: [
      'անուն և ազգանուն,',
      'հեռախոսահամար,',
      'էլեկտրոնային փոստի հասցե,',
      'միջոցառման տեսակը,',
      'միջոցառման ամսաթիվը, ժամը և վայրը,',
      'հրավիրատոմսի պատրաստման համար տրամադրված տեքստերը,',
      'լուսանկարներ և այլ մեդիա նյութեր,',
      'հյուրերի անուններ կամ հրավերի մեջ ներառվող այլ տվյալներ,'
    ],
    after: ['Մենք հավաքում ենք միայն այն տվյալները, որոնք անհրաժեշտ են մեր ծառայությունները տրամադրելու և կայքի բնականոն աշխատանքն ապահովելու համար։']
  },
  {
    title: '2. Ինչ նպատակով ենք օգտագործում տվյալները',
    text: ['Ձեր տրամադրած տվյալները կարող են օգտագործվել՝'],
    items: [
      'պատվերը ընդունելու և մշակելու,',
      'ձեր առցանց հրավիրատոմսը ստեղծելու և հրապարակելու,',
      'պատվերի կամ ծառայության հետ կապված ձեզ հետ կապ հաստատելու,',
      'անհրաժեշտ տեխնիկական աջակցություն տրամադրելու,',
      'ծառայությունների որակը բարելավելու,',
      'կայքի աշխատանքը վերլուծելու և տեխնիկական խնդիրները հայտնաբերելու,',
      'խարդախության կամ կայքի չարաշահման դեպքերը կանխելու,',
      'օրենսդրությամբ նախատեսված պարտավորությունները կատարելու նպատակով։'
    ],
    after: ['Ձեր տվյալները չենք օգտագործում այնպիսի նպատակներով, որոնք կապ չունեն Amulet-ի կողմից տրամադրվող ծառայությունների հետ, բացառությամբ այն դեպքերի, երբ ունենք դրա համար իրավական հիմք կամ ձեր համաձայնությունը։']
  },
  {
    title: '3. Հրավիրատոմսի հղումը և հասանելիությունը',
    text: [
      'Amulet-ում ստեղծված հրավիրատոմսը կարող է հասանելի լինել հատուկ հղման միջոցով։',
      'Հղումը կարող է բացել յուրաքանչյուր անձ, ով ստացել է կամ ում փոխանցվել է տվյալ հղումը։ Այդ պատճառով խորհուրդ ենք տալիս հրավիրատոմսում չտեղադրել այնպիսի տեղեկություններ, որոնք չեք ցանկանում հասանելի դարձնել հրավիրված անձանց կամ հղումը ստացած այլ մարդկանց։',
      'Հրավերի հղումն ուրիշ անձանց փոխանցելու դեպքում դրա հետագա տարածումը ամբողջությամբ վերահսկել հնարավոր չէ։'
    ]
  },
  {
    title: '4. Տվյալների փոխանցում երրորդ անձանց',
    text: [
      'Մենք չենք վաճառում և վարձակալությամբ չենք տրամադրում ձեր անձնական տվյալները երրորդ անձանց։',
      'Որոշ դեպքերում տվյալների սահմանափակ մասը կարող է փոխանցվել այն ծառայություններ մատուցող ընկերություններին, որոնք անհրաժեշտ են Amulet-ի աշխատանքի համար, օրինակ՝'
    ],
    items: [
      'հոսթինգ և սերվերային ծառայություններ,',
      'էլեկտրոնային փոստի ծառայություններ,',
      'վճարային համակարգեր,',
      'կայքի տեխնիկական սպասարկման կամ վերլուծական ծառայություններ։'
    ],
    after: [
      'Նման ծառայություններին տրամադրվում են միայն այն տվյալները, որոնք անհրաժեշտ են համապատասխան գործողությունն իրականացնելու համար։',
      'Տվյալները կարող են տրամադրվել նաև այն դեպքերում, երբ դա պահանջվում է Հայաստանի Հանրապետության օրենսդրությամբ կամ իրավասու պետական մարմնի օրինական պահանջով։'
    ]
  },
  {
    title: '5. Վճարումներ',
    text: [
      'Amulet-ում վճարումները կարող են իրականացվել երրորդ կողմի վճարային համակարգերի միջոցով։',
      'Amulet-ը չի պահպանում ձեր բանկային քարտի ամբողջական տվյալները, եթե վճարումն իրականացվում է արտաքին վճարային ծառայության միջոցով։',
      'Քարտային և վճարային տվյալների մշակումը կատարվում է համապատասխան վճարային համակարգի անվտանգության պայմաններին և գաղտնիության քաղաքականությանը համապատասխան։'
    ]
  },
  {
    title: '6. Cookies և տեխնիկական տվյալներ',
    text: ['Amulet կայքը կարող է օգտագործել cookies և նմանատիպ տեխնոլոգիաներ։', 'Դրանք կարող են օգտագործվել, օրինակ՝'],
    items: [
      'կայքի լեզուն կամ այլ նախընտրություններ հիշելու,',
      'կայքի ճիշտ աշխատանքն ապահովելու,',
      'օգտատերերի կողմից կայքի օգտագործումը հասկանալու,',
      'սխալները և տեխնիկական խնդիրները հայտնաբերելու,',
      'կայքի արագությունն ու օգտագործման հարմարավետությունը բարելավելու համար։'
    ],
    after: ['Դուք կարող եք ձեր դիտարկիչի կարգավորումների միջոցով սահմանափակել կամ անջատել cookies-ի օգտագործումը, սակայն այդ դեպքում կայքի որոշ գործառույթներ կարող են ոչ ամբողջությամբ աշխատել։']
  },
  {
    title: '7. Տվյալների պահպանում',
    text: ['Մենք պահպանում ենք անձնական տվյալները միայն այնքան ժամանակ, որքան անհրաժեշտ է՝'],
    items: [
      'պատվերը կատարելու,',
      'հաճախորդների սպասարկումն ապահովելու,',
      'հնարավոր տեխնիկական կամ վճարային հարցերը լուծելու,',
      'օրենսդրությամբ նախատեսված պարտավորությունները կատարելու համար։'
    ],
    after: ['Երբ տվյալներն այլևս անհրաժեշտ չեն, դրանք կարող են ջնջվել կամ ապանձնավորվել՝ կախված տվյալների տեսակից և դրանց պահպանման անհրաժեշտությունից։']
  },
  {
    title: '8. Տվյալների անվտանգություն',
    text: [
      'Մենք կիրառում ենք ողջամիտ տեխնիկական և կազմակերպչական միջոցներ՝ ձեր տվյալները չարտոնված հասանելիությունից, փոփոխությունից, հրապարակումից կամ կորստից պաշտպանելու համար։',
      'Միևնույն ժամանակ պետք է հաշվի առնել, որ ինտերնետով տվյալների փոխանցման որևէ համակարգ չի կարող երաշխավորել բացարձակ անվտանգություն։'
    ]
  },
  {
    title: '9. Լուսանկարներ և այլ բովանդակություն',
    text: [
      'Հրավիրատոմսի պատրաստման համար Amulet-ին փոխանցելով լուսանկարներ, տեքստեր կամ այլ նյութեր՝ դուք հաստատում եք, որ իրավունք ունեք դրանք օգտագործելու և տրամադրելու հրավիրատոմսի ստեղծման նպատակով։',
      'Ձեր տրամադրած նյութերը օգտագործվում են հիմնականում ձեր պատվերի կատարման և հրավիրատոմսի ձևավորման նպատակով։'
    ]
  },
  {
    title: '10. Երեխաների տվյալներ և լուսանկարներ',
    text: [
      'Մկրտության, ծննդյան կամ երեխաների մասնակցությամբ այլ միջոցառումների դեպքում հրավիրատոմսը կարող է պարունակել երեխայի անունը, լուսանկարը կամ այլ տվյալներ։',
      'Այդպիսի նյութերը պետք է տրամադրվեն երեխայի ծնողի, խնամակալի կամ այլ օրինական ներկայացուցչի համաձայնությամբ։',
      'Եթե դուք Amulet-ին փոխանցում եք երեխայի լուսանկար կամ անձնական տվյալ, ենթադրվում է, որ ունեք տվյալ նյութը տրամադրելու անհրաժեշտ իրավունքը կամ համաձայնությունը։'
    ]
  },
  {
    title: '11. Ձեր իրավունքները',
    text: ['Ձեր անձնական տվյալների հետ կապված կարող եք դիմել մեզ և խնդրել՝'],
    items: [
      'տեղեկություն ստանալ ձեր վերաբերյալ պահպանվող տվյալների մասին,',
      'ուղղել սխալ կամ ոչ ամբողջական տվյալները,',
      'հնարավորության դեպքում ջնջել ձեր տվյալները,',
      'սահմանափակել որոշ տվյալների օգտագործումը,',
      'պարզաբանել, թե ինչ նպատակով են օգտագործվում ձեր տվյալները։'
    ],
    after: ['Որոշ տվյալներ կարող են պահպանվել ավելի երկար, եթե դա անհրաժեշտ է օրենքով նախատեսված պարտավորությունների կատարման կամ իրավական պահանջների պաշտպանության համար։']
  },
  {
    title: '12. Այլ կայքերի հղումներ',
    text: [
      'Amulet-ում կարող են տեղադրվել երրորդ կողմի կայքերի կամ ծառայությունների հղումներ։',
      'Մենք պատասխանատվություն չենք կրում այդ կայքերի գաղտնիության քաղաքականության, անվտանգության կամ բովանդակության համար։ Խորհուրդ ենք տալիս արտաքին ծառայությունից օգտվելուց առաջ ծանոթանալ դրա սեփական գաղտնիության քաղաքականությանը։'
    ]
  },
  {
    title: '13. Գաղտնիության քաղաքականության փոփոխություններ',
    text: [
      'Ժամանակ առ ժամանակ կարող ենք թարմացնել այս Գաղտնիության քաղաքականությունը՝ ծառայությունների, կայքի գործառույթների կամ իրավական պահանջների փոփոխության պատճառով։',
      'Թարմացված տարբերակը կհրապարակվի Amulet կայքում։'
    ]
  },
  {
    title: '14. Կապ մեզ հետ',
    text: [
      'Եթե ունեք հարցեր ձեր անձնական տվյալների կամ այս Գաղտնիության քաղաքականության վերաբերյալ, կարող եք կապ հաստատել մեզ հետ՝',
      'Էլ. փոստ՝ amulet.invitation@gmail.com',
      'Հեռախոս՝ 041 401415',
      'Amulet — առցանց հրավիրատոմսեր ձեր կարևոր պահերի համար։'
    ]
  }
];

const privacySectionsEn = [
  { title: 'Data we may collect', text: ['We may collect contact details, event information, invitation texts, photos, guest names, and technical data needed to provide and improve the service.'] },
  { title: 'How we use data', text: ['We use data to process orders, prepare online invitations, contact customers, improve the website, prevent abuse, and meet legal requirements.'] },
  { title: 'Invitation access', text: ['Anyone with the invitation link may be able to view it, so avoid adding highly sensitive information.'] },
  { title: 'Sharing with third parties', text: ['We do not sell personal data. Data may be shared only with providers that help operate the website, process payments, or complete your order.'] },
  { title: 'Payments', text: ['Payments may be processed through payment providers. Amulet does not store complete bank card details.'] },
  { title: 'Cookies and technical data', text: ['We may use cookies to remember preferences, analyze usage, and improve the experience.'] },
  { title: 'Storage and security', text: ['Data is kept only as long as needed for orders, support, or legal obligations, and we use reasonable safeguards to protect it.'] },
  { title: 'Your rights', text: ['You may ask to access, correct, delete, or restrict the use of your personal data by contacting us.'] },
  { title: 'Children data and photos', text: ['For baptisms or children events, photos and information should be provided with parent or legal guardian consent.'] },
  { title: 'Contact', text: ['For privacy questions, contact amulet.invitation@gmail.com or 041 401415.'] }
];

const privacySectionsRu = [
  { title: 'Какие данные мы можем собирать', text: ['Мы можем собирать контактные данные, информацию о событии, тексты приглашения, фотографии, имена гостей и технические данные для работы сервиса.'] },
  { title: 'Как мы используем данные', text: ['Данные используются для обработки заказов, подготовки онлайн-приглашений, связи с клиентом, улучшения сайта и обеспечения безопасности.'] },
  { title: 'Доступ к приглашению', text: ['Приглашение может быть доступно людям, у которых есть ссылка. Не размещайте в нем слишком чувствительную информацию.'] },
  { title: 'Передача третьим лицам', text: ['Мы не продаем персональные данные. Они могут передаваться только поставщикам, которые помогают работе сайта, оплате или выполнению заказа.'] },
  { title: 'Платежи', text: ['Платежи могут обрабатываться платежными системами. Amulet не хранит полные данные банковской карты.'] },
  { title: 'Cookies и технические данные', text: ['Мы можем использовать cookies для запоминания настроек, анализа использования и улучшения опыта.'] },
  { title: 'Хранение и безопасность', text: ['Данные хранятся столько, сколько нужно для заказа, поддержки или юридических обязательств.'] },
  { title: 'Ваши права', text: ['Вы можете запросить доступ, исправление, удаление или ограничение использования ваших данных.'] },
  { title: 'Данные и фото детей', text: ['Для детских событий данные и фото должны передаваться с согласием родителя или законного представителя.'] },
  { title: 'Контакты', text: ['По вопросам конфиденциальности: amulet.invitation@gmail.com или 041 401415.'] }
];

const privacySectionsEs = [
  { title: 'Datos que podemos recopilar', text: ['Podemos recopilar datos de contacto, información del evento, textos, fotos, nombres de invitados y datos técnicos necesarios para el servicio.'] },
  { title: 'Cómo usamos los datos', text: ['Usamos los datos para procesar pedidos, preparar invitaciones online, contactar al cliente, mejorar el sitio y mantener la seguridad.'] },
  { title: 'Acceso a la invitación', text: ['Quien tenga el enlace puede ver la invitación, por eso recomendamos no incluir información demasiado sensible.'] },
  { title: 'Terceros', text: ['No vendemos datos personales. Solo los compartimos con proveedores necesarios para operar el sitio, pagos o pedidos.'] },
  { title: 'Pagos', text: ['Los pagos pueden ser procesados por proveedores de pago. Amulet no guarda los datos completos de la tarjeta.'] },
  { title: 'Cookies', text: ['Podemos usar cookies para recordar preferencias, analizar uso y mejorar la experiencia.'] },
  { title: 'Seguridad', text: ['Conservamos los datos solo el tiempo necesario y usamos medidas razonables de protección.'] },
  { title: 'Tus derechos', text: ['Puedes pedir acceso, corrección, eliminación o limitación del uso de tus datos.'] },
  { title: 'Datos de niños', text: ['En eventos infantiles, las fotos y datos deben enviarse con consentimiento de los padres o tutores.'] },
  { title: 'Contacto', text: ['Para privacidad: hello@amulet.local o 041 401415.'] }
];

const privacySectionsFr = [
  { title: 'Données collectées', text: ['Nous pouvons collecter les coordonnées, les informations de l’événement, les textes, photos, noms d’invités et données techniques nécessaires au service.'] },
  { title: 'Utilisation des données', text: ['Les données servent à traiter les commandes, préparer les invitations, contacter le client, améliorer le site et assurer la sécurité.'] },
  { title: 'Accès à l’invitation', text: ['Toute personne ayant le lien peut voir l’invitation. Évitez d’y ajouter des informations trop sensibles.'] },
  { title: 'Partage avec des tiers', text: ['Nous ne vendons pas les données personnelles. Elles peuvent être partagées uniquement avec les prestataires nécessaires au service.'] },
  { title: 'Paiements', text: ['Les paiements peuvent être traités par des prestataires de paiement. Amulet ne stocke pas les données complètes de carte bancaire.'] },
  { title: 'Cookies', text: ['Nous pouvons utiliser des cookies pour mémoriser les préférences, analyser l’usage et améliorer l’expérience.'] },
  { title: 'Sécurité', text: ['Les données sont conservées uniquement le temps nécessaire et protégées par des mesures raisonnables.'] },
  { title: 'Vos droits', text: ['Vous pouvez demander l’accès, la correction, la suppression ou la limitation de vos données.'] },
  { title: 'Données des enfants', text: ['Pour les événements d’enfants, les photos et données doivent être fournies avec l’accord d’un parent ou représentant légal.'] },
  { title: 'Contact', text: ['Questions de confidentialité : hello@amulet.local ou 041 401415.'] }
];

const privacySectionsDe = [
  { title: 'Welche Daten wir erfassen können', text: ['Wir können Kontaktdaten, Eventinformationen, Einladungstexte, Fotos, Gästenamen und technische Daten erfassen, die für den Service nötig sind.'] },
  { title: 'Wie wir Daten nutzen', text: ['Wir nutzen Daten für Bestellungen, Online-Einladungen, Kundenkontakt, Website-Verbesserung und Sicherheit.'] },
  { title: 'Zugriff auf die Einladung', text: ['Wer den Link hat, kann die Einladung sehen. Bitte keine sehr sensiblen Informationen hinzufügen.'] },
  { title: 'Weitergabe an Dritte', text: ['Wir verkaufen keine personenbezogenen Daten. Sie werden nur mit Dienstleistern geteilt, die für Website, Zahlung oder Auftrag nötig sind.'] },
  { title: 'Zahlungen', text: ['Zahlungen können über Zahlungsanbieter verarbeitet werden. Amulet speichert keine vollständigen Kartendaten.'] },
  { title: 'Cookies', text: ['Wir können Cookies nutzen, um Einstellungen zu speichern, Nutzung zu analysieren und die Erfahrung zu verbessern.'] },
  { title: 'Speicherung und Sicherheit', text: ['Daten werden nur so lange gespeichert wie nötig und mit angemessenen Maßnahmen geschützt.'] },
  { title: 'Ihre Rechte', text: ['Sie können Zugriff, Korrektur, Löschung oder Einschränkung Ihrer Daten beantragen.'] },
  { title: 'Kinderdaten und Fotos', text: ['Bei Kinderveranstaltungen müssen Fotos und Daten mit Zustimmung der Eltern oder Erziehungsberechtigten bereitgestellt werden.'] },
  { title: 'Kontakt', text: ['Datenschutzfragen: hello@amulet.local oder 041 401415.'] }
];

const privacySectionsIt = [
  { title: 'Dati che possiamo raccogliere', text: ['Possiamo raccogliere contatti, informazioni sull’evento, testi, foto, nomi degli ospiti e dati tecnici necessari al servizio.'] },
  { title: 'Uso dei dati', text: ['Usiamo i dati per gestire ordini, preparare inviti online, contattare il cliente, migliorare il sito e garantire sicurezza.'] },
  { title: 'Accesso all’invito', text: ['Chi possiede il link può vedere l’invito. Evita di inserire informazioni troppo sensibili.'] },
  { title: 'Terze parti', text: ['Non vendiamo dati personali. Li condividiamo solo con fornitori necessari per sito, pagamenti o ordini.'] },
  { title: 'Pagamenti', text: ['I pagamenti possono essere elaborati da provider di pagamento. Amulet non conserva i dati completi della carta.'] },
  { title: 'Cookies', text: ['Possiamo usare cookies per ricordare preferenze, analizzare l’uso e migliorare l’esperienza.'] },
  { title: 'Sicurezza', text: ['I dati sono conservati solo per il tempo necessario e protetti con misure ragionevoli.'] },
  { title: 'I tuoi diritti', text: ['Puoi chiedere accesso, correzione, eliminazione o limitazione dei tuoi dati.'] },
  { title: 'Dati e foto di bambini', text: ['Per eventi di bambini, foto e dati devono essere forniti con consenso dei genitori o tutori.'] },
  { title: 'Contatto', text: ['Domande sulla privacy: hello@amulet.local o 041 401415.'] }
];

Object.assign(hy, {
  menuTagline: 'Հարմարավետ և ժամանակակից հրավիրատոմսեր քո միջոցառման համար',
  menuPrivacy: 'Գաղտնիության քաղաքականություն',
  menuPartners: 'Գործընկերների համար',
  menuLogin: 'Մուտք',
  allInvitations: 'Բոլոր հրավիրատոմսերը',
  templateCatalogKicker: 'Հրավերների կատալոգ',
  templateChooserTitle: 'Ընտրիր հրավիրատոմսի տեսակը',
  templateChooserHint: 'Ընտրիր, թե ինչ հրավիրատոմս ես ուզում',
  templatesAllLanguages: '• Մոդելները նշված են մեկ լեզվի համար',
  templatesFastDelivery: '• Պատրաստման ժամկետը 4 օր',
  customerTestimonialsKicker: 'Հաճախորդների կարծիքներ',
  customerTestimonialsTitle: 'Հաճախորդների կարծիքները Ամուլետի մասին',
  customerTestimonialsSubtitle: 'Իրական տպավորություններ տարբեր միջոցառումներից՝ հարսանիք, նշանադրություն, մկրտություն, ծնունդ և կորպորատիվ երեկոներ։',
  privacyTitle: 'Գաղտնիության քաղաքականություն',
  privacyUpdated: 'Վերջին թարմացումը՝ 13 օգոստոսի, 2026 թ.',
  privacyIntro: 'Բարի գալուստ Amulet։ Մենք կարևորում ենք ձեր անձնական տվյալների գաղտնիությունն ու անվտանգությունը։ Այս Գաղտնիության քաղաքականությունը ներկայացնում է, թե ինչ տվյալներ կարող ենք ստանալ ձեզանից, ինչ նպատակով ենք դրանք օգտագործում և ինչպես ենք վերաբերվում դրանց՝ Amulet առցանց հրավիրատոմսերի ծառայությունից օգտվելիս։',
  privacySections: privacySectionsHy
});

Object.assign(en, {
  menuTagline: 'Comfortable, modern invitations for every event',
  allInvitations: 'All invitations',
  templateCatalogKicker: 'Invitation catalog',
  templateChooserTitle: 'Choose invitation type',
  templateChooserHint: 'Choose what kind of invitation you want',
  templatesAllLanguages: '• Templates are listed for one language',
  templatesFastDelivery: '• Preparation time is 4 days',
  customerTestimonialsKicker: 'Customer reviews',
  customerTestimonialsTitle: 'What customers say about Amulet',
  customerTestimonialsSubtitle: 'Warm feedback from weddings, engagements, baptisms, birthdays, and corporate events.',
  privacyTitle: 'Privacy Policy',
  privacyUpdated: 'Last updated: 08.07.2026',
  privacyIntro: 'Welcome to Amulet. This policy explains what data we collect, how we use it, and how we protect your privacy while using our online invitation service.',
  privacySections: privacySectionsEn
});

Object.assign(ru, {
  menuTagline: 'Удобные современные приглашения для любого события',
  allInvitations: 'Все приглашения',
  templateCatalogKicker: 'Каталог приглашений',
  templateChooserTitle: 'Выберите тип приглашения',
  templateChooserHint: 'Выберите, какое приглашение вам нужно',
  templatesAllLanguages: '• Шаблоны указаны для одного языка',
  templatesFastDelivery: '• Срок подготовки 4 дня',
  customerTestimonialsKicker: 'Отзывы клиентов',
  customerTestimonialsTitle: 'Отзывы клиентов об Amulet',
  customerTestimonialsSubtitle: 'Отзывы о свадьбах, помолвках, крещениях, днях рождения и корпоративных событиях.',
  privacyTitle: 'Политика конфиденциальности',
  privacyUpdated: 'Последнее обновление: 08.07.2026',
  privacyIntro: 'Добро пожаловать в Amulet. Эта политика объясняет, какие данные мы собираем, как используем их и как защищаем вашу конфиденциальность.',
  privacySections: privacySectionsRu
});

Object.assign(es, {
  menuTagline: 'Invitaciones modernas y cómodas para cada evento',
  allInvitations: 'Todas las invitaciones',
  templateCatalogKicker: 'Catálogo de invitaciones',
  templateChooserTitle: 'Elige el tipo de invitación',
  templateChooserHint: 'Elige qué invitación quieres',
  templatesAllLanguages: '• Los modelos están indicados para un idioma',
  templatesFastDelivery: '• Tiempo de preparación: 4 días',
  customerTestimonialsKicker: 'Opiniones',
  customerTestimonialsTitle: 'Opiniones de clientes sobre Amulet',
  customerTestimonialsSubtitle: 'Comentarios cálidos de bodas, compromisos, bautizos, cumpleaños y eventos corporativos.',
  privacyTitle: 'Política de privacidad',
  privacyUpdated: 'Última actualización: 08.07.2026',
  privacyIntro: 'Bienvenido a Amulet. Esta política explica qué datos recopilamos, cómo los usamos y cómo protegemos tu privacidad.',
  privacySections: privacySectionsEs
});

Object.assign(fr, {
  menuTagline: 'Des invitations modernes et pratiques pour chaque événement',
  allInvitations: 'Toutes les invitations',
  templateCatalogKicker: 'Catalogue d’invitations',
  templateChooserTitle: 'Choisir le type d’invitation',
  templateChooserHint: 'Choisissez le type d’invitation souhaité',
  templatesAllLanguages: '• Les modèles sont indiqués pour une langue',
  templatesFastDelivery: '• Délai de préparation : 4 jours',
  customerTestimonialsKicker: 'Avis clients',
  customerTestimonialsTitle: 'Ce que les clients disent d’Amulet',
  customerTestimonialsSubtitle: 'Des retours chaleureux pour mariages, fiançailles, baptêmes, anniversaires et événements corporate.',
  privacyTitle: 'Politique de confidentialité',
  privacyUpdated: 'Dernière mise à jour : 08.07.2026',
  privacyIntro: 'Bienvenue chez Amulet. Cette politique explique quelles données nous collectons, comment nous les utilisons et comment nous protégeons votre confidentialité.',
  privacySections: privacySectionsFr
});

Object.assign(de, {
  menuTagline: 'Moderne, bequeme Einladungen für jedes Event',
  allInvitations: 'Alle Einladungen',
  templateCatalogKicker: 'Einladungskatalog',
  templateChooserTitle: 'Einladungstyp wählen',
  templateChooserHint: 'Wähle, welche Einladung du möchtest',
  templatesAllLanguages: '• Vorlagen sind für eine Sprache angegeben',
  templatesFastDelivery: '• Vorbereitungszeit: 4 Tage',
  customerTestimonialsKicker: 'Kundenstimmen',
  customerTestimonialsTitle: 'Was Kunden über Amulet sagen',
  customerTestimonialsSubtitle: 'Feedback zu Hochzeiten, Verlobungen, Taufen, Geburtstagen und Firmenevents.',
  privacyTitle: 'Datenschutzerklärung',
  privacyUpdated: 'Letzte Aktualisierung: 08.07.2026',
  privacyIntro: 'Willkommen bei Amulet. Diese Erklärung beschreibt, welche Daten wir erfassen, wie wir sie nutzen und wie wir Ihre Privatsphäre schützen.',
  privacySections: privacySectionsDe
});

Object.assign(it, {
  menuTagline: 'Inviti moderni e comodi per ogni evento',
  allInvitations: 'Tutti gli inviti',
  templateCatalogKicker: 'Catalogo inviti',
  templateChooserTitle: 'Scegli il tipo di invito',
  templateChooserHint: 'Scegli quale invito desideri',
  templatesAllLanguages: '• I modelli sono indicati per una lingua',
  templatesFastDelivery: '• Tempo di preparazione: 4 giorni',
  customerTestimonialsKicker: 'Recensioni clienti',
  customerTestimonialsTitle: 'Cosa dicono i clienti di Amulet',
  customerTestimonialsSubtitle: 'Feedback da matrimoni, fidanzamenti, battesimi, compleanni ed eventi corporate.',
  privacyTitle: 'Informativa sulla privacy',
  privacyUpdated: 'Ultimo aggiornamento: 08.07.2026',
  privacyIntro: 'Benvenuto in Amulet. Questa informativa spiega quali dati raccogliamo, come li usiamo e come proteggiamo la tua privacy.',
  privacySections: privacySectionsIt
});

Object.assign(en, {
  authIntro: 'Sign in or create an Amulet account to keep your details safe.',
  authRegister: 'Register',
  authNamePlaceholder: 'Your name',
  authWait: 'Please wait...',
  authCreateAccount: 'Create account',
  authSignIn: 'Sign in',
  authOr: 'or',
  authGoogleMissing: 'Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in',
  authVerifyTitle: 'Verify your email',
  authVerifyIntro: 'We sent a 6-digit verification code to {email}.',
  authCodeSent: 'The verification code was sent to your email.',
  authCodeLength: 'The code must be 6 digits.',
  authCodeWrong: 'The code is incorrect.',
  authChecking: 'Checking...',
  authConfirm: 'Confirm',
  accountTitle: 'My page',
  accountInvitations: 'My invitations',
  accountNoInvitations: 'You do not have any invitations',
  accountOrdersError: 'Could not load your invitations.',
  accountViewDesign: 'View design',
  accountViewInvitation: 'View invitation',
  accountLogout: 'Log out',
  accountLogoutTitle: 'Do you want to log out?',
  accountLogoutText: 'If you leave your account, you will need to enter your email and password again the next time you want to access your page.',
  accountStay: 'Stay',
  accountLogoutConfirm: 'Yes, log out'
});

Object.assign(hy, {
  authIntro: 'Մուտք գործիր կամ ստեղծիր Amulet օգտահաշիվ՝ քո տվյալները անվտանգ պահելու համար։',
  authRegister: 'Գրանցում',
  authNamePlaceholder: 'Քո անունը',
  authWait: 'Սպասիր...',
  authCreateAccount: 'Գրանցվել',
  authSignIn: 'Մուտք գործել',
  authOr: 'կամ',
  authGoogleMissing: 'Google մուտքի համար ավելացրու VITE_GOOGLE_CLIENT_ID',
  authVerifyTitle: 'Հաստատիր email-ը',
  authVerifyIntro: '{email} հասցեին ուղարկել ենք 6 նիշանոց կոդ։ Մուտքագրիր այն՝ գրանցումն ավարտելու համար։',
  authCodeSent: 'Վերիֆիկացիայի կոդը ուղարկվել է email-ին։',
  authCodeLength: 'Կոդը պետք է լինի 6 նիշ։',
  authCodeWrong: 'Կոդը սխալ է։',
  authChecking: 'Ստուգվում է...',
  authConfirm: 'Հաստատել',
  accountTitle: 'Իմ էջը',
  accountInvitations: 'Իմ հրավիրատոմսերը',
  accountNoInvitations: 'դուք հրավիրատոմսեր չունեք',
  accountOrdersError: 'Չհաջողվեց բեռնել հրավիրատոմսերը։',
  accountViewDesign: 'Դիտել դիզայնը',
  accountViewInvitation: 'Դիտել հրավերը',
  accountLogout: 'Դուրս գալ',
  accountLogoutTitle: 'Ցանկանո՞ւմ ես դուրս գալ օգտահաշվից',
  accountLogoutText: 'Եթե դուրս գաս օգտահաշվից, հաջորդ անգամ քո էջ մուտք գործելու համար պետք է կրկին լրացնես email-ն ու գաղտնաբառը։',
  accountStay: 'Մնալ էջում',
  accountLogoutConfirm: 'Այո, դուրս գալ'
});

Object.assign(ru, {
  authIntro: 'Войдите или создайте аккаунт Amulet, чтобы безопасно хранить свои данные.',
  authRegister: 'Регистрация',
  authNamePlaceholder: 'Ваше имя',
  authWait: 'Подождите...',
  authCreateAccount: 'Зарегистрироваться',
  authSignIn: 'Войти',
  authOr: 'или',
  authGoogleMissing: 'Добавьте VITE_GOOGLE_CLIENT_ID для входа через Google',
  authVerifyTitle: 'Подтвердите email',
  authVerifyIntro: 'Мы отправили 6-значный код на {email}. Введите его, чтобы завершить регистрацию.',
  authCodeSent: 'Код подтверждения отправлен на ваш email.',
  authCodeLength: 'Код должен состоять из 6 цифр.',
  authCodeWrong: 'Код неверный.',
  authChecking: 'Проверяем...',
  authConfirm: 'Подтвердить',
  accountTitle: 'Моя страница',
  accountInvitations: 'Мои приглашения',
  accountNoInvitations: 'У вас нет приглашений',
  accountOrdersError: 'Не удалось загрузить приглашения.',
  accountViewDesign: 'Посмотреть дизайн',
  accountLogout: 'Выйти',
  accountLogoutTitle: 'Хотите выйти из аккаунта?',
  accountLogoutText: 'Если вы выйдете, при следующем входе на свою страницу нужно будет снова указать email и пароль.',
  accountStay: 'Остаться',
  accountLogoutConfirm: 'Да, выйти'
});

Object.assign(es, {
  authIntro: 'Inicia sesión o crea una cuenta de Amulet para guardar tus datos con seguridad.',
  authRegister: 'Registro',
  authNamePlaceholder: 'Tu nombre',
  authWait: 'Espera...',
  authCreateAccount: 'Crear cuenta',
  authSignIn: 'Entrar',
  authOr: 'o',
  authGoogleMissing: 'Añade VITE_GOOGLE_CLIENT_ID para activar Google',
  authVerifyTitle: 'Confirma tu email',
  authVerifyIntro: 'Hemos enviado un código de 6 dígitos a {email}. Introdúcelo para completar el registro.',
  authCodeSent: 'El código de verificación se envió a tu email.',
  authCodeLength: 'El código debe tener 6 dígitos.',
  authCodeWrong: 'El código es incorrecto.',
  authChecking: 'Comprobando...',
  authConfirm: 'Confirmar',
  accountTitle: 'Mi página',
  accountInvitations: 'Mis invitaciones',
  accountNoInvitations: 'No tienes invitaciones',
  accountOrdersError: 'No se pudieron cargar tus invitaciones.',
  accountViewDesign: 'Ver diseño',
  accountLogout: 'Salir',
  accountLogoutTitle: '¿Quieres cerrar sesión?',
  accountLogoutText: 'Si sales de tu cuenta, la próxima vez tendrás que volver a introducir tu email y contraseña.',
  accountStay: 'Quedarme',
  accountLogoutConfirm: 'Sí, salir'
});

Object.assign(fr, {
  authIntro: 'Connectez-vous ou créez un compte Amulet pour garder vos données en sécurité.',
  authRegister: 'Inscription',
  authNamePlaceholder: 'Votre nom',
  authWait: 'Patientez...',
  authCreateAccount: 'Créer un compte',
  authSignIn: 'Se connecter',
  authOr: 'ou',
  authGoogleMissing: 'Ajoutez VITE_GOOGLE_CLIENT_ID pour activer Google',
  authVerifyTitle: 'Confirmez votre email',
  authVerifyIntro: 'Nous avons envoyé un code à 6 chiffres à {email}. Saisissez-le pour finaliser l’inscription.',
  authCodeSent: 'Le code de vérification a été envoyé à votre email.',
  authCodeLength: 'Le code doit contenir 6 chiffres.',
  authCodeWrong: 'Le code est incorrect.',
  authChecking: 'Vérification...',
  authConfirm: 'Confirmer',
  accountTitle: 'Ma page',
  accountInvitations: 'Mes invitations',
  accountNoInvitations: 'Vous n’avez aucune invitation',
  accountOrdersError: 'Impossible de charger vos invitations.',
  accountViewDesign: 'Voir le design',
  accountLogout: 'Se déconnecter',
  accountLogoutTitle: 'Voulez-vous vous déconnecter ?',
  accountLogoutText: 'Si vous quittez votre compte, vous devrez saisir à nouveau votre email et votre mot de passe la prochaine fois.',
  accountStay: 'Rester',
  accountLogoutConfirm: 'Oui, sortir'
});

Object.assign(de, {
  authIntro: 'Melde dich an oder erstelle ein Amulet-Konto, um deine Daten sicher zu speichern.',
  authRegister: 'Registrieren',
  authNamePlaceholder: 'Dein Name',
  authWait: 'Bitte warten...',
  authCreateAccount: 'Konto erstellen',
  authSignIn: 'Anmelden',
  authOr: 'oder',
  authGoogleMissing: 'Füge VITE_GOOGLE_CLIENT_ID hinzu, um Google zu aktivieren',
  authVerifyTitle: 'E-Mail bestätigen',
  authVerifyIntro: 'Wir haben einen 6-stelligen Code an {email} gesendet. Gib ihn ein, um die Registrierung abzuschließen.',
  authCodeSent: 'Der Bestätigungscode wurde an deine E-Mail gesendet.',
  authCodeLength: 'Der Code muss 6 Ziffern haben.',
  authCodeWrong: 'Der Code ist falsch.',
  authChecking: 'Wird geprüft...',
  authConfirm: 'Bestätigen',
  accountTitle: 'Meine Seite',
  accountInvitations: 'Meine Einladungen',
  accountNoInvitations: 'Du hast keine Einladungen',
  accountOrdersError: 'Einladungen konnten nicht geladen werden.',
  accountViewDesign: 'Design ansehen',
  accountLogout: 'Abmelden',
  accountLogoutTitle: 'Möchtest du dich abmelden?',
  accountLogoutText: 'Wenn du dein Konto verlässt, musst du beim nächsten Zugriff auf deine Seite erneut E-Mail und Passwort eingeben.',
  accountStay: 'Bleiben',
  accountLogoutConfirm: 'Ja, abmelden'
});

Object.assign(it, {
  authIntro: 'Accedi o crea un account Amulet per tenere al sicuro i tuoi dati.',
  authRegister: 'Registrazione',
  authNamePlaceholder: 'Il tuo nome',
  authWait: 'Attendi...',
  authCreateAccount: 'Crea account',
  authSignIn: 'Accedi',
  authOr: 'o',
  authGoogleMissing: 'Aggiungi VITE_GOOGLE_CLIENT_ID per attivare Google',
  authVerifyTitle: 'Conferma la tua email',
  authVerifyIntro: 'Abbiamo inviato un codice di 6 cifre a {email}. Inseriscilo per completare la registrazione.',
  authCodeSent: 'Il codice di verifica è stato inviato alla tua email.',
  authCodeLength: 'Il codice deve essere di 6 cifre.',
  authCodeWrong: 'Il codice non è corretto.',
  authChecking: 'Verifica...',
  authConfirm: 'Conferma',
  accountTitle: 'La mia pagina',
  accountInvitations: 'I miei inviti',
  accountNoInvitations: 'Non hai inviti',
  accountOrdersError: 'Impossibile caricare i tuoi inviti.',
  accountViewDesign: 'Vedi design',
  accountLogout: 'Esci',
  accountLogoutTitle: 'Vuoi uscire dall’account?',
  accountLogoutText: 'Se esci dall’account, la prossima volta dovrai inserire di nuovo email e password.',
  accountStay: 'Resta',
  accountLogoutConfirm: 'Sì, esci'
});

Object.assign(hy, {
  newHeroTitle: 'Քո հրավերը՝ նոր ձևաչափով',
  newHeroText: 'Ստեղծիր գեղեցիկ և ժամանակակից օնլայն հրավեր՝ նախատեսված հենց քո հիշարժան օրվա համար։ Ընտրիր դիզայնը, ավելացրու անհրաժեշտ տվյալները և ընդամենը մեկ հղումով ուղարկիր այն բոլոր հյուրերին։ Հեշտ, արագ և տպավորիչ։',
  creationFlowTitle: 'Ստեղծիր օնլայն հրավեր ընդամենը 10 րոպեում',
  creationFlowSubtitle: 'Պահպանիր ավանդույթը և վայելիր հարմարավետությունը',
  creationSteps: [
    { title: 'Ընտրիր դիզայնը', text: 'Գտիր քո միջոցառմանը համապատասխան ոճը և բացիր այն հեռախոսի տեսքով։' },
    { title: 'Լրացրու տվյալները', text: 'Ավելացրու անունները, օրը, ժամը, հասցեն, նկարները և հյուրերի համար կարևոր տեքստերը։' },
    { title: 'Ուղարկիր հրավերը', text: 'Կիսվիր պատրաստի հղումով WhatsApp-ով, Viber-ով, Telegram-ով կամ ցանկացած հարթակով։' }
  ],
  step: 'Քայլ',
  startCreating: 'Սկսել ստեղծել',
  new: 'Նոր',
  close: 'Փակել',
  scanQr: 'Scan QR կոդը',
  scanQrText: 'Scan արեք QR կոդը՝ հրավերը հեռախոսով բացելու համար։',
  chooseTemplate: 'Ընտրել այս ձևանմուշը',
  edit: 'Խմբագրել',
  templateDefaultDescription: 'Ժամանակակից օնլայն հրավեր՝ նկարներով, քարտեզով, RSVP-ով և մեկ հղումով արագ ուղարկելու հնարավորությամբ։',
  templateTrialNote: 'Անվճար փորձարկում · վճարիր միայն եթե հավանես',
  templateSwitchNote: 'Խմբագրման ընթացքում կարող ես փոխել ձևանմուշը։',
  templateModalFeatures: ['Փոփոխվող բովանդակություն', 'Google Maps', 'Հյուրի անվան ցուցադրում', 'RSVP', 'Անսահմանափակ նկարներ', 'Բազմալեզու տարբերակ', 'Հղումով կիսվել', 'Հյուրերի գիրք']
});

Object.assign(en, {
  newHeroTitle: 'Your invitation in a new format',
  newHeroText: 'Create a beautiful modern online invitation made for your memorable day. Choose a design, add the details, and send it to every guest with one link. Easy, fast, and impressive.',
  creationFlowTitle: 'Create your online invitation in just 10 minutes',
  creationFlowSubtitle: 'Keep the tradition and enjoy the convenience',
  creationSteps: [
    { title: 'Choose a template', text: 'Find the style that fits your event and preview it as a phone invitation.' },
    { title: 'Fill in your details', text: 'Add names, date, time, address, photos, and the text your guests need.' },
    { title: 'Send your invitation', text: 'Share the finished link through WhatsApp, Viber, Telegram, or any platform.' }
  ],
  step: 'Step',
  startCreating: 'Start creating',
  new: 'New',
  close: 'Close',
  scanQr: 'Scan QR code',
  scanQrText: 'Scan the QR code to open the invitation on your phone.',
  chooseTemplate: 'Choose this template',
  edit: 'Edit',
  templateDefaultDescription: 'A modern online invitation with photos, map, RSVP, and one-link sharing.',
  templateTrialNote: 'Free to try · pay only if you love it',
  templateSwitchNote: 'You can switch templates anytime while editing.',
  templateModalFeatures: ['Customizable content', 'Google Maps', 'Guest name display', 'RSVP', 'Unlimited photos', 'Multiple languages', 'Link sharing', 'Guest book']
});

Object.assign(ru, {
  newHeroTitle: 'Ваше приглашение в новом формате',
  newHeroText: 'Создайте красивое и современное онлайн-приглашение для вашего памятного дня. Выберите дизайн, добавьте данные и отправьте всем гостям одной ссылкой. Легко, быстро и впечатляюще.',
  creationFlowTitle: 'Создайте онлайн-приглашение всего за 10 минут',
  creationFlowSubtitle: 'Сохраняйте традиции и наслаждайтесь удобством',
  creationSteps: [
    { title: 'Выберите шаблон', text: 'Найдите стиль для вашего события и посмотрите, как приглашение выглядит на телефоне.' },
    { title: 'Заполните данные', text: 'Добавьте имена, дату, время, адрес, фотографии и важный текст для гостей.' },
    { title: 'Отправьте приглашение', text: 'Поделитесь готовой ссылкой через WhatsApp, Viber, Telegram или любую платформу.' }
  ],
  step: 'Шаг',
  startCreating: 'Начать создание',
  new: 'Новое',
  close: 'Закрыть',
  scanQr: 'Сканировать QR-код',
  scanQrText: 'Сканируйте QR-код, чтобы открыть приглашение на телефоне.',
  chooseTemplate: 'Выбрать этот шаблон',
  edit: 'Редактировать',
  templateDefaultDescription: 'Современное онлайн-приглашение с фото, картой, RSVP и быстрой отправкой одной ссылкой.',
  templateTrialNote: 'Бесплатно попробовать · платите только если понравится',
  templateSwitchNote: 'Шаблон можно сменить в процессе редактирования.',
  templateModalFeatures: ['Редактируемый контент', 'Google Maps', 'Имя гостя', 'RSVP', 'Неограниченные фото', 'Несколько языков', 'Отправка ссылкой', 'Гостевая книга']
});

Object.assign(es, {
  newHeroTitle: 'Tu invitación en un nuevo formato',
  newHeroText: 'Crea una invitación online hermosa y moderna para tu día especial. Elige un diseño, añade los datos y envíala a todos tus invitados con un solo enlace. Fácil, rápido e impactante.',
  creationFlowTitle: 'Crea tu invitación online en solo 10 minutos',
  creationFlowSubtitle: 'Mantén la tradición y disfruta la comodidad',
  creationSteps: [
    { title: 'Elige una plantilla', text: 'Encuentra el estilo ideal para tu evento y míralo como invitación móvil.' },
    { title: 'Completa tus datos', text: 'Añade nombres, fecha, hora, dirección, fotos y el texto para tus invitados.' },
    { title: 'Envía tu invitación', text: 'Comparte el enlace final por WhatsApp, Viber, Telegram o cualquier plataforma.' }
  ],
  step: 'Paso',
  startCreating: 'Empezar',
  new: 'Nuevo',
  close: 'Cerrar',
  scanQr: 'Escanear QR',
  scanQrText: 'Escanea el código QR para abrir la invitación en tu teléfono.',
  chooseTemplate: 'Elegir esta plantilla',
  edit: 'Editar',
  templateDefaultDescription: 'Una invitación online moderna con fotos, mapa, RSVP y envío con un solo enlace.',
  templateTrialNote: 'Prueba gratis · paga solo si te encanta',
  templateSwitchNote: 'Puedes cambiar de plantilla durante la edición.',
  templateModalFeatures: ['Contenido editable', 'Google Maps', 'Nombre del invitado', 'RSVP', 'Fotos ilimitadas', 'Varios idiomas', 'Compartir enlace', 'Libro de invitados']
});

Object.assign(fr, {
  newHeroTitle: 'Votre invitation dans un nouveau format',
  newHeroText: 'Créez une belle invitation en ligne moderne pour votre journée mémorable. Choisissez un design, ajoutez les informations et envoyez-la à tous vos invités avec un seul lien. Simple, rapide et marquant.',
  creationFlowTitle: 'Créez votre invitation en ligne en 10 minutes',
  creationFlowSubtitle: 'Gardez la tradition et profitez du confort',
  creationSteps: [
    { title: 'Choisissez un modèle', text: 'Trouvez le style adapté à votre événement et prévisualisez-le sur mobile.' },
    { title: 'Ajoutez vos détails', text: 'Ajoutez les noms, la date, l’heure, l’adresse, les photos et le texte pour vos invités.' },
    { title: 'Envoyez l’invitation', text: 'Partagez le lien final via WhatsApp, Viber, Telegram ou toute autre plateforme.' }
  ],
  step: 'Étape',
  startCreating: 'Commencer',
  new: 'Nouveau',
  close: 'Fermer',
  scanQr: 'Scanner le QR code',
  scanQrText: 'Scannez le QR code pour ouvrir l’invitation sur votre téléphone.',
  chooseTemplate: 'Choisir ce modèle',
  edit: 'Modifier',
  templateDefaultDescription: 'Une invitation en ligne moderne avec photos, carte, RSVP et partage par lien unique.',
  templateTrialNote: 'Essai gratuit · payez seulement si vous aimez',
  templateSwitchNote: 'Vous pouvez changer de modèle pendant l’édition.',
  templateModalFeatures: ['Contenu modifiable', 'Google Maps', 'Nom de l’invité', 'RSVP', 'Photos illimitées', 'Plusieurs langues', 'Partage par lien', 'Livre d’or']
});

Object.assign(de, {
  newHeroTitle: 'Ihre Einladung in einem neuen Format',
  newHeroText: 'Erstellen Sie eine schöne, moderne Online-Einladung für Ihren besonderen Tag. Wählen Sie ein Design, ergänzen Sie die Details und senden Sie sie mit einem einzigen Link an alle Gäste. Einfach, schnell und eindrucksvoll.',
  creationFlowTitle: 'Erstellen Sie Ihre Online-Einladung in nur 10 Minuten',
  creationFlowSubtitle: 'Bewahren Sie die Tradition und genießen Sie den Komfort',
  creationSteps: [
    { title: 'Vorlage wählen', text: 'Finden Sie den passenden Stil für Ihr Event und sehen Sie ihn als mobile Einladung.' },
    { title: 'Details ausfüllen', text: 'Ergänzen Sie Namen, Datum, Uhrzeit, Adresse, Fotos und wichtige Texte für Gäste.' },
    { title: 'Einladung senden', text: 'Teilen Sie den fertigen Link über WhatsApp, Viber, Telegram oder jede andere Plattform.' }
  ],
  step: 'Schritt',
  startCreating: 'Loslegen',
  new: 'Neu',
  close: 'Schließen',
  scanQr: 'QR-Code scannen',
  scanQrText: 'Scannen Sie den QR-Code, um die Einladung auf dem Handy zu öffnen.',
  chooseTemplate: 'Diese Vorlage wählen',
  edit: 'Bearbeiten',
  templateDefaultDescription: 'Eine moderne Online-Einladung mit Fotos, Karte, RSVP und Teilen per Einzellink.',
  templateTrialNote: 'Kostenlos testen · zahlen Sie nur, wenn es gefällt',
  templateSwitchNote: 'Sie können die Vorlage beim Bearbeiten jederzeit wechseln.',
  templateModalFeatures: ['Anpassbare Inhalte', 'Google Maps', 'Gastname', 'RSVP', 'Unbegrenzte Fotos', 'Mehrere Sprachen', 'Link teilen', 'Gästebuch']
});

Object.assign(it, {
  newHeroTitle: 'Il tuo invito in un nuovo formato',
  newHeroText: 'Crea un invito online bello e moderno per il tuo giorno speciale. Scegli un design, aggiungi i dettagli e invialo a tutti gli ospiti con un solo link. Facile, veloce e d’effetto.',
  creationFlowTitle: 'Crea il tuo invito online in soli 10 minuti',
  creationFlowSubtitle: 'Mantieni la tradizione e goditi la comodità',
  creationSteps: [
    { title: 'Scegli un modello', text: 'Trova lo stile adatto al tuo evento e visualizzalo come invito mobile.' },
    { title: 'Inserisci i dettagli', text: 'Aggiungi nomi, data, ora, indirizzo, foto e testo per gli ospiti.' },
    { title: 'Invia l’invito', text: 'Condividi il link finale tramite WhatsApp, Viber, Telegram o qualsiasi piattaforma.' }
  ],
  step: 'Passo',
  startCreating: 'Inizia',
  new: 'Nuovo',
  close: 'Chiudi',
  scanQr: 'Scansiona QR',
  scanQrText: 'Scansiona il codice QR per aprire l’invito sul telefono.',
  chooseTemplate: 'Scegli questo modello',
  edit: 'Modifica',
  templateDefaultDescription: 'Un invito online moderno con foto, mappa, RSVP e condivisione con un solo link.',
  templateTrialNote: 'Prova gratis · paga solo se ti piace',
  templateSwitchNote: 'Puoi cambiare modello durante la modifica.',
  templateModalFeatures: ['Contenuto modificabile', 'Google Maps', 'Nome ospite', 'RSVP', 'Foto illimitate', 'Più lingue', 'Condivisione link', 'Libro ospiti']
});

Object.assign(hy, {
  accountDeleteInvitation: 'Ջնջել հրավիրատոմսը',
  accountDeleteTitle: 'Ջնջե՞լ այս հրավիրատոմսը',
  accountDeleteText: 'Եթե ջնջեք հրավիրատոմսը, այն այլևս հասանելի չի լինի ձեր էջում, իսկ հյուրերի պատասխանները նույնպես կհեռացվեն։ Ջնջված հրավիրատոմսը հետ վերադարձնել հնարավոր չէ։',
  accountDeleteCancel: 'Չջնջել',
  accountDeleteConfirm: 'Այո, ջնջել',
  accountDeleteError: 'Չհաջողվեց ջնջել հրավիրատոմսը։ Խնդրում ենք փորձել կրկին։'
});

Object.assign(en, {
  accountDeleteInvitation: 'Delete invitation',
  accountDeleteTitle: 'Delete this invitation?',
  accountDeleteText: 'If you delete this invitation, it will no longer be available in your profile and guest replies will be removed as well. A deleted invitation cannot be restored.',
  accountDeleteCancel: 'Keep it',
  accountDeleteConfirm: 'Yes, delete',
  accountDeleteError: 'Could not delete the invitation. Please try again.'
});

Object.assign(ru, {
  accountDeleteInvitation: 'Удалить приглашение',
  accountDeleteTitle: 'Удалить это приглашение?',
  accountDeleteText: 'Если удалить приглашение, оно больше не будет доступно в вашем профиле, а ответы гостей также будут удалены. Удаленное приглашение восстановить невозможно.',
  accountDeleteCancel: 'Не удалять',
  accountDeleteConfirm: 'Да, удалить',
  accountDeleteError: 'Не удалось удалить приглашение. Попробуйте еще раз.'
});

Object.assign(es, {
  accountDeleteInvitation: 'Eliminar invitación',
  accountDeleteTitle: '¿Eliminar esta invitación?',
  accountDeleteText: 'Si eliminas esta invitación, ya no estará disponible en tu perfil y también se eliminarán las respuestas de los invitados. Una invitación eliminada no se puede restaurar.',
  accountDeleteCancel: 'Conservar',
  accountDeleteConfirm: 'Sí, eliminar',
  accountDeleteError: 'No se pudo eliminar la invitación. Inténtalo de nuevo.'
});

Object.assign(fr, {
  accountDeleteInvitation: 'Supprimer l’invitation',
  accountDeleteTitle: 'Supprimer cette invitation ?',
  accountDeleteText: 'Si vous supprimez cette invitation, elle ne sera plus disponible dans votre profil et les réponses des invités seront également supprimées. Une invitation supprimée ne peut pas être restaurée.',
  accountDeleteCancel: 'Conserver',
  accountDeleteConfirm: 'Oui, supprimer',
  accountDeleteError: 'Impossible de supprimer l’invitation. Veuillez réessayer.'
});

Object.assign(de, {
  accountDeleteInvitation: 'Einladung löschen',
  accountDeleteTitle: 'Diese Einladung löschen?',
  accountDeleteText: 'Wenn Sie diese Einladung löschen, ist sie in Ihrem Profil nicht mehr verfügbar und die Antworten der Gäste werden ebenfalls entfernt. Eine gelöschte Einladung kann nicht wiederhergestellt werden.',
  accountDeleteCancel: 'Behalten',
  accountDeleteConfirm: 'Ja, löschen',
  accountDeleteError: 'Die Einladung konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.'
});

Object.assign(it, {
  accountDeleteInvitation: 'Elimina invito',
  accountDeleteTitle: 'Eliminare questo invito?',
  accountDeleteText: 'Se elimini questo invito, non sarà più disponibile nel tuo profilo e verranno eliminate anche le risposte degli ospiti. Un invito eliminato non può essere ripristinato.',
  accountDeleteCancel: 'Conserva',
  accountDeleteConfirm: 'Sì, elimina',
  accountDeleteError: 'Impossibile eliminare l’invito. Riprova.'
});

Object.assign(hy, {
  occasionBrowserKicker: 'Առիթներ',
  occasionBrowserTitle: 'Կատալոգ ըստ առիթի',
  editRequiredTitle: 'Նախ խմբագրեք հրավերը',
  editRequiredText: 'Գնելուց առաջ լրացրեք անունները, օրը, ժամը և միջոցառման մյուս անհրաժեշտ մանրամասները։',
  editRequiredAction: 'Խմբագրել հիմա',
  editRequiredLater: 'Ավելի ուշ'
});

Object.assign(en, {
  occasionBrowserKicker: 'Occasions',
  occasionBrowserTitle: 'Browse by occasion',
  editRequiredTitle: 'Edit your invitation first',
  editRequiredText: 'Before ordering, add the names, date, time, and the other details for your event.',
  editRequiredAction: 'Edit now',
  editRequiredLater: 'Maybe later'
});

Object.assign(ru, {
  occasionBrowserKicker: 'События',
  occasionBrowserTitle: 'Выберите приглашение по случаю',
  editRequiredTitle: 'Сначала отредактируйте приглашение',
  editRequiredText: 'Перед заказом укажите имена, дату, время и другие необходимые данные мероприятия.',
  editRequiredAction: 'Редактировать',
  editRequiredLater: 'Позже'
});

Object.assign(es, {
  occasionBrowserKicker: 'Ocasiones',
  occasionBrowserTitle: 'Elige según la ocasión',
  editRequiredTitle: 'Edita primero tu invitación',
  editRequiredText: 'Antes de pedir, añade los nombres, la fecha, la hora y los demás datos del evento.',
  editRequiredAction: 'Editar ahora',
  editRequiredLater: 'Más tarde'
});

Object.assign(fr, {
  occasionBrowserKicker: 'Occasions',
  occasionBrowserTitle: 'Choisissez selon l’occasion',
  editRequiredTitle: 'Modifiez d’abord votre invitation',
  editRequiredText: 'Avant de commander, ajoutez les noms, la date, l’heure et les autres informations de l’événement.',
  editRequiredAction: 'Modifier maintenant',
  editRequiredLater: 'Plus tard'
});

Object.assign(de, {
  occasionBrowserKicker: 'Anlässe',
  occasionBrowserTitle: 'Nach Anlass auswählen',
  editRequiredTitle: 'Einladung zuerst bearbeiten',
  editRequiredText: 'Ergänzen Sie vor der Bestellung Namen, Datum, Uhrzeit und die weiteren Veranstaltungsdetails.',
  editRequiredAction: 'Jetzt bearbeiten',
  editRequiredLater: 'Später'
});

Object.assign(it, {
  occasionBrowserKicker: 'Occasioni',
  occasionBrowserTitle: 'Scegli per occasione',
  editRequiredTitle: 'Prima modifica il tuo invito',
  editRequiredText: 'Prima di ordinare, aggiungi i nomi, la data, l’ora e gli altri dettagli dell’evento.',
  editRequiredAction: 'Modifica ora',
  editRequiredLater: 'Più tardi'
});

Object.assign(en, {
  accountSubtitle: 'Your purchased invitations and guest replies',
  accountViewInvitation: 'View invitation',
  accountInvitationPending: 'The invitation is not ready yet',
  accountGuestResponses: 'Guest replies',
  accountGuestResponsesDescription: 'View names, attendance, and all submitted details',
  guestResponsesBack: 'Back to my invitations',
  guestResponsesLoading: 'Loading guest replies...',
  guestResponsesErrorTitle: 'Could not open the details',
  guestResponsesErrorText: 'Refresh the page or return to your profile.',
  guestResponsesErrorBack: 'Back to profile',
  guestResponsesInvitationAlt: '{name} invitation',
  guestResponsesInvitation: 'Invitation',
  guestResponsesDescription: 'All guest attendance details are collected here.',
  guestResponsesSummaryLabel: 'Guest reply summary',
  guestResponsesAttending: 'Attending',
  guestResponsesDeclined: 'Not attending',
  guestResponsesUnsure: 'Not sure',
  guestResponsesTotal: 'Total',
  guestResponsesGuests: 'guests',
  guestResponsesReplies: 'replies',
  guestResponsesFilterLabel: 'Filter guest replies',
  guestResponsesAll: 'All',
  guestResponsesEmptyTitle: 'No replies yet',
  guestResponsesEmptyText: 'Guest replies will appear here immediately after they are submitted.',
  guestResponsesFilterEmptyTitle: 'There are no replies in this group',
  guestResponsesShowAll: 'Show all',
  guestResponsesFamilyGuest: 'Family guest',
  guestResponsesGodparentGuest: 'Godparent’s guest',
  guestResponsesBrideSide: 'Bride’s side',
  guestResponsesGroomSide: 'Groom’s side',
  guestResponsesGuestCount: '{count} guests'
});

Object.assign(hy, {
  accountSubtitle: 'Ձեր գնված հրավիրատոմսերը և հյուրերի պատասխանները',
  accountViewInvitation: 'Դիտել հրավերը',
  accountInvitationPending: 'Հրավերը դեռ պատրաստ չէ',
  accountGuestResponses: 'Հյուրերի պատասխանները',
  accountGuestResponsesDescription: 'Դիտել անունները, մասնակցությունը և բոլոր տվյալները',
  guestResponsesBack: 'Վերադառնալ իմ հրավիրատոմսերին',
  guestResponsesLoading: 'Բեռնվում են հյուրերի պատասխանները...',
  guestResponsesErrorTitle: 'Չհաջողվեց բացել տվյալները',
  guestResponsesErrorText: 'Խնդրում ենք թարմացնել էջը կամ վերադառնալ ձեր էջ։',
  guestResponsesErrorBack: 'Վերադառնալ իմ էջ',
  guestResponsesInvitationAlt: '{name} հրավիրատոմս',
  guestResponsesInvitation: 'Հրավիրատոմս',
  guestResponsesDescription: 'Այստեղ հավաքված են հյուրերի մասնակցության բոլոր տվյալները։',
  guestResponsesSummaryLabel: 'Հյուրերի պատասխանների ամփոփում',
  guestResponsesAttending: 'Գալու են',
  guestResponsesDeclined: 'Չեն գալու',
  guestResponsesUnsure: 'Վստահ չեն',
  guestResponsesTotal: 'Ընդհանուր',
  guestResponsesGuests: 'ընդհանուր հյուր',
  guestResponsesReplies: 'պատասխան',
  guestResponsesFilterLabel: 'Ֆիլտրել պատասխանները',
  guestResponsesAll: 'Բոլորը',
  guestResponsesEmptyTitle: 'Դեռ պատասխաններ չկան',
  guestResponsesEmptyText: 'Հյուրերի պատասխանները կհայտնվեն այստեղ՝ լրացնելուց անմիջապես հետո։',
  guestResponsesFilterEmptyTitle: 'Այս խմբում պատասխաններ չկան',
  guestResponsesShowAll: 'Ցույց տալ բոլորը',
  guestResponsesFamilyGuest: 'Ընտանիքի հյուր',
  guestResponsesGodparentGuest: 'Կնքահոր / կնքամոր հյուր',
  guestResponsesBrideSide: 'Հարսի կողմ',
  guestResponsesGroomSide: 'Փեսայի կողմ',
  guestResponsesGuestCount: '{count} հյուր'
});

Object.assign(ru, {
  accountSubtitle: 'Ваши приобретенные приглашения и ответы гостей',
  accountViewInvitation: 'Посмотреть приглашение',
  accountInvitationPending: 'Приглашение еще не готово',
  accountGuestResponses: 'Ответы гостей',
  accountGuestResponsesDescription: 'Посмотреть имена, участие и все отправленные данные',
  guestResponsesBack: 'Вернуться к моим приглашениям',
  guestResponsesLoading: 'Загружаем ответы гостей...',
  guestResponsesErrorTitle: 'Не удалось открыть данные',
  guestResponsesErrorText: 'Обновите страницу или вернитесь в профиль.',
  guestResponsesErrorBack: 'Вернуться в профиль',
  guestResponsesInvitationAlt: 'Приглашение {name}',
  guestResponsesInvitation: 'Приглашение',
  guestResponsesDescription: 'Здесь собраны все данные об участии гостей.',
  guestResponsesSummaryLabel: 'Сводка ответов гостей',
  guestResponsesAttending: 'Придут',
  guestResponsesDeclined: 'Не придут',
  guestResponsesUnsure: 'Не уверены',
  guestResponsesTotal: 'Всего',
  guestResponsesGuests: 'гостей',
  guestResponsesReplies: 'ответов',
  guestResponsesFilterLabel: 'Фильтровать ответы',
  guestResponsesAll: 'Все',
  guestResponsesEmptyTitle: 'Ответов пока нет',
  guestResponsesEmptyText: 'Ответы гостей появятся здесь сразу после отправки.',
  guestResponsesFilterEmptyTitle: 'В этой группе нет ответов',
  guestResponsesShowAll: 'Показать все',
  guestResponsesFamilyGuest: 'Гость семьи',
  guestResponsesGodparentGuest: 'Гость крестного / крестной',
  guestResponsesBrideSide: 'Сторона невесты',
  guestResponsesGroomSide: 'Сторона жениха',
  guestResponsesGuestCount: 'Гостей: {count}'
});

Object.assign(es, {
  accountSubtitle: 'Tus invitaciones compradas y las respuestas de los invitados',
  accountViewInvitation: 'Ver invitación',
  accountInvitationPending: 'La invitación aún no está lista',
  accountGuestResponses: 'Respuestas de invitados',
  accountGuestResponsesDescription: 'Consulta nombres, asistencia y todos los datos enviados',
  guestResponsesBack: 'Volver a mis invitaciones',
  guestResponsesLoading: 'Cargando respuestas...',
  guestResponsesErrorTitle: 'No se pudieron abrir los datos',
  guestResponsesErrorText: 'Actualiza la página o vuelve a tu perfil.',
  guestResponsesErrorBack: 'Volver al perfil',
  guestResponsesInvitationAlt: 'Invitación de {name}',
  guestResponsesInvitation: 'Invitación',
  guestResponsesDescription: 'Aquí se reúnen todos los datos de asistencia de los invitados.',
  guestResponsesSummaryLabel: 'Resumen de respuestas',
  guestResponsesAttending: 'Asistirán',
  guestResponsesDeclined: 'No asistirán',
  guestResponsesUnsure: 'No están seguros',
  guestResponsesTotal: 'Total',
  guestResponsesGuests: 'invitados',
  guestResponsesReplies: 'respuestas',
  guestResponsesFilterLabel: 'Filtrar respuestas',
  guestResponsesAll: 'Todos',
  guestResponsesEmptyTitle: 'Aún no hay respuestas',
  guestResponsesEmptyText: 'Las respuestas aparecerán aquí inmediatamente después de enviarse.',
  guestResponsesFilterEmptyTitle: 'No hay respuestas en este grupo',
  guestResponsesShowAll: 'Mostrar todos',
  guestResponsesFamilyGuest: 'Invitado de la familia',
  guestResponsesGodparentGuest: 'Invitado del padrino o la madrina',
  guestResponsesBrideSide: 'Familia de la novia',
  guestResponsesGroomSide: 'Familia del novio',
  guestResponsesGuestCount: '{count} invitados'
});

Object.assign(fr, {
  accountSubtitle: 'Vos invitations achetées et les réponses des invités',
  accountViewInvitation: 'Voir l’invitation',
  accountInvitationPending: 'L’invitation n’est pas encore prête',
  accountGuestResponses: 'Réponses des invités',
  accountGuestResponsesDescription: 'Consultez les noms, la présence et toutes les informations envoyées',
  guestResponsesBack: 'Retour à mes invitations',
  guestResponsesLoading: 'Chargement des réponses...',
  guestResponsesErrorTitle: 'Impossible d’ouvrir les informations',
  guestResponsesErrorText: 'Actualisez la page ou revenez à votre profil.',
  guestResponsesErrorBack: 'Retour au profil',
  guestResponsesInvitationAlt: 'Invitation de {name}',
  guestResponsesInvitation: 'Invitation',
  guestResponsesDescription: 'Toutes les informations de présence des invités sont réunies ici.',
  guestResponsesSummaryLabel: 'Résumé des réponses',
  guestResponsesAttending: 'Présents',
  guestResponsesDeclined: 'Absents',
  guestResponsesUnsure: 'Indécis',
  guestResponsesTotal: 'Total',
  guestResponsesGuests: 'invités',
  guestResponsesReplies: 'réponses',
  guestResponsesFilterLabel: 'Filtrer les réponses',
  guestResponsesAll: 'Tous',
  guestResponsesEmptyTitle: 'Aucune réponse pour le moment',
  guestResponsesEmptyText: 'Les réponses apparaîtront ici dès leur envoi.',
  guestResponsesFilterEmptyTitle: 'Aucune réponse dans ce groupe',
  guestResponsesShowAll: 'Tout afficher',
  guestResponsesFamilyGuest: 'Invité de la famille',
  guestResponsesGodparentGuest: 'Invité du parrain ou de la marraine',
  guestResponsesBrideSide: 'Côté de la mariée',
  guestResponsesGroomSide: 'Côté du marié',
  guestResponsesGuestCount: '{count} invités'
});

Object.assign(de, {
  accountSubtitle: 'Ihre gekauften Einladungen und die Antworten der Gäste',
  accountViewInvitation: 'Einladung ansehen',
  accountInvitationPending: 'Die Einladung ist noch nicht fertig',
  accountGuestResponses: 'Gästeantworten',
  accountGuestResponsesDescription: 'Namen, Teilnahme und alle übermittelten Angaben ansehen',
  guestResponsesBack: 'Zurück zu meinen Einladungen',
  guestResponsesLoading: 'Gästeantworten werden geladen...',
  guestResponsesErrorTitle: 'Die Angaben konnten nicht geöffnet werden',
  guestResponsesErrorText: 'Aktualisieren Sie die Seite oder kehren Sie zu Ihrem Profil zurück.',
  guestResponsesErrorBack: 'Zurück zum Profil',
  guestResponsesInvitationAlt: 'Einladung von {name}',
  guestResponsesInvitation: 'Einladung',
  guestResponsesDescription: 'Hier finden Sie alle Angaben zur Teilnahme Ihrer Gäste.',
  guestResponsesSummaryLabel: 'Zusammenfassung der Gästeantworten',
  guestResponsesAttending: 'Dabei',
  guestResponsesDeclined: 'Nicht dabei',
  guestResponsesUnsure: 'Unsicher',
  guestResponsesTotal: 'Gesamt',
  guestResponsesGuests: 'Gäste',
  guestResponsesReplies: 'Antworten',
  guestResponsesFilterLabel: 'Antworten filtern',
  guestResponsesAll: 'Alle',
  guestResponsesEmptyTitle: 'Noch keine Antworten',
  guestResponsesEmptyText: 'Die Antworten erscheinen hier direkt nach dem Absenden.',
  guestResponsesFilterEmptyTitle: 'Keine Antworten in dieser Gruppe',
  guestResponsesShowAll: 'Alle anzeigen',
  guestResponsesFamilyGuest: 'Gast der Familie',
  guestResponsesGodparentGuest: 'Gast der Taufpaten',
  guestResponsesBrideSide: 'Seite der Braut',
  guestResponsesGroomSide: 'Seite des Bräutigams',
  guestResponsesGuestCount: '{count} Gäste'
});

Object.assign(it, {
  accountSubtitle: 'I tuoi inviti acquistati e le risposte degli ospiti',
  accountViewInvitation: 'Vedi invito',
  accountInvitationPending: 'L’invito non è ancora pronto',
  accountGuestResponses: 'Risposte degli ospiti',
  accountGuestResponsesDescription: 'Visualizza nomi, partecipazione e tutti i dati inviati',
  guestResponsesBack: 'Torna ai miei inviti',
  guestResponsesLoading: 'Caricamento delle risposte...',
  guestResponsesErrorTitle: 'Impossibile aprire i dati',
  guestResponsesErrorText: 'Aggiorna la pagina o torna al tuo profilo.',
  guestResponsesErrorBack: 'Torna al profilo',
  guestResponsesInvitationAlt: 'Invito di {name}',
  guestResponsesInvitation: 'Invito',
  guestResponsesDescription: 'Qui sono raccolti tutti i dati di partecipazione degli ospiti.',
  guestResponsesSummaryLabel: 'Riepilogo delle risposte',
  guestResponsesAttending: 'Parteciperanno',
  guestResponsesDeclined: 'Non parteciperanno',
  guestResponsesUnsure: 'Non sono sicuri',
  guestResponsesTotal: 'Totale',
  guestResponsesGuests: 'ospiti',
  guestResponsesReplies: 'risposte',
  guestResponsesFilterLabel: 'Filtra le risposte',
  guestResponsesAll: 'Tutti',
  guestResponsesEmptyTitle: 'Nessuna risposta',
  guestResponsesEmptyText: 'Le risposte appariranno qui subito dopo l’invio.',
  guestResponsesFilterEmptyTitle: 'Nessuna risposta in questo gruppo',
  guestResponsesShowAll: 'Mostra tutti',
  guestResponsesFamilyGuest: 'Ospite della famiglia',
  guestResponsesGodparentGuest: 'Ospite del padrino o della madrina',
  guestResponsesBrideSide: 'Parte della sposa',
  guestResponsesGroomSide: 'Parte dello sposo',
  guestResponsesGuestCount: '{count} ospiti'
});

Object.assign(hy, {
  telegramCardTitle: 'Telegram ծանուցումներ',
  telegramCardDescription: 'Ստացեք հյուրերի պատասխանները Telegram-ում և արագ բացեք ձեր հրավիրատոմսերը։',
  telegramConnectedDescription: 'Ծանուցումները միացված են։ Նոր պատասխանները կստանաք անմիջապես Telegram-ում։',
  telegramConnected: 'Telegram-ը միացված է',
  telegramNotConnected: 'Telegram-ը միացված չէ',
  telegramChecking: 'Ստուգվում է կապը',
  telegramConnect: 'Միացնել Telegram-ը',
  telegramWaitingForStart: 'Սպասում ենք Start-ին',
  telegramOpenBot: 'Բացել բոտը',
  telegramDisconnect: 'Անջատել',
  telegramDisconnecting: 'Անջատվում է',
  telegramDisconnectConfirm: 'Անջատե՞լ Telegram-ը։ Հյուրերի նոր պատասխանների ավտոմատ ծանուցումները կդադարեն։',
  telegramStatusError: 'Չհաջողվեց ստուգել Telegram-ի կապը։ Կրկին փորձեք։',
  telegramLinkExpired: 'Կապման ժամանակը լրացավ։ Սեղմեք կոճակը՝ նորից փորձելու համար։',
  telegramNotConfigured: 'Telegram ծառայությունը ժամանակավորապես անհասանելի է։',
  telegramMaintenance: 'Ժամանակավորապես անհասանելի է',
  telegramMaintenanceDescription: 'Telegram ծառայության վրա կատարվում են տեխնիկական աշխատանքներ։ Այն շուտով կրկին հասանելի կլինի։',
  telegramComingSoon: 'Շուտով հասանելի կլինի',
  telegramConnectError: 'Չհաջողվեց բացել Telegram bot-ը։ Ստուգեք կարգավորումները և կրկին փորձեք։',
  telegramDisconnectError: 'Չհաջողվեց անջատել Telegram-ը։ Կրկին փորձեք։'
});

Object.assign(en, {
  telegramCardTitle: 'Telegram notifications',
  telegramCardDescription: 'Receive guest replies in Telegram and quickly open your invitations.',
  telegramConnectedDescription: 'Notifications are on. New guest replies will arrive in Telegram.',
  telegramConnected: 'Telegram connected',
  telegramNotConnected: 'Telegram not connected',
  telegramChecking: 'Checking connection',
  telegramConnect: 'Connect Telegram',
  telegramWaitingForStart: 'Waiting for Start',
  telegramOpenBot: 'Open bot',
  telegramDisconnect: 'Disconnect',
  telegramDisconnecting: 'Disconnecting',
  telegramDisconnectConfirm: 'Disconnect Telegram? Automatic notifications for new guest replies will stop.',
  telegramStatusError: 'Could not check the Telegram connection. Please try again.',
  telegramLinkExpired: 'The connection time expired. Press the button to try again.',
  telegramNotConfigured: 'Telegram service is temporarily unavailable.',
  telegramMaintenance: 'Temporarily unavailable',
  telegramMaintenanceDescription: 'Telegram service is undergoing maintenance and will be available again soon.',
  telegramComingSoon: 'Available soon',
  telegramConnectError: 'Could not open the Telegram bot. Check the configuration and try again.',
  telegramDisconnectError: 'Could not disconnect Telegram. Please try again.'
});

Object.assign(ru, {
  telegramCardTitle: 'Уведомления в Telegram',
  telegramCardDescription: 'Получайте ответы гостей в Telegram и быстро открывайте свои приглашения.',
  telegramConnectedDescription: 'Уведомления включены. Новые ответы гостей придут в Telegram.',
  telegramConnected: 'Telegram подключён',
  telegramNotConnected: 'Telegram не подключён',
  telegramChecking: 'Проверяем подключение',
  telegramConnect: 'Подключить Telegram',
  telegramWaitingForStart: 'Ожидаем Start',
  telegramOpenBot: 'Открыть бота',
  telegramDisconnect: 'Отключить',
  telegramDisconnecting: 'Отключение',
  telegramDisconnectConfirm: 'Отключить Telegram? Автоматические уведомления о новых ответах гостей прекратятся.',
  telegramStatusError: 'Не удалось проверить подключение Telegram. Попробуйте ещё раз.',
  telegramLinkExpired: 'Время подключения истекло. Нажмите кнопку, чтобы попробовать снова.',
  telegramNotConfigured: 'Сервис Telegram временно недоступен.',
  telegramMaintenance: 'Временно недоступно',
  telegramMaintenanceDescription: 'В сервисе Telegram проводятся технические работы. Он снова станет доступен в ближайшее время.',
  telegramComingSoon: 'Скоро будет доступно',
  telegramConnectError: 'Не удалось открыть Telegram-бота. Проверьте настройки и попробуйте ещё раз.',
  telegramDisconnectError: 'Не удалось отключить Telegram. Попробуйте ещё раз.'
});

Object.assign(es, {
  telegramCardTitle: 'Notificaciones de Telegram',
  telegramCardDescription: 'Recibe las respuestas en Telegram y abre rápidamente tus invitaciones.',
  telegramConnectedDescription: 'Las notificaciones están activas. Las nuevas respuestas llegarán a Telegram.',
  telegramConnected: 'Telegram conectado',
  telegramNotConnected: 'Telegram no conectado',
  telegramChecking: 'Comprobando conexión',
  telegramConnect: 'Conectar Telegram',
  telegramWaitingForStart: 'Esperando Start',
  telegramOpenBot: 'Abrir bot',
  telegramDisconnect: 'Desconectar',
  telegramDisconnecting: 'Desconectando',
  telegramDisconnectConfirm: '¿Desconectar Telegram? Se detendrán las notificaciones automáticas de nuevas respuestas.',
  telegramStatusError: 'No se pudo comprobar la conexión con Telegram. Inténtalo de nuevo.',
  telegramLinkExpired: 'El tiempo de conexión ha caducado. Pulsa el botón para intentarlo de nuevo.',
  telegramNotConfigured: 'El servicio de Telegram no está disponible temporalmente.',
  telegramMaintenance: 'Temporalmente no disponible',
  telegramMaintenanceDescription: 'El servicio de Telegram está en mantenimiento y volverá a estar disponible pronto.',
  telegramComingSoon: 'Disponible pronto',
  telegramConnectError: 'No se pudo abrir el bot de Telegram. Revisa la configuración e inténtalo de nuevo.',
  telegramDisconnectError: 'No se pudo desconectar Telegram. Inténtalo de nuevo.'
});

Object.assign(fr, {
  telegramCardTitle: 'Notifications Telegram',
  telegramCardDescription: 'Recevez les réponses dans Telegram et ouvrez rapidement vos invitations.',
  telegramConnectedDescription: 'Les notifications sont actives. Les nouvelles réponses arriveront dans Telegram.',
  telegramConnected: 'Telegram connecté',
  telegramNotConnected: 'Telegram non connecté',
  telegramChecking: 'Vérification de la connexion',
  telegramConnect: 'Connecter Telegram',
  telegramWaitingForStart: 'En attente de Start',
  telegramOpenBot: 'Ouvrir le bot',
  telegramDisconnect: 'Déconnecter',
  telegramDisconnecting: 'Déconnexion',
  telegramDisconnectConfirm: 'Déconnecter Telegram ? Les notifications automatiques des nouvelles réponses s’arrêteront.',
  telegramStatusError: 'Impossible de vérifier la connexion Telegram. Veuillez réessayer.',
  telegramLinkExpired: 'Le délai de connexion a expiré. Appuyez sur le bouton pour réessayer.',
  telegramNotConfigured: 'Le service Telegram est temporairement indisponible.',
  telegramMaintenance: 'Temporairement indisponible',
  telegramMaintenanceDescription: 'Le service Telegram est en maintenance et sera de nouveau disponible prochainement.',
  telegramComingSoon: 'Bientôt disponible',
  telegramConnectError: 'Impossible d’ouvrir le bot Telegram. Vérifiez la configuration et réessayez.',
  telegramDisconnectError: 'Impossible de déconnecter Telegram. Veuillez réessayer.'
});

Object.assign(de, {
  telegramCardTitle: 'Telegram-Benachrichtigungen',
  telegramCardDescription: 'Erhalten Sie Gästeantworten in Telegram und öffnen Sie Ihre Einladungen schnell.',
  telegramConnectedDescription: 'Benachrichtigungen sind aktiv. Neue Gästeantworten kommen in Telegram an.',
  telegramConnected: 'Telegram verbunden',
  telegramNotConnected: 'Telegram nicht verbunden',
  telegramChecking: 'Verbindung wird geprüft',
  telegramConnect: 'Telegram verbinden',
  telegramWaitingForStart: 'Warten auf Start',
  telegramOpenBot: 'Bot öffnen',
  telegramDisconnect: 'Trennen',
  telegramDisconnecting: 'Wird getrennt',
  telegramDisconnectConfirm: 'Telegram trennen? Automatische Benachrichtigungen über neue Gästeantworten werden beendet.',
  telegramStatusError: 'Die Telegram-Verbindung konnte nicht geprüft werden. Bitte versuchen Sie es erneut.',
  telegramLinkExpired: 'Die Verbindungszeit ist abgelaufen. Klicken Sie zum erneuten Versuch auf die Schaltfläche.',
  telegramNotConfigured: 'Der Telegram-Dienst ist vorübergehend nicht verfügbar.',
  telegramMaintenance: 'Vorübergehend nicht verfügbar',
  telegramMaintenanceDescription: 'Der Telegram-Dienst wird derzeit gewartet und ist bald wieder verfügbar.',
  telegramComingSoon: 'Bald verfügbar',
  telegramConnectError: 'Der Telegram-Bot konnte nicht geöffnet werden. Prüfen Sie die Konfiguration.',
  telegramDisconnectError: 'Telegram konnte nicht getrennt werden. Bitte versuchen Sie es erneut.'
});

Object.assign(it, {
  telegramCardTitle: 'Notifiche Telegram',
  telegramCardDescription: 'Ricevi le risposte su Telegram e apri rapidamente i tuoi inviti.',
  telegramConnectedDescription: 'Le notifiche sono attive. Le nuove risposte arriveranno su Telegram.',
  telegramConnected: 'Telegram collegato',
  telegramNotConnected: 'Telegram non collegato',
  telegramChecking: 'Verifica connessione',
  telegramConnect: 'Collega Telegram',
  telegramWaitingForStart: 'In attesa di Start',
  telegramOpenBot: 'Apri bot',
  telegramDisconnect: 'Scollega',
  telegramDisconnecting: 'Scollegamento',
  telegramDisconnectConfirm: 'Scollegare Telegram? Le notifiche automatiche delle nuove risposte si interromperanno.',
  telegramStatusError: 'Impossibile verificare la connessione Telegram. Riprova.',
  telegramLinkExpired: 'Il tempo di connessione è scaduto. Premi il pulsante per riprovare.',
  telegramNotConfigured: 'Il servizio Telegram è temporaneamente non disponibile.',
  telegramMaintenance: 'Temporaneamente non disponibile',
  telegramMaintenanceDescription: 'Il servizio Telegram è in manutenzione e tornerà disponibile a breve.',
  telegramComingSoon: 'Disponibile a breve',
  telegramConnectError: 'Impossibile aprire il bot Telegram. Controlla la configurazione e riprova.',
  telegramDisconnectError: 'Impossibile scollegare Telegram. Riprova.'
});

Object.assign(en, {
  promoQuestionKicker: 'A little gift', promoQuestion: 'Do you have a promo code?', promoQuestionText: 'Enter it now to reveal your Amulet gift before payment.', promoCodeLabel: 'Promo code', promoApply: 'Reveal gift', promoNoCode: 'Continue without a promo code', promoInvalid: 'This promo code is invalid or expired.', promoGiftUnlocked: 'Your gift is unlocked', promoDiscountApplied: 'discount applied', promoContinue: 'Continue to payment',
  addReview: 'Add a review', addReviewHint: 'Tell us about your invitation', reviewSubmitted: 'Review submitted', reviewPendingApproval: 'Thank you — it is awaiting approval', reviewThankYou: 'Thank you for your review!', reviewRating: 'Your rating', reviewText: 'Your experience', submitReview: 'Submit review', reviewSubmitError: 'The review could not be submitted.', cancel: 'Cancel'
});

Object.assign(hy, {
  promoQuestionKicker: 'Փոքրիկ նվեր', promoQuestion: 'Ունե՞ք պրոմոկոդ', promoQuestionText: 'Մուտքագրեք այն և բացահայտեք Ձեր Amulet նվերը վճարումից առաջ։', promoCodeLabel: 'Պրոմոկոդ', promoApply: 'Բացել նվերը', promoNoCode: 'Շարունակել առանց պրոմոկոդի', promoInvalid: 'Պրոմոկոդը սխալ է կամ ժամկետանց։', promoGiftUnlocked: 'Ձեր նվերը բացված է', promoDiscountApplied: 'զեղչ կիրառվեց', promoContinue: 'Շարունակել վճարումը',
  addReview: 'Ավելացնել կարծիք', addReviewHint: 'Պատմեք Ձեր հրավերի փորձի մասին', reviewSubmitted: 'Կարծիքն ուղարկված է', reviewPendingApproval: 'Շնորհակալություն․ այն սպասում է հաստատման', reviewThankYou: 'Շնորհակալություն կարծիքի համար', reviewRating: 'Ձեր գնահատականը', reviewText: 'Ձեր տպավորությունը', submitReview: 'Ուղարկել կարծիքը', reviewSubmitError: 'Չհաջողվեց ուղարկել կարծիքը։', cancel: 'Չեղարկել'
});

Object.assign(ru, {
  promoQuestionKicker: 'Небольшой подарок', promoQuestion: 'У вас есть промокод?', promoQuestionText: 'Введите его, чтобы открыть подарок Amulet до оплаты.', promoCodeLabel: 'Промокод', promoApply: 'Открыть подарок', promoNoCode: 'Продолжить без промокода', promoInvalid: 'Промокод недействителен или истёк.', promoGiftUnlocked: 'Ваш подарок открыт', promoDiscountApplied: 'скидка применена', promoContinue: 'Перейти к оплате',
  addReview: 'Добавить отзыв', addReviewHint: 'Расскажите о вашем приглашении', reviewSubmitted: 'Отзыв отправлен', reviewPendingApproval: 'Спасибо — он ожидает проверки', reviewThankYou: 'Спасибо за отзыв!', reviewRating: 'Ваша оценка', reviewText: 'Ваши впечатления', submitReview: 'Отправить отзыв', reviewSubmitError: 'Не удалось отправить отзыв.', cancel: 'Отмена'
});

Object.assign(es, { promoInvalid: 'Este código promocional no es válido o ha caducado.' });
Object.assign(fr, { promoInvalid: 'Ce code promotionnel est invalide ou a expiré.' });
Object.assign(de, { promoInvalid: 'Dieser Aktionscode ist ungültig oder abgelaufen.' });
Object.assign(it, { promoInvalid: 'Questo codice promozionale non è valido o è scaduto.' });

Object.assign(en, {
  authIdentifier: 'Email or phone number', authIdentifierPlaceholder: 'name@example.com or 041 401415', authRepeatPassword: 'Repeat password', authForgotPassword: 'Forgot password?',
  authPasswordRules: 'Password requirements', authPasswordLength: 'At least 8 characters', authPasswordUppercase: 'One uppercase letter', authPasswordLowercase: 'One lowercase letter', authPasswordNumber: 'One number', authPasswordSpecial: 'One special character', authPasswordRulesError: 'Please meet every password requirement.', authPasswordsMismatch: 'Passwords do not match.',
  authResetTitle: 'Reset your password', authResetIntro: 'Enter your account email and we will send a secure 6-digit code.', authSendResetCode: 'Send reset code', authResetCodeTitle: 'Enter the email code', authResetCodeIntro: 'We sent a 6-digit code to {email}.', authNewPasswordTitle: 'Create a new password', authNewPasswordIntro: 'Choose a strong password you have not used before.', authNewPassword: 'New password', authSavePassword: 'Save new password', authResetCompleteTitle: 'Password updated', authResetCompleteIntro: 'Your password was changed securely. Redirecting you to login.',
  customDesignCtaKicker: 'Made only for your story', customDesignCtaTitle: 'Need a completely custom invitation?', customDesignCtaText: 'Send your event details and inspiration. Our designers will contact you with a personal concept.', customDesignCtaButton: 'Order a custom design', inspirationLink: 'Style or inspiration link', budgetRange: 'Planned budget', customRequestNote: 'Describe the desired style, colors, sections, and any special ideas.'
});

Object.assign(hy, {
  authIdentifier: 'Էլ․ հասցե կամ հեռախոսահամար', authIdentifierPlaceholder: 'name@example.com կամ 041 401415', authRepeatPassword: 'Կրկնել գաղտնաբառը', authForgotPassword: 'Մոռացե՞լ եք գաղտնաբառը',
  authPasswordRules: 'Գաղտնաբառի պահանջները', authPasswordLength: 'Առնվազն 8 նիշ', authPasswordUppercase: 'Մեկ մեծատառ լատինատառ', authPasswordLowercase: 'Մեկ փոքրատառ լատինատառ', authPasswordNumber: 'Մեկ թիվ', authPasswordSpecial: 'Մեկ հատուկ նշան', authPasswordRulesError: 'Խնդրում ենք կատարել գաղտնաբառի բոլոր պահանջները։', authPasswordsMismatch: 'Գաղտնաբառերը չեն համընկնում։',
  authResetTitle: 'Վերականգնել գաղտնաբառը', authResetIntro: 'Գրեք օգտահաշվի էլ․ հասցեն, և մենք կուղարկենք անվտանգ 6-նիշ կոդ։', authSendResetCode: 'Ուղարկել կոդը', authResetCodeTitle: 'Մուտքագրեք email-ի կոդը', authResetCodeIntro: '{email} հասցեին ուղարկել ենք 6-նիշ կոդ։', authNewPasswordTitle: 'Ստեղծեք նոր գաղտնաբառ', authNewPasswordIntro: 'Ընտրեք ուժեղ գաղտնաբառ, որը նախկինում չեք օգտագործել։', authNewPassword: 'Նոր գաղտնաբառ', authSavePassword: 'Պահպանել նոր գաղտնաբառը', authResetCompleteTitle: 'Գաղտնաբառը փոխված է', authResetCompleteIntro: 'Գաղտնաբառը անվտանգ փոխվեց։ Ձեզ տեղափոխում ենք մուտքի էջ։',
  customDesignCtaKicker: 'Ստեղծված միայն ձեր պատմության համար', customDesignCtaTitle: 'Ցանկանո՞ւմ եք ամբողջությամբ անհատական հրավեր', customDesignCtaText: 'Ուղարկեք միջոցառման տվյալներն ու ոճային գաղափարները․ մեր դիզայները կկապվի ձեզ հետ անհատական առաջարկով։', customDesignCtaButton: 'Պատվիրել անհատական դիզայնով հրավեր', inspirationLink: 'Ոճի կամ ներշնչանքի հղում', budgetRange: 'Նախատեսվող բյուջե', customRequestNote: 'Նկարագրեք ցանկալի ոճը, գույները, բաժինները և հատուկ գաղափարները։'
});

Object.assign(ru, {
  authIdentifier: 'Email или номер телефона', authIdentifierPlaceholder: 'name@example.com или 041 401415', authRepeatPassword: 'Повторите пароль', authForgotPassword: 'Забыли пароль?',
  authPasswordRules: 'Требования к паролю', authPasswordLength: 'Минимум 8 символов', authPasswordUppercase: 'Одна заглавная буква', authPasswordLowercase: 'Одна строчная буква', authPasswordNumber: 'Одна цифра', authPasswordSpecial: 'Один специальный символ', authPasswordRulesError: 'Выполните все требования к паролю.', authPasswordsMismatch: 'Пароли не совпадают.',
  authResetTitle: 'Восстановить пароль', authResetIntro: 'Введите email аккаунта, и мы отправим защищённый 6-значный код.', authSendResetCode: 'Отправить код', authResetCodeTitle: 'Введите код из письма', authResetCodeIntro: 'Мы отправили 6-значный код на {email}.', authNewPasswordTitle: 'Создайте новый пароль', authNewPasswordIntro: 'Выберите надёжный пароль, который раньше не использовали.', authNewPassword: 'Новый пароль', authSavePassword: 'Сохранить пароль', authResetCompleteTitle: 'Пароль обновлён', authResetCompleteIntro: 'Пароль безопасно изменён. Переходим на страницу входа.',
  customDesignCtaKicker: 'Только для вашей истории', customDesignCtaTitle: 'Нужно полностью индивидуальное приглашение?', customDesignCtaText: 'Отправьте данные события и примеры стиля. Дизайнер свяжется с вами с персональным предложением.', customDesignCtaButton: 'Заказать индивидуальный дизайн', inspirationLink: 'Ссылка на стиль или пример', budgetRange: 'Планируемый бюджет', customRequestNote: 'Опишите желаемый стиль, цвета, разделы и особые идеи.'
});

Object.assign(hy, { promoCongratulations: 'Շնորհավորում ենք դուք ստացել եք' });
Object.assign(en, { promoCongratulations: 'Congratulations, you received' });
Object.assign(ru, { promoCongratulations: 'Поздравляем, вы получили' });
Object.assign(es, { promoCongratulations: 'Enhorabuena, has recibido' });
Object.assign(fr, { promoCongratulations: 'Félicitations, vous avez reçu' });
Object.assign(de, { promoCongratulations: 'Herzlichen Glückwunsch, Sie haben erhalten' });
Object.assign(it, { promoCongratulations: 'Congratulazioni, hai ricevuto' });

// Invitation editor: every control is localized because the editor is shared by all public languages.
Object.assign(hy, {
  editorPreviewDevice: 'Նախադիտման սարք', editorDesktop: 'Համակարգիչ', editorTablet: 'Պլանշետ', editorMobile: 'Հեռախոս', editorDialogLabel: 'Amulet հրավերի խմբագրիչ',
  editorClosePanel: 'Փակել խմբագրման վահանակը', editorOpenPanel: 'Բացել խմբագրման վահանակը', editorUndo: 'Հետարկել', editorRedo: 'Կրկնել',
  editorSessionChanges: 'Փոփոխությունները պահվում են միայն այս խմբագրման ընթացքում', editorOriginalState: 'Հրավերը սկզբնական տեսքով է', editorRestore: 'Վերականգնել', editorViewChanges: 'Դիտել փոփոխվածը', editorClose: 'Փակել խմբագրիչը', editorSections: 'Խմբագրիչի բաժիններ', back: 'Ետ',
  editorRestoreTitle: 'Վերականգնե՞լ հրավերի սկզբնական տեսքը', editorRestoreDescription: 'Ձեր կատարած բոլոր տեքստային, նկարային և ձևավորման փոփոխությունները կջնջվեն, և հրավերը կվերականգնվի իր սկզբնական տարբերակին։ Այս գործողությունը հնարավոր չէ չեղարկել։', editorRestoreConfirm: 'Այո, վերականգնել',
  editorTemplates: 'Ձևանմուշներ', editorEdit: 'Խմբագրել', editorDesign: 'Ձևավորում', editorMedia: 'Մեդիա', editorBuy: 'Գնել'
});
Object.assign(en, {
  editorPreviewDevice: 'Preview device', editorDesktop: 'Desktop', editorTablet: 'Tablet', editorMobile: 'Mobile', editorDialogLabel: 'Amulet invitation editor',
  editorClosePanel: 'Close editing panel', editorOpenPanel: 'Open editing panel', editorUndo: 'Undo', editorRedo: 'Redo',
  editorSessionChanges: 'Changes are kept only during this editing session', editorOriginalState: 'The invitation is in its original state', editorRestore: 'Restore', editorViewChanges: 'View changes', editorClose: 'Close editor', editorSections: 'Editor sections', back: 'Back',
  editorRestoreTitle: 'Restore the original invitation?', editorRestoreDescription: 'All text, image, and design changes you made will be removed, and the invitation will return to its original version. This action cannot be undone.', editorRestoreConfirm: 'Yes, restore',
  editorTemplates: 'Templates', editorEdit: 'Edit', editorDesign: 'Design', editorMedia: 'Media', editorBuy: 'Buy'
});
Object.assign(ru, {
  editorPreviewDevice: 'Устройство предпросмотра', editorDesktop: 'Компьютер', editorTablet: 'Планшет', editorMobile: 'Телефон', editorDialogLabel: 'Редактор приглашения Amulet',
  editorClosePanel: 'Закрыть панель редактирования', editorOpenPanel: 'Открыть панель редактирования', editorUndo: 'Отменить', editorRedo: 'Повторить',
  editorSessionChanges: 'Изменения хранятся только во время этого сеанса', editorOriginalState: 'Приглашение в исходном виде', editorRestore: 'Восстановить', editorViewChanges: 'Посмотреть изменения', editorClose: 'Закрыть редактор', editorSections: 'Разделы редактора', back: 'Назад',
  editorRestoreTitle: 'Восстановить исходное приглашение?', editorRestoreDescription: 'Все изменения текста, изображений и оформления будут удалены, а приглашение вернётся к исходной версии. Это действие нельзя отменить.', editorRestoreConfirm: 'Да, восстановить',
  editorTemplates: 'Шаблоны', editorEdit: 'Редактировать', editorDesign: 'Дизайн', editorMedia: 'Медиа', editorBuy: 'Купить'
});
Object.assign(es, {
  editorPreviewDevice: 'Dispositivo de vista previa', editorDesktop: 'Ordenador', editorTablet: 'Tableta', editorMobile: 'Móvil', editorDialogLabel: 'Editor de invitaciones Amulet', editorClosePanel: 'Cerrar panel de edición', editorOpenPanel: 'Abrir panel de edición', editorUndo: 'Deshacer', editorRedo: 'Rehacer', editorSessionChanges: 'Los cambios se conservan solo durante esta sesión', editorOriginalState: 'La invitación está en su estado original', editorRestore: 'Restaurar', editorViewChanges: 'Ver cambios', editorClose: 'Cerrar editor', editorSections: 'Secciones del editor', back: 'Atrás', editorRestoreTitle: '¿Restaurar la invitación original?', editorRestoreDescription: 'Se eliminarán todos los cambios de texto, imágenes y diseño, y la invitación volverá a su versión original. Esta acción no se puede deshacer.', editorRestoreConfirm: 'Sí, restaurar', editorTemplates: 'Plantillas', editorEdit: 'Editar', editorDesign: 'Diseño', editorMedia: 'Multimedia', editorBuy: 'Comprar'
});
Object.assign(fr, {
  editorPreviewDevice: 'Appareil de prévisualisation', editorDesktop: 'Ordinateur', editorTablet: 'Tablette', editorMobile: 'Téléphone', editorDialogLabel: "Éditeur d’invitation Amulet", editorClosePanel: "Fermer le panneau d’édition", editorOpenPanel: "Ouvrir le panneau d’édition", editorUndo: 'Annuler', editorRedo: 'Rétablir', editorSessionChanges: 'Les modifications sont conservées uniquement pendant cette session', editorOriginalState: "L’invitation est dans son état d’origine", editorRestore: 'Restaurer', editorViewChanges: 'Voir les modifications', editorClose: "Fermer l’éditeur", editorSections: "Sections de l’éditeur", back: 'Retour', editorRestoreTitle: "Restaurer l’invitation d’origine ?", editorRestoreDescription: "Toutes les modifications de texte, d’images et de design seront supprimées, et l’invitation retrouvera sa version d’origine. Cette action est irréversible.", editorRestoreConfirm: 'Oui, restaurer', editorTemplates: 'Modèles', editorEdit: 'Modifier', editorDesign: 'Design', editorMedia: 'Médias', editorBuy: 'Acheter'
});
Object.assign(de, {
  editorPreviewDevice: 'Vorschaugerät', editorDesktop: 'Computer', editorTablet: 'Tablet', editorMobile: 'Mobilgerät', editorDialogLabel: 'Amulet-Einladungseditor', editorClosePanel: 'Bearbeitungsbereich schließen', editorOpenPanel: 'Bearbeitungsbereich öffnen', editorUndo: 'Rückgängig', editorRedo: 'Wiederholen', editorSessionChanges: 'Änderungen bleiben nur während dieser Sitzung erhalten', editorOriginalState: 'Die Einladung ist im Originalzustand', editorRestore: 'Wiederherstellen', editorViewChanges: 'Änderungen ansehen', editorClose: 'Editor schließen', editorSections: 'Editorbereiche', back: 'Zurück', editorRestoreTitle: 'Originale Einladung wiederherstellen?', editorRestoreDescription: 'Alle Änderungen an Texten, Bildern und Design werden entfernt und die Einladung wird auf die Originalversion zurückgesetzt. Dies kann nicht rückgängig gemacht werden.', editorRestoreConfirm: 'Ja, wiederherstellen', editorTemplates: 'Vorlagen', editorEdit: 'Bearbeiten', editorDesign: 'Design', editorMedia: 'Medien', editorBuy: 'Kaufen'
});
Object.assign(it, {
  editorPreviewDevice: 'Dispositivo di anteprima', editorDesktop: 'Computer', editorTablet: 'Tablet', editorMobile: 'Telefono', editorDialogLabel: 'Editor inviti Amulet', editorClosePanel: 'Chiudi pannello di modifica', editorOpenPanel: 'Apri pannello di modifica', editorUndo: 'Annulla', editorRedo: 'Ripeti', editorSessionChanges: 'Le modifiche restano solo durante questa sessione', editorOriginalState: "L’invito è nello stato originale", editorRestore: 'Ripristina', editorViewChanges: 'Visualizza modifiche', editorClose: "Chiudi l’editor", editorSections: "Sezioni dell’editor", back: 'Indietro', editorRestoreTitle: "Ripristinare l’invito originale?", editorRestoreDescription: "Tutte le modifiche a testi, immagini e design verranno eliminate e l’invito tornerà alla versione originale. Questa azione non può essere annullata.", editorRestoreConfirm: 'Sì, ripristina', editorTemplates: 'Modelli', editorEdit: 'Modifica', editorDesign: 'Design', editorMedia: 'Media', editorBuy: 'Acquista'
});

export const translations = { hy, en, ru, es, fr, de, it };
