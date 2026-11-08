import type {NewLanguageId} from './newCourses';
import type {A1Checkpoint} from './a1Checkpoint';
/** Independent self-practice, not an assessment or certificate. */
export const A2_CHECKPOINT:Record<NewLanguageId,A1Checkpoint>={
 fr:{questions:[
  {kind:'listening',text:'Bonjour Léa, je ne peux pas venir au café à trois heures parce que je travaille. Est-ce qu’on peut se retrouver à cinq heures ?',question:'چرا گوینده ساعت سه نمی‌تواند بیاید؟',choices:['کار می‌کند','بیمار است','به سفر می‌رود'],correctIndex:0,explanation:'گوینده می‌گوید parce que je travaille: چون کار می‌کنم.'},
  {kind:'listening',text:'Hier, j’ai pris le train pour Lyon. Ensuite, j’ai visité le musée avec mon frère.',question:'پس از سفر با قطار چه کرد؟',choices:['به بازار رفت','از موزه دیدن کرد','به خانه برگشت'],correctIndex:1,explanation:'j’ai visité le musée یعنی از موزه دیدن کردم.'},
  {kind:'listening',text:'Le cours de français est lundi et mercredi. Mercredi, il commence à dix heures au lieu de neuf.',question:'کلاس چهارشنبه چه ساعتی شروع می‌شود؟',choices:['نه','یازده','ده'],correctIndex:2,explanation:'à dix heures au lieu de neuf یعنی ساعت ده به‌جای نه.'},
  {kind:'reading',text:'Bonjour, votre chambre est réservée pour deux nuits, du vendredi au dimanche. Le petit-déjeuner est compris. Pour modifier la réservation, téléphonez avant jeudi.',question:'برای تغییر رزرو چه باید کرد؟',choices:['پیش از پنج‌شنبه تماس بگیرید','جمعه ایمیل بفرستید','یکشنبه به هتل بروید'],correctIndex:0,explanation:'téléphonez avant jeudi یعنی پیش از پنج‌شنبه تماس بگیرید.'},
  {kind:'reading',text:'Salle de sport : ouverte du mardi au samedi, de 8 h à 20 h. Fermée le lundi et le dimanche.',question:'کدام روز سالن بسته است؟',choices:['سه‌شنبه','یکشنبه','شنبه'],correctIndex:1,explanation:'fermée le dimanche یعنی یکشنبه بسته است.'},
  {kind:'reading',text:'J’aime mon nouvel appartement : il est plus petit que l’ancien, mais il est près de mon travail. Je peux y aller à pied.',question:'مزیت آپارتمان جدید چیست؟',choices:['از خانهٔ قدیم بزرگ‌تر است','یک استخر دارد','نزدیک محل کار است'],correctIndex:2,explanation:'près de mon travail یعنی نزدیک محل کارم.'},
 ],speaking:[
  {prompt:'دو جمله دربارهٔ آخر هفتهٔ گذشتهٔ خود بگویید.',stimulus:'Qu’est-ce que tu as fait le week-end dernier ?',stimulusFa:'آخر هفتهٔ گذشته چه کار کردی؟',model:'Samedi, j’ai retrouvé une amie. Ensuite, nous avons pris un café.'},
  {prompt:'زمان پیشنهادی را مؤدبانه رد کنید و زمان دیگری پیشنهاد دهید.',stimulus:'On se retrouve à trois heures ?',stimulusFa:'ساعت سه دیدار کنیم؟',model:'Désolée, je travaille à trois heures. On peut se retrouver à cinq heures ?'},
 ],writing:[
  {prompt:'برای دوستی پیام کوتاه بنویسید: شنبه دعوتش کنید، زمان و مکان پیشنهاد دهید.',model:'Salut ! Tu veux aller au cinéma samedi ? On peut se retrouver à six heures devant le cinéma.'},
  {prompt:'در دو یا سه جمله از خانهٔ خود بگویید؛ یک ویژگی و دلیل دوست داشتن یا نداشتن آن را بنویسید.',model:'Mon appartement est petit, mais il est calme. Je l’aime parce qu’il est près de mon travail.'},
 ]},
 de:{questions:[
  {kind:'listening',text:'Hallo Lea, ich kann um drei Uhr nicht ins Café kommen, weil ich arbeite. Können wir uns um fünf Uhr treffen?',question:'چرا گوینده ساعت سه نمی‌تواند بیاید؟',choices:['کار می‌کند','بیمار است','به سفر می‌رود'],correctIndex:0,explanation:'weil ich arbeite یعنی چون کار می‌کنم.'},
  {kind:'listening',text:'Gestern bin ich mit dem Zug nach Lyon gefahren. Danach habe ich mit meinem Bruder das Museum besucht.',question:'پس از سفر با قطار چه کرد؟',choices:['به بازار رفت','از موزه دیدن کرد','به خانه برگشت'],correctIndex:1,explanation:'das Museum besucht یعنی از موزه دیدن کرد.'},
  {kind:'listening',text:'Der Deutschkurs ist am Montag und am Mittwoch. Am Mittwoch beginnt er um zehn Uhr statt um neun.',question:'کلاس چهارشنبه چه ساعتی شروع می‌شود؟',choices:['نه','یازده','ده'],correctIndex:2,explanation:'um zehn Uhr statt um neun یعنی ساعت ده به‌جای نه.'},
  {kind:'reading',text:'Guten Tag, Ihr Zimmer ist für zwei Nächte von Freitag bis Sonntag reserviert. Das Frühstück ist im Preis. Für eine Änderung rufen Sie bitte vor Donnerstag an.',question:'برای تغییر رزرو چه باید کرد؟',choices:['پیش از پنج‌شنبه تماس بگیرید','جمعه ایمیل بفرستید','یکشنبه به هتل بروید'],correctIndex:0,explanation:'vor Donnerstag anrufen یعنی پیش از پنج‌شنبه تماس گرفتن.'},
  {kind:'reading',text:'Sportstudio: Dienstag bis Samstag von 8 bis 20 Uhr geöffnet. Montag und Sonntag geschlossen.',question:'کدام روز سالن بسته است؟',choices:['سه‌شنبه','یکشنبه','شنبه'],correctIndex:1,explanation:'Sonntag geschlossen یعنی یکشنبه بسته است.'},
  {kind:'reading',text:'Ich mag meine neue Wohnung: Sie ist kleiner als die alte, aber sie ist nah an meiner Arbeit. Ich kann zu Fuß gehen.',question:'مزیت آپارتمان جدید چیست؟',choices:['از خانهٔ قدیم بزرگ‌تر است','یک استخر دارد','نزدیک محل کار است'],correctIndex:2,explanation:'nah an meiner Arbeit یعنی نزدیک محل کارم.'},
 ],speaking:[
  {prompt:'دو جمله دربارهٔ آخر هفتهٔ گذشتهٔ خود بگویید.',stimulus:'Was hast du letztes Wochenende gemacht?',stimulusFa:'آخر هفتهٔ گذشته چه کار کردی؟',model:'Am Samstag habe ich eine Freundin getroffen. Danach haben wir einen Kaffee getrunken.'},
  {prompt:'زمان پیشنهادی را مؤدبانه رد کنید و زمان دیگری پیشنهاد دهید.',stimulus:'Treffen wir uns um drei Uhr?',stimulusFa:'ساعت سه دیدار کنیم؟',model:'Tut mir leid, um drei Uhr arbeite ich. Können wir uns um fünf Uhr treffen?'},
 ],writing:[
  {prompt:'برای دوستی پیام کوتاه بنویسید: شنبه دعوتش کنید، زمان و مکان پیشنهاد دهید.',model:'Hallo! Möchtest du am Samstag ins Kino gehen? Wir können uns um sechs vor dem Kino treffen.'},
  {prompt:'در دو یا سه جمله از خانهٔ خود بگویید؛ یک ویژگی و دلیل دوست داشتن یا نداشتن آن را بنویسید.',model:'Meine Wohnung ist klein, aber ruhig. Ich mag sie, weil sie nah an meiner Arbeit ist.'},
 ]},
 es:{questions:[
  {kind:'listening',text:'Hola, Lea: no puedo ir a la cafetería a las tres porque trabajo. ¿Podemos vernos a las cinco?',question:'چرا گوینده ساعت سه نمی‌تواند بیاید؟',choices:['کار می‌کند','بیمار است','به سفر می‌رود'],correctIndex:0,explanation:'porque trabajo یعنی چون کار می‌کنم.'},
  {kind:'listening',text:'Ayer fui en tren a Lyon. Después visité el museo con mi hermano.',question:'پس از سفر با قطار چه کرد؟',choices:['به بازار رفت','از موزه دیدن کرد','به خانه برگشت'],correctIndex:1,explanation:'visité el museo یعنی از موزه دیدن کردم.'},
  {kind:'listening',text:'El curso de español es los lunes y los miércoles. El miércoles empieza a las diez en vez de a las nueve.',question:'کلاس چهارشنبه چه ساعتی شروع می‌شود؟',choices:['نه','یازده','ده'],correctIndex:2,explanation:'a las diez en vez de a las nueve یعنی ساعت ده به‌جای نه.'},
  {kind:'reading',text:'Buenos días: su habitación está reservada para dos noches, del viernes al domingo. El desayuno está incluido. Para cambiar la reserva, llame antes del jueves.',question:'برای تغییر رزرو چه باید کرد؟',choices:['پیش از پنج‌شنبه تماس بگیرید','جمعه ایمیل بفرستید','یکشنبه به هتل بروید'],correctIndex:0,explanation:'llame antes del jueves یعنی پیش از پنج‌شنبه تماس بگیرید.'},
  {kind:'reading',text:'Gimnasio: abierto de martes a sábado, de 8 a 20 horas. Cerrado los lunes y los domingos.',question:'کدام روز سالن بسته است؟',choices:['سه‌شنبه','یکشنبه','شنبه'],correctIndex:1,explanation:'cerrado los domingos یعنی یکشنبه‌ها بسته است.'},
  {kind:'reading',text:'Me gusta mi piso nuevo: es más pequeño que el anterior, pero está cerca de mi trabajo. Puedo ir a pie.',question:'مزیت آپارتمان جدید چیست؟',choices:['از خانهٔ قدیم بزرگ‌تر است','یک استخر دارد','نزدیک محل کار است'],correctIndex:2,explanation:'cerca de mi trabajo یعنی نزدیک محل کارم.'},
 ],speaking:[
  {prompt:'دو جمله دربارهٔ آخر هفتهٔ گذشتهٔ خود بگویید.',stimulus:'¿Qué hiciste el fin de semana pasado?',stimulusFa:'آخر هفتهٔ گذشته چه کار کردی؟',model:'El sábado vi a una amiga. Después tomamos un café.'},
  {prompt:'زمان پیشنهادی را مؤدبانه رد کنید و زمان دیگری پیشنهاد دهید.',stimulus:'¿Nos vemos a las tres?',stimulusFa:'ساعت سه دیدار کنیم؟',model:'Lo siento, a las tres trabajo. ¿Podemos vernos a las cinco?'},
 ],writing:[
  {prompt:'برای دوستی پیام کوتاه بنویسید: شنبه دعوتش کنید، زمان و مکان پیشنهاد دهید.',model:'¡Hola! ¿Quieres ir al cine el sábado? Podemos vernos a las seis delante del cine.'},
  {prompt:'در دو یا سه جمله از خانهٔ خود بگویید؛ یک ویژگی و دلیل دوست داشتن یا نداشتن آن را بنویسید.',model:'Mi piso es pequeño, pero tranquilo. Me gusta porque está cerca de mi trabajo.'},
 ]},
};
