import type { A1SkillTask } from './a1Skills';

/** Additional, independently authored comprehension tasks; optional and not persisted. */
export const A1_CORE_SKILLS: Readonly<Record<string, readonly A1SkillTask[]>> = {
  'fr-a1-greetings':[
    {kind:'listening',passage:'Bonsoir, madame. Comment allez-vous ?',promptFa:'این احوال‌پرسی کدام است؟',choices:['دوستانه با یک کودک','رسمی با یک خانم','خداحافظی تا فردا'],correctIndex:1,explanationFa:'madame و vous در این پیام برای خطاب رسمی آمده‌اند.'},
    {kind:'reading',passage:'Bonjour, Léa ! À demain.',promptFa:'قرار است چه زمانی دوباره یکدیگر را ببینند؟',choices:['فردا','امروز عصر','هفتهٔ بعد'],correctIndex:0,explanationFa:'À demain یعنی تا فردا.'},
  ],
  'de-a1-greetings':[
    {kind:'listening',passage:'Guten Abend, Frau Müller. Wie geht es Ihnen?',promptFa:'این احوال‌پرسی کدام است؟',choices:['دوستانه با یک کودک','رسمی با یک خانم','خداحافظی تا فردا'],correctIndex:1,explanationFa:'Frau و Ihnen در این پیام خطاب رسمی را نشان می‌دهند.'},
    {kind:'reading',passage:'Hallo, Lena! Bis morgen.',promptFa:'قرار است چه زمانی دوباره یکدیگر را ببینند؟',choices:['فردا','امروز عصر','هفتهٔ بعد'],correctIndex:0,explanationFa:'Bis morgen یعنی تا فردا.'},
  ],
  'es-a1-greetings':[
    {kind:'listening',passage:'Buenas tardes, señora. ¿Cómo está usted?',promptFa:'این احوال‌پرسی کدام است؟',choices:['دوستانه با یک کودک','رسمی با یک خانم','خداحافظی تا فردا'],correctIndex:1,explanationFa:'señora و usted در این پیام برای خطاب رسمی آمده‌اند.'},
    {kind:'reading',passage:'¡Hola, Lucía! Hasta mañana.',promptFa:'قرار است چه زمانی دوباره یکدیگر را ببینند؟',choices:['فردا','امروز عصر','هفتهٔ بعد'],correctIndex:0,explanationFa:'Hasta mañana یعنی تا فردا.'},
  ],
  'fr-a1-profile':[
    {kind:'listening',passage:'Je m’appelle Claire. J’habite à Lyon et je parle français.',promptFa:'کلر کجا زندگی می‌کند؟',choices:['پاریس','لیون','مادرید'],correctIndex:1,explanationFa:'J’habite à Lyon یعنی در لیون زندگی می‌کنم.'},
    {kind:'reading',passage:'Bonjour ! Je suis Adam. Je viens du Maroc et j’apprends le français.',promptFa:'آدم اهل کجاست؟',choices:['ایران','فرانسه','مراکش'],correctIndex:2,explanationFa:'Je viens du Maroc یعنی اهل مراکش هستم.'},
  ],
  'de-a1-profile':[
    {kind:'listening',passage:'Ich heiße Anna. Ich wohne in Berlin und spreche Deutsch.',promptFa:'آنا کجا زندگی می‌کند؟',choices:['مونیخ','برلین','مادرید'],correctIndex:1,explanationFa:'Ich wohne in Berlin یعنی در برلین زندگی می‌کنم.'},
    {kind:'reading',passage:'Hallo! Ich bin Amir. Ich komme aus dem Iran und lerne Deutsch.',promptFa:'امیر اهل کجاست؟',choices:['ایران','آلمان','مراکش'],correctIndex:0,explanationFa:'Ich komme aus dem Iran یعنی اهل ایران هستم.'},
  ],
  'es-a1-profile':[
    {kind:'listening',passage:'Me llamo Ana. Vivo en Madrid y hablo español.',promptFa:'آنا کجا زندگی می‌کند؟',choices:['والنسیا','مادرید','لیون'],correctIndex:1,explanationFa:'Vivo en Madrid یعنی در مادرید زندگی می‌کنم.'},
    {kind:'reading',passage:'¡Hola! Soy Amir. Soy de Irán y aprendo español.',promptFa:'امیر اهل کجاست؟',choices:['اسپانیا','ایران','مراکش'],correctIndex:1,explanationFa:'Soy de Irán یعنی اهل ایران هستم.'},
  ],
  'fr-a1-cafe':[
    {kind:'listening',passage:'Un café, s’il vous plaît. Sans sucre, merci.',promptFa:'مشتری قهوه را چگونه می‌خواهد؟',choices:['بدون شکر','با شیر','با شکر'],correctIndex:0,explanationFa:'Sans sucre یعنی بدون شکر.'},
    {kind:'reading',passage:'Café : 3 euros. Thé : 2 euros. Paiement par carte accepté.',promptFa:'قیمت چای چقدر است؟',choices:['یک یورو','دو یورو','سه یورو'],correctIndex:1,explanationFa:'Thé : 2 euros یعنی چای دو یورو است.'},
  ],
  'de-a1-cafe':[
    {kind:'listening',passage:'Einen Kaffee, bitte. Ohne Zucker, danke.',promptFa:'مشتری قهوه را چگونه می‌خواهد؟',choices:['بدون شکر','با شیر','با شکر'],correctIndex:0,explanationFa:'Ohne Zucker یعنی بدون شکر.'},
    {kind:'reading',passage:'Kaffee: 3 Euro. Tee: 2 Euro. Kartenzahlung möglich.',promptFa:'قیمت چای چقدر است؟',choices:['یک یورو','دو یورو','سه یورو'],correctIndex:1,explanationFa:'Tee: 2 Euro یعنی چای دو یورو است.'},
  ],
  'es-a1-cafe':[
    {kind:'listening',passage:'Un café, por favor. Sin azúcar, gracias.',promptFa:'مشتری قهوه را چگونه می‌خواهد؟',choices:['بدون شکر','با شیر','با شکر'],correctIndex:0,explanationFa:'Sin azúcar یعنی بدون شکر.'},
    {kind:'reading',passage:'Café: 3 euros. Té: 2 euros. Se acepta tarjeta.',promptFa:'قیمت چای چقدر است؟',choices:['یک یورو','دو یورو','سه یورو'],correctIndex:1,explanationFa:'Té: 2 euros یعنی چای دو یورو است.'},
  ],
  'fr-a1-subject-pronouns':[
    {kind:'listening',passage:'Nous parlons français. Elles parlent espagnol.',promptFa:'کدام گروه در پیام اسپانیایی صحبت می‌کند؟',choices:['گروه زنان','ما','هیچ‌کس'],correctIndex:0,explanationFa:'Elles parlent espagnol یعنی آن گروه زنان اسپانیایی صحبت می‌کنند.'},
    {kind:'reading',passage:'Léa parle français. Elle apprend aussi l’allemand.',promptFa:'Elle به چه کسی اشاره دارد؟',choices:['معلم','لئا','یک گروه'],correctIndex:1,explanationFa:'Elle به لئا در جملهٔ قبل اشاره دارد.'},
  ],
  'de-a1-subject-pronouns':[
    {kind:'listening',passage:'Wir lernen Deutsch. Ihr lernt Französisch.',promptFa:'چه کسانی فرانسوی یاد می‌گیرند؟',choices:['ما','شما، چند مخاطب دوستانه','او، مرد'],correctIndex:1,explanationFa:'Ihr lernt Französisch مخاطبان جمع دوستانه را توصیف می‌کند.'},
    {kind:'reading',passage:'Anna lernt Deutsch. Sie lernt auch Französisch.',promptFa:'Sie به چه کسی اشاره دارد؟',choices:['آنا','یک گروه','معلم مرد'],correctIndex:0,explanationFa:'Sie با فعل مفرد lernt اینجا به آنا اشاره می‌کند.'},
  ],
  'es-a1-subject-pronouns':[
    {kind:'listening',passage:'Nosotras hablamos español. Ellas hablan francés.',promptFa:'کدام گروه در پیام فرانسوی صحبت می‌کند؟',choices:['گروه زنانِ دیگر','ما','هیچ‌کس'],correctIndex:0,explanationFa:'Ellas hablan francés یعنی آن گروه زنان فرانسوی صحبت می‌کنند.'},
    {kind:'reading',passage:'Lucía habla español. Ella aprende francés.',promptFa:'Ella به چه کسی اشاره دارد؟',choices:['معلم','لوسیا','یک گروه'],correctIndex:1,explanationFa:'Ella به لوسیا در جملهٔ قبل اشاره دارد.'},
  ],
  'fr-a1-numbers-age':[
    {kind:'listening',passage:'J’ai vingt ans. Ma sœur a dix ans.',promptFa:'خواهر گوینده چند سال دارد؟',choices:['ده سال','بیست سال','سی سال'],correctIndex:0,explanationFa:'Ma sœur a dix ans یعنی خواهرم ده سال دارد.'},
    {kind:'reading',passage:'Dans la classe, il y a trois étudiants et une professeure.',promptFa:'چند دانشجو در کلاس هستند؟',choices:['یک نفر','دو نفر','سه نفر'],correctIndex:2,explanationFa:'trois étudiants یعنی سه دانشجو.'},
  ],
  'de-a1-numbers-age':[
    {kind:'listening',passage:'Ich bin zwanzig Jahre alt. Meine Schwester ist zehn Jahre alt.',promptFa:'خواهر گوینده چند سال دارد؟',choices:['ده سال','بیست سال','سی سال'],correctIndex:0,explanationFa:'Meine Schwester ist zehn Jahre alt یعنی خواهرم ده سال دارد.'},
    {kind:'reading',passage:'Im Kurs sind drei Studenten und eine Lehrerin.',promptFa:'چند دانشجو در کلاس هستند؟',choices:['یک نفر','دو نفر','سه نفر'],correctIndex:2,explanationFa:'drei Studenten یعنی سه دانشجو.'},
  ],
  'es-a1-numbers-age':[
    {kind:'listening',passage:'Tengo veinte años. Mi hermana tiene diez años.',promptFa:'خواهر گوینده چند سال دارد؟',choices:['ده سال','بیست سال','سی سال'],correctIndex:0,explanationFa:'Mi hermana tiene diez años یعنی خواهرم ده سال دارد.'},
    {kind:'reading',passage:'En la clase hay tres estudiantes y una profesora.',promptFa:'چند دانشجو در کلاس هستند؟',choices:['یک نفر','دو نفر','سه نفر'],correctIndex:2,explanationFa:'tres estudiantes یعنی سه دانشجو.'},
  ],
  'fr-a1-family':[
    {kind:'listening',passage:'Voici ma sœur. Elle habite à Lyon.',promptFa:'چه کسی در لیون زندگی می‌کند؟',choices:['خواهر گوینده','پدر گوینده','برادر گوینده'],correctIndex:0,explanationFa:'ma sœur خواهر گوینده است و elle به او اشاره می‌کند.'},
    {kind:'reading',passage:'J’ai un frère et deux sœurs.',promptFa:'گوینده چند خواهر دارد؟',choices:['یک خواهر','دو خواهر','سه خواهر'],correctIndex:1,explanationFa:'deux sœurs یعنی دو خواهر.'},
  ],
  'de-a1-family':[
    {kind:'listening',passage:'Das ist meine Schwester. Sie wohnt in Berlin.',promptFa:'چه کسی در برلین زندگی می‌کند؟',choices:['خواهر گوینده','پدر گوینده','برادر گوینده'],correctIndex:0,explanationFa:'meine Schwester خواهر گوینده است و Sie در جملهٔ بعد به او اشاره می‌کند.'},
    {kind:'reading',passage:'Ich habe einen Bruder und zwei Schwestern.',promptFa:'گوینده چند خواهر دارد؟',choices:['یک خواهر','دو خواهر','سه خواهر'],correctIndex:1,explanationFa:'zwei Schwestern یعنی دو خواهر.'},
  ],
  'es-a1-family':[
    {kind:'listening',passage:'Esta es mi hermana. Vive en Madrid.',promptFa:'چه کسی در مادرید زندگی می‌کند؟',choices:['خواهر گوینده','پدر گوینده','برادر گوینده'],correctIndex:0,explanationFa:'mi hermana خواهر گوینده است و vive به او اشاره می‌کند.'},
    {kind:'reading',passage:'Tengo un hermano y dos hermanas.',promptFa:'گوینده چند خواهر دارد؟',choices:['یک خواهر','دو خواهر','سه خواهر'],correctIndex:1,explanationFa:'dos hermanas یعنی دو خواهر.'},
  ],
  'fr-a1-nationalities':[
    {kind:'listening',passage:'Je viens de Belgique et j’habite à Paris.',promptFa:'گوینده اکنون در کدام شهر زندگی می‌کند؟',choices:['پاریس','لیون','بروکسل'],correctIndex:0,explanationFa:'J’habite à Paris محل زندگی را نشان می‌دهد.'},
    {kind:'reading',passage:'Lina est espagnole. Elle parle espagnol et français.',promptFa:'لینا کدام دو زبان را صحبت می‌کند؟',choices:['آلمانی و فرانسوی','اسپانیایی و فرانسوی','اسپانیایی و فارسی'],correctIndex:1,explanationFa:'espagnol et français یعنی اسپانیایی و فرانسوی.'},
  ],
  'de-a1-nationalities':[
    {kind:'listening',passage:'Ich komme aus Österreich und wohne in Berlin.',promptFa:'گوینده اکنون در کدام شهر زندگی می‌کند؟',choices:['برلین','مونیخ','وین'],correctIndex:0,explanationFa:'Ich wohne in Berlin محل زندگی را نشان می‌دهد.'},
    {kind:'reading',passage:'Lina kommt aus Spanien. Sie spricht Spanisch und Deutsch.',promptFa:'لینا کدام دو زبان را صحبت می‌کند؟',choices:['آلمانی و فرانسوی','اسپانیایی و آلمانی','اسپانیایی و فارسی'],correctIndex:1,explanationFa:'Spanisch und Deutsch یعنی اسپانیایی و آلمانی.'},
  ],
  'es-a1-nationalities':[
    {kind:'listening',passage:'Soy de Francia y vivo en Madrid.',promptFa:'گوینده اکنون در کدام شهر زندگی می‌کند؟',choices:['مادرید','لیون','پاریس'],correctIndex:0,explanationFa:'Vivo en Madrid محل زندگی را نشان می‌دهد.'},
    {kind:'reading',passage:'Lina es española. Habla español y francés.',promptFa:'لینا کدام دو زبان را صحبت می‌کند؟',choices:['آلمانی و فرانسوی','اسپانیایی و فرانسوی','اسپانیایی و فارسی'],correctIndex:1,explanationFa:'español y francés یعنی اسپانیایی و فرانسوی.'},
  ],
  'fr-a1-verb-to-be':[
    {kind:'listening',passage:'Je suis étudiante. Mon frère est professeur.',promptFa:'برادر گوینده چه نقشی دارد؟',choices:['دانشجو','معلم','پزشک'],correctIndex:1,explanationFa:'Mon frère est professeur یعنی برادرم معلم است.'},
    {kind:'reading',passage:'Nous sommes étudiants. Notre professeure est ici.',promptFa:'طبق متن، چه کسی اینجاست؟',choices:['معلم زن','برادر','دوست'],correctIndex:0,explanationFa:'Notre professeure est ici یعنی معلم زن ما اینجاست.'},
  ],
  'de-a1-verb-to-be':[
    {kind:'listening',passage:'Ich bin Studentin. Mein Bruder ist Lehrer.',promptFa:'برادر گوینده چه نقشی دارد؟',choices:['دانشجو','معلم','پزشک'],correctIndex:1,explanationFa:'Mein Bruder ist Lehrer یعنی برادرم معلم است.'},
    {kind:'reading',passage:'Wir sind Studenten. Unsere Lehrerin ist hier.',promptFa:'طبق متن، چه کسی اینجاست؟',choices:['معلم زن','برادر','دوست'],correctIndex:0,explanationFa:'Unsere Lehrerin ist hier یعنی معلم زن ما اینجاست.'},
  ],
  'es-a1-verb-to-be':[
    {kind:'listening',passage:'Soy estudiante. Mi hermano es profesor.',promptFa:'برادر گوینده چه نقشی دارد؟',choices:['دانشجو','معلم','پزشک'],correctIndex:1,explanationFa:'Mi hermano es profesor یعنی برادرم معلم است.'},
    {kind:'reading',passage:'Somos estudiantes. Nuestra profesora es de Madrid.',promptFa:'معلم زن اهل کجاست؟',choices:['مادرید','لیون','برلین'],correctIndex:0,explanationFa:'Nuestra profesora es de Madrid یعنی معلم ما اهل مادرید است.'},
  ],
};
