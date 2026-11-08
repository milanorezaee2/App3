import type { A1SkillTask } from './a1Skills';

/** Task passages are independent of the lesson answer options. */
export const A1_EXTRA_SKILLS: Readonly<Record<string,readonly A1SkillTask[]>> = {
  'fr-a1-possessives':[
    {kind:'listening',passage:'C’est mon sac. Voici mes livres.',promptFa:'کدام وسایل در پیام متعلق به گوینده‌اند؟',choices:['کیف و کتاب‌ها','میز و خودکار','کیف و تلفن'],correctIndex:0,explanationFa:'mon sac و mes livres یعنی کیف من و کتاب‌های من.'},
    {kind:'reading',passage:'Léa a un frère. Son frère habite à Lyon.',promptFa:'چه کسی در لیون زندگی می‌کند؟',choices:['خواهر لئا','برادر لئا','معلم لئا'],correctIndex:1,explanationFa:'Son frère یعنی برادر او و در اینجا به برادر لئا اشاره دارد.'},
  ],
  'de-a1-possessives':[
    {kind:'listening',passage:'Das ist meine Tasche. Hier sind meine Bücher.',promptFa:'کدام وسایل در پیام متعلق به گوینده‌اند؟',choices:['کیف و کتاب‌ها','میز و خودکار','کیف و تلفن'],correctIndex:0,explanationFa:'meine Tasche و meine Bücher یعنی کیف من و کتاب‌های من.'},
    {kind:'reading',passage:'Ali hat einen Bruder. Sein Bruder wohnt in Berlin.',promptFa:'چه کسی در برلین زندگی می‌کند؟',choices:['خواهر علی','برادر علی','معلم علی'],correctIndex:1,explanationFa:'Sein Bruder در اینجا یعنی برادر علی.'},
  ],
  'es-a1-possessives':[
    {kind:'listening',passage:'Este es mi bolso. Aquí están mis libros.',promptFa:'کدام وسایل در پیام متعلق به گوینده‌اند؟',choices:['کیف و کتاب‌ها','میز و خودکار','کیف و تلفن'],correctIndex:0,explanationFa:'mi bolso و mis libros یعنی کیف من و کتاب‌های من.'},
    {kind:'reading',passage:'Lucía tiene un hermano. Su hermano vive en Madrid.',promptFa:'چه کسی در مادرید زندگی می‌کند؟',choices:['خواهر لوسیا','برادر لوسیا','معلم لوسیا'],correctIndex:1,explanationFa:'Su hermano در اینجا یعنی برادر لوسیا.'},
  ],
  'fr-a1-shopping-payment':[
    {kind:'listening',passage:'Ce cahier coûte quatre euros. Vous pouvez payer en espèces.',promptFa:'قیمت دفتر چقدر است؟',choices:['سه یورو','چهار یورو','پنج یورو'],correctIndex:1,explanationFa:'quatre euros یعنی چهار یورو.'},
    {kind:'reading',passage:'Prix du stylo : deux euros. Paiement par carte ou en espèces.',promptFa:'کدام روش پرداخت طبق متن پذیرفته می‌شود؟',choices:['فقط کارت','فقط نقدی','کارت یا نقدی'],correctIndex:2,explanationFa:'par carte ou en espèces یعنی کارت یا نقدی.'},
  ],
  'de-a1-shopping-payment':[
    {kind:'listening',passage:'Dieses Heft kostet vier Euro. Sie können bar zahlen.',promptFa:'قیمت دفتر چقدر است؟',choices:['سه یورو','چهار یورو','پنج یورو'],correctIndex:1,explanationFa:'vier Euro یعنی چهار یورو.'},
    {kind:'reading',passage:'Preis für den Stift: zwei Euro. Zahlung mit Karte oder bar.',promptFa:'کدام روش پرداخت طبق متن پذیرفته می‌شود؟',choices:['فقط کارت','فقط نقدی','کارت یا نقدی'],correctIndex:2,explanationFa:'mit Karte oder bar یعنی کارت یا نقدی.'},
  ],
  'es-a1-shopping-payment':[
    {kind:'listening',passage:'Este cuaderno cuesta cuatro euros. Puede pagar en efectivo.',promptFa:'قیمت دفتر چقدر است؟',choices:['سه یورو','چهار یورو','پنج یورو'],correctIndex:1,explanationFa:'cuatro euros یعنی چهار یورو.'},
    {kind:'reading',passage:'Precio del bolígrafo: dos euros. Pago con tarjeta o en efectivo.',promptFa:'کدام روش پرداخت طبق متن پذیرفته می‌شود؟',choices:['فقط کارت','فقط نقدی','کارت یا نقدی'],correctIndex:2,explanationFa:'con tarjeta o en efectivo یعنی کارت یا نقدی.'},
  ],
  'fr-a1-directions':[
    {kind:'listening',passage:'Allez tout droit, puis tournez à droite.',promptFa:'پس از مستقیم رفتن، به کدام سمت بپیچید؟',choices:['راست','چپ','به عقب'],correctIndex:0,explanationFa:'à droite یعنی به راست.'},
    {kind:'reading',passage:'La bibliothèque est près de la place, à côté du café.',promptFa:'کتابخانه کنار چیست؟',choices:['ایستگاه','کافه','هتل'],correctIndex:1,explanationFa:'à côté du café یعنی کنار کافه.'},
  ],
  'de-a1-directions':[
    {kind:'listening',passage:'Gehen Sie geradeaus und biegen Sie dann rechts ab.',promptFa:'پس از مستقیم رفتن، به کدام سمت بپیچید؟',choices:['راست','چپ','به عقب'],correctIndex:0,explanationFa:'rechts یعنی به راست.'},
    {kind:'reading',passage:'Die Bibliothek ist in der Nähe vom Platz, neben dem Café.',promptFa:'کتابخانه کنار چیست؟',choices:['ایستگاه','کافه','هتل'],correctIndex:1,explanationFa:'neben dem Café یعنی کنار کافه.'},
  ],
  'es-a1-directions':[
    {kind:'listening',passage:'Siga todo recto y después gire a la derecha.',promptFa:'پس از مستقیم رفتن، به کدام سمت بپیچید؟',choices:['راست','چپ','به عقب'],correctIndex:0,explanationFa:'a la derecha یعنی به راست.'},
    {kind:'reading',passage:'La biblioteca está cerca de la plaza, al lado del café.',promptFa:'کتابخانه کنار چیست؟',choices:['ایستگاه','کافه','هتل'],correctIndex:1,explanationFa:'al lado del café یعنی کنار کافه.'},
  ],
  'fr-a1-asking-help':[
    {kind:'listening',passage:'Excusez-moi, je ne trouve pas mon sac. Pouvez-vous m’aider ?',promptFa:'گوینده چه چیزی را پیدا نمی‌کند؟',choices:['بلیتش','کیفش','تلفنش'],correctIndex:1,explanationFa:'mon sac یعنی کیف من.'},
    {kind:'reading',passage:'Mon téléphone ne marche pas. J’ai besoin d’aide.',promptFa:'چه مشکلی پیش آمده است؟',choices:['تلفن کار نمی‌کند','کیف گم شده','بلیتی وجود ندارد'],correctIndex:0,explanationFa:'Mon téléphone ne marche pas یعنی تلفنم کار نمی‌کند.'},
  ],
  'de-a1-asking-help':[
    {kind:'listening',passage:'Entschuldigung, ich finde meine Tasche nicht. Können Sie mir helfen?',promptFa:'گوینده چه چیزی را پیدا نمی‌کند؟',choices:['بلیتش','کیفش','تلفنش'],correctIndex:1,explanationFa:'meine Tasche یعنی کیف من.'},
    {kind:'reading',passage:'Mein Handy funktioniert nicht. Ich brauche Hilfe.',promptFa:'چه مشکلی پیش آمده است؟',choices:['تلفن کار نمی‌کند','کیف گم شده','بلیتی وجود ندارد'],correctIndex:0,explanationFa:'Mein Handy funktioniert nicht یعنی تلفنم کار نمی‌کند.'},
  ],
  'es-a1-asking-help':[
    {kind:'listening',passage:'Perdone, no encuentro mi bolso. ¿Puede ayudarme?',promptFa:'گوینده چه چیزی را پیدا نمی‌کند؟',choices:['بلیتش','کیفش','تلفنش'],correctIndex:1,explanationFa:'mi bolso یعنی کیف من.'},
    {kind:'reading',passage:'Mi móvil no funciona. Necesito ayuda.',promptFa:'چه مشکلی پیش آمده است؟',choices:['تلفن کار نمی‌کند','کیف گم شده','بلیتی وجود ندارد'],correctIndex:0,explanationFa:'Mi móvil no funciona یعنی تلفنم کار نمی‌کند.'},
  ],
};
