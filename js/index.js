const SUPABASE_URL = "https://qzgijlgwqxjwzlwctbke.supabase.co";
const REGISTER_SECRET = "your-super-secret-key-for-register";
let userProfileData = null;
let authToken = null;
let isSessionExpired = false;
let selectedProfileImage = "1-Cz2mt-nl.png";
let currentGameFilter = "all";
let userBanks = [];
let depositHistory = [];
let currentDepositFilter = "all";
let currentWithdrawFilter = "all";
let navigationHistory = ["home"];
let activeDownlineFilter = "today";
let downlineData = {
  today: [],
  yesterday: [],
  month: []
};
let winnerData = null;
let selectedVipLevel = 0;
let vipDataCache = null;
let commissionDataCache = null;
let isAppReady = false;
let currentBannerIndex = 0;
let bannerInterval = null;
const LANG = {
  ok: "အိုကေ",
  success: "အောင်မြင်ပါသည်",
  warning: "သတိပေးချက်",
  error: "အမှားဖြစ်ပွားခဲ့သည်",
  cancel: "မလုပ်တော့ပါ",
  headerTitle: "MINI GAMES",
  login: "လော့ဂ်အင်",
  register: "မှတ်ပုံတင်",
  logout: "လော့အောက်",
  loginTitle: "လော့ဂ်အင်",
  loginSubtitle: "ဖုန်းနံပါတ်ဖြင့် ဝင်ရောက်ပါ",
  loginPhone: "ဖုန်းနံပါတ်",
  loginPassword: "စကားဝှက်",
  loginPhonePlaceholder: "ဖုန်းနံပါတ် ထည့်ပါ",
  loginPasswordPlaceholder: "စကားဝှက် ထည့်ပါ",
  rememberPassword: "စကားဝှက်ကို မှတ်ထားပါ",
  loginBtn: "လော့ဂ်အင်",
  loginRegisterBtn: "မှတ်ပုံတင်ရန်",
  loginSuccess: "လော့ဂ်အင် အောင်မြင်ပါသည်",
  registerTitle: "မှတ်ပုံတင်ရန်",
  registerSubtitle: "ဖုန်းနံပါတ်ဖြင့် မှတ်ပုံတင်ပါ",
  registerPhone: "ဖုန်းနံပါတ်",
  registerPassword: "စကားဝှက်သတ်မှတ်ရန်",
  registerConfirm: "စကားဝှက် အတည်ပြုရန်",
  registerRefer: "မိတ်ဆက်ကုဒ်",
  registerPhonePlaceholder: "ဖုန်းနံပါတ် ထည့်ပါ",
  registerPasswordPlaceholder: "စကားဝှက် ထည့်ပါ",
  registerConfirmPlaceholder: "စကားဝှက် အတည်ပြုပါ",
  registerReferPlaceholder: "မိတ်ဆက်ကုဒ် ထည့်ပါ",
  registerAgree: "ကျွန်ုပ် ဖတ်ရှုပြီး သဘောတူပါသည်",
  registerAgreeLink: "【ကိုယ်ရေးအချက်အလက် သဘောတူညီချက်】",
  registerBtn: "မှတ်ပုံတင်ရန်",
  registerLoginBtn: "အကောင့်ရှိပြီးသား လော့ဂ်အင်",
  registerSuccess: "မှတ်ပုံတင်ခြင်း အောင်မြင်ပါသည်",
  registerPhoneError: "ဖုန်းနံပါတ် မှားယွင်းနေပါသည်။ 09xxxxxxxx သို့မဟုတ် 9xxxxxxxxx ထည့်ပါ။",
  registerPasswordMismatch: "စကားဝှက်များ ကိုက်ညီမှုမရှိပါ။",
  registerPasswordShort: "စကားဝှက်သည် အနည်းဆုံး ၆ လုံး ရှိရပါမည်။",
  homeTitle: "MINI GAMES",
  gameTabAll: "ဂိမ်းစာရင်းများ",
  gameTabLottery: "ထီ",
  gameTabMini: "မီနီဂိမ်း",
  winnerTitle: "ယနေ့၀င်ငွေအဆင့်သတ်မှတ်ချက်",
  marqueeText: "မင်္ဂလာပါ၊ မိနီဂိမ်းမှကြိုဆိုပါတယ်၊ ငွေသွင်း/ငွေထုတ် ၁၀၀% ယုံကြည်စိတ်ချစွာစိတ်ကြိုက်ပြုလုပ်နိုင်ပါတယ်၊ ဘောနပ်စ်များစွာရယူ၍ အမြတ်များယူလိုက်ကြစို့ !",
  totalBalance: "စုစုပေါင်းလက်ကျန်",
  wallet: "ပိုက်ဆံအိတ်",
  deposit: "ငွေသွင်း",
  withdraw: "ငွေထုတ်",
  vip: "VIP",
  depositHistory: "ငွေသွင်းမှတ်တမ်း",
  withdrawHistory: "ငွေထုတ်မှတ်တမ်း",
  historySub: "မှတ်တမ်း",
  notifications: "အသိပေးချက်များ",
  giftExchange: "လက်ဆောင်လဲလှယ်",
  languageChange: "ဘာသာစကားပြောင်းလဲမှု",
  serviceTitle: "ဝန်ဆောင်မှုဌာန",
  setting: "စက်တင်",
  feedback: "တုံ့ပြန်ချက်",
  announcement: "ကြေငြာချက်များ",
  customerService: "ဧည့်ဝန်ဆောင်မှု",
  guide: "လူသစ်လမ်းညွှန်",
  about: "အကြောင်း",
  version: "ဗားရှင်းအသစ် မြင့်တင်",
  lastLogin: "နောက်ဆုံး၀င်ရောက်ချိန်",
  walletTotal: "စုစုပေါင်းလက်ကျန်",
  depositAction: "ငွေသွင်း",
  depositSub: "ငွေသွင်းရန်",
  withdrawAction: "ငွေထုတ်",
  withdrawSub: "ငွေထုတ်ရန်",
  inviteReward: "ဖိတ်ခေါ်\nဆုကြေး",
  giftCardTitle: "လက်ဆောင်လဲလှယ်",
  giftCardDesc: "လက်ဆောင်များရယူရန် ရွေးနုတ်ကုဒ်ကို ထည့်ပါ။",
  promoCommissionLabel: "မနေ့ စုစုပေါင်း ကော်မရှင်",
  promoCommissionSub: "ကော်မရှင်၀င်ငွေတိုးရန် အဆင့်မြှင့်ပါ။",
  inviteLinkBtn: "ဖိတ်ခေါ်လင့်ခ်",
  copyCodeLabel: "ဖိတ်ခေါ်ကုဒ်ကို ကူးယူပါ။",
  downlineData: "အောက်လက်ငယ်သားဒေတာ",
  newDownline: "အသစ်တိုးလက်အောက်",
  agentService: "အေးဂျင့်လိုင်း၀န်ဆောင်မှု",
  commissionRatio: "ကော်မရှင်အချိုး",
  commissionTitle: "ကော်မရှင်အချိုး",
  commissionSub: "ကော်မရှင်အဆင့်များ",
  level1: "အဆင့် 1 ကော်မရှင်",
  level2: "အဆင့် 2 ကော်မရှင်",
  level3: "အဆင့် 3 ကော်မရှင်",
  level4: "အဆင့် 4 ကော်မရှင်",
  level5: "အဆင့် 5 ကော်မရှင်",
  level6: "အဆင့် 6 ကော်မရှင်",
  commissionInfo: "အဆင့်တစ်ဆင့်ချင်းစီအတွက် သတ်မှတ်ထားသော ကော်မရှင်နှုန်းထားများ",
  vipNotice: "VIP အဆင့်ဆုကြေးများကို လစဉ် ၁ ရက်နေ့ ချီးမြှင့်မည်ဖြစ်ပါသည်။",
  vipBenefitsTitle: "VIP အဆင့် အကျိုးကျေးဇူးများ",
  vipExpLabel: "EXP",
  vipDaysLabel: "ထုတ်ယူချိန် ရက်",
  upgradeBonusTitle: "အဆင့်မြှင့် ဆုကြေးများ",
  upgradeBonusDesc: "အကောင့်တစ်ခုတည်းသည် 1 ကြိမ်သာ လက်ခံနိုင်သည်။",
  monthlyBonusTitle: "လစဉ်ဆုကြေး",
  monthlyBonusDesc: "အကောင့်တစ်ခုတည်းသည် တစ်လလျှင် 1 ကြိမ်သာ ရရှိနိုင်သည်။",
  claimBtn: "လက်ခံသည်",
  claimedBtn: "လက်ခံပြီးပါပြီ",
  upgradeClaimSuccess: "အဆင့်မြှင့်ဆုကြေး ကျပ် ရရှိပါသည်။ ငွေလက်ကျန်ထဲသို့ ပေါင်းထည့်ပြီးပါပြီ။",
  monthlyClaimSuccess: "လစဉ်ဆုကြေး ကျပ် ရရှိပါသည်။ ငွေလက်ကျန်ထဲသို့ ပေါင်းထည့်ပြီးပါပြီ။",
  downlineSearchTitle: "အောက်လက်ငယ်သားရှာဖွေရန်",
  searchPlaceholder: "UID ထည့်ပါ",
  newDownlineTitle: "အသစ်တိုးလက်အောက်",
  filterToday: "ဒီနေ့",
  filterYesterday: "မနေ့",
  filterMonth: "ဒီလ",
  noData: "ဒေတာမရှိပါ။",
  enterUid: "ကျေးဇူးပြု၍ UID ထည့်သွင်းပါ။",
  loginRequired: "အကောင့်အရင်ဝင်ပါ။",
  notFound: "UID မတွေ့ပါ။",
  depositTitle: "ငွေသွင်းဖောင်",
  depositMethod: "ငွေလွဲအမျိုးအစားရွေးပါ",
  depositAmount: "ပမာဏ (အနည်းဆုံး 3,000 MMK)",
  depositTxid: "လုပ်ငန်းစဉ်နံပါတ် (နောက်ဆုံး 6 လုံး)",
  depositTxidPlaceholder: "နောက်ဆုံး 6 လုံး",
  depositAmountPlaceholder: "ပမာဏ",
  depositSubmit: "ငွေလွှဲမည်",
  depositSuccess: "ငွေသွင်းလွှာ တင်သွင်းပြီးပါပြီ။\n",
  depositPending: "Admin အတည်ပြုပြီးမှ ငွေရောက်ပါမည်။",
  depositMin: "အနည်းဆုံး 3,000 MMK ထည့်ပါ။",
  depositTxidRequired: "လုပ်ငန်းစဉ်နံပါတ် ၆ လုံး ထည့်ပါ။",
  withdrawTitle: "ငွေထုတ်ဖောင်",
  withdrawBank: "ငွေထုတ်မည့်ဘဏ်ရွေးပါ",
  withdrawAmount: "ပမာဏ (အနည်းဆုံး 5,000 MMK)",
  withdrawAmountPlaceholder: "ပမာဏ",
  selectBank: "ဘဏ်ရွေးပါ",
  editBank: "ပြင်ဆင်မည်",
  noBank: "ဘဏ်မရှိပါ",
  withdrawSubmit: "ငွေထုတ်ယူမည်",
  withdrawSuccess: "ငွေထုတ်ယူမှု တင်ပြချက် အောင်မြင်ပါသည်။",
  withdrawMin: "အနည်းဆုံး 5,000 MMK ထည့်ပါ။",
  withdrawInsufficient: "သင့်အကောင့်တွင် လက်ကျန်ငွေ မလုံလောက်ပါ။",
  withdrawRequired: "လောင်းကြေးလိုအပ်ပါသည်။",
  withdrawRequiredDesc: "လက်ရှိလောင်းကြေး ကျပ်၊ လိုအပ်သောလောင်းကြေး ကျပ်။ ငွေထုတ်ရန် လောင်းကြေးပြည့်ရပါမည်။",
  withdrawInfo1: "လောင်းကြေးထိုးရန်လိုအပ်သည်",
  withdrawInfo2: "လောင်းကစားပြီးနောက် ငွေထုတ်ယူနိုင်သည်",
  withdrawInfo3: "ငွေထုတ်ယူချိန် 00:00-23:59",
  withdrawInfo4: "ငွေထုတ်မှုအနည်းအများပမာဏ K5,000.00-K1,000,000.00",
  withdrawInfo5: "ငွေထုတ်ခြင်းမပြုမီ သင့်ငွေပေးချေမှုအကောင့်အချက်အလက်ကိုစစ်ဆေးပါ။",
  bankSetupTitle: "ဘဏ်အကောင့် ချိတ်ဆက်ရန်",
  bankType: "ဘဏ် အမျိုးအစား",
  bankName: "ဘဏ် အသုံးပြုသူ",
  bankNamePlaceholder: "ဘဏ်အသုံးပြုသူအမည်",
  bankNumber: "ဘဏ် နံပါတ်",
  bankNumberPlaceholder: "အကောင့်နံပါတ်",
  bankSave: "သိမ်းဆည်းမည်",
  bankSuccess: "ဘဏ်အကောင့် သိမ်းဆည်းပြီးပါပြီ။",
  settingTitle: "စက်တင်",
  passwordChange: "စကားဝှက်ပြောင်းရန်",
  nicknameChange: "နာမည်ပြောင်းရန်",
  versionUpdate: "ဗားရှင်းအသစ် မြင့်တင်",
  passwordChangeTitle: "စကားဝှက်ပြောင်းရန်",
  oldPassword: "စကားဝှက်အဟောင်း",
  newPassword: "စကားဝှက်အသစ်",
  confirmPassword: "စကားဝှက်အတည်ပြုပါ",
  passwordSubmit: "ပြောင်းလဲမည်",
  passwordSuccess: "စကားဝှက် ပြောင်းလဲမှု အောင်မြင်ပါသည်။",
  passwordMismatch: "စကားဝှက်အသစ်များ မကိုက်ညီပါ။",
  passwordShort: "စကားဝှက်သည် အနည်းဆုံး ၆ လုံး ရှိရပါမည်။",
  nicknameChangeTitle: "နာမည်ပြောင်းရန်",
  newNickname: "နာမည်အသစ်",
  newNicknamePlaceholder: "နာမည်အသစ်ထည့်ပါ",
  nicknameSubmit: "ပြောင်းလဲမည်",
  nicknameSuccess: "နာမည်ပြောင်းလဲမှု အောင်မြင်ပါသည်။",
  nicknameShort: "နာမည်သည် အနည်းဆုံး ၂ လုံး ရှိရပါမည်။",
  languageTitle: "ဘာသာစကားပြောင်းလဲမှု",
  myanmar: "မြန်မာ (Myanmar)",
  english: "English",
  notificationsTitle: "အသိပေးချက်များ",
  notifDepositSuccess: "ငွေသွင်းအောင်မြင်ပါသည်",
  notifDepositSuccessDesc: "သင်၏ ငွေသွင်းမှု အောင်မြင်စွာ ပြီးဆုံးပါပြီ။",
  notifWithdrawPending: "ငွေထုတ်ရန် စောင့်ဆိုင်းနေဆဲ",
  notifWithdrawPendingDesc: "သင်၏ ငွေထုတ်မှုကို အတည်ပြုရန် စောင့်ဆိုင်းနေပါသည်။",
  notifVipUpgrade: "VIP အဆင့်မြှင့်တင်ခြင်း",
  notifVipUpgradeDesc: "ဂုဏ်ပြုပါသည်! သင် VIP Level အဆင့်မြှင့်တင်ခြင်း ခံရပါသည်။",
  giftTitle: "လက်ဆောင်",
  giftMessage1: "မင်္ဂလာပါ လေးစားအပ်ပါသော အဖွဲ့၀င်များ။",
  giftMessage2: "ငါတို့မှာသင့်အတွက် လက်ဆောင်တစ်ခုရှိသည်။",
  giftMessage3: "ကျေးဇူးပြု၍ အောက်တွင် ပေးထားသော လက်ဆောင်လဲလှယ်ကုဒ်ကိုထည့်ပါ။",
  giftPlaceholder: "ကျေးဇူးပြု၍ လက်ဆောင်ကုဒ်ကို ထည့်ပါ။",
  giftRedeem: "လက်ခံသည်",
  giftHistory: "မှတ်တမ်း",
  giftSuccess: "ကျပ် လက်ဆောင်ရရှိပါသည်။",
  giftInvalid: "လက်ဆောင်ကုဒ်မှားနေပါသည်",
  giftUsed: "လက်ဆောင်ကုဒ်ကို အသုံးပြုပြီးဖြစ်သည်။",
  giftLimit: "တစ်နေ့လျှင် ၃ ကြိမ်သာ လဲလှယ်နိုင်ပါသည်။",
  giftCodeRequired: "လက်ဆောင်ကုဒ်ကို ထည့်သွင်းပါ။",
  customerTitle: "ဧည့်၀န်ဆောင်မှု",
  agentTelegram: "အေးဂျင့်လိုင်းဖောက်သည်၀န်ဆောင်မှု Telegram",
  supportTelegram: "ဧည့်၀န်ဆောင်မှု Telegram",
  liveChat: "Live Chat",
  liveChatComing: "Live Chat ဝန်ဆောင်မှုကို မကြာမီ ထည့်သွင်းပါမည်။",
  profileTitle: "Profile ကိုပြောင်းပါ",
  profileSave: "သိမ်းဆည်းမည်",
  profileSuccess: "ပရိုဖိုင် ပုံပြောင်းလဲမှု အောင်မြင်ပါသည်။",
  sessionTitle: "အကောင့်မှ ထွက်ခြင်း",
  sessionDesc: "သင်၏အကောင့်ကို အခြား နေရာ တွင် ဝင်ရောက်ထားသောကြောင့် ဤ နေရာ မှ ထွက်ခွာရပါမည်။",
  sessionBtn: "အိုကေ၊ ပြန်ဝင်မည်",
  ibTitle: "ငွေမလုံလောက်ပါ",
  ibDesc: "ဤလုပ်ဆောင်ချက်ကို အသုံးပြုရန် သင့်အကောင့်တွင် ငွေမလုံလောက်ပါ။ ငွေအရင်သွင်းပါ။",
  ibCancel: "မလုပ်တော့ပါ",
  ibDeposit: "ငွေသွင်းမည်",
  gdTitle: "ဂိမ်းကစားရန် ငွေသွင်းရပါမည်",
  gdDesc: "ဂိမ်းကစားရန်အတွက် သင့်အကောင့်တွင် ငွေမလုံလောက်ပါ။ ငွေသွင်းပြီးမှ ပြန်ကစားပါ။",
  gdCancel: "မလုပ်တော့ပါ",
  gdDeposit: "ငွေသွင်းမည်",
  spinnerText: "ခဏစောင့်ပါ...",
  navHome: "ပင်မ",
  navActivity: "လုပ်ဆောင်ချက်",
  navPromo: "ပရိုမိုးရှင်း",
  navWallet: "ပိုက်ဆံအိတ်",
  navAccount: "ကျွန်ုပ်",
  copyUid: "UID ကူးယူပြီးပါပြီ။",
  copyCode: "မိတ်ဆက်ကုဒ် ကူးယူပြီးပါပြီ။",
  copyAccount: "အကောင့်နံပါတ် ကူးယူပြီးပါပြီ။",
  copyLink: "Invitation Link copied!",
  searchFound: "အဆင့် မိတ်ဆက်သူ တွေ့ရှိပါသည်။",
  searchNotFound: "မိတ်ဆက်သူ မတွေ့ပါ",
  uid: "အိုင်ဒီ",
  username: "နာမည်",
  balance: "လက်ကျန်ပိုက်ဆံ",
  joinedDate: "၀င်ရောက်ခဲ့သည်နေ့",
  todayDeposit: "မနေ့စုစုပေါင်းငွေသွင်း",
  todayBet: "မနေ့စုစုပေါင်းထိုးကြေး",
  totalCommission: "မနေ့စုစုပေါင်းကော်မရှင်",
  refLevel: "မိတ်ဆက်သူ အဆင့်",
  statusPending: "စောင့်ဆိုင်းနေဆဲ",
  statusCompleted: "အတည်ပြုပြီ",
  statusFailed: "ပယ်ချတယ်",
  statusReversed: "လှန်ပြောင်း",
  depositHistoryTitle: "ငွေသွင်းမှတ်တမ်း",
  withdrawHistoryTitle: "ငွေထုတ်မှတ်တမ်း",
  noHistory: "မှတ်တမ်းမရှိသေးပါ",
  orderId: "အော်ဒါနံပါတ်",
  adminNote: "မှတ်ချက်",
  gameLoginRequired: "ဂိမ်းကစားရန် အကောင့်ဝင်ရောက်ရန် လိုအပ်ပါသည်။",
  gameNotAvailable: "ဤဂိမ်းကို မကစားနိုင်သေးပါ။ စောင့်ဆိုင်းပေးပါ။",
  filterAll: "အားလုံး"
};
function formatCurrency(_0x3cd31a) {
  return Number(_0x3cd31a).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function normalizePhone(_0x55457c) {
  let _0x4beae0 = _0x55457c.replace(/^0+/, "");
  if (!_0x4beae0.startsWith("9")) {
    _0x4beae0 = "9" + _0x4beae0;
  }
  return _0x4beae0;
}
function getDeviceId() {
  let _0x3530e5 = localStorage.getItem("device_id");
  if (!_0x3530e5) {
    _0x3530e5 = "dev_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem("device_id", _0x3530e5);
  }
  return _0x3530e5;
}
function getCurrentMyanmarTime() {
  const _0x1fdd6c = new Date();
  const _0x19a67c = 23400000;
  const _0x24f048 = new Date(_0x1fdd6c.getTime() + _0x19a67c);
  return _0x24f048.toISOString().replace("T", " ").slice(0, 19);
}
function getMyanmarDate() {
  const _0x4b2b0d = new Date();
  const _0x49f1b5 = 23400000;
  return new Date(_0x4b2b0d.getTime() + _0x49f1b5);
}
function generateRandom() {
  const _0x29a08f = "abcdefghijklmnopqrstuvwxyz0123456789";
  let _0x32b272 = "";
  for (let _0x28f7e9 = 0; _0x28f7e9 < 32; _0x28f7e9++) {
    _0x32b272 += _0x29a08f.charAt(Math.floor(Math.random() * _0x29a08f.length));
  }
  return _0x32b272;
}
function generateSignature(_0x2dcd85) {
  const _0x3999e8 = Object.keys(_0x2dcd85).sort();
  let _0x59cf1c = "";
  _0x3999e8.forEach(_0x4a7e7f => {
    if (_0x4a7e7f !== "signature" && _0x2dcd85[_0x4a7e7f] !== undefined && _0x2dcd85[_0x4a7e7f] !== null) {
      _0x59cf1c += _0x4a7e7f + "=" + _0x2dcd85[_0x4a7e7f] + "&";
    }
  });
  _0x59cf1c = _0x59cf1c.slice(0, -1);
  let _0x426e06 = 0;
  for (let _0x4b9e94 = 0; _0x4b9e94 < _0x59cf1c.length; _0x4b9e94++) {
    const _0x18b282 = _0x59cf1c.charCodeAt(_0x4b9e94);
    _0x426e06 = (_0x426e06 << 5) - _0x426e06 + _0x18b282;
    _0x426e06 = _0x426e06 & _0x426e06;
  }
  return Math.abs(_0x426e06).toString(16).toUpperCase().padStart(32, "0");
}
function maskBankNumber(_0x25c1ff) {
  if (!_0x25c1ff || _0x25c1ff.length < 8) {
    return _0x25c1ff;
  }
  const _0x44f680 = _0x25c1ff.substring(0, 2);
  const _0x9e0a3d = _0x25c1ff.substring(_0x25c1ff.length - 3);
  const _0x3b6f7e = "*".repeat(Math.max(0, _0x25c1ff.length - 5));
  return "" + _0x44f680 + _0x3b6f7e + _0x9e0a3d;
}
function maskPhoneNumber(_0x132d5a) {
  if (!_0x132d5a || _0x132d5a.length < 8) {
    return _0x132d5a || "";
  }
  const _0x32cb78 = _0x132d5a.substring(0, 2);
  const _0x2143ee = _0x132d5a.substring(_0x132d5a.length - 3);
  return _0x32cb78 + "XXXXX" + _0x2143ee;
}
function getBankIcon(_0x188907) {
  if (_0x188907 === "KBZ Pay") {
    return "png/kbz_icon-j2UvitJy.png";
  }
  if (_0x188907 === "Wave Pay") {
    return "png/wave_icon-MMSgjjJE.png";
  }
  return "";
}
function getStatusClass(_0x19a597) {
  if (_0x19a597 === "completed" || _0x19a597 === "အတည်ပြုပြီ") {
    return "status-success";
  }
  if (_0x19a597 === "failed" || _0x19a597 === "ပယ်ချတယ်") {
    return "status-failed";
  }
  if (_0x19a597 === "reversed" || _0x19a597 === "လှန်ပြောင်း") {
    return "status-reversed";
  }
  return "status-pending";
}
function getStatusText(_0x354a12) {
  if (_0x354a12 === "completed") {
    return LANG.statusCompleted;
  }
  if (_0x354a12 === "failed") {
    return LANG.statusFailed;
  }
  if (_0x354a12 === "reversed") {
    return LANG.statusReversed;
  }
  if (_0x354a12 === "pending") {
    return LANG.statusPending;
  }
  return _0x354a12 || LANG.statusPending;
}
const VIP_LEVELS = [{
  level: 0,
  threshold: 0,
  upgradeBonus: 0,
  monthlyBonus: 0,
  img: "0-BG6QPOmD.png"
}, {
  level: 1,
  threshold: 1000,
  upgradeBonus: 1000,
  monthlyBonus: 100,
  img: "1-Cx7tGjnc.png"
}, {
  level: 2,
  threshold: 3000,
  upgradeBonus: 2000,
  monthlyBonus: 500,
  img: "2-DSernNVr.png"
}, {
  level: 3,
  threshold: 10000,
  upgradeBonus: 5000,
  monthlyBonus: 1000,
  img: "3-BcJpLSeh.png"
}, {
  level: 4,
  threshold: 50000,
  upgradeBonus: 10000,
  monthlyBonus: 3000,
  img: "4-CUhm8sT6.png"
}, {
  level: 5,
  threshold: 200000,
  upgradeBonus: 50000,
  monthlyBonus: 20000,
  img: "5-CrVoNhwK.png"
}, {
  level: 6,
  threshold: 1000000,
  upgradeBonus: 150000,
  monthlyBonus: 50000,
  img: "6-CCzRU1dM.png"
}, {
  level: 7,
  threshold: 5000000,
  upgradeBonus: 500000,
  monthlyBonus: 150000,
  img: "7-CUIdRk8a.png"
}, {
  level: 8,
  threshold: 20000000,
  upgradeBonus: 2000000,
  monthlyBonus: 500000,
  img: "8-DZMegZRt.png"
}, {
  level: 9,
  threshold: 100000000,
  upgradeBonus: 6000000,
  monthlyBonus: 2000000,
  img: "9-BeIDzsUE.png"
}, {
  level: 10,
  threshold: 500000000,
  upgradeBonus: 15000000,
  monthlyBonus: 5000000,
  img: "10-CQvZLiXE.png"
}];
let depositGateways = {
  wave: {
    name: "Khin Mar Lar",
    phone: "09756394842"
  },
  kbz: {
    name: "Khin Mar Lar",
    phone: "09756394842"
  }
};
const GAMES = {
  all: [{
    id: 1,
    name: "WinGo",
    image: "png/file_00000000472c71fbb8adac41166dc2de.png",
    category: "lottery"
  }, {
    id: 2,
    name: "WinTrx",
    image: "png/file_00000000ebe481f8b6d7e9f932740540.png",
    category: "lottery"
  }, {
    id: 3,
    name: "GoldGoal",
    image: "png/gold-goal-NMsjak2.png",
    category: "mini"
  }],
  lottery: [{
    id: 1,
    name: "WinGo",
    image: "png/file_00000000472c71fbb8adac41166dc2de.png",
    category: "lottery"
  }, {
    id: 2,
    name: "WinTrx",
    image: "png/file_00000000ebe481f8b6d7e9f932740540.png",
    category: "lottery"
  }],
  mini: [{
    id: 3,
    name: "GoldGoal",
    image: "png/gold-goal-NMsjak2.png",
    category: "mini"
  }]
};
const PROFILE_IMAGES = ["1-Cz2mt-nl.png", "2-DzTtSgI1.png", "3-CieZaTkx.png", "4-FzE5GskB.png", "5-BE1kalqa.png", "6-BptTdCuy.png", "7-OCP1Ruci.png", "8-4L9YXhCn.png", "9-iOf3oyEz.png", "10-BcpE5fen.png", "11-DBjki8Hc.png", "12-DZNy4n9Y.png", "13-DEwaMq4g.png", "14-DwyWmQfy.png", "15-CLyM484-.png", "16-BSWOqo6F.png", "17-q-XMVoEb.png", "18-nEcSw01G.png", "19-B4g10rGY.png", "20-jsNPML4j.png"];
function getVipLevel(_0x5544f0) {
  let _0x556f9f = 0;
  for (let _0x1bf2cc = VIP_LEVELS.length - 1; _0x1bf2cc >= 0; _0x1bf2cc--) {
    if (_0x5544f0 >= VIP_LEVELS[_0x1bf2cc].threshold) {
      _0x556f9f = VIP_LEVELS[_0x1bf2cc].level;
      break;
    }
  }
  return _0x556f9f;
}
function getVipLevelData(_0xa3f853) {
  return VIP_LEVELS.find(_0x54a852 => _0x54a852.level === _0xa3f853) || VIP_LEVELS[0];
}
function getNextVipLevel(_0x4ea429) {
  return VIP_LEVELS.find(_0x1dd591 => _0x1dd591.level > _0x4ea429) || null;
}
function getRemainingDays() {
  const _0x5c8983 = getMyanmarDate();
  const _0x14a9b3 = _0x5c8983.getFullYear();
  const _0x5b5ec2 = _0x5c8983.getMonth();
  const _0x444b10 = new Date(_0x14a9b3, _0x5b5ec2 + 1, 0).getDate();
  const _0x3dcc53 = _0x5c8983.getDate();
  return _0x444b10 - _0x3dcc53;
}
function getUserTotalWagered() {
  return userProfileData?.totalWagered || 0;
}
function getUserVipLevelFromData() {
  return getVipLevel(getUserTotalWagered());
}
function toggleCheckbox(_0x1b7917) {
  const _0x122754 = document.getElementById(_0x1b7917);
  if (_0x122754) {
    _0x122754.classList.toggle("checked");
  }
  checkInputState();
}
function showSessionExpiredDialog() {
  localStorage.removeItem("mini_auth_token");
  authToken = null;
  userProfileData = null;
  isSessionExpired = true;
  document.getElementById("authStateUser").style.display = "none";
  document.getElementById("authStateGuest").style.display = "flex";
  document.getElementById("headerBalance").textContent = "0.00";
  const _0x423d42 = document.getElementById("sessionExpiredOverlay");
  _0x423d42.classList.remove("hidden");
  _0x423d42.classList.add("show");
  const _0x190b52 = document.querySelector(".session-expired-icon");
  if (_0x190b52) {
    _0x190b52.innerHTML = "<img src=\"png/tip-DEIPQW3.png\" onerror=\"this.style.display='none'; this.textContent='🔐';\">";
  }
  document.querySelector(".session-expired-title").textContent = "သင်သည် အခြားနေရာတွင် အကောင့်ဝင်ထားသည်";
  document.querySelector(".session-expired-desc").textContent = "ကျေးဇူးပြု၍ ထပ်မံအကောင့်ဝင်ပါ";
  document.querySelector(".se-btn").textContent = "ပြန်၀င်မည်";
  navigationHistory = ["home"];
}
function handleSessionExpired() {
  const _0x49264e = document.getElementById("sessionExpiredOverlay");
  _0x49264e.classList.add("hidden");
  _0x49264e.classList.remove("show");
  isSessionExpired = false;
  authToken = null;
  userProfileData = null;
  localStorage.removeItem("mini_auth_token");
  document.getElementById("headerBalance").textContent = "0.00";
  document.getElementById("authStateUser").style.display = "none";
  document.getElementById("authStateGuest").style.display = "flex";
  navigationHistory = ["home"];
  showScreen("login");
}
async function callAPI(_0x524f2d, _0x4dc3e2 = {}) {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return {
      code: 401,
      msg: "Session expired"
    };
  }
  const _0x1af535 = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + (authToken || "")
  };
  const _0x28d91e = Math.floor(Date.now() / 1000);
  const _0x4bc8ba = generateRandom();
  const _0x500088 = 7;
  const _0x4b79b4 = {
    language: _0x500088,
    random: _0x4bc8ba,
    timestamp: _0x28d91e
  };
  const _0x4fd940 = _0x4b79b4;
  const _0xea7dcd = generateSignature(_0x4fd940);
  const _0x73d6be = {
    ..._0x4dc3e2,
    ..._0x4fd940
  };
  _0x73d6be.signature = _0xea7dcd;
  const _0x5c064a = _0x73d6be;
  try {
    const _0x565735 = await fetch(SUPABASE_URL + "/functions/v1/" + _0x524f2d, {
      method: "POST",
      headers: _0x1af535,
      body: JSON.stringify(_0x5c064a)
    });
    const _0x449811 = await _0x565735.json();
    if (_0x449811.code === 401 || _0x449811.expired === true || _0x449811.msg?.includes("expired") || _0x449811.msg?.includes("token")) {
      showSessionExpiredDialog();
      return {
        code: 401,
        msg: "Session expired"
      };
    }
    return _0x449811;
  } catch (_0x49ccec) {
    console.error("API call error:", _0x49ccec);
    return {
      code: 500,
      msg: "Network error"
    };
  }
}
async function login(_0x31e616, _0x4a61b9) {
  const _0x2e189c = normalizePhone(_0x31e616);
  const _0x2ebe67 = getDeviceId();
  const _0x39f93b = {
    phone: _0x2e189c,
    pwd: _0x4a61b9,
    deviceId: _0x2ebe67
  };
  const _0x136212 = await fetch(SUPABASE_URL + "/functions/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(_0x39f93b)
  });
  return await _0x136212.json();
}
async function register(_0x28e7d5, _0x3cffac, _0x26b964, _0xbb24fe) {
  const _0x5558c2 = normalizePhone(_0x28e7d5);
  const _0x106b68 = {
    phone: _0x5558c2,
    pwd: _0x3cffac,
    deviceId: _0x26b964,
    referCode: _0xbb24fe
  };
  const _0x355352 = await fetch(SUPABASE_URL + "/functions/v1/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Register-Secret": REGISTER_SECRET
    },
    body: JSON.stringify(_0x106b68)
  });
  return await _0x355352.json();
}
async function getUserInfo() {
  if (isSessionExpired) {
    return {
      code: 401,
      msg: "Session expired"
    };
  }
  const _0x542900 = {
    Authorization: "Bearer " + (authToken || "")
  };
  const _0x512a9c = await fetch(SUPABASE_URL + "/functions/v1/get-user-info", {
    method: "GET",
    headers: _0x542900
  });
  const _0x450643 = await _0x512a9c.json();
  if (_0x450643.code === 401 || _0x450643.expired === true) {
    showSessionExpiredDialog();
  }
  return _0x450643;
}
async function getUserVipLevel() {
  if (isSessionExpired) {
    return {
      code: 401,
      msg: "Session expired"
    };
  }
  const _0x31ce92 = {
    Authorization: "Bearer " + (authToken || "")
  };
  const _0x4fdd89 = await fetch(SUPABASE_URL + "/functions/v1/vip-system?action=info", {
    method: "GET",
    headers: _0x31ce92
  });
  const _0x42211f = await _0x4fdd89.json();
  if (_0x42211f.code === 401 || _0x42211f.expired === true) {
    showSessionExpiredDialog();
  }
  return _0x42211f;
}
async function getPromotions() {
  return await callAPI("get-promotions", {});
}
async function getSearch(_0x23d68b) {
  const _0x572a71 = {
    uid: _0x23d68b
  };
  return await callAPI("get-search", _0x572a71);
}
async function getBalance() {
  return await callAPI("get-balance", {});
}
async function changePassword(_0x323cf1, _0x10c0eb) {
  const _0x155a3d = {
    oldPassword: _0x323cf1,
    newPassword: _0x10c0eb
  };
  return await callAPI("change-password", _0x155a3d);
}
async function setupBank(_0x5f151f, _0x32a81c, _0x40e095) {
  const _0x2124a7 = {
    bankType: _0x5f151f,
    accountName: _0x32a81c,
    accountNumber: _0x40e095
  };
  return await callAPI("setup-bank", _0x2124a7);
}
async function updateProfile(_0x193dc3) {
  const _0x3ce52d = _0x193dc3.split("-")[0] || "1";
  const _0x3cef8f = {
    userPhoto: _0x3ce52d
  };
  return await callAPI("update-profile", _0x3cef8f);
}
async function updateNickname(_0x97f9b6) {
  const _0x1c4ff0 = {
    nickname: _0x97f9b6
  };
  return await callAPI("update-nickname", _0x1c4ff0);
}
async function claimGiftCode(_0x3ef439) {
  if (isSessionExpired) {
    return {
      code: 401,
      msg: "Session expired"
    };
  }
  const _0x5e9e5c = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + (authToken || "")
  };
  const _0x258361 = {
    giftCode: _0x3ef439
  };
  const _0x357ddf = await fetch(SUPABASE_URL + "/functions/v1/get-giftcode-claim?action=claim", {
    method: "POST",
    headers: _0x5e9e5c,
    body: JSON.stringify(_0x258361)
  });
  const _0x1c1953 = await _0x357ddf.json();
  if (_0x1c1953.code === 401 || _0x1c1953.expired === true) {
    showSessionExpiredDialog();
  }
  return _0x1c1953;
}
async function logout() {
  return await callAPI("logout", {});
}
async function submitDeposit(_0x74ff96, _0x1e170d, _0x78d9b) {
  return await callAPI("get-transaction", {
    type: "deposit",
    amount: _0x74ff96,
    method: _0x1e170d,
    txid: _0x78d9b
  });
}
async function submitWithdraw(_0x12cb74, _0x101a65) {
  return await callAPI("get-transaction", {
    type: "withdraw",
    amount: _0x12cb74,
    method: _0x101a65
  });
}
async function getWinnerToday() {
  try {
    const _0x23d548 = await fetch(SUPABASE_URL + "/functions/v1/get-today-winner-list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return await _0x23d548.json();
  } catch (_0x1da300) {
    return {
      success: false
    };
  }
}
async function claimUpgradeBonusAPI() {
  if (isSessionExpired) {
    return {
      success: false,
      error: "Session expired"
    };
  }
  const _0x305f43 = {
    Authorization: "Bearer " + (authToken || "")
  };
  const _0x11687b = {
    userId: userProfileData?.id
  };
  const _0x109e81 = await fetch(SUPABASE_URL + "/functions/v1/vip-system?action=claim-upgrade", {
    method: "POST",
    headers: {
      ..._0x305f43,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(_0x11687b)
  });
  const _0x29c4ed = await _0x109e81.json();
  if (_0x29c4ed.code === 401 || _0x29c4ed.expired === true) {
    showSessionExpiredDialog();
  }
  return _0x29c4ed;
}
async function claimMonthlyBonusAPI() {
  if (isSessionExpired) {
    return {
      success: false,
      error: "Session expired"
    };
  }
  const _0x2fd460 = {
    Authorization: "Bearer " + (authToken || "")
  };
  const _0x4af37b = {
    userId: userProfileData?.id
  };
  const _0x478f7d = await fetch(SUPABASE_URL + "/functions/v1/vip-system?action=claim-monthly", {
    method: "POST",
    headers: {
      ..._0x2fd460,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(_0x4af37b)
  });
  const _0x39a62d = await _0x478f7d.json();
  if (_0x39a62d.code === 401 || _0x39a62d.expired === true) {
    showSessionExpiredDialog();
  }
  return _0x39a62d;
}
async function getDepositHistory() {
  return await callAPI("get-myhistory-record", {
    type: "deposit"
  });
}
function showSpinner(_0x419018 = true) {
  const _0x2a9412 = document.getElementById("actionSpinnerOverlay");
  if (_0x419018) {
    _0x2a9412.style.display = "flex";
  } else {
    _0x2a9412.style.display = "none";
  }
}
function setBalanceLoading(_0x3e010f) {
  const _0x58f60d = document.getElementById("headerBalanceLoader");
  const _0x28d692 = document.getElementById("headerBalance");
  if (_0x3e010f) {
    _0x58f60d.style.display = "inline-block";
    _0x28d692.textContent = "...";
  } else {
    _0x58f60d.style.display = "none";
  }
}
function showScreen(_0x58f2c6) {
  if (isSessionExpired && _0x58f2c6 !== "login" && _0x58f2c6 !== "register") {
    showSessionExpiredDialog();
    return;
  }
  const _0x376282 = document.getElementById("screen" + capitalize(_0x58f2c6));
  if (!_0x376282) {
    return;
  }
  document.querySelectorAll(".app-screen").forEach(_0x2d0476 => {
    _0x2d0476.classList.remove("active");
    _0x2d0476.style.display = "none";
  });
  _0x376282.style.display = "";
  _0x376282.classList.add("active");
  document.querySelectorAll(".bottom-nav .nav-item").forEach(_0x4936ad => {
    _0x4936ad.classList.remove("active");
  });
  const _0x1fb39d = document.getElementById("nav" + capitalize(_0x58f2c6));
  if (_0x1fb39d) {
    _0x1fb39d.classList.add("active");
  }
  const _0x24ed6b = {
    home: LANG.homeTitle,
    login: LANG.login,
    register: LANG.register,
    account: LANG.navAccount,
    wallet: LANG.navWallet,
    activity: LANG.navActivity,
    promotion: LANG.navPromo,
    "commission-ratio": LANG.commissionTitle,
    vip: LANG.vip,
    deposit: LANG.deposit,
    "deposit-history": LANG.depositHistory,
    withdraw: LANG.withdraw,
    "withdraw-history": LANG.withdrawHistory,
    "bank-setup": LANG.bankSetupTitle,
    setting: LANG.setting,
    "password-change": LANG.passwordChange,
    "nickname-change": LANG.nicknameChange,
    "language-change": LANG.languageTitle,
    "profile-change": LANG.profileTitle,
    notifications: LANG.notifications,
    "gift-exchange": LANG.giftTitle,
    "customer-service": LANG.customerTitle,
    "downline-search": LANG.downlineSearchTitle,
    "new-downline": LANG.newDownlineTitle
  };
  const _0x2c3ff1 = _0x24ed6b;
  document.getElementById("headerTitle").textContent = _0x2c3ff1[_0x58f2c6] || LANG.headerTitle;
  const _0x1a82c2 = document.getElementById("headerBackBtn");
  if (_0x58f2c6 === "home") {
    _0x1a82c2.style.display = "none";
  } else {
    _0x1a82c2.style.display = "flex";
  }
  if (navigationHistory[navigationHistory.length - 1] !== _0x58f2c6) {
    navigationHistory.push(_0x58f2c6);
  }
}
function capitalize(_0x1f34d1) {
  return _0x1f34d1.charAt(0).toUpperCase() + _0x1f34d1.slice(1).replace(/-([a-z])/g, (_0x23392c, _0x357bd9) => _0x357bd9.toUpperCase());
}
function goBack() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  if (navigationHistory.length > 1) {
    navigationHistory.pop();
    const _0x767449 = navigationHistory[navigationHistory.length - 1];
    showScreen(_0x767449);
  } else {
    showScreen("home");
  }
}
function showCustomDialog(_0x7e54f6, _0x5cc8ac, _0x50943e = "png/tip-FtCajNfL.png") {
  const _0x4984e5 = document.getElementById("dialogIconImg");
  const _0x5224e0 = document.querySelector("#customDialog .dialog-icon-fallback");
  if (_0x50943e && (_0x50943e.includes(".png") || _0x50943e.includes(".jpg") || _0x50943e.includes(".svg"))) {
    _0x4984e5.src = _0x50943e;
    _0x4984e5.style.display = "block";
    _0x5224e0.style.display = "none";
    _0x4984e5.onerror = function () {
      this.style.display = "none";
      _0x5224e0.style.display = "block";
      _0x5224e0.textContent = "⚠️";
    };
  } else {
    _0x4984e5.style.display = "none";
    _0x5224e0.style.display = "block";
    _0x5224e0.textContent = _0x50943e || "⚠️";
  }
  document.getElementById("dialogTitle").textContent = _0x7e54f6;
  document.getElementById("dialogMsg").textContent = _0x5cc8ac;
  document.getElementById("dialogOkBtn").textContent = LANG.ok;
  document.getElementById("customDialog").classList.remove("hidden");
}
function closeCustomDialog() {
  document.getElementById("customDialog").classList.add("hidden");
}
function togglePasswordVisibility(_0x6c7ab8, _0x265d49) {
  const _0x392b10 = document.getElementById(_0x6c7ab8);
  const _0x4680bd = _0x265d49.querySelector(".password-eye");
  if (!_0x392b10 || !_0x4680bd) {
    return;
  }
  if (_0x392b10.type === "password") {
    _0x392b10.type = "text";
    _0x4680bd.src = "png/eyeInvisible-NUKC6jpG.png";
  } else {
    _0x392b10.type = "password";
    _0x4680bd.src = "png/eyeVisible-DnFspzX8.png";
  }
}
function getProfileImage() {
  const _0x1cd4e5 = "profile_image_" + (userProfileData?.uid || "guest");
  return localStorage.getItem(_0x1cd4e5) || "1-Cz2mt-nl.png";
}
function setProfileImage(_0x418529) {
  const _0x5d143b = "profile_image_" + (userProfileData?.uid || "guest");
  localStorage.setItem(_0x5d143b, _0x418529);
}
function toggleCountryDropdown(_0x2ca6be, _0x1c753c) {
  _0x2ca6be.stopPropagation();
  const _0x579146 = document.getElementById(_0x1c753c + "CountryDropdown");
  const _0x24ac86 = document.getElementById(_0x1c753c + "CountrySelector");
  if (_0x579146 && _0x24ac86) {
    _0x579146.classList.toggle("show");
    _0x24ac86.classList.toggle("open");
  }
}
function selectCountry(_0x1383f7, _0x1e6802, _0x4e492c) {
  _0x4e492c.stopPropagation();
  document.getElementById(_0x1e6802 + "SelectedCode").innerText = _0x1383f7;
  const _0x31dfbf = document.getElementById(_0x1e6802 + "CountryDropdown");
  const _0x1e90cd = document.getElementById(_0x1e6802 + "CountrySelector");
  if (_0x31dfbf) {
    _0x31dfbf.classList.remove("show");
  }
  if (_0x1e90cd) {
    _0x1e90cd.classList.remove("open");
  }
}
window.addEventListener("click", function () {
  document.querySelectorAll(".country-dropdown").forEach(_0xa21264 => _0xa21264.classList.remove("show"));
  document.querySelectorAll(".country-selector").forEach(_0x3c7f5a => _0x3c7f5a.classList.remove("open"));
});
function checkInputState() {
  const _0x4ae5fb = document.getElementById("loginUsername")?.value?.trim() || "";
  const _0x1a64ff = document.getElementById("loginPassword")?.value?.trim() || "";
  const _0x513a68 = document.getElementById("loginBtn");
  if (_0x513a68) {
    if (_0x4ae5fb.length > 0 || _0x1a64ff.length > 0) {
      _0x513a68.style.background = "linear-gradient(180deg,#2a82e4,#2578db)";
      _0x513a68.style.color = "#fff";
      _0x513a68.style.cursor = "pointer";
      _0x513a68.disabled = false;
    } else {
      _0x513a68.style.background = "#363c5d";
      _0x513a68.style.color = "#737c9e";
      _0x513a68.style.cursor = "not-allowed";
      _0x513a68.disabled = true;
    }
  }
  const _0x47a524 = document.getElementById("regUsername")?.value?.trim() || "";
  const _0x1e8d48 = document.getElementById("regPassword")?.value?.trim() || "";
  const _0x50944c = document.getElementById("regConfpass")?.value?.trim() || "";
  const _0x12ac00 = document.getElementById("agreeCheckbox")?.classList.contains("checked") || false;
  const _0x17d6a9 = document.getElementById("registerBtn");
  if (_0x17d6a9) {
    if (_0x47a524.length > 0 && _0x1e8d48.length > 0 && _0x50944c.length > 0 && _0x12ac00) {
      _0x17d6a9.style.background = "linear-gradient(180deg,#2a82e4,#2578db)";
      _0x17d6a9.style.color = "#fff";
      _0x17d6a9.style.cursor = "pointer";
      _0x17d6a9.disabled = false;
    } else {
      _0x17d6a9.style.background = "#363c5d";
      _0x17d6a9.style.color = "#737c9e";
      _0x17d6a9.style.cursor = "not-allowed";
      _0x17d6a9.disabled = true;
    }
  }
}
function setupUIText() {
  document.querySelectorAll(".header-login-btn").forEach(_0xc2c364 => _0xc2c364.textContent = LANG.login);
  document.querySelectorAll(".header-register-btn").forEach(_0x34fe09 => _0x34fe09.textContent = LANG.register);
  document.querySelector(".loading-title").textContent = "WELCOME TO";
  document.querySelector(".loading-subtitle").textContent = LANG.headerTitle;
  document.querySelector(".network-title").textContent = "Network Error";
  document.querySelector(".network-desc").textContent = "navigator is offLine, Please check the device network";
  document.getElementById("loginTitle").textContent = LANG.loginTitle;
  document.getElementById("loginSubtitle").textContent = LANG.loginSubtitle;
  document.getElementById("loginPhoneLabel").textContent = LANG.loginPhone;
  document.getElementById("loginPasswordLabel").textContent = LANG.loginPassword;
  document.getElementById("loginUsername").placeholder = LANG.loginPhonePlaceholder;
  document.getElementById("loginPassword").placeholder = LANG.loginPasswordPlaceholder;
  document.getElementById("rememberLabel").textContent = LANG.rememberPassword;
  document.getElementById("loginBtn").textContent = LANG.loginBtn;
  document.getElementById("loginRegisterBtn").textContent = LANG.loginRegisterBtn;
  document.getElementById("registerTitle").textContent = LANG.registerTitle;
  document.getElementById("registerSubtitle").textContent = LANG.registerSubtitle;
  document.getElementById("registerTabLabel").textContent = LANG.register;
  document.getElementById("registerPhoneLabel").textContent = LANG.registerPhone;
  document.getElementById("registerPasswordLabel").textContent = LANG.registerPassword;
  document.getElementById("registerConfirmLabel").textContent = LANG.registerConfirm;
  document.getElementById("registerReferLabel").textContent = LANG.registerRefer;
  document.getElementById("regUsername").placeholder = LANG.registerPhonePlaceholder;
  document.getElementById("regPassword").placeholder = LANG.registerPasswordPlaceholder;
  document.getElementById("regConfpass").placeholder = LANG.registerConfirmPlaceholder;
  document.getElementById("regRefer").placeholder = LANG.registerReferPlaceholder;
  document.getElementById("agreeLabel").innerHTML = LANG.registerAgree + " <a href=\"#\" style=\"color:#d9534f;text-decoration:none;\">" + LANG.registerAgreeLink + "</a>";
  document.getElementById("registerBtn").textContent = LANG.registerBtn;
  document.getElementById("registerLoginBtn").innerHTML = LANG.registerLoginBtn.replace("လော့ဂ်အင်", "<span style=\"color:#2f82ff;font-weight:600;\">" + LANG.login + "</span>");
  document.getElementById("marqueeText").innerHTML = "<i class=\"fa-solid fa-horn mr-1\"></i> " + LANG.marqueeText;
  document.getElementById("gameTabAll").textContent = LANG.gameTabAll;
  document.getElementById("gameTabLottery").textContent = LANG.gameTabLottery;
  document.getElementById("gameTabMini").textContent = LANG.gameTabMini;
  document.getElementById("winnerTitle").textContent = LANG.winnerTitle;
  document.getElementById("totalBalanceLabel").textContent = LANG.totalBalance;
  document.getElementById("walletLabel").textContent = LANG.wallet;
  document.getElementById("depositLabel").textContent = LANG.deposit;
  document.getElementById("withdrawLabel").textContent = LANG.withdraw;
  document.getElementById("depositHistoryLabel").textContent = LANG.depositHistory;
  document.getElementById("withdrawHistoryLabel").textContent = LANG.withdrawHistory;
  document.querySelectorAll(".history-sub").forEach(_0x1a1893 => _0x1a1893.textContent = LANG.historySub);
  document.getElementById("notificationsLabel").textContent = LANG.notifications;
  document.getElementById("giftExchangeLabel").textContent = LANG.giftExchange;
  document.getElementById("languageLabel").textContent = LANG.languageChange;
  document.getElementById("serviceTitle").textContent = LANG.serviceTitle;
  document.getElementById("settingLabel").textContent = LANG.setting;
  document.getElementById("feedbackLabel").textContent = LANG.feedback;
  document.getElementById("announcementLabel").textContent = LANG.announcement;
  document.getElementById("customerServiceLabel").textContent = LANG.customerService;
  document.getElementById("guideLabel").textContent = LANG.guide;
  document.getElementById("aboutLabel").textContent = LANG.about;
  document.getElementById("logoutLabel").textContent = LANG.logout;
  document.getElementById("versionLabel").textContent = LANG.version;
  document.getElementById("walletTotalLabel").textContent = LANG.walletTotal;
  document.getElementById("depositActionLabel").textContent = LANG.depositAction;
  document.getElementById("depositActionSub").textContent = LANG.depositSub;
  document.getElementById("withdrawActionLabel").textContent = LANG.withdrawAction;
  document.getElementById("withdrawActionSub").textContent = LANG.withdrawSub;
  document.getElementById("depositHistoryActionLabel").textContent = LANG.depositHistory;
  document.getElementById("withdrawHistoryActionLabel").textContent = LANG.withdrawHistory;
  document.getElementById("historySubLabel3").textContent = LANG.historySub;
  document.getElementById("historySubLabel4").textContent = LANG.historySub;
  document.querySelectorAll("#wallet .wallet-action-sub").forEach(_0x4975ce => {
    if (_0x4975ce.id !== "depositActionSub" && _0x4975ce.id !== "withdrawActionSub") {
      _0x4975ce.textContent = LANG.historySub;
    }
  });
  document.getElementById("inviteRewardLabel").innerHTML = LANG.inviteReward.replace("\n", "<br>");
  document.getElementById("giftCardTitle").textContent = LANG.giftCardTitle;
  document.getElementById("giftCardDesc").textContent = LANG.giftCardDesc;
  document.getElementById("promoCommissionLabel").textContent = LANG.promoCommissionLabel;
  document.getElementById("promoCommissionSub").textContent = LANG.promoCommissionSub;
  document.getElementById("inviteLinkBtn").textContent = LANG.inviteLinkBtn;
  document.getElementById("copyCodeLabel").innerHTML = "<i class=\"fas fa-copy text-blue\"></i> " + LANG.copyCodeLabel;
  document.getElementById("downlineDataLabel").textContent = LANG.downlineData;
  document.getElementById("newDownlineLabel").textContent = LANG.newDownline;
  document.getElementById("agentServiceLabel").textContent = LANG.agentService;
  document.getElementById("commissionRatioLabel").textContent = LANG.commissionRatio;
  document.getElementById("commissionRatioTitle").textContent = LANG.commissionTitle;
  document.getElementById("vipNotice").textContent = LANG.vipNotice;
  document.getElementById("vipExpLabel").textContent = LANG.vipExpLabel;
  document.getElementById("vipDaysLabel").innerHTML = LANG.vipDaysLabel + " <span id=\"vipDaysDisplay\">0</span> ";
  document.getElementById("vipBenefitsTitle").innerHTML = "VIP <span id=\"vipBenefitsLevelLabel\">0</span> " + LANG.vipBenefitsTitle;
  document.getElementById("downlineSearchTitle").textContent = LANG.downlineSearchTitle;
  document.getElementById("downlineSearchUid").placeholder = LANG.searchPlaceholder;
  document.getElementById("newDownlineTitle").textContent = LANG.newDownlineTitle;
  document.getElementById("btnFilterToday").textContent = LANG.filterToday;
  document.getElementById("btnFilterYesterday").textContent = LANG.filterYesterday;
  document.getElementById("btnFilterMonth").textContent = LANG.filterMonth;
  document.getElementById("depositFormTitle").textContent = LANG.depositTitle;
  document.getElementById("depositMethodLabel").textContent = LANG.depositMethod;
  document.getElementById("depositAmountLabel").textContent = LANG.depositAmount;
  document.getElementById("depositTxidLabel").textContent = LANG.depositTxid;
  document.getElementById("depAmount").placeholder = LANG.depositAmountPlaceholder;
  document.getElementById("depTxid").placeholder = LANG.depositTxidPlaceholder;
  document.getElementById("depositSubmitBtn").textContent = LANG.depositSubmit;
  document.getElementById("depNameLabel").textContent = LANG.bankName + ":";
  document.getElementById("withdrawFormTitle").textContent = LANG.withdrawTitle;
  document.getElementById("editBankLabel").textContent = LANG.editBank;
  document.getElementById("withdrawBankLabel").textContent = LANG.withdrawBank;
  document.getElementById("selectBankLabel").textContent = LANG.selectBank;
  document.getElementById("withdrawAmountLabel").textContent = LANG.withdrawAmount;
  document.getElementById("witAmount").placeholder = LANG.withdrawAmountPlaceholder;
  document.getElementById("withdrawSubmitBtn").textContent = LANG.withdrawSubmit;
  document.getElementById("wCardNameLabel").textContent = LANG.bankName + ":";
  document.getElementById("wCardNumLabel").textContent = LANG.bankNumber + ":";
  document.getElementById("withdrawInfoBox").innerHTML = "\n        <p>➖ " + LANG.withdrawInfo1 + " <span class=\"highlight\">K<span id=\"withdrawRequiredBet\">0.00</span></span> " + LANG.withdrawInfo2 + "</p>\n        <p>➖ " + LANG.withdrawInfo3 + "</p>\n        <p>➖ " + LANG.withdrawInfo4 + "</p>\n        <p>➖ " + LANG.withdrawInfo5 + "</p>\n    ";
  document.getElementById("bankSetupTitle").textContent = LANG.bankSetupTitle;
  document.getElementById("bankTypeLabel").textContent = LANG.bankType;
  document.getElementById("bankNameLabel").textContent = LANG.bankName;
  document.getElementById("bankNumberLabel").textContent = LANG.bankNumber;
  document.getElementById("bankName").placeholder = LANG.bankNamePlaceholder;
  document.getElementById("bankNumber").placeholder = LANG.bankNumberPlaceholder;
  document.getElementById("bankSaveBtn").textContent = LANG.bankSave;
  document.getElementById("settingTitle").textContent = LANG.settingTitle;
  document.getElementById("passwordChangeLabel").textContent = LANG.passwordChange;
  document.getElementById("nicknameChangeLabel").textContent = LANG.nicknameChange;
  document.getElementById("versionUpdateLabel").textContent = LANG.versionUpdate;
  document.getElementById("passwordChangeTitle").textContent = LANG.passwordChangeTitle;
  document.getElementById("pwdOld").placeholder = LANG.oldPassword;
  document.getElementById("pwdNew").placeholder = LANG.newPassword;
  document.getElementById("pwdConf").placeholder = LANG.confirmPassword;
  document.getElementById("passwordSubmitBtn").textContent = LANG.passwordSubmit;
  document.getElementById("nicknameChangeTitle").textContent = LANG.nicknameChangeTitle;
  document.getElementById("newNicknameLabel").textContent = LANG.newNickname;
  document.getElementById("nicknameNew").placeholder = LANG.newNicknamePlaceholder;
  document.getElementById("nicknameSubmitBtn").textContent = LANG.nicknameSubmit;
  document.getElementById("languageChangeTitle").textContent = LANG.languageTitle;
  document.getElementById("myanmarLabel").textContent = LANG.myanmar;
  document.getElementById("englishLabel").textContent = LANG.english;
  document.getElementById("notificationsTitle").textContent = LANG.notificationsTitle;
  document.getElementById("giftExchangeTitle").textContent = LANG.giftTitle;
  document.getElementById("giftMessage").innerHTML = "\n        <p>" + LANG.giftMessage1 + "</p>\n        <p>" + LANG.giftMessage2 + "</p>\n        <p>" + LANG.giftMessage3 + "</p>\n    ";
  document.getElementById("giftCodeInput").placeholder = LANG.giftPlaceholder;
  document.getElementById("giftRedeemBtn").textContent = LANG.giftRedeem;
  document.getElementById("giftHistoryTitle").textContent = LANG.giftHistory;
  document.getElementById("customerServiceTitle").textContent = LANG.customerTitle;
  document.getElementById("agentTelegramLabel").textContent = LANG.agentTelegram;
  document.getElementById("supportTelegramLabel").textContent = LANG.supportTelegram;
  document.getElementById("liveChatLabel").textContent = LANG.liveChat;
  document.getElementById("profileChangeTitle").textContent = LANG.profileTitle;
  document.getElementById("profileSaveBtn").textContent = LANG.profileSave;
  document.getElementById("ibTitle").textContent = LANG.ibTitle;
  document.getElementById("ibDesc").textContent = LANG.ibDesc;
  document.getElementById("ibCancelBtn").textContent = LANG.ibCancel;
  document.getElementById("ibDepositBtn").textContent = LANG.ibDeposit;
  document.getElementById("gdTitle").textContent = LANG.gdTitle;
  document.getElementById("gdDesc").textContent = LANG.gdDesc;
  document.getElementById("gdCancelBtn").textContent = LANG.gdCancel;
  document.getElementById("gdDepositBtn").textContent = LANG.gdDeposit;
  document.getElementById("spinnerText").textContent = LANG.spinnerText;
  document.getElementById("navHomeLabel").textContent = LANG.navHome;
  document.getElementById("navActivityLabel").textContent = LANG.navActivity;
  document.getElementById("navPromoLabel").textContent = LANG.navPromo;
  document.getElementById("navWalletLabel").textContent = LANG.navWallet;
  document.getElementById("navAccountLabel").textContent = LANG.navAccount;
  document.getElementById("depositHistoryTitle").textContent = LANG.depositHistoryTitle;
  document.getElementById("depFilterAll").textContent = LANG.filterAll;
  document.getElementById("withdrawHistoryTitle").textContent = LANG.withdrawHistoryTitle;
  document.getElementById("witFilterAll").textContent = LANG.filterAll;
}
function handleNavClick(_0x2d3238) {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  if (!navigator.onLine) {
    document.getElementById("networkError").classList.add("show");
    return;
  }
  const _0x1385ff = ["deposit", "withdraw", "promotion", "account", "wallet", "activity", "vip"];
  if (_0x1385ff.includes(_0x2d3238) && !userProfileData) {
    showCustomDialog(LANG.warning, LANG.loginRequired);
    showScreen("login");
    return;
  }
  showScreen(_0x2d3238);
  if (_0x2d3238 === "deposit") {
    setTimeout(() => {
      loadDepositHistory();
    }, 300);
  }
  if (_0x2d3238 === "wallet") {
    updateWalletScreen();
  }
  if (_0x2d3238 === "vip") {
    renderVIPScreen();
  }
  if (_0x2d3238 === "promotion") {
    renderPromotionScreen();
  }
  if (_0x2d3238 === "account") {
    refreshAccountScreen();
  }
  if (_0x2d3238 === "commission-ratio") {
    renderCommissionScreen("all");
  }
}
function refreshAccountScreen() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  showSpinner(true);
  const _0x4d461a = document.getElementById("vipBadgeContainer");
  _0x4d461a.innerHTML = "<div class=\"vip-badge-loading\"></div>";
  Promise.all([getUserInfo(), getUserVipLevel()]).then(([_0x3ed90d, _0x24d31a]) => {
    showSpinner(false);
    if (_0x3ed90d.code === 401 || _0x3ed90d.expired === true) {
      showSessionExpiredDialog();
      return;
    }
    if (_0x3ed90d.code === 0 && _0x3ed90d.data) {
      userProfileData = _0x3ed90d.data;
      renderUserUI(userProfileData);
      if (_0x24d31a.code === 0 && _0x24d31a.data) {
        const _0x16f088 = _0x24d31a.data.vip_level || 0;
        const _0x1b4fb9 = getVipLevelData(_0x16f088);
        _0x4d461a.innerHTML = "<img src=\"png/" + _0x1b4fb9.img + "\" onerror=\"this.style.display='none'; this.parentElement.innerHTML='VIP " + _0x16f088 + "'; this.parentElement.style.background='#2a3478'; this.parentElement.style.color='#f39c12'; this.parentElement.style.fontWeight='bold'; this.parentElement.style.fontSize='11px'; this.parentElement.style.padding='0 6px';\">";
      } else {
        const _0x3d0d5a = userProfileData.totalWagered || 0;
        const _0x373f4b = getVipLevel(_0x3d0d5a);
        const _0x521cf4 = getVipLevelData(_0x373f4b);
        _0x4d461a.innerHTML = "<img src=\"png/" + _0x521cf4.img + "\" onerror=\"this.style.display='none'; this.parentElement.innerHTML='VIP " + _0x373f4b + "'; this.parentElement.style.background='#2a3478'; this.parentElement.style.color='#f39c12'; this.parentElement.style.fontWeight='bold'; this.parentElement.style.fontSize='11px'; this.parentElement.style.padding='0 6px';\">";
      }
    } else {
      showSpinner(false);
      document.getElementById("authStateUser").style.display = "none";
      document.getElementById("authStateGuest").style.display = "flex";
      _0x4d461a.innerHTML = "<img src=\"png/0-BG6QPOmD.png\" onerror=\"this.style.display='none'; this.parentElement.innerHTML='VIP 0'; this.parentElement.style.background='#2a3478'; this.parentElement.style.color='#f39c12'; this.parentElement.style.fontWeight='bold'; this.parentElement.style.fontSize='11px'; this.parentElement.style.padding='0 6px';\">";
    }
  }).catch(_0x24739b => {
    showSpinner(false);
    const _0x5f0dc5 = document.getElementById("vipBadgeContainer");
    _0x5f0dc5.innerHTML = "<img src=\"png/0-BG6QPOmD.png\" onerror=\"this.style.display='none'; this.parentElement.innerHTML='VIP 0'; this.parentElement.style.background='#2a3478'; this.parentElement.style.color='#f39c12'; this.parentElement.style.fontWeight='bold'; this.parentElement.style.fontSize='11px'; this.parentElement.style.padding='0 6px';\">";
  });
}
function showVIPScreen() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  navigationHistory.push("vip");
  renderVIPScreen();
  showScreen("vip");
}
function showPromotionScreen() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  navigationHistory.push("promotion");
  renderPromotionScreen();
  showScreen("promotion");
}
function showDownlineSearch() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  navigationHistory.push("downline-search");
  showScreen("downline-search");
}
function showNewDownline() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  navigationHistory.push("new-downline");
  loadDownlineList();
  showScreen("new-downline");
}
function showGiftExchange() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  renderGiftHistory();
  navigationHistory.push("gift-exchange");
  showScreen("gift-exchange");
}
function showNotificationList() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  renderNotifications();
  navigationHistory.push("notifications");
  showScreen("notifications");
}
function showLanguageChange() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  navigationHistory.push("language-change");
  showScreen("language-change");
}
function showSettingOnly() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  navigationHistory.push("setting");
  showScreen("setting");
}
function showCustomerService() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  navigationHistory.push("customer-service");
  showScreen("customer-service");
}
function showCommissionRatio() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  navigationHistory.push("commission-ratio");
  renderCommissionScreen("all");
  showScreen("commission-ratio");
}
let currentCommissionFilter = "all";
function renderCommissionScreen(_0x1c8398) {
  currentCommissionFilter = _0x1c8398 || "all";
  const _0x400512 = document.getElementById("commissionDisplayContainer");
  document.querySelectorAll(".comm-tab-active, .comm-tab-inactive").forEach(_0x1b52d8 => {
    _0x1b52d8.className = "comm-tab-inactive";
  });
  const _0x247048 = {
    all: "commFilterAll",
    lottery: "commFilterLottery",
    mini: "commFilterMini"
  };
  const _0x54d616 = document.getElementById(_0x247048[_0x1c8398] || "commFilterAll");
  if (_0x54d616) {
    _0x54d616.className = "comm-tab-active";
  }
  let _0x2229f8 = [];
  if (_0x1c8398 === "all" || _0x1c8398 === "lottery") {
    const _0x4f0997 = [{
      level: 1,
      rate: "0.4%"
    }, {
      level: 2,
      rate: "0.08%"
    }, {
      level: 3,
      rate: "0.016%"
    }, {
      level: 4,
      rate: "0.0032%"
    }, {
      level: 5,
      rate: "0.00064%"
    }, {
      level: 6,
      rate: "0.000128%"
    }];
    if (_0x1c8398 === "all") {
      _0x2229f8 = _0x2229f8.concat(_0x4f0997.map(_0x51006c => ({
        ..._0x51006c,
        type: "ထီ"
      })));
    } else {
      _0x2229f8 = _0x4f0997;
    }
  }
  if (_0x1c8398 === "all" || _0x1c8398 === "mini") {
    const _0x41364d = [{
      level: 1,
      rate: "0.1%"
    }, {
      level: 2,
      rate: "0.03%"
    }, {
      level: 3,
      rate: "0.007%"
    }, {
      level: 4,
      rate: "0.0015%"
    }, {
      level: 5,
      rate: "0.00031%"
    }, {
      level: 6,
      rate: "0.000063%"
    }];
    if (_0x1c8398 === "all") {
      _0x2229f8 = _0x2229f8.concat(_0x41364d.map(_0x29c4b3 => ({
        ..._0x29c4b3,
        type: "မီနီဂိမ်း"
      })));
    } else {
      _0x2229f8 = _0x41364d;
    }
  }
  let _0x24a520 = "<div class=\"commission-subtitle\">" + LANG.commissionSub + "</div>";
  if (_0x1c8398 === "all") {
    const _0x1e9cdb = _0x2229f8.filter(_0x1e0ba1 => _0x1e0ba1.type === "ထီ");
    const _0x1f6ed8 = _0x2229f8.filter(_0x3a136b => _0x3a136b.type === "မီနီဂိမ်း");
    if (_0x1e9cdb.length > 0) {
      _0x24a520 += "<div style=\"color:#2f82ff;font-weight:bold;font-size:12px;margin:8px 0 4px 0;\">ထီ</div>";
      _0x1e9cdb.forEach(_0x4bbe08 => {
        _0x24a520 += "<div class=\"commission-level-item\">\n                    <span class=\"level-name\">" + (LANG["level" + _0x4bbe08.level] || "အဆင့် " + _0x4bbe08.level) + "</span>\n                    <span class=\"level-rate\">" + _0x4bbe08.rate + "</span>\n                </div>";
      });
    }
    if (_0x1f6ed8.length > 0) {
      _0x24a520 += "<div style=\"color:#2f82ff;font-weight:bold;font-size:12px;margin:8px 0 4px 0;\">မီနီဂိမ်း</div>";
      _0x1f6ed8.forEach(_0x403ac5 => {
        _0x24a520 += "<div class=\"commission-level-item\">\n                    <span class=\"level-name\">" + (LANG["level" + _0x403ac5.level] || "အဆင့် " + _0x403ac5.level) + "</span>\n                    <span class=\"level-rate\">" + _0x403ac5.rate + "</span>\n                </div>";
      });
    }
  } else {
    _0x2229f8.forEach(_0x41e64d => {
      _0x24a520 += "<div class=\"commission-level-item\">\n                <span class=\"level-name\">" + (LANG["level" + _0x41e64d.level] || "အဆင့် " + _0x41e64d.level) + "</span>\n                <span class=\"level-rate\">" + _0x41e64d.rate + "</span>\n            </div>";
    });
  }
  _0x24a520 += "<div class=\"commission-info\">" + LANG.commissionInfo + "</div>";
  _0x400512.innerHTML = _0x24a520;
}
function filterCommission(_0x475eb8) {
  renderCommissionScreen(_0x475eb8);
}
function renderUserUI(_0x2f8bee) {
  if (!_0x2f8bee) {
    return;
  }
  document.getElementById("authStateGuest").style.display = "none";
  document.getElementById("authStateUser").style.display = "flex";
  const _0x1b1cc2 = Number(_0x2f8bee.balance || 0).toFixed(2);
  document.getElementById("headerBalance").textContent = formatCurrency(_0x2f8bee.balance || 0);
  document.getElementById("profUsername").textContent = _0x2f8bee.nickName || _0x2f8bee.userName || _0x2f8bee.phone || "-";
  document.getElementById("profUid").textContent = _0x2f8bee.uid || "-";
  document.getElementById("profBalance").textContent = formatCurrency(_0x2f8bee.balance || 0);
  const _0x2e854f = getProfileImage();
  document.getElementById("profileAvatar").src = "png/" + _0x2e854f;
  selectedProfileImage = _0x2e854f;
  document.getElementById("profLastLogin").textContent = LANG.lastLogin + " " + (_0x2f8bee.lastLogin || "-");
  if (_0x2f8bee.bankData && Array.isArray(_0x2f8bee.bankData)) {
    userBanks = _0x2f8bee.bankData;
  } else if (_0x2f8bee.bankType) {
    const _0x129b51 = {
      bank_type: _0x2f8bee.bankType,
      account_name: _0x2f8bee.bankName || "",
      account_number: _0x2f8bee.bankNumber || ""
    };
    userBanks = [_0x129b51];
  } else {
    userBanks = [];
  }
  populateBankSelect(userBanks);
  const _0x161f9a = _0x2f8bee.referCode || "Ref-mini" + (_0x2f8bee.uid || "");
  document.getElementById("promoRefcodeDisplay").innerHTML = _0x161f9a + " <i class=\"fas fa-copy text-muted cursor-pointer\" style=\"font-size:11px;\" onclick=\"copyReferralCodeString()\"></i>";
  const _0x88026 = _0x2f8bee.totalWagered || 0;
  const _0x42dabd = _0x2f8bee.requiredWagered || _0x2f8bee.totalDeposit || 0;
  const _0x2645e7 = Math.max(0, _0x42dabd - _0x88026);
  document.getElementById("withdrawRequiredBet").textContent = formatCurrency(_0x2645e7);
  updateWalletScreen();
  loadPromotions();
  loadWinnerData();
}
function updateWalletScreen() {
  if (!userProfileData) {
    return;
  }
  document.getElementById("walletBalance").textContent = formatCurrency(userProfileData.balance || 0);
}
function refreshBalance() {
  if (userProfileData) {
    getBalance().then(_0x5f46d2 => {
      if (_0x5f46d2.code === 0 && _0x5f46d2.data) {
        const _0x4a00e0 = Number(_0x5f46d2.data.amount || 0);
        document.getElementById("headerBalance").textContent = formatCurrency(_0x4a00e0);
        document.getElementById("profBalance").textContent = formatCurrency(_0x4a00e0);
        userProfileData.balance = _0x4a00e0;
        updateWalletScreen();
      }
    });
  }
}
function copyUID() {
  const _0x52e2de = document.getElementById("profUid").textContent;
  navigator.clipboard.writeText(_0x52e2de);
  showCustomDialog(LANG.success, LANG.copyUid, "png/success-pXDR1HMK.png");
}
function copyReferralCodeString() {
  const _0x582975 = document.getElementById("promoRefcodeDisplay").textContent.replace("", "").trim();
  navigator.clipboard.writeText(_0x582975);
  showCustomDialog(LANG.success, LANG.copyCode, "png/success-pXDR1HMK.png");
}
function copyPaymentField() {
  const _0x4e9e3e = document.getElementById("depPhone").textContent;
  if (_0x4e9e3e === "-") {
    return;
  }
  navigator.clipboard.writeText(_0x4e9e3e);
  showCustomDialog(LANG.success, LANG.copyAccount, "png/success-pXDR1HMK.png");
}
function copyInvitationLink() {
  const _0x3de99d = "https://mini-game.site/?invite=" + (userProfileData?.referCode || "Ref-11481000");
  navigator.clipboard.writeText(_0x3de99d);
  showCustomDialog(LANG.success, LANG.copyLink, "png/success-pXDR1HMK.png");
}
function openAgentTelegram() {
  window.open("https://t.me/ngelayminigamemm", "_blank");
}
function openSupportTelegram() {
  window.open("https://t.me/minigameofficial_service", "_blank");
}
function filterGames(_0x16c8d6) {
  currentGameFilter = _0x16c8d6;
  ["all", "lottery", "mini"].forEach(_0x25e0de => {
    const _0x49874d = document.getElementById("gameTab" + capitalize(_0x25e0de));
    if (_0x49874d) {
      _0x49874d.className = _0x25e0de === _0x16c8d6 ? "game-tab-active" : "game-tab-inactive";
    }
  });
  renderGames(_0x16c8d6);
}
function renderGames(_0x163d5c) {
  const _0x1f658 = document.getElementById("gameGridContainer");
  const _0xcd69b4 = GAMES[_0x163d5c] || GAMES.all;
  _0x1f658.style.opacity = "0";
  setTimeout(() => {
    const _0x2f6d2b = _0xcd69b4.length >= 3;
    _0x1f658.className = _0x2f6d2b ? "grid-3col" : "grid-2col";
    _0x1f658.innerHTML = _0xcd69b4.map(_0xc1893 => "\n                <div class=\"game-card-wrapper\" onclick=\"attemptEnterGame(" + _0xc1893.id + ", '" + _0xc1893.name + "')\">\n                    <img src=\"" + _0xc1893.image + "\" class=\"game-card-img\" onerror=\"this.src='https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300'\">\n                </div>\n            ").join("");
    _0x1f658.style.opacity = "1";
  }, 200);
}
function hasMadeFirstDeposit() {
  if (userProfileData && Number(userProfileData.totalDeposit) > 0) {
    return true;
  }
  return Array.isArray(depositHistory) && depositHistory.length > 0;
}
function showGameDepositDialog() {
  const _0x4e26d1 = document.getElementById("gameDepositDialog");
  if (!_0x4e26d1) {
    showCustomDialog(LANG.warning, "ပထမဦးဆုံးငွေသွင်းပါ");
    return;
  }
  const _0x1d3a96 = document.getElementById("gdTitle");
  const _0x2c8d31 = document.getElementById("gdDesc");
  if (_0x1d3a96) {
    _0x1d3a96.textContent = "ပထမဦးဆုံးငွေသွင်းပါ";
  }
  if (_0x2c8d31) {
    _0x2c8d31.textContent = "ဤဂိမ်းကို ကစားရန်အတွက် အရင်ဆုံး ငွေသွင်းရပါမည်။";
  }
  _0x4e26d1.classList.remove("hidden");
  _0x4e26d1.style.display = "flex";
}
function attemptEnterGame(_0x16b0d9, _0x42596f) {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  if (!navigator.onLine) {
    document.getElementById("networkError").classList.add("show");
    return;
  }
  if (!userProfileData) {
    showCustomDialog(LANG.warning, LANG.gameLoginRequired);
    showScreen("login");
    return;
  }
  if ((_0x16b0d9 === 1 || _0x16b0d9 === 2) && !hasMadeFirstDeposit()) {
    showGameDepositDialog();
    return;
  }
  showSpinner(true);
  setTimeout(() => {
    showSpinner(false);
    if (_0x16b0d9 === 1) {
      window.location.href = "home/AllLotteryGames/WinGo/";
    } else if (_0x16b0d9 === 2) {
      window.location.href = "home/AllLotteryGames/WinTrx/";
    } else if (_0x16b0d9 === 3) {
      window.location.href = "home/minigame/gold/";
    } else {
      showCustomDialog(LANG.warning, LANG.gameNotAvailable);
    }
  }, 800);
}
function closeGameDepositDialog() {
  const _0x32ccf6 = document.getElementById("gameDepositDialog");
  if (!_0x32ccf6) {
    return;
  }
  _0x32ccf6.style.display = "none";
  _0x32ccf6.classList.add("hidden");
}
function goToDepositFromGame() {
  closeGameDepositDialog();
  handleNavClick("deposit");
}
function goToDeposit() {
  document.getElementById("insufficientBalance").style.display = "none";
  handleNavClick("deposit");
}
function closeInsufficientBalance() {
  document.getElementById("insufficientBalance").style.display = "none";
}
function syncDepositGateways() {
  const method = document.getElementById("depMethod").value;
  const key = method === "Wave Pay" ? "wave" : "kbz";
  // Frontend-only deposit account — no API
  const FIXED = {
    name: "Khin Mar Lar",
    phone: "09756394842"
  };
  depositGateways.wave = {
    ...FIXED
  };
  depositGateways.kbz = {
    ...FIXED
  };
  try {
    localStorage.removeItem("deposit_gateways");
  } catch (_e) {}
  const account = depositGateways[key] || FIXED;
  document.getElementById("depTitle").textContent = method;
  document.getElementById("depName").textContent = account.name;
  document.getElementById("depPhone").textContent = account.phone;
  const logo = key === "wave" ? "png/wave_icon-MMSgjjJE.png" : "png/kbz_icon-j2UvitJy.png";
  document.getElementById("depLogo").src = logo;
  document.getElementById("depLogo").onerror = function () {
    this.src = logo;
  };
}
async function loadDepositHistory() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  showSpinner(true);
  try {
    const _0x1f8c53 = await getDepositHistory();
    if (_0x1f8c53.code === 0 && _0x1f8c53.data) {
      depositHistory = _0x1f8c53.data.history?.deposits || [];
      renderDepositHistory(depositHistory);
    } else {
      depositHistory = [];
      renderDepositHistory([]);
    }
  } catch (_0x255d6c) {
    depositHistory = [];
    renderDepositHistory([]);
  } finally {
    showSpinner(false);
  }
}
function renderDepositHistory(_0x30261b) {
  const _0x5144bc = document.getElementById("depositHistoryListFull");
  let _0x51923c = _0x30261b;
  if (currentDepositFilter !== "all") {
    _0x51923c = _0x30261b.filter(_0x550f5d => _0x550f5d.method === currentDepositFilter);
  }
  if (!_0x51923c || _0x51923c.length === 0) {
    _0x5144bc.innerHTML = "<div style=\"text-align:center;color:#8c95bf;font-size:11px;padding:12px 0;\">" + LANG.noHistory + "</div>";
    return;
  }
  _0x5144bc.innerHTML = _0x51923c.map(_0x5e5fd8 => {
    const _0x5a01b2 = _0x5e5fd8.method === "KBZ Pay";
    const _0xa3c4df = _0x5a01b2 ? "png/kbz_icon-j2UvitJy.png" : "png/wave_icon-MMSgjjJE.png";
    const _0x249d58 = getStatusText(_0x5e5fd8.status);
    const _0x46ec8b = getStatusClass(_0x5e5fd8.status);
    const _0x537aaa = Number(_0x5e5fd8.amount).toLocaleString();
    const _0xd24d0a = _0x5e5fd8.orderId || _0x5e5fd8.order_id || "RC" + Date.now() + Math.random().toString(36).substring(2, 8);
    return "\n                <div style=\"background:#1a1f4a;border:1px solid #2a3478;border-radius:6px;padding:8px;border-left:3px solid #10b981;\">\n                    <div style=\"display:flex;justify-content:space-between;align-items:flex-start;\">\n                        <div>\n                            <div style=\"display:flex;align-items:center;gap:3px;flex-wrap:wrap;\">\n                                <span style=\"font-size:10px;font-weight:bold;color:#c5cee9;\">" + LANG.deposit + "</span>\n                                <span style=\"font-size:8px;font-weight:bold;color:" + (_0x46ec8b === "status-success" ? "#34d399" : _0x46ec8b === "status-pending" ? "#fbbf24" : "#f87171") + ";\">" + _0x249d58 + "</span>\n                            </div>\n                            <p style=\"font-size:12px;color:#34d399;font-weight:bold;\">K" + _0x537aaa + ".00</p>\n                            <p style=\"font-size:9px;color:#8c95bf;display:flex;align-items:center;gap:3px;\"><img src=\"" + _0xa3c4df + "\" style=\"width:12px;height:12px;display:inline;\" onerror=\"this.style.display='none'\">" + (_0x5e5fd8.method || "-") + "</p>\n                            <p style=\"font-size:8px;color:#8c95bf;font-family:monospace;\">" + LANG.orderId + " " + _0xd24d0a + "</p>\n                            " + (_0x5e5fd8.adminNote ? "<p style=\"font-size:8px;color:#f87171;\">" + LANG.adminNote + ": " + _0x5e5fd8.adminNote + "</p>" : "") + "\n                        </div>\n                        <span style=\"font-size:8px;color:#8c95bf;white-space:nowrap;margin-left:4px;\">" + (_0x5e5fd8.time || "-") + "</span>\n                    </div>\n                </div>\n            ";
  }).join("");
}
function filterDepositHistory(_0x4b9374) {
  currentDepositFilter = _0x4b9374;
  document.querySelectorAll("#screenDepositHistory .filter-btn-active, #screenDepositHistory .filter-btn-inactive").forEach(_0x518dd6 => {
    _0x518dd6.className = "filter-btn-inactive";
  });
  const _0x1ea2bb = {
    all: "depFilterAll",
    "KBZ Pay": "depFilterKbz",
    "Wave Pay": "depFilterWave"
  };
  const _0x2c7c56 = document.getElementById(_0x1ea2bb[_0x4b9374]);
  if (_0x2c7c56) {
    _0x2c7c56.className = "filter-btn-active";
  }
  renderDepositHistory(depositHistory);
}
function showDepositHistory() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  loadDepositHistory();
  navigationHistory.push("deposit-history");
  showScreen("deposit-history");
}
async function showWithdrawHistory() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  showSpinner(true);
  try {
    const _0x21d659 = await callAPI("get-myhistory-record", {
      type: "withdraw"
    });
    if (_0x21d659.code === 0 && _0x21d659.data) {
      renderWithdrawHistory(_0x21d659.data.history?.withdrawals || []);
    } else {
      renderWithdrawHistory([]);
    }
  } catch (_0x4b1f98) {
    renderWithdrawHistory([]);
  } finally {
    showSpinner(false);
    navigationHistory.push("withdraw-history");
    showScreen("withdraw-history");
  }
}
function renderWithdrawHistory(_0x45a4f4) {
  const _0x1d8ee3 = document.getElementById("withdrawHistoryList");
  let _0x82b6a3 = _0x45a4f4;
  if (currentWithdrawFilter !== "all") {
    _0x82b6a3 = _0x45a4f4.filter(_0x147f5c => _0x147f5c.method === currentWithdrawFilter);
  }
  if (!_0x82b6a3 || _0x82b6a3.length === 0) {
    _0x1d8ee3.innerHTML = "<div style=\"text-align:center;color:#8c95bf;font-size:11px;padding:12px 0;\">" + LANG.noHistory + "</div>";
    return;
  }
  _0x1d8ee3.innerHTML = _0x82b6a3.map(_0xbde8cc => {
    const _0x9300d8 = _0xbde8cc.method === "KBZ Pay";
    const _0x1b39b3 = _0x9300d8 ? "png/kbz_icon-j2UvitJy.png" : "png/wave_icon-MMSgjjJE.png";
    const _0x56138f = getStatusText(_0xbde8cc.status);
    const _0x15abaa = getStatusClass(_0xbde8cc.status);
    const _0x953237 = Number(_0xbde8cc.amount).toLocaleString();
    const _0x84ba05 = _0xbde8cc.orderId || _0xbde8cc.order_id || "RC" + Date.now() + Math.random().toString(36).substring(2, 8);
    return "\n                <div style=\"background:#1a1f4a;border:1px solid #2a3478;border-radius:6px;padding:8px;border-left:3px solid #f59e0b;\">\n                    <div style=\"display:flex;justify-content:space-between;align-items:flex-start;\">\n                        <div>\n                            <p style=\"font-size:10px;font-weight:bold;color:#c5cee9;\">" + LANG.withdraw + " <span style=\"color:" + (_0x15abaa === "status-success" ? "#34d399" : _0x15abaa === "status-pending" ? "#fbbf24" : "#f87171") + ";\">" + _0x56138f + "</span></p>\n                            <p style=\"font-size:12px;color:#f59e0b;font-weight:bold;\">K" + _0x953237 + ".00</p>\n                            <p style=\"font-size:9px;color:#8c95bf;display:flex;align-items:center;gap:3px;\"><img src=\"" + _0x1b39b3 + "\" style=\"width:12px;height:12px;display:inline;\" onerror=\"this.style.display='none'\">" + (_0xbde8cc.method || "-") + "</p>\n                            <p style=\"font-size:8px;color:#8c95bf;font-family:monospace;\">" + LANG.orderId + " " + _0x84ba05 + "</p>\n                            " + (_0xbde8cc.note ? "<p style=\"font-size:8px;color:#8c95bf;\">" + LANG.adminNote + ": " + _0xbde8cc.note + "</p>" : "") + "\n                            " + (_0xbde8cc.adminNote ? "<p style=\"font-size:8px;color:#f87171;\">Admin " + LANG.adminNote + ": " + _0xbde8cc.adminNote + "</p>" : "") + "\n                        </div>\n                        <span style=\"font-size:8px;color:#8c95bf;\">" + (_0xbde8cc.time || "-") + "</span>\n                    </div>\n                </div>\n            ";
  }).join("");
}
function filterWithdrawHistory(_0x48ee1f) {
  currentWithdrawFilter = _0x48ee1f;
  document.querySelectorAll("#screenWithdrawHistory .filter-btn-active, #screenWithdrawHistory .filter-btn-inactive").forEach(_0x262165 => {
    _0x262165.className = "filter-btn-inactive";
  });
  const _0x35b655 = {
    all: "witFilterAll",
    "KBZ Pay": "witFilterKbz",
    "Wave Pay": "witFilterWave"
  };
  const _0x5c65ee = document.getElementById(_0x35b655[_0x48ee1f]);
  if (_0x5c65ee) {
    _0x5c65ee.className = "filter-btn-active";
  }
  showWithdrawHistory();
}
function populateBankSelect(_0x41042f) {
  const _0x2b4076 = document.getElementById("withdrawBankSelect");
  _0x2b4076.innerHTML = "<option value=\"\">-- " + LANG.selectBank + " --</option>";
  if (!_0x41042f || _0x41042f.length === 0) {
    _0x2b4076.innerHTML = "<option value=\"\">-- " + LANG.noBank + " --</option>";
    document.getElementById("witBankDisplay").style.display = "none";
    return;
  }
  let _0x52ddf8 = false;
  let _0x1db4ae = false;
  _0x41042f.forEach(_0x5d6874 => {
    if (_0x5d6874.bank_type === "Wave Pay") {
      _0x52ddf8 = true;
    }
    if (_0x5d6874.bank_type === "KBZ Pay") {
      _0x1db4ae = true;
    }
  });
  const _0x4b4812 = document.getElementById("editBankBtn");
  if (_0x52ddf8 && _0x1db4ae) {
    _0x4b4812.style.display = "none";
  } else {
    _0x4b4812.style.display = "inline";
  }
  _0x41042f.forEach(_0x45e8bf => {
    const _0x59b358 = document.createElement("option");
    _0x59b358.value = JSON.stringify(_0x45e8bf);
    const _0x577239 = getBankIcon(_0x45e8bf.bank_type);
    _0x59b358.innerHTML = (_0x577239 ? "<img src=\"" + _0x577239 + "\" style=\"width:12px;height:12px;display:inline;vertical-align:middle;margin-right:3px;\" onerror=\"this.style.display='none'\">" : "") + " " + _0x45e8bf.bank_type + " - " + maskBankNumber(_0x45e8bf.account_number);
    _0x2b4076.appendChild(_0x59b358);
  });
}
function updateWithdrawBankDisplay() {
  const _0x269df6 = document.getElementById("withdrawBankSelect");
  const _0x5f04f8 = _0x269df6.value;
  const _0x4e3a44 = document.getElementById("witBankDisplay");
  if (!_0x5f04f8) {
    _0x4e3a44.style.display = "none";
    return;
  }
  const _0x5f2a41 = JSON.parse(_0x5f04f8);
  const _0x52f9f9 = getBankIcon(_0x5f2a41.bank_type);
  document.getElementById("witBankIcon").src = _0x52f9f9;
  document.getElementById("witBankIcon").onerror = function () {
    this.style.display = "none";
  };
  document.getElementById("wCardType").textContent = _0x5f2a41.bank_type;
  document.getElementById("wCardName").textContent = _0x5f2a41.account_name;
  document.getElementById("wCardNum").textContent = maskBankNumber(_0x5f2a41.account_number);
  _0x4e3a44.style.display = "block";
}
function getGiftHistory() {
  const _0x37f6d1 = "gift_history_" + (userProfileData?.uid || "guest");
  return JSON.parse(localStorage.getItem(_0x37f6d1) || "[]");
}
function saveGiftHistory(_0x4113eb) {
  const _0x4c02d7 = "gift_history_" + (userProfileData?.uid || "guest");
  const _0x1c14d6 = getGiftHistory();
  _0x1c14d6.unshift(_0x4113eb);
  localStorage.setItem(_0x4c02d7, JSON.stringify(_0x1c14d6));
}
function renderGiftHistory() {
  const _0x9670cf = document.getElementById("giftHistoryList");
  const _0x94752 = getGiftHistory();
  if (_0x94752.length === 0) {
    _0x9670cf.innerHTML = "<div style=\"text-align:center;color:#8c95bf;font-size:10px;padding:8px 0;\">" + LANG.noHistory + "</div>";
    return;
  }
  _0x9670cf.innerHTML = _0x94752.map(_0x4ec525 => "\n            <div style=\"display:flex;justify-content:space-between;align-items:center;background:#1a1f4a;padding:4px 8px;border-radius:4px;border:1px solid #2a3478;margin-bottom:3px;\">\n                <div><p style=\"font-size:10px;color:#34d399;font-weight:bold;\">" + LANG.statusCompleted + "</p><p style=\"font-size:10px;color:#f39c12;\">" + _0x4ec525.amount + " ကျပ်</p></div>\n                <span style=\"font-size:8px;color:#8c95bf;\">" + _0x4ec525.time + "</span>\n            </div>\n        ").join("");
}
async function redeemGiftCode() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  if (!userProfileData) {
    showCustomDialog(LANG.warning, LANG.loginRequired);
    return;
  }
  const _0xbece02 = document.getElementById("giftCodeInput").value.trim();
  if (!_0xbece02) {
    showCustomDialog(LANG.warning, LANG.giftCodeRequired);
    return;
  }
  const _0x11d410 = getGiftHistory();
  const _0x46eda6 = new Date().toDateString();
  const _0x3d4462 = _0x11d410.filter(_0x1f5e6f => new Date(_0x1f5e6f.time).toDateString() === _0x46eda6).length;
  if (_0x3d4462 >= 3) {
    showCustomDialog(LANG.warning, LANG.giftLimit);
    return;
  }
  showSpinner(true);
  try {
    const _0x36361f = await claimGiftCode(_0xbece02);
    if (_0x36361f.code === 0) {
      const _0xfce346 = new Date();
      const _0xa7d3fc = _0xfce346.getFullYear() + "-" + String(_0xfce346.getMonth() + 1).padStart(2, "0") + "-" + String(_0xfce346.getDate()).padStart(2, "0") + " " + String(_0xfce346.getHours()).padStart(2, "0") + ":" + String(_0xfce346.getMinutes()).padStart(2, "0") + ":" + String(_0xfce346.getSeconds()).padStart(2, "0");
      const _0xea37c = {
        amount: _0x36361f.data.amount,
        time: _0xa7d3fc
      };
      saveGiftHistory(_0xea37c);
      document.getElementById("giftCodeInput").value = "";
      renderGiftHistory();
      refreshBalance();
      const _0x828237 = await getUserInfo();
      if (_0x828237.code === 0) {
        userProfileData = _0x828237.data;
        renderUserUI(userProfileData);
      }
      showCustomDialog(LANG.success, _0x36361f.data.amount + " " + LANG.giftSuccess, "png/success-pXDR1HMK.png");
    } else if (_0x36361f.code === 404) {
      showCustomDialog(LANG.error, _0x36361f.msg || LANG.giftInvalid);
    } else if (_0x36361f.code === 400) {
      showCustomDialog(LANG.error, _0x36361f.msg || LANG.giftUsed);
    } else {
      showCustomDialog(LANG.error, _0x36361f.msg || LANG.giftInvalid);
    }
  } catch (_0x1475a5) {
    showCustomDialog(LANG.error, _0x1475a5.message);
  } finally {
    showSpinner(false);
  }
}
function renderNotifications() {
  const _0x49beca = document.getElementById("notificationList");
  const _0x1d43c1 = {
    icon: "success",
    color: "#2ecc71",
    bg: "rgba(46,204,113,0.2)",
    title: LANG.notifDepositSuccess,
    desc: LANG.notifDepositSuccessDesc,
    time: "2026-07-22 14:30:00"
  };
  const _0x28768c = {
    icon: "warning",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.2)",
    title: LANG.notifWithdrawPending,
    desc: LANG.notifWithdrawPendingDesc,
    time: "2026-07-22 13:15:00"
  };
  const _0x504ae2 = {
    icon: "info",
    color: "#2f82ff",
    bg: "rgba(47,130,255,0.2)",
    title: LANG.notifVipUpgrade,
    desc: LANG.notifVipUpgradeDesc,
    time: "2026-07-21 22:00:00"
  };
  const _0x331041 = [_0x1d43c1, _0x28768c, _0x504ae2];
  _0x49beca.innerHTML = _0x331041.map(_0xe939c => "\n            <div class=\"notification-item\" style=\"border-left-color: " + _0xe939c.color + ";\">\n                <div class=\"notif-body\">\n                    <div class=\"notif-icon\" style=\"background:" + _0xe939c.bg + ";color:" + _0xe939c.color + ";\">\n                        <svg viewBox=\"0 0 24 24\"><path d=\"" + (_0xe939c.icon === "success" ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" : _0xe939c.icon === "warning" ? "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z") + "\"/></svg>\n                    </div>\n                    <div class=\"notif-content\">\n                        <div class=\"notif-title\">" + _0xe939c.title + "</div>\n                        <div class=\"notif-desc\">" + _0xe939c.desc + "</div>\n                        <span class=\"notif-time\">" + _0xe939c.time + "</span>\n                    </div>\n                </div>\n            </div>\n        ").join("");
}
async function executeDownlineSearch() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  const _0x3c5885 = parseInt(document.getElementById("downlineSearchUid").value);
  const _0x5be90b = document.getElementById("searchResultContainer");
  _0x5be90b.style.display = "block";
  if (isNaN(_0x3c5885)) {
    _0x5be90b.innerHTML = "<p style=\"color:#8c95bf;font-size:11px;\">" + LANG.enterUid + "</p>";
    return;
  }
  if (!userProfileData) {
    _0x5be90b.innerHTML = "<p style=\"color:#8c95bf;font-size:11px;\">" + LANG.loginRequired + "</p>";
    return;
  }
  if (_0x3c5885 === userProfileData.uid) {
    _0x5be90b.innerHTML = "<p style=\"color:#8c95bf;font-size:11px;\">" + LANG.noData + "</p>";
    return;
  }
  showSpinner(true);
  try {
    const _0x1e19f3 = await getSearch(_0x3c5885);
    showSpinner(false);
    if (_0x1e19f3.code === 401 || _0x1e19f3.expired === true) {
      showSessionExpiredDialog();
      return;
    }
    if (_0x1e19f3.code === 0 && _0x1e19f3.data) {
      const _0x2c85a8 = _0x1e19f3.data;
      let _0xbbb6b1 = LANG.searchNotFound;
      let _0x42f9de = "-";
      let _0x2e06c9 = "0.00";
      let _0x2fa1f4 = "-";
      let _0x3f1351 = "0.00";
      let _0x433fa9 = "0.00";
      let _0x271bff = "0.00";
      if (_0x2c85a8.referralInfo) {
        _0xbbb6b1 = LANG.searchFound.replace("အဆင့်", "အဆင့် " + _0x2c85a8.referralInfo.level);
        _0x42f9de = _0x2c85a8.referralInfo.level || "-";
        _0x2e06c9 = _0x2c85a8.referralInfo.commission || "0.00";
        _0x2fa1f4 = _0x2c85a8.referralInfo.level || "-";
      }
      if (_0x2c85a8.yesterday) {
        _0x3f1351 = _0x2c85a8.yesterday.deposit || "0.00";
        _0x433fa9 = _0x2c85a8.yesterday.betAmount || "0.00";
        _0x271bff = _0x2c85a8.yesterday.commission || "0.00";
      }
      _0x5be90b.innerHTML = "\n                    <div style=\"text-align:left;color:#c5cee9;font-size:11px;width:100%;\">\n                        <div style=\"background:#1a1f4a;padding:8px;border-radius:6px;border:1px solid #2a3478;margin-bottom:6px;\">\n                            <p style=\"color:#34d399;font-weight:bold;\">" + (_0x2c85a8.isReferral ? _0xbbb6b1 : LANG.searchNotFound) + "</p>\n                            <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:4px;\">\n                                <div><span style=\"color:#8c95bf;\">" + LANG.uid + " :</span><span style=\"color:#f39c12;font-weight:bold;\">" + (_0x2c85a8.uid || "-") + "</span></div>\n                                <div><span style=\"color:#8c95bf;\">" + LANG.username + " :</span><span style=\"color:#c5cee9;\">" + (_0x2c85a8.username || "-") + "</span></div>\n                                <div><span style=\"color:#8c95bf;\">" + LANG.balance + " :</span><span style=\"color:#34d399;\">" + (_0x2c85a8.balance !== undefined ? formatCurrency(_0x2c85a8.balance) : "0.00") + "</span></div>\n                                <div><span style=\"color:#8c95bf;\">" + LANG.joinedDate + " :</span><span style=\"color:#c5cee9;\">" + (_0x2c85a8.joinedDate || "-") + "</span></div>\n                                <div><span style=\"color:#8c95bf;\">" + LANG.todayDeposit + " :</span><span style=\"color:#f39c12;\">" + formatCurrency(_0x3f1351) + "</span></div>\n                                <div><span style=\"color:#8c95bf;\">" + LANG.todayBet + " :</span><span style=\"color:#f39c12;\">" + formatCurrency(_0x433fa9) + "</span></div>\n                                <div><span style=\"color:#8c95bf;\">" + LANG.totalCommission + " :</span><span style=\"color:#34d399;\">" + formatCurrency(_0x271bff) + "</span></div>\n                                <div><span style=\"color:#8c95bf;\">" + LANG.refLevel + " :</span><span style=\"color:#2f82ff;\">" + _0x2fa1f4 + "</span></div>\n                            </div>\n                        </div>\n                    </div>\n                ";
    } else if (_0x1e19f3.code === 404) {
      _0x5be90b.innerHTML = "\n                    <div class=\"empty-state\">\n                        <img src=\"png/empty-xV1p0yFa.png\" onerror=\"this.style.display='none'\">\n                        <p>" + (_0x1e19f3.msg || LANG.notFound) + "</p>\n                    </div>\n                ";
    } else {
      _0x5be90b.innerHTML = "<p style=\"color:#8c95bf;font-size:11px;\">" + (_0x1e19f3.msg || LANG.noData) + "</p>";
    }
  } catch (_0x170c75) {
    _0x5be90b.innerHTML = "\n                <div class=\"empty-state\">\n                    <img src=\"png/empty-xV1p0yFa.png\" onerror=\"this.style.display='none'\">\n                    <p>" + LANG.noData + "</p>\n                </div>\n            ";
    showSpinner(false);
  }
}
async function loadDownlineList() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  try {
    const _0x2c9a59 = await getPromotions();
    if (_0x2c9a59.code === 0 && _0x2c9a59.data) {
      const _0x493d83 = _0x2c9a59.data.referralStats || {};
      const _0x411c14 = {
        today: _0x493d83.todayReferrals || [],
        yesterday: _0x493d83.yesterdayReferrals || [],
        month: _0x493d83.allReferrals || []
      };
      downlineData = _0x411c14;
      renderDownlineList(activeDownlineFilter);
    }
  } catch (_0x38fe9e) {
    downlineData = {
      today: [],
      yesterday: [],
      month: []
    };
    renderDownlineList(activeDownlineFilter);
  }
}
function renderDownlineList(_0x507897) {
  const _0x175cb5 = document.getElementById("downlineListView");
  _0x175cb5.innerHTML = "";
  const _0x197d29 = downlineData[_0x507897] || [];
  if (_0x197d29.length === 0) {
    _0x175cb5.innerHTML = "\n                <div class=\"empty-state\">\n                    <img src=\"png/empty-xV1p0yFa.png\" onerror=\"this.style.display='none'\">\n                    <p>" + LANG.noData + "</p>\n                </div>\n            ";
    return;
  }
  _0x197d29.forEach(_0x370dff => {
    const _0x4022fe = document.createElement("div");
    _0x4022fe.className = "downline-item";
    const _0x14b3ec = new Date(_0x370dff.joinedDate || _0x370dff.createdAt);
    _0x4022fe.innerHTML = "\n                <span><span class=\"uid\">" + _0x370dff.uid + "</span> (" + maskPhoneNumber(_0x370dff.phone || "") + ")</span>\n                <span class=\"time\">" + _0x14b3ec.toLocaleString() + "</span>\n            ";
    _0x175cb5.appendChild(_0x4022fe);
  });
}
function filterDownlineList(_0x42cad3) {
  activeDownlineFilter = _0x42cad3;
  ["today", "yesterday", "month"].forEach(_0x34de34 => {
    const _0x1ee8e5 = document.getElementById("btnFilter" + capitalize(_0x34de34));
    if (_0x1ee8e5) {
      _0x1ee8e5.style.background = _0x34de34 === _0x42cad3 ? "#2a3478" : "transparent";
      _0x1ee8e5.style.color = _0x34de34 === _0x42cad3 ? "#fff" : "#8c95bf";
    }
  });
  renderDownlineList(_0x42cad3);
}
async function renderPromotionScreen() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  if (!userProfileData) {
    return;
  }
  showSpinner(true);
  try {
    const _0x4cf90b = await getPromotions();
    if (_0x4cf90b.code === 0 && _0x4cf90b.data) {
      const _0x35ab41 = _0x4cf90b.data.commission || {};
      const _0x5e631b = _0x35ab41.amount || 0;
      document.getElementById("promoCommission").textContent = formatCurrency(_0x5e631b);
      const _0x1771bb = _0x4cf90b.data.referralStats || {};
      if (_0x1771bb) {
        const _0x3bbe70 = {
          today: _0x1771bb.todayReferrals || [],
          yesterday: _0x1771bb.yesterdayReferrals || [],
          month: _0x1771bb.allReferrals || []
        };
        downlineData = _0x3bbe70;
      }
    } else {
      document.getElementById("promoCommission").textContent = "0.00";
    }
  } catch (_0x5a1204) {
    document.getElementById("promoCommission").textContent = "0.00";
  } finally {
    showSpinner(false);
  }
}
async function loadPromotions() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  try {
    const _0x12b952 = await getPromotions();
    if (_0x12b952.code === 0 && _0x12b952.data) {
      if (userProfileData) {
        userProfileData.referralStats = _0x12b952.data.referralStats || {};
        renderPromotionScreen();
      }
      const _0x3cbc09 = _0x12b952.data.referralStats || {};
      const _0x4f299b = {
        today: _0x3cbc09.todayReferrals || [],
        yesterday: _0x3cbc09.yesterdayReferrals || [],
        month: _0x3cbc09.allReferrals || []
      };
      downlineData = _0x4f299b;
      if (document.getElementById("screenNewDownline").classList.contains("active")) {
        renderDownlineList(activeDownlineFilter);
      }
    }
  } catch (_0x28ea44) {
    console.error("Load promotions error:", _0x28ea44);
  }
}
async function loadWinnerData() {
  try {
    const _0x44d526 = await getWinnerToday();
    if (_0x44d526.success && _0x44d526.data) {
      renderWinner(_0x44d526.data);
    } else {
      renderWinner(null);
    }
  } catch (_0x569cff) {
    renderWinner(null);
  }
}
function renderWinner(_0x10cdac) {
  const _0x130c85 = document.getElementById("winnerContainer");
  if (!_0x10cdac || !_0x10cdac.top3 || _0x10cdac.top3.length === 0) {
    _0x130c85.innerHTML = "";
    return;
  }
  const _0x4aaab2 = _0x10cdac.top3 || [];
  const _0x37aee0 = _0x10cdac.list || [];
  let _0x4b0b3f = "";
  _0x4b0b3f += "<div class=\"winner-podium-container\">";
  const _0x2f8ee7 = _0x4aaab2.find(_0x44cceb => _0x44cceb.rank === 2) || _0x4aaab2[1] || null;
  _0x4b0b3f += "<div class=\"winner-podium-col rank-2\">";
  if (_0x2f8ee7) {
    const _0x3c5149 = _0x2f8ee7.user_photo || "1";
    _0x4b0b3f += "\n                <div class=\"winner-avatar-wrapper\">\n                    <img src=\"png/" + _0x3c5149 + "-Cz2mt-nl.png\" class=\"winner-avatar\" onerror=\"this.src='png/1-Cz2mt-nl.png'\">\n                    <div class=\"winner-rank-badge\">2</div>\n                </div>\n                <div class=\"winner-pillar\">\n                    <span class=\"winner-pillar-name\">" + _0x2f8ee7.nickname + "</span>\n                    <span class=\"winner-pillar-rank-num\">02</span>\n                    <span class=\"winner-pillar-amount\">K" + formatCurrency(_0x2f8ee7.total_profit) + "</span>\n                </div>\n            ";
  } else {
    _0x4b0b3f += "\n                <div class=\"winner-avatar-wrapper\">\n                    <div class=\"winner-avatar\" style=\"background:#2a3478;\"></div>\n                    <div class=\"winner-rank-badge\">2</div>\n                </div>\n                <div class=\"winner-pillar\">\n                    <span class=\"winner-pillar-name\">-</span>\n                    <span class=\"winner-pillar-rank-num\">02</span>\n                    <span class=\"winner-pillar-amount\">K0.00</span>\n                </div>\n            ";
  }
  _0x4b0b3f += "</div>";
  const _0x1f16ba = _0x4aaab2.find(_0x312958 => _0x312958.rank === 1) || _0x4aaab2[0] || null;
  _0x4b0b3f += "<div class=\"winner-podium-col rank-1\">";
  if (_0x1f16ba) {
    const _0x4826eb = _0x1f16ba.user_photo || "1";
    _0x4b0b3f += "\n                <div class=\"winner-avatar-wrapper\">\n                    <img src=\"png/" + _0x4826eb + "-Cz2mt-nl.png\" class=\"winner-avatar\" onerror=\"this.src='png/1-Cz2mt-nl.png'\">\n                    <div class=\"winner-rank-badge\">1</div>\n                </div>\n                <div class=\"winner-pillar\">\n                    <span class=\"winner-pillar-name\">" + _0x1f16ba.nickname + "</span>\n                    <span class=\"winner-pillar-rank-num\">01</span>\n                    <span class=\"winner-pillar-amount\">K" + formatCurrency(_0x1f16ba.total_profit) + "</span>\n                </div>\n            ";
  } else {
    _0x4b0b3f += "\n                <div class=\"winner-avatar-wrapper\">\n                    <div class=\"winner-avatar\" style=\"background:#2a3478;\"></div>\n                    <div class=\"winner-rank-badge\">1</div>\n                </div>\n                <div class=\"winner-pillar\">\n                    <span class=\"winner-pillar-name\">-</span>\n                    <span class=\"winner-pillar-rank-num\">01</span>\n                    <span class=\"winner-pillar-amount\">K0.00</span>\n                </div>\n            ";
  }
  _0x4b0b3f += "</div>";
  const _0x15e09d = _0x4aaab2.find(_0x1ec9ff => _0x1ec9ff.rank === 3) || _0x4aaab2[2] || null;
  _0x4b0b3f += "<div class=\"winner-podium-col rank-3\">";
  if (_0x15e09d) {
    const _0x319161 = _0x15e09d.user_photo || "1";
    _0x4b0b3f += "\n                <div class=\"winner-avatar-wrapper\">\n                    <img src=\"png/" + _0x319161 + "-Cz2mt-nl.png\" class=\"winner-avatar\" onerror=\"this.src='png/1-Cz2mt-nl.png'\">\n                    <div class=\"winner-rank-badge\">3</div>\n                </div>\n                <div class=\"winner-pillar\">\n                    <span class=\"winner-pillar-name\">" + _0x15e09d.nickname + "</span>\n                    <span class=\"winner-pillar-rank-num\">03</span>\n                    <span class=\"winner-pillar-amount\">K" + formatCurrency(_0x15e09d.total_profit) + "</span>\n                </div>\n            ";
  } else {
    _0x4b0b3f += "\n                <div class=\"winner-avatar-wrapper\">\n                    <div class=\"winner-avatar\" style=\"background:#2a3478;\"></div>\n                    <div class=\"winner-rank-badge\">3</div>\n                </div>\n                <div class=\"winner-pillar\">\n                    <span class=\"winner-pillar-name\">-</span>\n                    <span class=\"winner-pillar-rank-num\">03</span>\n                    <span class=\"winner-pillar-amount\">K0.00</span>\n                </div>\n            ";
  }
  _0x4b0b3f += "</div>";
  _0x4b0b3f += "</div>";
  if (_0x37aee0 && _0x37aee0.length > 0) {
    _0x4b0b3f += "<div class=\"winner-leaderboard-list\">";
    _0x37aee0.forEach(_0x95be62 => {
      const _0x1e452d = _0x95be62.rank || 4;
      const _0x724fac = _0x95be62.user_photo || "1";
      _0x4b0b3f += "\n                    <div class=\"winner-leaderboard-item\">\n                        <div class=\"winner-leaderboard-left\">\n                            <span class=\"winner-rank-number\">" + _0x1e452d + "</span>\n                            <img src=\"png/" + _0x724fac + "-Cz2mt-nl.png\" class=\"winner-list-avatar\" onerror=\"this.src='png/1-Cz2mt-nl.png'\">\n                            <span class=\"winner-list-username\">" + _0x95be62.nickname + "</span>\n                        </div>\n                        <span class=\"winner-list-amount\">K" + formatCurrency(_0x95be62.total_profit) + "</span>\n                    </div>\n                ";
    });
    _0x4b0b3f += "</div>";
  }
  _0x130c85.innerHTML = _0x4b0b3f;
}
async function loadVIPData() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  if (!userProfileData) {
    return;
  }
  try {
    const _0x2a400f = await getUserVipLevel();
    if (_0x2a400f.code === 0 && _0x2a400f.data) {
      vipDataCache = _0x2a400f.data;
      userProfileData.vipData = _0x2a400f.data;
      userProfileData.vip_level = _0x2a400f.data.vip_level;
      userProfileData.exp = _0x2a400f.data.exp;
      userProfileData.total_exp = _0x2a400f.data.total_exp;
      userProfileData.claimed_upgrade_levels = _0x2a400f.data.claimed_upgrade_levels || [];
      userProfileData.monthly_bonus_claimed = _0x2a400f.data.monthly_bonus_claimed || false;
      userProfileData.can_claim_monthly = _0x2a400f.data.can_claim_monthly || false;
    }
  } catch (_0x290c7a) {}
}
async function renderVIPScreen() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  if (!userProfileData) {
    return;
  }
  try {
    const _0x45f017 = await getUserVipLevel();
    if (_0x45f017.code === 0 && _0x45f017.data) {
      vipDataCache = _0x45f017.data;
      userProfileData.vipData = _0x45f017.data;
      userProfileData.vip_level = _0x45f017.data.vip_level;
      userProfileData.exp = _0x45f017.data.exp;
      userProfileData.total_exp = _0x45f017.data.total_exp;
      userProfileData.claimed_upgrade_levels = _0x45f017.data.claimed_upgrade_levels || [];
      userProfileData.monthly_bonus_claimed = _0x45f017.data.monthly_bonus_claimed || false;
      userProfileData.can_claim_monthly = _0x45f017.data.can_claim_monthly || false;
    }
    const _0x526e59 = vipDataCache || userProfileData.vipData || {};
    const _0x28230b = userProfileData.nickName || userProfileData.userName || userProfileData.phone || "-";
    document.getElementById("vipUsername").textContent = _0x28230b;
    const _0x12faca = getProfileImage();
    document.getElementById("vipProfileImg").src = "png/" + _0x12faca;
    const _0x56654f = _0x526e59.vip_level || 0;
    const _0x4585d0 = _0x526e59.exp || 0;
    const _0x467042 = _0x526e59.total_exp || 0;
    document.getElementById("vipExpDisplay").textContent = _0x467042;
    const _0x244314 = getRemainingDays();
    document.getElementById("vipDaysDisplay").textContent = _0x244314;
    const _0x5cb52b = getVipLevelData(_0x56654f);
    document.getElementById("vipLevelBadgeImg").src = "png/" + _0x5cb52b.img;
    if (selectedVipLevel === 0 && _0x56654f > 0) {
      selectedVipLevel = _0x56654f;
    } else if (selectedVipLevel === 0) {
      selectedVipLevel = 0;
    }
    document.getElementById("vipBenefitsLevelLabel").textContent = selectedVipLevel;
    renderVIPSlider(_0x56654f, _0x4585d0, _0x467042, _0x526e59);
    renderVIPBenefits(selectedVipLevel, _0x526e59);
  } catch (_0xe4a315) {
    const _0xf4f7aa = userProfileData.nickName || userProfileData.userName || userProfileData.phone || "-";
    document.getElementById("vipUsername").textContent = _0xf4f7aa;
    const _0x49a162 = getProfileImage();
    document.getElementById("vipProfileImg").src = "png/" + _0x49a162;
    const _0x3a5cea = userProfileData.totalWagered || 0;
    const _0x35e875 = getVipLevel(_0x3a5cea);
    const _0x351f92 = Math.floor(_0x3a5cea / 100);
    document.getElementById("vipExpDisplay").textContent = _0x351f92;
    const _0x4ceebd = getRemainingDays();
    document.getElementById("vipDaysDisplay").textContent = _0x4ceebd;
    const _0x4f2512 = getVipLevelData(_0x35e875);
    document.getElementById("vipLevelBadgeImg").src = "png/" + _0x4f2512.img;
    if (selectedVipLevel === 0 && _0x35e875 > 0) {
      selectedVipLevel = _0x35e875;
    } else if (selectedVipLevel === 0) {
      selectedVipLevel = 0;
    }
    document.getElementById("vipBenefitsLevelLabel").textContent = selectedVipLevel;
    renderVIPSlider(_0x35e875, _0x351f92, _0x351f92, null);
    renderVIPBenefits(selectedVipLevel, null);
  }
}
function renderVIPSlider(_0x46944a, _0x267b0b, _0x39ea65, _0x26c4eb) {
  const _0x33f1b2 = document.getElementById("vipSliderContainer");
  _0x33f1b2.innerHTML = "";
  VIP_LEVELS.forEach((_0x3cddb9, _0x506219) => {
    if (_0x3cddb9.level === 0) {
      return;
    }
    const _0x2edcf7 = _0x3cddb9.threshold;
    const _0x41293a = _0x506219 > 0 ? VIP_LEVELS[_0x506219 - 1].threshold : 0;
    const _0x4a7b5a = _0x2edcf7 - _0x41293a;
    let _0x9d73b6 = 0;
    let _0x26c2b6 = false;
    let _0x96300c = false;
    if (_0x26c4eb && _0x26c4eb.exp !== undefined) {
      const _0xeb6c8b = _0x26c4eb.exp || 0;
      const _0x1d5a77 = _0x26c4eb.vip_level || 0;
      _0x26c2b6 = _0x3cddb9.level <= _0x1d5a77;
      _0x96300c = _0x3cddb9.level === _0x1d5a77;
      if (_0x26c2b6) {
        _0x9d73b6 = 100;
      } else if (_0x4a7b5a > 0) {
        const _0x546926 = _0xeb6c8b - _0x41293a;
        _0x9d73b6 = Math.min(100, Math.max(0, _0x546926 / _0x4a7b5a * 100));
      }
    } else {
      const _0x567309 = _0x267b0b || 0;
      const _0x29b241 = getVipLevel(_0x567309 * 100);
      _0x26c2b6 = _0x3cddb9.level <= _0x29b241;
      _0x96300c = _0x3cddb9.level === _0x29b241;
      if (_0x26c2b6) {
        _0x9d73b6 = 100;
      } else if (_0x4a7b5a > 0) {
        const _0x1534f8 = _0x567309 - _0x41293a;
        _0x9d73b6 = Math.min(100, Math.max(0, _0x1534f8 / _0x4a7b5a * 100));
      }
    }
    const _0x568aaf = document.createElement("div");
    _0x568aaf.className = "vip-card";
    let _0x36de59 = "သော့ခတ်ထားသည်";
    let _0x1feb23 = "#9b59b6";
    if (_0x26c2b6 && _0x96300c) {
      _0x36de59 = "လက်ရှိအဆင့်";
      _0x1feb23 = "#f1c40f";
    } else if (_0x26c2b6) {
      _0x36de59 = "အောင်မြင်သည်";
      _0x1feb23 = "#2ecc71";
    }
    const _0x4bc92c = _0x26c4eb?.exp || _0x267b0b || 0;
    const _0x4c83ea = _0x2edcf7;
    _0x568aaf.innerHTML = "\n                <div style=\"display:flex;justify-content:space-between;align-items:flex-start;\">\n                    <div class=\"vip-title-tag\">VIP " + _0x3cddb9.level + "</div>\n                    <span class=\"vip-status-pill\" style=\"background:" + (_0x26c2b6 ? "rgba(46,204,113,0.2)" : "rgba(142,68,173,0.2)") + ";color:" + _0x1feb23 + ";\">" + _0x36de59 + "</span>\n                </div>\n                <div class=\"vip-req-text\">" + LANG.vipExpLabel + " " + _0x4c83ea.toLocaleString() + " " + LANG.vipExpLabel + "</div>\n                <div class=\"progress-bar-bg\"><div class=\"progress-bar-fill\" style=\"width:" + Math.min(100, _0x9d73b6) + "%;\"></div></div>\n                <div style=\"display:flex;justify-content:space-between;font-size:8px;color:#8c95bf;\">\n                    <span>" + Math.floor(_0x4bc92c).toLocaleString() + "/" + _0x4c83ea.toLocaleString() + "</span>\n                    <span>" + (_0x26c2b6 ? "100% ပြီးစီးပြီ" : Math.min(100, _0x9d73b6).toFixed(0) + "% ပြီးစီးပြီ") + "</span>\n                </div>\n            ";
    _0x568aaf.onclick = () => {
      selectedVipLevel = _0x3cddb9.level;
      document.getElementById("vipBenefitsLevelLabel").textContent = selectedVipLevel;
      renderVIPBenefits(selectedVipLevel, _0x26c4eb);
      document.getElementById("vipBenefitsContainer").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    };
    _0x33f1b2.appendChild(_0x568aaf);
  });
}
function renderVIPBenefits(_0x28f0bc, _0x1ff0c6) {
  const _0x19fee3 = document.getElementById("vipBenefitsContainer");
  const _0x239d8e = getVipLevelData(_0x28f0bc);
  let _0x5a29ec = _0x239d8e.upgradeBonus;
  let _0x268b4b = _0x239d8e.monthlyBonus;
  let _0x49a2d8 = false;
  let _0x558740 = false;
  let _0x998730 = false;
  let _0x3fead3 = false;
  const _0x12e5a2 = userProfileData?.claimed_upgrade_levels || [];
  _0x49a2d8 = _0x12e5a2.includes(_0x28f0bc);
  _0x558740 = userProfileData?.monthly_bonus_claimed || false;
  _0x998730 = userProfileData?.can_claim_monthly || false;
  const _0x4289ac = userProfileData?.vip_level || 0;
  const _0x244baa = _0x28f0bc <= _0x4289ac;
  _0x3fead3 = !_0x49a2d8 && _0x5a29ec > 0 && _0x28f0bc > 0 && _0x244baa;
  const _0x3d0f3e = !_0x558740 && _0x268b4b > 0 && _0x244baa && _0x998730;
  const _0x1cb537 = !_0x244baa;
  let _0x1e5b33 = "";
  let _0x168b9f = LANG.claimedBtn;
  let _0x4d4ed5 = "claimed";
  let _0x14469c = true;
  if (_0x1cb537) {
    _0x168b9f = "သော့ခတ်ထားသည်";
    _0x4d4ed5 = "claimed";
    _0x14469c = true;
  } else if (_0x49a2d8) {
    _0x168b9f = LANG.claimedBtn;
    _0x4d4ed5 = "claimed";
    _0x14469c = true;
  } else if (_0x3fead3) {
    _0x168b9f = LANG.claimBtn;
    _0x4d4ed5 = "unclaimed";
    _0x14469c = false;
  } else {
    _0x168b9f = LANG.claimedBtn;
    _0x4d4ed5 = "claimed";
    _0x14469c = true;
  }
  _0x1e5b33 += "\n            <div class=\"vip-benefit-card\" style=\"" + (_0x1cb537 ? "opacity:0.6;" : "") + "\">\n                <div class=\"card-top-row\">\n                    <span class=\"reward-amount-badge\" style=\"" + (_0x1cb537 ? "background:rgba(142,68,173,0.2);color:#9b59b6;" : "") + "\">K " + formatCurrency(_0x5a29ec) + "</span>\n                    <div class=\"reward-icon-box\" style=\"" + (_0x1cb537 ? "background:rgba(142,68,173,0.1);" : "") + "\">\n                        <svg viewBox=\"0 0 24 24\" fill=\"" + (_0x1cb537 ? "#9b59b6" : "#2ecc71") + "\"><path d=\"M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4V8h5.08L7 10.83l1.41 1.41L12 8.66l3.59 3.58L17 10.83 14.92 8H20v11z\"/></svg>\n                    </div>\n                </div>\n                <div class=\"card-middle\">\n                    <div class=\"card-title\" style=\"" + (_0x1cb537 ? "color:#9b59b6;" : "") + "\">" + LANG.upgradeBonusTitle + "</div>\n                    <div class=\"card-desc\">" + (_0x1cb537 ? "ဤအဆင့်သို့ ရောက်ရှိမှသာ ရယူနိုင်ပါသည်။" : LANG.upgradeBonusDesc) + "</div>\n                </div>\n                <button class=\"btn-claim-status " + _0x4d4ed5 + "\" onclick=\"handleClaimUpgradeBonus(" + _0x28f0bc + ")\" " + (_0x14469c ? "disabled" : "") + ">\n                    " + _0x168b9f + "\n                </button>\n            </div>\n        ";
  let _0x473dce = LANG.claimedBtn;
  let _0x5e9c9e = "claimed";
  let _0x49e3f8 = true;
  let _0x25369d = false;
  if (_0x1cb537) {
    _0x473dce = "သော့ခတ်ထားသည်";
    _0x5e9c9e = "claimed";
    _0x49e3f8 = true;
    _0x25369d = true;
  } else if (_0x3d0f3e && _0x268b4b > 0 && _0x244baa) {
    _0x473dce = LANG.claimBtn;
    _0x5e9c9e = "unclaimed";
    _0x49e3f8 = false;
  } else if (_0x558740) {
    _0x473dce = LANG.claimedBtn;
    _0x5e9c9e = "claimed";
    _0x49e3f8 = true;
  } else {
    _0x473dce = LANG.claimedBtn;
    _0x5e9c9e = "claimed";
    _0x49e3f8 = true;
  }
  _0x1e5b33 += "\n            <div class=\"vip-benefit-card\" style=\"" + (_0x25369d ? "opacity:0.6;" : "") + "\">\n                <div class=\"card-top-row\">\n                    <span class=\"reward-amount-badge\" style=\"" + (_0x25369d ? "background:rgba(142,68,173,0.2);color:#9b59b6;" : "") + "\">K " + formatCurrency(_0x268b4b) + "</span>\n                    <div class=\"reward-icon-box\" style=\"" + (_0x25369d ? "background:rgba(142,68,173,0.1);" : "background: rgba(42, 130, 228, 0.15);") + "\">\n                        <svg viewBox=\"0 0 24 24\" fill=\"" + (_0x25369d ? "#9b59b6" : "#2a82e4") + "\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z\"/></svg>\n                    </div>\n                </div>\n                <div class=\"card-middle\">\n                    <div class=\"card-title\" style=\"" + (_0x25369d ? "color:#9b59b6;" : "") + "\">" + LANG.monthlyBonusTitle + "</div>\n                    <div class=\"card-desc\">" + (_0x25369d ? "ဤအဆင့်သို့ ရောက်ရှိမှသာ ရယူနိုင်ပါသည်။" : LANG.monthlyBonusDesc) + "</div>\n                </div>\n                <button class=\"btn-claim-status " + _0x5e9c9e + "\" onclick=\"handleClaimMonthlyBonus(" + _0x28f0bc + ")\" " + (_0x49e3f8 ? "disabled" : "") + ">\n                    " + _0x473dce + "\n                </button>\n            </div>\n        ";
  _0x19fee3.innerHTML = _0x1e5b33;
}
async function handleClaimUpgradeBonus(_0x49e614) {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  const _0x3b2068 = getVipLevelData(_0x49e614);
  if (_0x3b2068.upgradeBonus === 0 || _0x49e614 === 0) {
    showCustomDialog(LANG.warning, LANG.noData);
    return;
  }
  const _0x5bf114 = userProfileData?.vip_level || 0;
  if (_0x49e614 > _0x5bf114) {
    showCustomDialog(LANG.warning, "ဤအဆင့်သို့ မရောက်ရှိသေးပါ။");
    return;
  }
  const _0x3f5158 = userProfileData?.claimed_upgrade_levels || [];
  if (_0x3f5158.includes(_0x49e614)) {
    showCustomDialog(LANG.warning, LANG.claimedBtn);
    return;
  }
  showSpinner(true);
  try {
    const _0xdce2fb = await claimUpgradeBonusAPI();
    if (_0xdce2fb.success) {
      showCustomDialog(LANG.success, "VIP" + _0x49e614 + " " + LANG.upgradeBonusTitle + " " + formatCurrency(_0x3b2068.upgradeBonus) + " " + LANG.upgradeClaimSuccess, "png/success-pXDR1HMK.png");
      const _0x2a8346 = await getUserInfo();
      if (_0x2a8346.code === 0) {
        userProfileData = _0x2a8346.data;
        renderUserUI(userProfileData);
      }
      await loadVIPData();
      await renderVIPScreen();
    } else {
      showCustomDialog(LANG.error, _0xdce2fb.error || LANG.error);
    }
  } catch (_0x228238) {
    showCustomDialog(LANG.error, _0x228238.message);
  } finally {
    showSpinner(false);
  }
}
async function handleClaimMonthlyBonus(_0x66b7de) {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  const _0x1f5761 = getVipLevelData(_0x66b7de);
  if (_0x1f5761.monthlyBonus === 0) {
    showCustomDialog(LANG.warning, LANG.noData);
    return;
  }
  const _0x5b4623 = userProfileData?.vip_level || 0;
  if (_0x66b7de > _0x5b4623) {
    showCustomDialog(LANG.warning, "ဤအဆင့်သို့ မရောက်ရှိသေးပါ။");
    return;
  }
  if (!userProfileData?.can_claim_monthly) {
    showCustomDialog(LANG.warning, LANG.claimedBtn);
    return;
  }
  if (userProfileData?.monthly_bonus_claimed) {
    showCustomDialog(LANG.warning, LANG.claimedBtn);
    return;
  }
  showSpinner(true);
  try {
    const _0x1c2f29 = await claimMonthlyBonusAPI();
    if (_0x1c2f29.success) {
      showCustomDialog(LANG.success, "VIP" + _0x66b7de + " " + LANG.monthlyBonusTitle + " " + formatCurrency(_0x1f5761.monthlyBonus) + " " + LANG.monthlyClaimSuccess, "png/success-pXDR1HMK.png");
      const _0x3eccfc = await getUserInfo();
      if (_0x3eccfc.code === 0) {
        userProfileData = _0x3eccfc.data;
        renderUserUI(userProfileData);
      }
      await loadVIPData();
      await renderVIPScreen();
    } else {
      showCustomDialog(LANG.error, _0x1c2f29.error || LANG.error);
    }
  } catch (_0x4bb40d) {
    showCustomDialog(LANG.error, _0x4bb40d.message);
  } finally {
    showSpinner(false);
  }
}
function openProfileChange() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  const _0xc1d5bc = document.getElementById("profileOptionsGrid");
  _0xc1d5bc.innerHTML = "";
  const _0xc24c46 = getProfileImage();
  PROFILE_IMAGES.forEach(_0x310269 => {
    const _0x2d2bab = document.createElement("div");
    _0x2d2bab.className = "profile-option-item " + (_0x310269 === _0xc24c46 ? "selected" : "");
    _0x2d2bab.innerHTML = "\n                <img src=\"png/" + _0x310269 + "\" onerror=\"this.src='png/1-Cz2mt-nl.png'\">\n                <span class=\"check-mark\"><i class=\"fa-solid fa-check-circle\"></i></span>\n            ";
    _0x2d2bab.onclick = () => {
      document.querySelectorAll(".profile-option-item").forEach(_0x2107db => _0x2107db.classList.remove("selected"));
      _0x2d2bab.classList.add("selected");
      selectedProfileImage = _0x310269;
    };
    _0xc1d5bc.appendChild(_0x2d2bab);
  });
  navigationHistory.push("profile-change");
  showScreen("profile-change");
}
async function saveProfileImage() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  try {
    showSpinner(true);
    const _0x3587a7 = selectedProfileImage.split("-")[0] || "1";
    const _0x5640b1 = await updateProfile(_0x3587a7);
    if (_0x5640b1.code === 0) {
      setProfileImage(selectedProfileImage);
      document.getElementById("profileAvatar").src = "png/" + selectedProfileImage;
      showCustomDialog(LANG.success, LANG.profileSuccess, "png/success-pXDR1HMK.png");
      const _0x27c954 = await getUserInfo();
      if (_0x27c954.code === 0) {
        userProfileData = _0x27c954.data;
        renderUserUI(userProfileData);
      }
      goBack();
    } else {
      showCustomDialog(LANG.error, _0x5640b1.msg || LANG.error);
    }
  } catch (_0x2c721b) {
    showCustomDialog(LANG.error, _0x2c721b.message);
  } finally {
    showSpinner(false);
  }
}
async function triggerApplicationSignOut() {
  showSpinner(true);
  try {
    if (authToken) {
      await logout();
    }
    localStorage.removeItem("mini_auth_token");
    authToken = null;
    userProfileData = null;
    isSessionExpired = false;
    document.getElementById("authStateUser").style.display = "none";
    document.getElementById("authStateGuest").style.display = "flex";
    document.getElementById("headerBalance").textContent = "0.00";
    showCustomDialog(LANG.success, LANG.logout + " " + LANG.success, "png/success-pXDR1HMK.png");
    navigationHistory = ["home"];
    showScreen("home");
  } catch (_0x190421) {
    showCustomDialog(LANG.error, _0x190421.message);
  } finally {
    showSpinner(false);
  }
}
async function refreshUserData() {
  if (isSessionExpired) {
    showSessionExpiredDialog();
    return;
  }
  if (!authToken) {
    return;
  }
  try {
    const _0x26a5e7 = await getUserInfo();
    if (_0x26a5e7.code === 0) {
      userProfileData = _0x26a5e7.data;
      renderUserUI(userProfileData);
    }
  } catch (_0x2163dc) {}
}
function initFabChat() {
  const _0x428e19 = document.getElementById("fabChat");
  if (_0x428e19) {
    _0x428e19.style.display = "block";
    _0x428e19.style.opacity = "1";
    _0x428e19.style.visibility = "visible";
  }
}
function initBannerSlider() {
  const _0x120c41 = document.getElementById("bannerTrack");
  if (!_0x120c41) {
    return;
  }
  const _0x43a2ba = _0x120c41.querySelectorAll(".banner-card");
  if (_0x43a2ba.length <= 1) {
    return;
  }
  let _0x5f1943 = 0;
  setInterval(() => {
    _0x5f1943 = (_0x5f1943 + 1) % _0x43a2ba.length;
    _0x120c41.style.transform = "translateX(-" + _0x5f1943 * 100 + "%)";
  }, 5000);
}
function initApp() {
  setupUIText();
  renderGames("all");
  syncDepositGateways();
  initFabChat();
  initBannerSlider();
  const _0x105e23 = new URLSearchParams(window.location.search);
  const _0x49cd0a = _0x105e23.get("invite");
  const _0x319667 = _0x105e23.get("deposit");
  const _0x441a48 = _0x105e23.get("withdrawal");
  const _0x2c58b2 = _0x105e23.get("service");
  if (_0x49cd0a) {
    document.getElementById("regRefer").value = _0x49cd0a;
    setTimeout(function () {
      showScreen("register");
    }, 600);
  }
  document.getElementById("formLogin").addEventListener("submit", async function (_0x55b121) {
    _0x55b121.preventDefault();
    showSpinner(true);
    setBalanceLoading(true);
    const _0xea5c2e = document.getElementById("loginUsername").value.trim();
    const _0x61c7b = document.getElementById("loginPassword").value;
    try {
      const _0x2c1c44 = await login(_0xea5c2e, _0x61c7b);
      if (_0x2c1c44.code === 0 && _0x2c1c44.data) {
        authToken = _0x2c1c44.data.token;
        localStorage.setItem("mini_auth_token", JSON.stringify({
          token: authToken,
          timestamp: Date.now()
        }));
        const _0x11710b = await getUserInfo();
        if (_0x11710b.code === 0) {
          userProfileData = _0x11710b.data;
          renderUserUI(userProfileData);
          const _0x2d4127 = await getUserVipLevel();
          if (_0x2d4127.code === 0 && _0x2d4127.data) {
            const _0x5eaa74 = _0x2d4127.data.vip_level || 0;
            const _0x4090e0 = getVipLevelData(_0x5eaa74);
            const _0x438b53 = document.getElementById("vipBadgeContainer");
            _0x438b53.innerHTML = "<img src=\"png/" + _0x4090e0.img + "\" onerror=\"this.style.display='none'; this.parentElement.innerHTML='VIP " + _0x5eaa74 + "'; this.parentElement.style.background='#2a3478'; this.parentElement.style.color='#f39c12'; this.parentElement.style.fontWeight='bold'; this.parentElement.style.fontSize='11px'; this.parentElement.style.padding='0 6px';\">";
          }
          const _0x5d3e1f = sessionStorage.getItem("redirectAfterLogin");
          if (_0x5d3e1f) {
            sessionStorage.removeItem("redirectAfterLogin");
            if (_0x5d3e1f === "deposit") {
              setTimeout(function () {
                handleNavClick("deposit");
              }, 500);
              showSpinner(false);
              setBalanceLoading(false);
              return;
            } else if (_0x5d3e1f === "withdrawal") {
              setTimeout(function () {
                handleNavClick("withdraw");
              }, 500);
              showSpinner(false);
              setBalanceLoading(false);
              return;
            } else if (_0x5d3e1f === "service") {
              setTimeout(function () {
                handleNavClick("customer-service");
              }, 500);
              showSpinner(false);
              setBalanceLoading(false);
              return;
            }
          }
          showCustomDialog(LANG.success, LANG.loginSuccess, "png/success-pXDR1HMK.png");
          navigationHistory = ["home"];
          showScreen("home");
        } else {
          showCustomDialog(LANG.warning, LANG.error);
        }
      } else {
        showCustomDialog(LANG.warning, _0x2c1c44.msg || LANG.error);
      }
    } catch (_0x1bbe58) {
      showCustomDialog(LANG.warning, _0x1bbe58.message || LANG.error);
    } finally {
      showSpinner(false);
      setBalanceLoading(false);
    }
  });
  document.getElementById("formRegister").addEventListener("submit", async function (_0x14f582) {
    _0x14f582.preventDefault();
    showSpinner(true);
    const _0x3a2cf5 = document.getElementById("regUsername").value.trim();
    const _0x3f0a00 = document.getElementById("regPassword").value;
    const _0x575914 = document.getElementById("regConfpass").value;
    const _0x3d38e5 = document.getElementById("regRefer").value.trim() || "Ref-11481000";
    if (_0x3f0a00 !== _0x575914) {
      showSpinner(false);
      showCustomDialog(LANG.warning, LANG.registerPasswordMismatch);
      return;
    }
    if (_0x3f0a00.length < 6) {
      showSpinner(false);
      showCustomDialog(LANG.warning, LANG.registerPasswordShort);
      return;
    }
    const _0x43d5dc = _0x3a2cf5.replace(/^0+/, "");
    if (!/^9\d{9}$/.test(_0x43d5dc)) {
      showSpinner(false);
      showCustomDialog(LANG.warning, LANG.registerPhoneError);
      return;
    }
    try {
      const _0x5d30dc = getDeviceId();
      const _0x42760d = await register(_0x3a2cf5, _0x3f0a00, _0x5d30dc, _0x3d38e5);
      if (_0x42760d.code === 0 && _0x42760d.data) {
        authToken = _0x42760d.data.token;
        localStorage.setItem("mini_auth_token", JSON.stringify({
          token: authToken,
          timestamp: Date.now()
        }));
        const _0x5b93ea = await getUserInfo();
        if (_0x5b93ea.code === 0) {
          userProfileData = _0x5b93ea.data;
          renderUserUI(userProfileData);
          const _0x22d80c = await getUserVipLevel();
          if (_0x22d80c.code === 0 && _0x22d80c.data) {
            const _0x2bb71f = _0x22d80c.data.vip_level || 0;
            const _0x29bab9 = getVipLevelData(_0x2bb71f);
            const _0x5d1fa0 = document.getElementById("vipBadgeContainer");
            _0x5d1fa0.innerHTML = "<img src=\"png/" + _0x29bab9.img + "\" onerror=\"this.style.display='none'; this.parentElement.innerHTML='VIP " + _0x2bb71f + "'; this.parentElement.style.background='#2a3478'; this.parentElement.style.color='#f39c12'; this.parentElement.style.fontWeight='bold'; this.parentElement.style.fontSize='11px'; this.parentElement.style.padding='0 6px';\">";
          }
          const _0x367bd7 = sessionStorage.getItem("redirectAfterLogin");
          if (_0x367bd7) {
            sessionStorage.removeItem("redirectAfterLogin");
            if (_0x367bd7 === "deposit") {
              setTimeout(function () {
                handleNavClick("deposit");
              }, 500);
              showSpinner(false);
              return;
            } else if (_0x367bd7 === "withdrawal") {
              setTimeout(function () {
                handleNavClick("withdraw");
              }, 500);
              showSpinner(false);
              return;
            } else if (_0x367bd7 === "service") {
              setTimeout(function () {
                handleNavClick("customer-service");
              }, 500);
              showSpinner(false);
              return;
            }
          }
          showCustomDialog(LANG.success, LANG.registerSuccess, "png/success-pXDR1HMK.png");
          navigationHistory = ["home"];
          showScreen("home");
        } else {
          showCustomDialog(LANG.warning, LANG.error);
        }
      } else {
        showCustomDialog(LANG.warning, _0x42760d.msg || LANG.error);
      }
    } catch (_0x37f4dd) {
      showCustomDialog(LANG.warning, _0x37f4dd.message || LANG.error);
    } finally {
      showSpinner(false);
    }
  });
  document.getElementById("formDeposit").addEventListener("submit", async function (_0xbab6dd) {
    _0xbab6dd.preventDefault();
    if (isSessionExpired) {
      showSessionExpiredDialog();
      return;
    }
    if (!userProfileData) {
      showCustomDialog(LANG.warning, LANG.loginRequired);
      return;
    }
    const _0x575a5f = parseInt(document.getElementById("depAmount").value);
    const _0xa2bbd7 = document.getElementById("depTxid").value.trim();
    const _0x90fd7a = document.getElementById("depMethod").value;
    if (!_0x575a5f || _0x575a5f < 3000) {
      showCustomDialog(LANG.warning, LANG.depositMin);
      return;
    }
    if (!_0xa2bbd7 || _0xa2bbd7.length < 6) {
      showCustomDialog(LANG.warning, LANG.depositTxidRequired);
      return;
    }
    showSpinner(true);
    try {
      const _0x3b4256 = await submitDeposit(_0x575a5f, _0x90fd7a, _0xa2bbd7);
      if (_0x3b4256.code === 0) {
        const _0x359294 = {
          id: _0x3b4256.data.transactionId,
          orderId: _0x3b4256.data.orderId,
          amount: _0x3b4256.data.amount,
          method: _0x3b4256.data.method,
          status: _0x3b4256.data.status || "pending",
          time: _0x3b4256.data.createdAt || getCurrentMyanmarTime(),
          adminNote: ""
        };
        depositHistory.unshift(_0x359294);
        await refreshUserData();
        showCustomDialog(LANG.success, LANG.depositSuccess + "\n" + LANG.orderId + ": " + _0x3b4256.data.orderId + "\n" + LANG.depositPending, "png/success-pXDR1HMK.png");
        document.getElementById("formDeposit").reset();
        showScreen("home");
      } else {
        showCustomDialog(LANG.warning, _0x3b4256.msg || LANG.error);
      }
    } catch (_0x1c2b8d) {
      showCustomDialog(LANG.error, _0x1c2b8d.message);
    } finally {
      showSpinner(false);
    }
  });
  document.getElementById("formWithdraw").addEventListener("submit", async function (_0x58d7e2) {
    _0x58d7e2.preventDefault();
    if (isSessionExpired) {
      showSessionExpiredDialog();
      return;
    }
    if (!userProfileData) {
      showCustomDialog(LANG.warning, LANG.loginRequired);
      return;
    }
    const _0xf3b694 = document.getElementById("withdrawBankSelect").value;
    if (!_0xf3b694) {
      showCustomDialog(LANG.warning, LANG.selectBank);
      return;
    }
    const _0x24a052 = JSON.parse(_0xf3b694);
    const _0x5e86b5 = parseInt(document.getElementById("witAmount").value);
    if (!_0x5e86b5 || _0x5e86b5 < 5000) {
      showCustomDialog(LANG.warning, LANG.withdrawMin);
      return;
    }
    if ((userProfileData.balance || 0) < _0x5e86b5) {
      showCustomDialog(LANG.warning, LANG.withdrawInsufficient);
      return;
    }
    const _0xcdb8e9 = userProfileData.totalWagered || 0;
    const _0x11e033 = userProfileData.requiredWagered || userProfileData.totalDeposit || 0;
    if (_0xcdb8e9 < _0x11e033) {
      showCustomDialog(LANG.warning, LANG.withdrawRequired + "\n" + LANG.withdrawRequiredDesc);
      return;
    }
    showSpinner(true);
    try {
      const _0xdad366 = await submitWithdraw(_0x5e86b5, _0x24a052.bank_type);
      if (_0xdad366.code === 0) {
        showCustomDialog(LANG.success, LANG.withdrawSuccess, "png/success-pXDR1HMK.png");
        document.getElementById("formWithdraw").reset();
        await refreshUserData();
        showScreen("home");
      } else {
        showCustomDialog(LANG.warning, _0xdad366.msg || LANG.error);
      }
    } catch (_0x255d5d) {
      showCustomDialog(LANG.error, _0x255d5d.message);
    } finally {
      showSpinner(false);
    }
  });
  document.getElementById("formBankSetup").addEventListener("submit", async function (_0x1f706e) {
    _0x1f706e.preventDefault();
    if (isSessionExpired) {
      showSessionExpiredDialog();
      return;
    }
    if (!userProfileData) {
      showCustomDialog(LANG.warning, LANG.loginRequired);
      return;
    }
    const _0x3760d7 = document.getElementById("bankType").value;
    const _0x293af7 = document.getElementById("bankName").value.trim();
    const _0x2b12c8 = document.getElementById("bankNumber").value.trim();
    if (!_0x293af7 || !_0x2b12c8) {
      showCustomDialog(LANG.warning, LANG.error);
      return;
    }
    showSpinner(true);
    try {
      const _0x2d77bf = await setupBank(_0x3760d7, _0x293af7, _0x2b12c8);
      if (_0x2d77bf.code === 0) {
        await refreshUserData();
        showCustomDialog(LANG.success, LANG.bankSuccess, "png/success-pXDR1HMK.png");
        showScreen("withdraw");
      } else {
        let _0x3a42a7 = _0x2d77bf.msg || LANG.error;
        _0x3a42a7 = _0x3a42a7.replace(/\([^)]*\)/g, "").replace(/UID \d+/, "UID");
        showCustomDialog(LANG.warning, _0x3a42a7);
      }
    } catch (_0x4651d2) {
      showCustomDialog(LANG.error, _0x4651d2.message);
    } finally {
      showSpinner(false);
    }
  });
  document.getElementById("formPasswordChange").addEventListener("submit", async function (_0x441fc9) {
    _0x441fc9.preventDefault();
    if (isSessionExpired) {
      showSessionExpiredDialog();
      return;
    }
    if (!userProfileData) {
      showCustomDialog(LANG.warning, LANG.loginRequired);
      return;
    }
    const _0x995829 = document.getElementById("pwdOld").value;
    const _0x435991 = document.getElementById("pwdNew").value;
    const _0x2221bd = document.getElementById("pwdConf").value;
    if (_0x435991 !== _0x2221bd) {
      showCustomDialog(LANG.warning, LANG.passwordMismatch);
      return;
    }
    if (_0x435991.length < 6) {
      showCustomDialog(LANG.warning, LANG.passwordShort);
      return;
    }
    showSpinner(true);
    try {
      const _0x497b2e = await changePassword(_0x995829, _0x435991);
      if (_0x497b2e.code === 0) {
        showCustomDialog(LANG.success, LANG.passwordSuccess, "png/success-pXDR1HMK.png");
        document.getElementById("formPasswordChange").reset();
        await refreshUserData();
        showScreen("setting");
      } else {
        showCustomDialog(LANG.warning, _0x497b2e.msg || LANG.error);
      }
    } catch (_0x538f62) {
      showCustomDialog(LANG.error, _0x538f62.message);
    } finally {
      showSpinner(false);
    }
  });
  document.getElementById("formNicknameChange").addEventListener("submit", async function (_0x2bca2a) {
    _0x2bca2a.preventDefault();
    if (isSessionExpired) {
      showSessionExpiredDialog();
      return;
    }
    if (!userProfileData) {
      showCustomDialog(LANG.warning, LANG.loginRequired);
      return;
    }
    const _0x71e0b = document.getElementById("nicknameNew").value.trim();
    if (!_0x71e0b || _0x71e0b.length < 2) {
      showCustomDialog(LANG.warning, LANG.nicknameShort);
      return;
    }
    showSpinner(true);
    try {
      const _0x2bfcf0 = await updateNickname(_0x71e0b);
      if (_0x2bfcf0.code === 0) {
        showCustomDialog(LANG.success, LANG.nicknameSuccess, "png/success-pXDR1HMK.png");
        await refreshUserData();
        document.getElementById("nicknameNew").value = "";
        showScreen("setting");
      } else {
        showCustomDialog(LANG.error, _0x2bfcf0.msg || LANG.error);
      }
    } catch (_0x49054a) {
      showCustomDialog(LANG.error, _0x49054a.message);
    } finally {
      showSpinner(false);
    }
  });
  var _0x52f727 = document.querySelectorAll("#loginUsername, #loginPassword, #regUsername, #regPassword, #regConfpass, #regRefer");
  for (var _0x5ed288 = 0; _0x5ed288 < _0x52f727.length; _0x5ed288++) {
    _0x52f727[_0x5ed288].addEventListener("input", checkInputState);
  }
  var _0xbb185a = localStorage.getItem("mini_auth_token");
  if (_0xbb185a) {
    try {
      var _0x25f6d5 = JSON.parse(_0xbb185a);
      if (_0x25f6d5.token && Date.now() - _0x25f6d5.timestamp < 86400000) {
        authToken = _0x25f6d5.token;
        getUserInfo().then(function (_0x2db0f2) {
          if (_0x2db0f2.code === 0) {
            userProfileData = _0x2db0f2.data;
            renderUserUI(userProfileData);
            document.getElementById("authStateGuest").style.display = "none";
            document.getElementById("authStateUser").style.display = "flex";
            getUserVipLevel().then(function (_0x1a3bc8) {
              if (_0x1a3bc8.code === 0 && _0x1a3bc8.data) {
                var _0x135ca7 = _0x1a3bc8.data.vip_level || 0;
                var _0x54029e = getVipLevelData(_0x135ca7);
                var _0x17b4f8 = document.getElementById("vipBadgeContainer");
                _0x17b4f8.innerHTML = "<img src=\"png/" + _0x54029e.img + "\" onerror=\"this.style.display='none'; this.parentElement.innerHTML='VIP " + _0x135ca7 + "'; this.parentElement.style.background='#2a3478'; this.parentElement.style.color='#f39c12'; this.parentElement.style.fontWeight='bold'; this.parentElement.style.fontSize='11px'; this.parentElement.style.padding='0 6px';\">";
              }
            }).catch(function () {});
            var _0x1e39ab = sessionStorage.getItem("redirectAfterLogin");
            if (_0x1e39ab) {
              sessionStorage.removeItem("redirectAfterLogin");
              if (_0x1e39ab === "deposit") {
                setTimeout(function () {
                  handleNavClick("deposit");
                }, 500);
                return;
              } else if (_0x1e39ab === "withdrawal") {
                setTimeout(function () {
                  handleNavClick("withdraw");
                }, 500);
                return;
              } else if (_0x1e39ab === "service") {
                setTimeout(function () {
                  handleNavClick("customer-service");
                }, 500);
                return;
              }
            }
            navigationHistory = ["home"];
            showScreen("home");
          } else {
            localStorage.removeItem("mini_auth_token");
            authToken = null;
          }
        }).catch(function () {
          localStorage.removeItem("mini_auth_token");
          authToken = null;
        });
      } else {
        localStorage.removeItem("mini_auth_token");
      }
    } catch (_0x8f3d09) {
      localStorage.removeItem("mini_auth_token");
    }
  }
  var _0x4fd045 = document.getElementById("screenLoading");
  var _0x52da8b = document.getElementById("appWrapper");
  if (_0x4fd045) {
    _0x4fd045.style.display = "none";
    _0x4fd045.classList.add("hidden");
  }
  if (_0x52da8b) {
    _0x52da8b.style.display = "flex";
  }
  setTimeout(function () {
    if (userProfileData) {
      if (_0x319667 !== null) {
        handleNavClick("deposit");
      } else if (_0x441a48 !== null) {
        handleNavClick("withdraw");
      } else if (_0x2c58b2 !== null) {
        handleNavClick("customer-service");
      }
    } else if (_0x319667 !== null || _0x441a48 !== null || _0x2c58b2 !== null) {
      if (_0x319667 !== null) {
        sessionStorage.setItem("redirectAfterLogin", "deposit");
        showCustomDialog(LANG.warning, LANG.loginRequired);
        showScreen("login");
      } else if (_0x441a48 !== null) {
        sessionStorage.setItem("redirectAfterLogin", "withdrawal");
        showCustomDialog(LANG.warning, LANG.loginRequired);
        showScreen("login");
      } else if (_0x2c58b2 !== null) {
        sessionStorage.setItem("redirectAfterLogin", "service");
        showCustomDialog(LANG.warning, "ဧည့်ဝန်ဆောင်မှုကို အသုံးပြုရန် အကောင့်ဝင်ရောက်ရန် လိုအပ်ပါသည်။");
        showScreen("login");
      }
    }
  }, 800);
  setTimeout(function () {
    loadWinnerData();
    loadPromotions();
    loadVIPData();
  }, 100);
}
document.addEventListener("DOMContentLoaded", function () {
  initApp();
});
window.addEventListener("online", function () {
  document.getElementById("networkError").classList.remove("show");
  document.getElementById("appWrapper").style.display = "flex";
  initFabChat();
});
window.addEventListener("offline", function () {
  document.getElementById("networkError").classList.add("show");
  document.getElementById("appWrapper").style.display = "none";
});