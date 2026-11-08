import type { NewLanguageId, SentenceSeed } from './newCourses';
import type { A1Seed } from './a1FirstUnits';

/** Short authored introductions, not claims of full topic coverage.
 * Lesson checks use the authored examples; listening and reading are separate messages.
 */
export type TopicIntro = {slug:string; title:string; subtitle:string; situation:string; teachingFa:string; rows:SentenceSeed[]; dialogue?:number[]};
export const A1_TOPIC_INTROS: Record<NewLanguageId,TopicIntro[]> = {
  fr:[
    {slug:'nouns-gender-plural',title:'اسم‌ها، جنسیت و جمع',subtitle:'اسم‌های مذکر، مؤنث و جمع در کلاس',situation:'در کلاس دربارهٔ کتاب‌ها و کیف‌ها صحبت می‌کنید.',teachingFa:'اسم فرانسوی جنس دستوری دارد: un livre مذکر و une table مؤنث است. در این نمونه‌ها اسم جمع با des می‌آید و معمولاً s نوشته می‌شود، اما اغلب شنیده نمی‌شود. همهٔ جمع‌ها از یک قاعده پیروی نمی‌کنند. تلفظ فارسی تقریبی است.',rows:[
      ['C’est un livre ?','این یک کتاب است؟','سِ اَن لیوْغ','livre','کتاب'],
      ['Oui, c’est un livre.','بله، این یک کتاب است.','وی، سِ اَن لیوْغ','un livre','یک کتاب'],
      ['Ce sont des livres ?','این‌ها کتاب هستند؟','سُ سون دِ لیوْغ','des livres','کتاب‌ها'],
      ['Oui, ce sont des livres.','بله، این‌ها کتاب هستند.','وی، سُ سون دِ لیوْغ','livres','کتاب‌ها'],
      ['C’est une table.','این یک میز است.','سِ یون تابل','une table','یک میز'],
      ['Ce sont des tables.','این‌ها میز هستند.','سُ سون دِ تابل','tables','میزها'],
      ['Le sac est ici.','کیف اینجاست.','لُ سَک اِ ایسی','Le sac','کیف'],
      ['La porte est ouverte.','در باز است.','لا پورت اِ اووِرت','La porte','در'],
    ]},
    {slug:'demonstratives',title:'اشاره به اشخاص و اشیا',subtitle:'این کتاب، این دوست و این کیف‌ها',situation:'در کلاس به وسایل و افراد اشاره می‌کنید.',teachingFa:'ce پیش از اسم مذکر، cet پیش از اسم مذکر با صدای آغازین واکه، cette پیش از اسم مؤنث و ces برای اسم جمع به کار می‌رود. این‌ها پیش از اسم می‌آیند. تلفظ فارسی تقریبی است.',rows:[
      ['Tu veux ce livre ?','این کتاب را می‌خواهی؟','تو وُ سُ لیوْغ','ce livre','این کتاب'],
      ['Oui, je veux ce livre.','بله، این کتاب را می‌خواهم.','وی، ژُ وُ سُ لیوْغ','veux','می‌خواهم'],
      ['Tu veux cette table ?','این میز را می‌خواهی؟','تو وُ سِت تابل','cette table','این میز'],
      ['Non, je veux cette chaise.','نه، این صندلی را می‌خواهم.','نون، ژُ وُ سِت شِز','cette chaise','این صندلی'],
      ['Cet ami habite ici.','این دوست مرد اینجا زندگی می‌کند.','سِت آمی آبیت ایسی','Cet ami','این دوست مرد'],
      ['Cette amie parle français.','این دوست زن فرانسوی صحبت می‌کند.','سِت آمی پارل فرانسه','Cette amie','این دوست زن'],
      ['Ces livres sont ici.','این کتاب‌ها اینجا هستند.','سِ لیوْغ سون ایسی','Ces livres','این کتاب‌ها'],
      ['Ces sacs sont petits.','این کیف‌ها کوچک هستند.','سِ سَک سون پُتی','Ces sacs','این کیف‌ها'],
    ]},
    {slug:'descriptions',title:'توصیف اشخاص، اشیا و مکان‌ها',subtitle:'چند صفت ساده در جمله',situation:'از یک دوست دربارهٔ کلاس و وسایلش سؤال می‌کنید.',teachingFa:'در مثال‌های این درس صفت با اسم از نظر جنس و شمار هماهنگ می‌شود: petit / petite و petits / petites. بعضی صفت‌ها مانند intéressant معمولاً پس از اسم می‌آیند. تلفظ فارسی تقریبی است.',rows:[
      ['Ton sac est grand ?','کیف تو بزرگ است؟','تون سَک اِ گْغان','grand','بزرگ، مذکر'],
      ['Oui, il est grand.','بله، آن بزرگ است.','وی، ایل اِ گْغان','il est','آن است'],
      ['Ta classe est petite ?','کلاس تو کوچک است؟','تا کلاس اِ پُتیت','petite','کوچک، مؤنث'],
      ['Oui, elle est petite.','بله، آن کوچک است.','وی، اِل اِ پُتیت','elle est','آن است'],
      ['Ce livre est intéressant.','این کتاب جالب است.','سُ لیوْغ اِ اَنتِغِسان','intéressant','جالب'],
      ['La rue est calme.','خیابان آرام است.','لا غو اِ کَلم','calme','آرام'],
      ['Les sacs sont petits.','کیف‌ها کوچک هستند.','لِ سَک سون پُتی','petits','کوچک، جمع مذکر'],
      ['Les tables sont petites.','میزها کوچک هستند.','لِ تابل سون پُتیت','petites','کوچک، جمع مؤنث'],
    ]},
    {slug:'colors',title:'رنگ‌ها و ویژگی‌های ظاهری',subtitle:'پرسیدن و بیان رنگ',situation:'در کلاس رنگ وسایل را می‌پرسید.',teachingFa:'رنگ در فرانسوی اغلب با اسم هماهنگ می‌شود: vert / verte و bleu / bleue. شکل نوشتاری ممکن است تغییر کند حتی وقتی تفاوتی در صدا شنیده نمی‌شود. آوانویسی تقریبی است.',rows:[
      ['Le livre est bleu ?','کتاب آبی است؟','لُ لیوْغ اِ بلو','bleu','آبی، مذکر'],
      ['Oui, le livre est bleu.','بله، کتاب آبی است.','وی، لُ لیوْغ اِ بلو','livre','کتاب'],
      ['La table est verte ?','میز سبز است؟','لا تابل اِ وِرت','verte','سبز، مؤنث'],
      ['Non, elle est rouge.','نه، آن قرمز است.','نون، اِل اِ غوژ','rouge','قرمز'],
      ['Le sac est noir.','کیف سیاه است.','لُ سَک اِ نواغ','noir','سیاه'],
      ['La porte est blanche.','در سفید است.','لا پورت اِ بلانش','blanche','سفید، مؤنث'],
      ['Les sacs sont jaunes.','کیف‌ها زرد هستند.','لِ سَک سون ژون','jaunes','زرد، جمع'],
      ['La chaise est grise.','صندلی خاکستری است.','لا شِز اِ گْغیز','grise','خاکستری، مؤنث'],
    ]},
    {slug:'articles',title:'حروف تعریف معین و نامعین',subtitle:'یک کتاب و کتاب مشخص',situation:'در کتابخانه دربارهٔ کتاب‌ها و یک میز صحبت می‌کنید.',teachingFa:'un / une برای یک اسم نامعین مذکر / مؤنث و des برای جمع نامعین است. le / la / les به اسم مشخص اشاره می‌کنند؛ پیش از صدای واکه le یا la به l’ تبدیل می‌شود. تلفظ فارسی تقریبی است.',rows:[
      ['Tu as un livre ?','آیا یک کتاب داری؟','تو آ اَن لیوْغ','un livre','یک کتاب'],
      ['Oui, j’ai un livre.','بله، یک کتاب دارم.','وی، ژِ اَن لیوْغ','j’ai','دارم'],
      ['Le livre est ici ?','آن کتاب اینجاست؟','لُ لیوْغ اِ ایسی','Le livre','آن کتاب'],
      ['Oui, le livre est ici.','بله، آن کتاب اینجاست.','وی، لُ لیوْغ اِ ایسی','ici','اینجا'],
      ['Je vois une table.','یک میز می‌بینم.','ژُ ووا یون تابل','une table','یک میز'],
      ['La table est grande.','آن میز بزرگ است.','لا تابل اِ گْغانْد','La table','آن میز'],
      ['Voici des livres.','این‌ها کتاب‌هایی هستند.','وواسی دِ لیوْغ','des livres','کتاب‌هایی'],
      ['Les livres sont sur la table.','کتاب‌ها روی میز هستند.','لِ لیوْغ سون سور لا تابل','Les livres','کتاب‌ها'],
    ]},
  ],
  de:[
    {slug:'nouns-gender-plural',title:'اسم‌ها، جنسیت و جمع',subtitle:'اسم‌های مذکر، مؤنث، خنثی و جمع',situation:'در کلاس دربارهٔ کتاب‌ها و کیف‌ها صحبت می‌کنید.',teachingFa:'جنس دستوری اسم را همراه حرف تعریف یاد بگیرید: der Tisch مذکر، die Tasche مؤنث و das Buch خنثی است. حرف تعریف معین جمع در حالت فاعلی die است؛ شکل جمع هر اسم را جداگانه یاد بگیرید. تلفظ فارسی تقریبی است.',rows:[
      ['Ist das ein Buch?','این یک کتاب است؟','ایست داس آین بوخ','Buch','کتاب'],
      ['Ja, das ist ein Buch.','بله، این یک کتاب است.','یا، داس ایست آین بوخ','ein Buch','یک کتاب'],
      ['Sind das Bücher?','این‌ها کتاب هستند؟','زیند داس بوشِر','Bücher','کتاب‌ها'],
      ['Ja, das sind Bücher.','بله، این‌ها کتاب هستند.','یا، داس زیند بوشِر','Bücher','کتاب‌ها'],
      ['Der Tisch ist hier.','میز اینجاست.','دِر تیش ایست هیر','Der Tisch','میز، مذکر'],
      ['Die Tasche ist hier.','کیف اینجاست.','دی تاشِه ایست هیر','Die Tasche','کیف، مؤنث'],
      ['Das Buch ist neu.','کتاب نو است.','داس بوخ ایست نوی','Das Buch','کتاب، خنثی'],
      ['Die Taschen sind neu.','کیف‌ها نو هستند.','دی تاشِن زیند نوی','Die Taschen','کیف‌ها'],
    ]},
    {slug:'demonstratives',title:'اشاره به اشخاص و اشیا',subtitle:'این کتاب، این میز و این کیف‌ها',situation:'در کلاس به وسایل و افراد اشاره می‌کنید.',teachingFa:'در نقش فاعل، dieser پیش از اسم مذکر، diese پیش از اسم مؤنث یا جمع و dieses پیش از اسم خنثی می‌آید. پایان این واژه‌ها با جنس، شمار و نقش دستوری تغییر می‌کند. تلفظ فارسی تقریبی است.',rows:[
      ['Ist dieses Buch neu?','این کتاب نو است؟','ایست دیزِس بوخ نوی','dieses Buch','این کتاب'],
      ['Ja, dieses Buch ist neu.','بله، این کتاب نو است.','یا، دیزِس بوخ ایست نوی','neu','نو'],
      ['Ist diese Tasche neu?','این کیف نو است؟','ایست دیزِه تاشِه نوی','diese Tasche','این کیف'],
      ['Nein, diese Tasche ist alt.','نه، این کیف قدیمی است.','ناین، دیزِه تاشِه ایست آلت','alt','قدیمی'],
      ['Dieser Tisch ist groß.','این میز بزرگ است.','دیزِر تیش ایست گروس','Dieser Tisch','این میز'],
      ['Diese Frau spricht Deutsch.','این زن آلمانی صحبت می‌کند.','دیزِه فراو اِشپریشت دویچ','Diese Frau','این زن'],
      ['Diese Bücher sind hier.','این کتاب‌ها اینجا هستند.','دیزِه بوشِر زیند هیر','Diese Bücher','این کتاب‌ها'],
      ['Dieses Kind lernt Deutsch.','این کودک آلمانی یاد می‌گیرد.','دیزِس کیند لِرنت دویچ','Dieses Kind','این کودک'],
    ]},
    {slug:'descriptions',title:'توصیف اشخاص، اشیا و مکان‌ها',subtitle:'چند صفت ساده در جمله',situation:'از یک دوست دربارهٔ کلاس و وسایلش سؤال می‌کنید.',teachingFa:'در این جمله‌ها صفت پس از sein آمده و پایان آن برای جنس یا جمع تغییر نمی‌کند: groß و klein. وقتی صفت پیش از اسم قرار بگیرد، قواعد پایان صفت متفاوت است. تلفظ فارسی تقریبی است.',rows:[
      ['Ist deine Tasche groß?','کیف تو بزرگ است؟','ایست داینِه تاشِه گروس','groß','بزرگ'],
      ['Ja, sie ist groß.','بله، آن بزرگ است.','یا، زی ایست گروس','sie ist','آن است'],
      ['Ist dein Kurs klein?','کلاس تو کوچک است؟','ایست داین کورس کلاین','klein','کوچک'],
      ['Ja, er ist klein.','بله، آن کوچک است.','یا، اِر ایست کلاین','er ist','آن است'],
      ['Dieses Buch ist interessant.','این کتاب جالب است.','دیزِس بوخ ایست اینتِرِسانت','interessant','جالب'],
      ['Die Straße ist ruhig.','خیابان آرام است.','دی اشتراسِه ایست روهیش','ruhig','آرام'],
      ['Die Taschen sind klein.','کیف‌ها کوچک هستند.','دی تاشِن زیند کلاین','Taschen','کیف‌ها'],
      ['Der Tisch ist alt.','میز قدیمی است.','دِر تیش ایست آلت','alt','قدیمی'],
    ]},
    {slug:'colors',title:'رنگ‌ها و ویژگی‌های ظاهری',subtitle:'پرسیدن و بیان رنگ',situation:'در کلاس رنگ وسایل را می‌پرسید.',teachingFa:'در این مثال‌ها رنگ پس از فعل sein می‌آید و بدون پایان صفت است: blau، rot و grün. وقتی رنگ پیش از اسم قرار بگیرد، پایان صفت ممکن است تغییر کند. آوانویسی تقریبی است.',rows:[
      ['Ist das Buch blau?','کتاب آبی است؟','ایست داس بوخ بلاو','blau','آبی'],
      ['Ja, das Buch ist blau.','بله، کتاب آبی است.','یا، داس بوخ ایست بلاو','Buch','کتاب'],
      ['Ist der Tisch grün?','میز سبز است؟','ایست دِر تیش گرون','grün','سبز'],
      ['Nein, er ist rot.','نه، آن قرمز است.','ناین، اِر ایست روت','rot','قرمز'],
      ['Die Tasche ist schwarz.','کیف سیاه است.','دی تاشِه ایست شوارتس','schwarz','سیاه'],
      ['Die Tür ist weiß.','در سفید است.','دی تور ایست وایس','weiß','سفید'],
      ['Die Taschen sind gelb.','کیف‌ها زرد هستند.','دی تاشِن زیند گِلب','gelb','زرد'],
      ['Der Stuhl ist grau.','صندلی خاکستری است.','دِر اشتول ایست گراو','grau','خاکستری'],
    ]},
    {slug:'articles',title:'حروف تعریف معین و نامعین',subtitle:'یک کتاب و کتاب مشخص',situation:'در کتابخانه دربارهٔ کتاب‌ها و یک میز صحبت می‌کنید.',teachingFa:'در حالت فاعلی ein برای اسم مذکر و خنثی و eine برای اسم مؤنث نامعین است. der / die / das معین‌اند. در جملهٔ مفعولی مذکر شکل ein به einen تغییر می‌کند؛ کاربردهای دیگر را جداگانه تمرین کنید. تلفظ فارسی تقریبی است.',rows:[
      ['Ist das ein Buch?','این یک کتاب است؟','ایست داس آین بوخ','ein Buch','یک کتاب'],
      ['Ja, das ist ein Buch.','بله، این یک کتاب است.','یا، داس ایست آین بوخ','Buch','کتاب'],
      ['Ist das Buch hier?','آن کتاب اینجاست؟','ایست داس بوخ هیر','das Buch','آن کتاب'],
      ['Ja, das Buch ist hier.','بله، آن کتاب اینجاست.','یا، داس بوخ ایست هیر','hier','اینجا'],
      ['Das ist eine Tasche.','این یک کیف است.','داس ایست آینِه تاشِه','eine Tasche','یک کیف'],
      ['Die Tasche ist groß.','آن کیف بزرگ است.','دی تاشِه ایست گروس','Die Tasche','آن کیف'],
      ['Ich sehe einen Tisch.','یک میز می‌بینم.','ایش زِهِه آینِن تیش','einen Tisch','یک میز، مفعول'],
      ['Der Tisch ist neu.','آن میز نو است.','دِر تیش ایست نوی','Der Tisch','آن میز'],
    ]},
  ],
  es:[
    {slug:'nouns-gender-plural',title:'اسم‌ها، جنسیت و جمع',subtitle:'اسم‌های مذکر، مؤنث و جمع',situation:'در کلاس دربارهٔ کتاب‌ها و کیف‌ها صحبت می‌کنید.',teachingFa:'بسیاری از اسم‌های پایان‌یافته به o مذکر و به a مؤنث‌اند، اما استثنا دارند، مانند el mapa. معمولاً به اسم پایان‌یافته به واکه s و به اسم پایان‌یافته به همخوان es افزوده می‌شود. تلفظ فارسی تقریبی است.',rows:[
      ['¿Es un libro?','این یک کتاب است؟','اِس اون لیبرو','libro','کتاب'],
      ['Sí, es un libro.','بله، این یک کتاب است.','سی، اِس اون لیبرو','un libro','یک کتاب'],
      ['¿Son libros?','این‌ها کتاب هستند؟','سون لیبروس','libros','کتاب‌ها'],
      ['Sí, son libros.','بله، این‌ها کتاب هستند.','سی، سون لیبروس','son','هستند'],
      ['Es una mesa.','این یک میز است.','اِس اونا مِسا','una mesa','یک میز'],
      ['Son mesas.','این‌ها میز هستند.','سون مِساس','mesas','میزها'],
      ['El mapa está aquí.','نقشه اینجاست.','اِل ماپا اِستا آکی','El mapa','نقشه، مذکر'],
      ['Las bolsas son nuevas.','کیسه‌ها نو هستند.','لاس بولساس سون نوئِباس','Las bolsas','کیسه‌ها'],
    ]},
    {slug:'demonstratives',title:'اشاره به اشخاص و اشیا',subtitle:'این، آن نزدیک تو و آن دور',situation:'در کلاس به وسایل و افراد اشاره می‌کنید.',teachingFa:'este / esta معمولاً برای اشاره به چیزی نزدیک و ese / esa برای چیزی دورتر یا نزدیک مخاطب است. شکل آن‌ها با اسم هماهنگ می‌شود. تلفظ فارسی تقریبی است.',rows:[
      ['¿Este libro es nuevo?','این کتاب نو است؟','اِستِه لیبرو اِس نوئِبو','Este libro','این کتاب'],
      ['Sí, este libro es nuevo.','بله، این کتاب نو است.','سی، اِستِه لیبرو اِس نوئِبو','nuevo','نو'],
      ['¿Esa bolsa es nueva?','آن کیف نو است؟ (نزدیک مخاطب)','اِسا بولسا اِس نوئِبا','Esa bolsa','آن کیف، نزدیک مخاطب'],
      ['No, esa bolsa es vieja.','نه، آن کیف قدیمی است.','نو، اِسا بولسا اِس بیِخا','vieja','قدیمی'],
      ['Ese coche es rojo.','آن خودرو قرمز است.','اِسِه کوچِه اِس روخو','Ese coche','آن خودرو'],
      ['Esa casa es grande.','آن خانه بزرگ است.','اِسا کاسا اِس گراندِه','Esa casa','آن خانه'],
      ['Estos libros están aquí.','این کتاب‌ها اینجا هستند.','اِستوس لیبروس اِستان آکی','Estos libros','این کتاب‌ها'],
      ['Esas mesas son pequeñas.','آن میزها کوچک هستند.','اِساس مِساس سون پِکِنیاس','Esas mesas','آن میزها'],
    ]},
    {slug:'descriptions',title:'توصیف اشخاص، اشیا و مکان‌ها',subtitle:'چند صفت ساده در جمله',situation:'از یک دوست دربارهٔ کلاس و وسایلش سؤال می‌کنید.',teachingFa:'در این مثال‌ها صفت با جنس و شمار اسم هماهنگ می‌شود: pequeño / pequeña و pequeños / pequeñas. صفت‌های دیگری مانند interesante برای مذکر و مؤنث مفرد شکل یکسانی دارند. تلفظ فارسی تقریبی است.',rows:[
      ['¿Tu bolsa es grande?','کیف تو بزرگ است؟','تو بولسا اِس گراندِه','grande','بزرگ'],
      ['Sí, es grande.','بله، آن بزرگ است.','سی، اِس گراندِه','es','است'],
      ['¿Tu clase es pequeña?','کلاس تو کوچک است؟','تو کلاسِه اِس پِکِنیا','pequeña','کوچک، مؤنث'],
      ['Sí, es pequeña.','بله، آن کوچک است.','سی، اِس پِکِنیا','pequeña','کوچک، مؤنث'],
      ['Este libro es interesante.','این کتاب جالب است.','اِستِه لیبرو اِس اینتِرِسانتِه','interesante','جالب'],
      ['La calle es tranquila.','خیابان آرام است.','لا کایِه اِس ترانکیلا','tranquila','آرام، مؤنث'],
      ['Los libros son pequeños.','کتاب‌ها کوچک هستند.','لوس لیبروس سون پِکِنیوس','pequeños','کوچک، جمع مذکر'],
      ['Las mesas son pequeñas.','میزها کوچک هستند.','لاس مِساس سون پِکِنیاس','pequeñas','کوچک، جمع مؤنث'],
    ]},
    {slug:'colors',title:'رنگ‌ها و ویژگی‌های ظاهری',subtitle:'پرسیدن و بیان رنگ',situation:'در کلاس رنگ وسایل را می‌پرسید.',teachingFa:'برخی رنگ‌ها مانند rojo / roja با جنس اسم تغییر می‌کنند. برخی مانند azul در مذکر و مؤنث مفرد یکسان‌اند، اما جمع می‌شوند: azules. آوانویسی تقریبی است.',rows:[
      ['¿El libro es azul?','کتاب آبی است؟','اِل لیبرو اِس آثول','azul','آبی'],
      ['Sí, el libro es azul.','بله، کتاب آبی است.','سی، اِل لیبرو اِس آثول','libro','کتاب'],
      ['¿La mesa es verde?','میز سبز است؟','لا مِسا اِس بِردِه','verde','سبز'],
      ['No, es roja.','نه، آن قرمز است.','نو، اِس روخا','roja','قرمز، مؤنث'],
      ['La bolsa es negra.','کیف سیاه است.','لا بولسا اِس نِگرا','negra','سیاه، مؤنث'],
      ['La puerta es blanca.','در سفید است.','لا پوئِرتا اِس بلانکا','blanca','سفید، مؤنث'],
      ['Las bolsas son amarillas.','کیف‌ها زرد هستند.','لاس بولساس سون آمارییاس','amarillas','زرد، جمع مؤنث'],
      ['La silla es gris.','صندلی خاکستری است.','لا سییا اِس گریس','gris','خاکستری'],
    ]},
    {slug:'articles',title:'حروف تعریف معین و نامعین',subtitle:'یک کتاب و کتاب مشخص',situation:'در کتابخانه دربارهٔ کتاب‌ها و یک میز صحبت می‌کنید.',teachingFa:'un / una برای اسم نامعین مفرد و unos / unas برای جمع نامعین‌اند. el / la / los / las به اسم معین اشاره می‌کنند و با جنس و شمار اسم هماهنگ می‌شوند. تلفظ فارسی تقریبی است.',rows:[
      ['¿Tienes un libro?','آیا یک کتاب داری؟','تیِنِس اون لیبرو','un libro','یک کتاب'],
      ['Sí, tengo un libro.','بله، یک کتاب دارم.','سی، تِنگو اون لیبرو','tengo','دارم'],
      ['¿El libro está aquí?','آن کتاب اینجاست؟','اِل لیبرو اِستا آکی','El libro','آن کتاب'],
      ['Sí, el libro está aquí.','بله، آن کتاب اینجاست.','سی، اِل لیبرو اِستا آکی','aquí','اینجا'],
      ['Veo una mesa.','یک میز می‌بینم.','بِئو اونا مِسا','una mesa','یک میز'],
      ['La mesa es grande.','آن میز بزرگ است.','لا مِسا اِس گراندِه','La mesa','آن میز'],
      ['Veo unos libros.','چند کتاب می‌بینم.','بِئو اونوس لیبروس','unos libros','چند کتاب'],
      ['Los libros están en la mesa.','کتاب‌ها روی میز هستند.','لوس لیبروس اِستان اِن لا مِسا','Los libros','کتاب‌ها'],
    ]},
  ],
};

function recognitionChoices(rows:SentenceSeed[], target:number, correctIndex:number): {choices:number[];correctIndex:number} {
  const other=rows.map((_,i)=>i).filter(i=>i!==target).slice(0,3);
  other.splice(correctIndex,0,target);
  return {choices:other,correctIndex};
}
/** Four recognition checks. The dialogue lines are authored as two coherent exchanges. */
export function toTopicSeed(intro:TopicIntro):A1Seed {
  return {...intro,dialogue:intro.dialogue ?? [0,1,2,3],checks:[0,2,4,6].map((index,i)=>({
    promptFa:`کدام جمله یعنی «${intro.rows[index][1]}»؟`,
    ...recognitionChoices(intro.rows,index,i),
    explanationFa:`${intro.rows[index][0]} یعنی ${intro.rows[index][1]}`,
  }))};
}
