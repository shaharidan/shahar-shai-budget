import type {Plan,Row,Scope} from './budget';
const row=(id:string,scope:Scope,name:string,amount:number|null,status:Row['status'],note='',frequency:Row['frequency']='month',parents=false):Row=>({id,scope,name,amount,status,note,frequency,share:50,parents});
export const initial:Plan={income:{shahar:0,shai:null},notes:'לברר: ועד בית, אופן חימום המים, חשבון ארנונה, כביש 6 ואחריות לתיקוני רכב. עלויות מעבר וציוד שכבר נקנו יושלמו בהמשך.',rows:[
row('rent','shared','שכר דירה',3000,'known','1,500 ₪ לכל אחד. החלק של שחר מכוסה ישירות על ידי ההורים.'),
row('food','shared','סופר ואוכל לבית',2400,'estimate','בישול איכותי וארוחות ללימודים; ללא אבקת חלבון וארוחות בחוץ.'),
row('clean','shared','ניקיון ומוצרים לבית',200,'estimate','חומרי ניקוי, שקיות, נייר טואלט ומוצרים מתכלים.'),
row('electric','shared','חשמל',450,'estimate','ממוצע לתכנון; שימוש במזגן עשוי לשנות את החשבון.'),
row('water','shared','מים',120,'estimate','לשני אנשים; לא כולל חיוב נפרד לחימום.'),
row('gas','shared','גז לבישול',60,'estimate','לבישול בלבד. חימום המים טרם הובהר.'),
row('internet','shared','אינטרנט',100,'known','החשבון החודשי לכל הדירה.'),
row('arnona','shared','ארנונה',400,'estimate','80 מ״ר בקירוב; ללא הנחה. לעדכן לפי השובר.'),
row('building','shared','ועד בית',null,'missing','טרם ידוע אם יש תשלום ומה גובהו.'),
row('hotwater','shared','חימום מים — חיוב נפרד',null,'missing','אם כלול בחשמל או בגז, למלא 0 כדי לא לספור פעמיים.'),
row('gym','shahar','חדר כושר',190,'known'),row('protein','shahar','אבקת חלבון',150,'estimate','לעדכן לפי מחיר האריזה וכמה חודשים היא מספיקה.'),
row('outside','shahar','ארוחות בחוץ',200,'estimate','שתי ארוחות בחודש; לא לספור שוב בבילויים.'),row('fun','shahar','בילויים',350,'estimate','4–5 בילויי סטודנטים בחודש.'),
row('fuel','shahar','דלק',850,'estimate','כולו על שחר. כ־3.25 ביקורים בהוד השרון בחודש. הנחת תכנון: 1,000–1,100 ק״מ, 10–12 ק״מ לליטר ובנזין 95 ב־8.27 ₪. לעדכן לפי תדלוקים.'),
row('hair','shahar','תספורת',90,'known','90 ₪ פעם ב־3 שבועות = 130 ₪ בממוצע לחודש.','threeWeeks'),
row('reserve','shahar','רזרבה כללית',350,'estimate','כסף ששומרים בצד. אינו מבטיח כיסוי תיקון רכב גדול.'),
row('tolls','shahar','כבישי אגרה וחניה',null,'missing','לברר שימוש בכביש 6 וחניה.'),row('repairs','shahar','קרן תיקוני רכב נוספת',null,'missing','אם שחר מממן; להימנע מכפל מול הרזרבה הכללית.'),
row('phone','shahar','טלפון ומנויים נוספים',null,'missing','למלא סכום או 0 אם מכוסה בנפרד.'),
...['תחבורה ודלק','חדר כושר','אוכל בחוץ ובילויים','טיפוח ובריאות','טלפון ומנויים','רזרבה אישית'].map((n,i)=>row('shai'+i,'shai',n,null,'missing','שי תמלא את הסכום שלה.')),
row('move','shared','ריהוט וציוד לדירה',null,'missing','כולל מה שכבר נקנה; משלימים בסוף.','once'),row('study','shahar','ציוד אישי ללימודים',null,'missing','מחשב ואביזרים שכבר נקנו או נדרשים; ללא שכר לימוד.','once')
]};


import {validYear,validPlan,type YearPlan} from './budget';
export function setupPlan():Plan{return {rows:[...initial.rows.filter(r=>r.frequency==='once').map(r=>({...r,amount:null,status:'missing' as const})),row('shai-study','shai','ציוד אישי ללימודים',null,'missing','','once'),row('moving','shared','הובלה',null,'missing','','once'),row('first-buy','shared','קניות ראשונות לבית',null,'missing','','once')],income:{shahar:0,shai:0},notes:''}}
export function newYear():YearPlan{const p=structuredClone(initial);p.rows=p.rows.filter(r=>r.frequency!=='once');return {start:'2026-10',end:'2027-08',months:{'2026-10':p,setup:setupPlan()}}}

export function migrateYear(value:unknown):YearPlan{if(validYear(value))return {...value,months:{setup:setupPlan(),...value.months}};if(validPlan(value)){const setup=setupPlan();setup.rows=[...value.rows.filter(r=>r.frequency==='once'),...setup.rows.filter(r=>!value.rows.some(v=>v.id===r.id))];const p=structuredClone(value);p.rows=p.rows.filter(r=>r.frequency!=='once');return {start:'2026-10',end:'2027-08',months:{'2026-10':p,setup}}};throw new Error('Invalid saved budget')}

