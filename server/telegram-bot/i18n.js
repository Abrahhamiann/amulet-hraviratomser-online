export const LANGUAGES = ['hy', 'en', 'ru'];

export const LANGUAGE_NAMES = {
  hy: 'Հայերեն', en: 'English', ru: 'Русский'
};

const common = {
  invitation_url: 'Invitation URL', no_message: ''
};

const texts = {
  en: {
    welcome: '<b>Welcome to Amulet, {name}!</b>\n\nYour account is connected securely. New guest replies can now arrive here automatically.',
    welcome_back: '<b>Welcome back, {name}!</b>\n\nManage your invitations and guest replies from this menu.',
    not_connected: '<b>Your Amulet account is not connected.</b>\n\nOpen Profile on the website, press “Connect Telegram”, then press Start here.',
    expired: '<b>This connection link is invalid or has expired.</b>\n\nCreate a new link from your Amulet Profile and try again.',
    api_unavailable: '<b>Amulet could not complete the connection.</b>\n\nPlease try again shortly. Your link remains safe; if needed, create a new one from your Profile.',
    error: '<b>Something went wrong.</b>\n\nPlease try again. If the problem continues, contact Amulet support.',
    menu_title: '<b>Amulet assistant</b>\n\nChoose what you want to view or manage.',
    invitations: 'My invitations', language: 'Language', notifications_on: 'Notifications: ON', notifications_off: 'Notifications: OFF', help: 'Help', disconnect: 'Disconnect Telegram', back: 'Back',
    open_invitation: 'Open invitation', guest_replies: 'Guest replies',
    no_invitations: '<b>No purchased invitations yet.</b>\n\nThey will appear here after your purchase is completed.',
    invitations_title: '<b>Your invitations</b>\n\nSelect an invitation to see its details.',
    invitation_details: '<b>{title}</b>\nTemplate: {template}\nDate: {date}\nTime: {time}\nLocation: {location}\n\nReplies: <b>{replies}</b> · Guests: <b>{guests}</b>',
    no_replies: '<b>No guest replies yet.</b>\n\nNew submissions will appear here and arrive as notifications when enabled.',
    replies_title: '<b>Guest replies — {title}</b>\nPage {page}/{pages}\n\n{items}',
    reply_item: '{icon} <b>{name}</b> · {count}\n{status} · {phone}{message}', previous: 'Previous', next: 'Next',
    choose_language: '<b>Choose the bot language</b>', language_saved: 'Language updated.',
    notifications_enabled: 'Automatic guest reply notifications are now enabled.', notifications_disabled: 'Automatic guest reply notifications are now paused.',
    help_text: '<b>How Amulet Bot works</b>\n\n• New guest replies arrive automatically.\n• “My invitations” shows purchased invitations.\n• Open one to view its replies.\n• Change language or pause notifications anytime.',
    disconnect_confirm: '<b>Disconnect Telegram?</b>\n\nAutomatic guest reply notifications will stop.', disconnect_yes: 'Yes, disconnect', cancel: 'Cancel',
    disconnected: '<b>Telegram was disconnected.</b>\n\nYou can connect it again from your Amulet Profile.',
    attending: 'Attending', declined: 'Not attending', unsure: 'Not sure', guests: '{count} guest(s)'
  },
  hy: {
    welcome: '<b>Բարի գալուստ Amulet, {name}՛</b>\n\nՁեր հաշիվն անվտանգ կապվեց։ Հյուրերի նոր պատասխաններն այսուհետ կարող են ավտոմատ հասնել այստեղ։',
    welcome_back: '<b>Բարի վերադարձ, {name}՛</b>\n\nԱյս բաժնից կառավարեք հրավիրատոմսերն ու հյուրերի պատասխանները։',
    not_connected: '<b>Ձեր Amulet հաշիվը դեռ կապակցված չէ։</b>\n\nԿայքի Profile բաժնում սեղմեք «Միացնել Telegram-ը», ապա այստեղ՝ Start։',
    expired: '<b>Կապման հղումը սխալ է կամ ժամկետանց։</b>\n\nProfile-ից ստեղծեք նոր հղում և կրկին փորձեք։',
    api_unavailable: '<b>Amulet-ին չհաջողվեց ավարտել կապակցումը։</b>\n\nՓորձեք կրկին մի փոքր անց։ Հղումն անվտանգ է, իսկ անհրաժեշտության դեպքում Profile-ից ստեղծեք նորը։',
    error: '<b>Ինչ-որ բան սխալ ընթացավ։</b>\n\nԽնդրում ենք կրկին փորձել։ Եթե խնդիրը շարունակվի, կապվեք Amulet-ի աջակցության հետ։',
    menu_title: '<b>Amulet օգնական</b>\n\nԸնտրեք՝ ինչ եք ցանկանում դիտել կամ կարգավորել։',
    invitations: 'Իմ հրավիրատոմսերը', language: 'Լեզու', notifications_on: 'Ծանուցումներ՝ ՄԻԱՑՎԱԾ', notifications_off: 'Ծանուցումներ՝ ԱՆՋԱՏՎԱԾ', help: 'Օգնություն', disconnect: 'Անջատել Telegram-ը', back: 'Հետ',
    open_invitation: 'Բացել հրավիրատոմսը', guest_replies: 'Հյուրերի պատասխանները',
    no_invitations: '<b>Գնված հրավիրատոմսեր դեռ չկան։</b>\n\nԳնումն ավարտելուց հետո դրանք կհայտնվեն այստեղ։', invitations_title: '<b>Ձեր հրավիրատոմսերը</b>\n\nԸնտրեք հրավիրատոմսը՝ մանրամասները տեսնելու համար։',
    invitation_details: '<b>{title}</b>\nՇաբլոն՝ {template}\nԱմսաթիվ՝ {date}\nԺամ՝ {time}\nՎայր՝ {location}\n\nՊատասխաններ՝ <b>{replies}</b> · Հյուրեր՝ <b>{guests}</b>', invitation_url: 'Հրավիրատոմսի հասցե',
    no_replies: '<b>Հյուրերի պատասխաններ դեռ չկան։</b>\n\nՆոր պատասխանները կհայտնվեն այստեղ և, եթե միացված է, կգան որպես ծանուցում։',
    replies_title: '<b>Հյուրերի պատասխաններ — {title}</b>\nԷջ {page}/{pages}\n\n{items}', reply_item: '{icon} <b>{name}</b> · {count}\n{status} · {phone}{message}', previous: 'Նախորդ', next: 'Հաջորդ',
    choose_language: '<b>Ընտրեք բոտի լեզուն</b>', language_saved: 'Լեզուն փոխված է։', notifications_enabled: 'Հյուրերի նոր պատասխանների ավտոմատ ծանուցումները միացված են։', notifications_disabled: 'Հյուրերի պատասխանների ավտոմատ ծանուցումները դադարեցված են։',
    help_text: '<b>Ինչպես է աշխատում Amulet Bot-ը</b>\n\n• Հյուրերի նոր պատասխաններն ավտոմատ կգան այստեղ։\n• «Իմ հրավիրատոմսերը» բաժինը ցույց է տալիս գնումները։\n• Բացեք հրավիրատոմսը՝ պատասխանները տեսնելու համար։\n• Ցանկացած պահի փոխեք լեզուն կամ դադարեցրեք ծանուցումները։',
    disconnect_confirm: '<b>Անջատե՞լ Telegram-ը։</b>\n\nՀյուրերի ավտոմատ ծանուցումները կդադարեն։', disconnect_yes: 'Այո, անջատել', cancel: 'Չեղարկել', disconnected: '<b>Telegram-ն անջատված է։</b>\n\nԿարող եք կրկին կապել այն Amulet Profile-ից։',
    attending: 'Գալու է', declined: 'Չի գալու', unsure: 'Դեռ վստահ չէ', guests: '{count} հյուր'
  },
  ru: {
    welcome: '<b>Добро пожаловать в Amulet, {name}!</b>\n\nВаш аккаунт безопасно подключён. Новые ответы гостей теперь могут приходить сюда автоматически.', welcome_back: '<b>С возвращением, {name}!</b>\n\nУправляйте приглашениями и ответами гостей в этом меню.', not_connected: '<b>Ваш аккаунт Amulet не подключён.</b>\n\nВ профиле на сайте нажмите «Подключить Telegram», затем Start здесь.', expired: '<b>Ссылка подключения недействительна или устарела.</b>\n\nСоздайте новую ссылку в профиле.', api_unavailable: '<b>Не удалось завершить подключение к Amulet.</b>\n\nПовторите попытку немного позже.', error: '<b>Что-то пошло не так.</b>\n\nПовторите попытку или обратитесь в поддержку Amulet.', menu_title: '<b>Помощник Amulet</b>\n\nВыберите нужный раздел.', invitations: 'Мои приглашения', language: 'Язык', notifications_on: 'Уведомления: ВКЛ', notifications_off: 'Уведомления: ВЫКЛ', help: 'Помощь', disconnect: 'Отключить Telegram', back: 'Назад', open_invitation: 'Открыть приглашение', guest_replies: 'Ответы гостей', no_invitations: '<b>Купленных приглашений пока нет.</b>', invitations_title: '<b>Ваши приглашения</b>\n\nВыберите приглашение.', invitation_details: '<b>{title}</b>\nШаблон: {template}\nДата: {date}\nВремя: {time}\nМесто: {location}\n\nОтветов: <b>{replies}</b> · Гостей: <b>{guests}</b>', no_replies: '<b>Ответов гостей пока нет.</b>', replies_title: '<b>Ответы гостей — {title}</b>\nСтраница {page}/{pages}\n\n{items}', reply_item: '{icon} <b>{name}</b> · {count}\n{status} · {phone}{message}', previous: 'Назад', next: 'Далее', choose_language: '<b>Выберите язык бота</b>', language_saved: 'Язык обновлён.', notifications_enabled: 'Автоматические уведомления включены.', notifications_disabled: 'Автоматические уведомления приостановлены.', help_text: '<b>Как работает Amulet Bot</b>\n\n• Ответы гостей приходят автоматически.\n• Здесь доступны ваши приглашения и ответы.\n• Язык и уведомления можно изменить в любое время.', disconnect_confirm: '<b>Отключить Telegram?</b>', disconnect_yes: 'Да, отключить', cancel: 'Отмена', disconnected: '<b>Telegram отключён.</b>', attending: 'Будет', declined: 'Не будет', unsure: 'Не уверен(а)', guests: '{count} гост.'
  },
};

export const normalizeLanguage = (language, fallback = 'en') => {
  const candidate = String(language || '').split('-')[0].toLowerCase();
  return LANGUAGES.includes(candidate) ? candidate : fallback;
};

export const tr = (language, key, values = {}) => {
  const template = texts[normalizeLanguage(language)]?.[key] ?? texts.en[key] ?? common[key] ?? key;
  return Object.entries(values).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
    template
  );
};

