import type { AppLanguage } from "./shared";

type LocalizedCaseDisplay = {
  title: string;
  theme: string;
  presenting_complaint: string;
};

const arabicCaseDisplay: Record<string, LocalizedCaseDisplay> = {
  B001: {
    title: "قلق أول تحديث في اجتماع الفريق",
    theme: "قلق في بيئة العمل",
    presenting_complaint:
      "تدور الحالة حول قلق يظهر قبل تقديم تحديثات شفوية قصيرة في اجتماعات الفريق. الشخص يخشى أن يتجمد أو يبدو غير ذكي أو يتعرض لحكم الزملاء."
  },
  B002: {
    title: "تجنب الدعوات الاجتماعية",
    theme: "قلق اجتماعي",
    presenting_complaint:
      "تتعلق الحالة بتجنب متكرر للدعوات لأن الشخص يتوقع الإحراج والارتباك والرفض."
  },
  B003: {
    title: "تأجيل الدراسة قبل الاختبارات",
    theme: "تجنب أكاديمي",
    presenting_complaint:
      "تتعلق الحالة بتأخير جلسات الدراسة لأن فتح المادة يثير بسرعة رهبة ونقدًا ذاتيًا."
  },
  B004: {
    title: "انخفاض المزاج بعد فقدان الروتين",
    theme: "انخفاض المزاج واضطراب الروتين",
    presenting_complaint:
      "تتعلق الحالة بانخفاض المزاج وزيادة الانسحاب بعد تغير كبير في الروتين أزال البنية اليومية المعتادة."
  },
  B005: {
    title: "توتر بعد الرسائل غير المجاب عنها",
    theme: "حساسية في العلاقات",
    presenting_complaint:
      "تتعلق الحالة بردود فعل انفعالية قوية عندما لا يرد المقربون بسرعة على الرسائل."
  },
  I001: {
    title: "حلقة الكمالية في العمل",
    theme: "كمالية",
    presenting_complaint:
      "تتعلق الحالة بالإفراط في التحضير وبطء إنجاز المهام وارتفاع الضيق عند الأخطاء الصغيرة في العمل."
  },
  I002: {
    title: "تجنب المواصلات العامة بسبب نوبات الهلع",
    theme: "هلع وتجنب",
    presenting_complaint:
      "تتعلق الحالة بتجنب الحافلات والقطارات بعد نوبات هلع متكررة أثناء التنقل."
  },
  I003: {
    title: "طلب الطمأنة المتكرر في العلاقة",
    theme: "السعي إلى الطمأنة",
    presenting_complaint:
      "تتعلق الحالة بطلب متكرر للطمأنة في علاقة عاطفية يعقبه ارتياح قصير ثم عودة الشك."
  },
  A001: {
    title: "نمط معتقدات جوهرية مرتبط بالخزي",
    theme: "مخطط خزي جوهري",
    presenting_complaint:
      "تتعلق الحالة بانسحاب متكرر بعد النقد المتصور مع موضوعات قديمة من الخزي والحط من الذات عبر مواقف متعددة."
  },
  A002: {
    title: "تجنب مزمن مع تخطيط علاجي متعدد الخطوات",
    theme: "نمط تجنب معقد",
    presenting_complaint:
      "تتعلق الحالة بتقييد واسع للحياة في العمل والعلاقات والعادات الصحية بسبب خوف من الفشل والإرهاق."
  }
};

export function localizeCaseDisplay<T extends { id: string; title: string; presenting_complaint: string; theme?: string }>(
  language: AppLanguage,
  caseRecord: T
): T {
  if (language !== "ar") {
    return caseRecord;
  }

  const localized = arabicCaseDisplay[caseRecord.id];
  if (!localized) {
    return caseRecord;
  }

  return {
    ...caseRecord,
    title: localized.title,
    ...(typeof caseRecord.theme === "string" ? { theme: localized.theme } : {}),
    presenting_complaint: localized.presenting_complaint
  };
}
