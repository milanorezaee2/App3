/** Corrections to vocabulary glosses only; never changes sentences, IDs or answer slots. */
const corrections: Record<string, readonly {index:number;word:string;old:string;new:string}[]> = {
  "fr-b1-future-plans": [
    {
      "index": 0,
      "word": "projets",
      "old": "سال آینده",
      "new": "برنامه‌ها"
    }
  ],
  "es-b1-future-plans": [
    {
      "index": 0,
      "word": "planes",
      "old": "سال آینده",
      "new": "برنامه‌ها"
    }
  ],
  "de-b1-past-contrast": [
    {
      "index": 7,
      "word": "hier",
      "old": "زندگی",
      "new": "اینجا"
    }
  ],
  "fr-b1-real-conditions": [
    {
      "index": 0,
      "word": "demain",
      "old": "هوا",
      "new": "فردا"
    }
  ],
  "de-b1-real-conditions": [
    {
      "index": 4,
      "word": "Zeit",
      "old": "ناهار",
      "new": "وقت"
    }
  ],
  "es-b1-real-conditions": [
    {
      "index": 4,
      "word": "tiempo",
      "old": "ناهار",
      "new": "وقت"
    },
    {
      "index": 5,
      "word": "consultar",
      "old": "هواشناسی",
      "new": "بررسی کردن"
    }
  ],
  "fr-b1-opinions": [
    {
      "index": 3,
      "word": "pourtant",
      "old": "ترجیح",
      "new": "با این حال"
    }
  ],
  "de-b1-opinions": [
    {
      "index": 3,
      "word": "trotzdem",
      "old": "ترجیح",
      "new": "با این حال"
    }
  ],
  "es-b1-opinions": [
    {
      "index": 3,
      "word": "sin embargo",
      "old": "ترجیح",
      "new": "با این حال"
    }
  ],
  "fr-b1-health-advice": [
    {
      "index": 7,
      "word": "symptômes",
      "old": "درمانگاه",
      "new": "علائم"
    }
  ],
  "de-b1-health-advice": [
    {
      "index": 7,
      "word": "Symptome",
      "old": "درمانگاه",
      "new": "علائم"
    }
  ],
  "es-b1-health-advice": [
    {
      "index": 7,
      "word": "síntomas",
      "old": "درمانگاه",
      "new": "علائم"
    }
  ],
  "fr-b1-digital-life": [
    {
      "index": 1,
      "word": "chaque jour",
      "old": "تمرین",
      "new": "هر روز"
    }
  ],
  "de-b1-digital-life": [
    {
      "index": 1,
      "word": "jeden Tag",
      "old": "تمرین",
      "new": "هر روز"
    }
  ],
  "es-b1-digital-life": [
    {
      "index": 1,
      "word": "cada día",
      "old": "تمرین",
      "new": "هر روز"
    }
  ],
  "fr-b1-relative-clauses": [
    {
      "index": 2,
      "word": "quelqu’un",
      "old": "آنجا",
      "new": "کسی"
    }
  ],
  "de-b1-relative-clauses": [
    {
      "index": 2,
      "word": "jemanden",
      "old": "آنجا",
      "new": "کسی"
    }
  ],
  "es-b1-relative-clauses": [
    {
      "index": 2,
      "word": "alguien",
      "old": "آنجا",
      "new": "کسی"
    }
  ],
  "fr-b1-process-passive": [
    {
      "index": 2,
      "word": "formulaire",
      "old": "ارسال",
      "new": "فرم"
    }
  ],
  "de-b1-process-passive": [
    {
      "index": 2,
      "word": "Formulars",
      "old": "ارسال",
      "new": "فرم"
    }
  ],
  "es-b1-process-passive": [
    {
      "index": 2,
      "word": "formulario",
      "old": "ارسال",
      "new": "فرم"
    }
  ],
  "fr-b1-inference-past-modals": [
    {
      "index": 4,
      "word": "la lumière",
      "old": "دفتر",
      "new": "نور / چراغ"
    }
  ],
  "de-b1-inference-past-modals": [
    {
      "index": 4,
      "word": "das Licht",
      "old": "دفتر",
      "new": "نور / چراغ"
    }
  ],
  "es-b1-inference-past-modals": [
    {
      "index": 4,
      "word": "la luz",
      "old": "دفتر",
      "new": "نور / چراغ"
    }
  ],
  "fr-b1-culture-exchange": [
    {
      "index": 0,
      "word": "ta famille",
      "old": "مهمان",
      "new": "خانوادهٔ تو"
    }
  ],
  "es-b1-culture-exchange": [
    {
      "index": 0,
      "word": "la gente",
      "old": "مهمان",
      "new": "مردم"
    }
  ],
  "fr-b1-complaint-followup": [
    {
      "index": 3,
      "word": "maintenant",
      "old": "عکس",
      "new": "اکنون"
    }
  ],
  "de-b1-complaint-followup": [
    {
      "index": 3,
      "word": "jetzt",
      "old": "عکس",
      "new": "اکنون"
    }
  ],
  "es-b1-complaint-followup": [
    {
      "index": 3,
      "word": "ahora mismo",
      "old": "عکس",
      "new": "اکنون"
    }
  ],
  "de-b1-negotiating": [
    {
      "index": 1,
      "word": "keine Zeit",
      "old": "در دسترس",
      "new": "وقت ندارم"
    }
  ],
  "fr-b1-relatives-prepositions": [
    {
      "index": 1,
      "word": "un projet",
      "old": "محیط‌زیست",
      "new": "یک پروژه"
    }
  ],
  "de-b1-relatives-prepositions": [
    {
      "index": 1,
      "word": "Umweltprojekt",
      "old": "محیط‌زیست",
      "new": "پروژهٔ محیط‌زیستی"
    }
  ],
  "es-b1-relatives-prepositions": [
    {
      "index": 1,
      "word": "un proyecto",
      "old": "محیط‌زیست",
      "new": "یک پروژه"
    }
  ],
  "fr-b1-sequence-incident": [
    {
      "index": 3,
      "word": "dix minutes",
      "old": "تأخیر",
      "new": "ده دقیقه"
    }
  ],
  "de-b1-sequence-incident": [
    {
      "index": 3,
      "word": "zehn Minuten",
      "old": "تأخیر",
      "new": "ده دقیقه"
    }
  ],
  "es-b1-sequence-incident": [
    {
      "index": 3,
      "word": "diez minutos",
      "old": "تأخیر",
      "new": "ده دقیقه"
    }
  ],
  "fr-b1-advice-rules": [
    {
      "index": 3,
      "word": "s’inscrire",
      "old": "او هم",
      "new": "ثبت‌نام کردن"
    },
    {
      "index": 6,
      "word": "obligatoire",
      "old": "پیشنهاد",
      "new": "اجباری / الزام"
    }
  ],
  "de-b1-advice-rules": [
    {
      "index": 3,
      "word": "anmelden",
      "old": "او هم",
      "new": "ثبت‌نام کردن"
    },
    {
      "index": 6,
      "word": "Pflicht",
      "old": "پیشنهاد",
      "new": "اجباری / الزام"
    }
  ],
  "es-b1-advice-rules": [
    {
      "index": 3,
      "word": "inscribirse",
      "old": "او هم",
      "new": "ثبت‌نام کردن"
    },
    {
      "index": 6,
      "word": "obligatorio",
      "old": "پیشنهاد",
      "new": "اجباری / الزام"
    }
  ]
};
export function b1VocabularyMeaning(id:string,index:number,word:string,old:string):string {
 const fix=corrections[id]?.find(item=>item.index===index);
 if(!fix)return old;
 if(fix.word!==word||fix.old!==old)throw new Error(`B1 vocabulary correction does not match ${id} sentence ${index+1}`);
 return fix.new;
}
