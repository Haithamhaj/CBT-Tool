from __future__ import annotations

from dataclasses import dataclass
import os
from pathlib import Path
from shutil import copyfile
from zipfile import ZipFile, ZIP_DEFLATED
from xml.sax.saxutils import escape

import arabic_reshaper
from bidi.algorithm import get_display
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "disorders" / "depression"
WORKSHEETS_DIR = PUBLIC / "worksheets"
REFERENCES_DIR = PUBLIC / "references"
SOURCE_FILES_DIR = ROOT / "content" / "disorders" / "depression" / "source-files"

FONT_CANDIDATES = [
    os.environ.get("CBT_ARABIC_FONT_PATH", ""),
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf",
]


def ar(text: str) -> str:
    return get_display(arabic_reshaper.reshape(text))


def make_dirs() -> None:
    WORKSHEETS_DIR.mkdir(parents=True, exist_ok=True)
    REFERENCES_DIR.mkdir(parents=True, exist_ok=True)


def resolve_arabic_font() -> str:
    for candidate in FONT_CANDIDATES:
        if candidate and Path(candidate).exists():
            return candidate
    raise FileNotFoundError(
        "No Arabic-capable font found. Set CBT_ARABIC_FONT_PATH to a valid TTF path before running this script."
    )


def xml_cell(value: str) -> str:
    return f'<c t="inlineStr"><is><t xml:space="preserve">{escape(value)}</t></is></c>'


def build_xlsx(rows: list[list[str]], destination: Path) -> None:
    sheet_rows = []
    for row_index, row in enumerate(rows, start=1):
      cells = "".join(xml_cell(str(cell)) for cell in row)
      sheet_rows.append(f'<row r="{row_index}">{cells}</row>')

    workbook_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
 <sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>
</workbook>"""

    worksheet_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
 <sheetData>{''.join(sheet_rows)}</sheetData>
</worksheet>"""

    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
 <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
 <Default Extension="xml" ContentType="application/xml"/>
 <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
 <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
 <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
 <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
 <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
 <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>"""

    workbook_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>"""

    core = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/"
 xmlns:dcterms="http://purl.org/dc/terms/"
 xmlns:dcmitype="http://purl.org/dc/dcmitype/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
 <dc:title>CBT Depression Worksheet</dc:title>
 <dc:creator>Codex</dc:creator>
</cp:coreProperties>"""

    app = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
 xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
 <Application>Codex</Application>
</Properties>"""

    with ZipFile(destination, "w", ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types)
        zf.writestr("_rels/.rels", rels)
        zf.writestr("xl/workbook.xml", workbook_xml)
        zf.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
        zf.writestr("xl/worksheets/sheet1.xml", worksheet_xml)
        zf.writestr("docProps/core.xml", core)
        zf.writestr("docProps/app.xml", app)


@dataclass
class Layout:
    kind: str
    headers: list[str] | None = None
    rows: list[list[str]] | None = None
    fields: list[tuple[str, str]] | None = None
    sections: list[tuple[str, list[str]]] | None = None


@dataclass
class WorksheetSpec:
    slug: str
    title: str
    blank: Layout
    guided: Layout
    filled: Layout


def rows_from_layout(layout: Layout) -> list[list[str]]:
    if layout.kind == "table":
        return [layout.headers or []] + (layout.rows or [])
    if layout.kind == "form":
        return [[label, value] for label, value in (layout.fields or [])]
    rows: list[list[str]] = []
    for title, lines in layout.sections or []:
        rows.append([title])
        rows.extend([[line] for line in lines])
        rows.append([""])
    return rows


def build_pdf(spec: WorksheetSpec, version: str, layout: Layout) -> None:
    destination = WORKSHEETS_DIR / f"{spec.slug}-{version}.pdf"
    font_path = resolve_arabic_font()
    if "ArabicWorksheetFont" not in pdfmetrics.getRegisteredFontNames():
        pdfmetrics.registerFont(TTFont("ArabicWorksheetFont", font_path))
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "ArabicTitle",
        parent=styles["Title"],
        fontName="ArabicWorksheetFont",
        fontSize=18,
        leading=24,
        alignment=2,
    )
    body_style = ParagraphStyle(
        "ArabicBody",
        parent=styles["BodyText"],
        fontName="ArabicWorksheetFont",
        fontSize=11,
        leading=16,
        alignment=2,
    )
    note_style = ParagraphStyle(
        "ArabicNote",
        parent=styles["BodyText"],
        fontName="ArabicWorksheetFont",
        fontSize=10,
        textColor=colors.HexColor("#4b5563"),
        leading=15,
        alignment=2,
    )

    doc = SimpleDocTemplate(str(destination), pagesize=landscape(A4), rightMargin=24, leftMargin=24, topMargin=24, bottomMargin=24)
    elements = [
        Paragraph(ar(spec.title), title_style),
        Spacer(1, 10),
        Paragraph(ar({"blank": "نسخة فارغة", "guided": "نسخة تدريبية", "filled": "مثال مملوء"}[version]), note_style),
        Spacer(1, 12),
    ]

    if layout.kind == "table":
        data = [[Paragraph(ar(cell or " "), body_style) for cell in row] for row in [layout.headers or []] + (layout.rows or [])]
        table = Table(data, repeatRows=1)
        table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eff6ff")),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                    ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ]
            )
        )
        elements.append(table)
    elif layout.kind == "form":
        data = [[Paragraph(ar(label), body_style), Paragraph(ar(value or "________________"), body_style)] for label, value in (layout.fields or [])]
        table = Table(data, colWidths=[180, 520])
        table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                    ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f8fafc")),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ]
            )
        )
        elements.append(table)
    else:
        for title, lines in layout.sections or []:
            elements.append(Paragraph(ar(title), body_style))
            elements.append(Spacer(1, 6))
            data = [[Paragraph(ar(line or "________________"), body_style)] for line in lines]
            table = Table(data, colWidths=[720])
            table.setStyle(
                TableStyle(
                    [
                        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                    ]
                )
            )
            elements.append(table)
            elements.append(Spacer(1, 10))

    doc.build(elements)


def build_assets(spec: WorksheetSpec) -> None:
    for version, layout in [("blank", spec.blank), ("guided", spec.guided), ("filled", spec.filled)]:
        build_xlsx(rows_from_layout(layout), WORKSHEETS_DIR / f"{spec.slug}-{version}.xlsx")
        build_pdf(spec, version, layout)


WORKSHEETS = [
    WorksheetSpec(
        slug="abc",
        title="ورقة نموذج ABC",
        blank=Layout("table", headers=["A الموقف", "B الفكرة أو التفسير", "C الشعور/السلوك"], rows=[["", "", ""] for _ in range(6)]),
        guided=Layout("table", headers=["A الموقف", "B الفكرة أو التفسير", "C الشعور/السلوك"], rows=[["تأخر صديقتي في الرد", "ما عدت مهمة لديها", "حزن + تجنب"], ["", "", ""], ["", "", ""], ["", "", ""]]),
        filled=Layout("table", headers=["A الموقف", "B الفكرة أو التفسير", "C الشعور/السلوك"], rows=[["تأخر مشرفي في الرد", "أكيد غير راضٍ عني", "قلق 80% + تجنب"], ["لم أخرج من غرفتي عصرًا", "أنا فاشل", "حزن 75% + انسحاب"]]),
    ),
    WorksheetSpec(
        slug="conceptualization",
        title="استمارة التصور المعرفي",
        blank=Layout("sections", sections=[("خبرات مبكرة مهمة", ["", "", ""]), ("المعتقد الجوهري", [""]), ("المعتقدات الوسيطة", ["", ""]), ("الأفكار التلقائية الحالية", ["", ""]), ("الاستراتيجيات التعويضية والسلوك", ["", ""])]),
        guided=Layout("sections", sections=[("خبرات مبكرة مهمة", ["مثال: نقد متكرر في الطفولة", "", ""]), ("المعتقد الجوهري", ["مثال: أنا غير كفء"]), ("المعتقدات الوسيطة", ["إذا أخطأت سيرفضني الناس", ""]), ("الأفكار التلقائية الحالية", ["أكيد سأفشل", ""]), ("الاستراتيجيات التعويضية والسلوك", ["تجنب المحاولة", ""])]),
        filled=Layout("sections", sections=[("خبرات مبكرة مهمة", ["إهمال عاطفي من الأم", "صعوبة في تكوين صداقات", "خبرات تحرش في سن صغيرة"]), ("المعتقد الجوهري", ["محدش بيحبني"]), ("المعتقدات الوسيطة", ["لو أرضيت الجميع سيبقون معي", "لازم أتجنب الرفض"]), ("الأفكار التلقائية الحالية", ["أنا مليش لزمة", "أي مشكلة تعني أنني فاشلة"]), ("الاستراتيجيات التعويضية والسلوك", ["لا أرفض طلبات الآخرين", "أنسحب عند أقل خيبة"])]),
    ),
    WorksheetSpec(
        slug="thought-record",
        title="سجل الأفكار السلبية",
        blank=Layout("table", headers=["اليوم/الساعة", "الموقف", "الانفعال ودرجته", "الفكرة ودرجة الإيمان", "الفكرة البديلة", "الانفعال بعد المراجعة"], rows=[["", "", "", "", "", ""] for _ in range(5)]),
        guided=Layout("table", headers=["اليوم/الساعة", "الموقف", "الانفعال ودرجته", "الفكرة ودرجة الإيمان", "الفكرة البديلة", "الانفعال بعد المراجعة"], rows=[["الاثنين 6م", "تأخر الرد على رسالتي", "حزن 70%", "أنا غير مهم 85%", "هل أملك دليلًا كافيًا؟", ""], ["", "", "", "", "", ""], ["", "", "", "", "", ""]]),
        filled=Layout("table", headers=["اليوم/الساعة", "الموقف", "الانفعال ودرجته", "الفكرة ودرجة الإيمان", "الفكرة البديلة", "الانفعال بعد المراجعة"], rows=[["الاثنين 6م", "تأخر الرد على رسالتي", "حزن 70%", "أنا غير مهم 85%", "قد يكون التأخر بسبب الانشغال", "حزن 45%"], ["الأربعاء 11ص", "تعطلت في مهمة", "إحباط 80%", "أنا فاشل في كل شيء 90%", "التعثر في مهمة لا يعني الفشل العام", "إحباط 50%"]]),
    ),
    WorksheetSpec(
        slug="socratic",
        title="ورقة الأسئلة السقراطية",
        blank=Layout("sections", sections=[("الفكرة المستهدفة", [""]), ("ما الأدلة التي تؤيدها؟", ["", ""]), ("ما الأدلة التي لا تؤيدها؟", ["", ""]), ("ما أسوأ ما قد يحدث؟ وكيف يمكن التعامل معه؟", ["", ""]), ("ما الفكرة البديلة الأكثر توازنًا؟", [""])]),
        guided=Layout("sections", sections=[("الفكرة المستهدفة", ["مثال: لا أحد يريدني"]), ("ما الأدلة التي تؤيدها؟", ["رفضت دعوتي مرة", ""]), ("ما الأدلة التي لا تؤيدها؟", ["هناك من سأل عني الأسبوع الماضي", ""]), ("ما أسوأ ما قد يحدث؟ وكيف يمكن التعامل معه؟", ["", ""]), ("ما الفكرة البديلة الأكثر توازنًا؟", [""])]),
        filled=Layout("sections", sections=[("الفكرة المستهدفة", ["لا أحد يريدني"]), ("ما الأدلة التي تؤيدها؟", ["اعتذرت صديقة عن لقائي", "تجاهلني زميل يومًا واحدًا"]), ("ما الأدلة التي لا تؤيدها؟", ["سألت أختي عني", "دعاني صديق للخروج"]), ("ما أسوأ ما قد يحدث؟ وكيف يمكن التعامل معه؟", ["قد يرفضني بعض الناس فعلًا", "يمكنني طلب دعم من آخرين وعدم التعميم"]), ("ما الفكرة البديلة الأكثر توازنًا؟", ["بعض العلاقات قد تخيبني، لكن ذلك لا يعني أنني غير مرغوب من الجميع"])]),
    ),
    WorksheetSpec(
        slug="behavioral-experiment",
        title="ورقة التجربة السلوكية",
        blank=Layout("table", headers=["الفكرة", "التوقع", "تصميم التجربة", "النتيجة الفعلية", "ما الذي تعلمته؟"], rows=[["", "", "", "", ""] for _ in range(5)]),
        guided=Layout("table", headers=["الفكرة", "التوقع", "تصميم التجربة", "النتيجة الفعلية", "ما الذي تعلمته؟"], rows=[["لو طلبت المساعدة سيرفضني الجميع", "سيرفضونني بنسبة كبيرة", "أطلب مساعدة محددة من زميل واحد", "", ""], ["", "", "", "", ""]]),
        filled=Layout("table", headers=["الفكرة", "التوقع", "تصميم التجربة", "النتيجة الفعلية", "ما الذي تعلمته؟"], rows=[["لو طلبت المساعدة سيرفضني الجميع", "سيرفضونني بنسبة 90%", "طلبت من زميل واحد مساعدتي", "وافق وساعدني", "التوقع كان أوسع من الواقع"]]),
    ),
    WorksheetSpec(
        slug="continuum",
        title="ورقة المتصل المعرفي",
        blank=Layout("sections", sections=[("الفكرة القطبية", [""]), ("طرف 0%", [""]), ("طرف 100%", [""]), ("أين يضع المريض نفسه الآن؟", [""]), ("ما الموضع الأقرب للواقع بعد جمع الأدلة؟", [""])]),
        guided=Layout("sections", sections=[("الفكرة القطبية", ["أنا غير كفء على الإطلاق"]), ("طرف 0%", ["غير كفء تمامًا"]), ("طرف 100%", ["كفء دائمًا"]), ("أين يضع المريض نفسه الآن؟", ["10%"]), ("ما الموضع الأقرب للواقع بعد جمع الأدلة؟", [""])]),
        filled=Layout("sections", sections=[("الفكرة القطبية", ["أنا غير كفء على الإطلاق"]), ("طرف 0%", ["غير كفء تمامًا"]), ("طرف 100%", ["كفء دائمًا"]), ("أين يضع المريض نفسه الآن؟", ["10%"]), ("ما الموضع الأقرب للواقع بعد جمع الأدلة؟", ["45%: أتعثر أحيانًا لكن لدي جوانب قدرة واضحة"])]),
    ),
    WorksheetSpec(
        slug="activity-schedule",
        title="جدول الأنشطة الأسبوعي",
        blank=Layout("table", headers=["الوقت", "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"], rows=[["8-9", "", "", "", "", "", "", ""], ["9-10", "", "", "", "", "", "", ""], ["10-11", "", "", "", "", "", "", ""], ["11-12", "", "", "", "", "", "", ""], ["12-1", "", "", "", "", "", "", ""], ["1-2", "", "", "", "", "", "", ""]]),
        guided=Layout("table", headers=["الوقت", "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"], rows=[["8-9", "استيقاظ + فطور", "", "", "", "", "", ""], ["9-10", "مشي 15 دقيقة", "", "", "", "", "", ""], ["10-11", "", "", "", "", "", "", ""]]),
        filled=Layout("table", headers=["الوقت", "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"], rows=[["8-9", "استيقاظ + فطور", "استيقاظ + فطور", "استيقاظ + فطور", "استيقاظ + فطور", "استيقاظ + فطور", "استيقاظ + فطور", "استيقاظ + فطور"], ["9-10", "مشي 15 دقيقة", "ترتيب السرير", "مراجعة 30 دقيقة", "مشي 20 دقيقة", "اتصال بصديق", "زيارة قصيرة", "راحة"], ["10-11", "مهمة منزلية", "مذاكرة", "شراء حاجات", "مهمة جامعية", "جلسة علاجية", "قراءة خفيفة", "خروج مع الأسرة"]]),
    ),
    WorksheetSpec(
        slug="pleasant-activities",
        title="جدول الأنشطة السارة",
        blank=Layout("table", headers=["النشاط", "درجة المتعة المتوقعة", "درجة المتعة الفعلية", "ملاحظات"], rows=[["", "", "", ""] for _ in range(6)]),
        guided=Layout("table", headers=["النشاط", "درجة المتعة المتوقعة", "درجة المتعة الفعلية", "ملاحظات"], rows=[["مشي قصير في الحديقة", "40%", "", ""], ["الجلوس مع صديق موثوق", "50%", "", ""]]),
        filled=Layout("table", headers=["النشاط", "درجة المتعة المتوقعة", "درجة المتعة الفعلية", "ملاحظات"], rows=[["مشي قصير في الحديقة", "40%", "55%", "كان أصعب قبل الخروج ثم صار أخف"], ["الجلوس مع صديق موثوق", "50%", "60%", "المتعة لم تكن كاملة لكن العزلة انخفضت"]]),
    ),
    WorksheetSpec(
        slug="positive-log",
        title="سجل المعلومات الإيجابية",
        blank=Layout("table", headers=["المعتقد الجديد", "الدليل أو الحدث", "ما الذي يقوله هذا الدليل؟"], rows=[["", "", ""] for _ in range(6)]),
        guided=Layout("table", headers=["المعتقد الجديد", "الدليل أو الحدث", "ما الذي يقوله هذا الدليل؟"], rows=[["أنا شخص كفء إلى حد معقول", "أنهيت مهمة كنت أؤجلها", ""], ["", "", ""]]),
        filled=Layout("table", headers=["المعتقد الجديد", "الدليل أو الحدث", "ما الذي يقوله هذا الدليل؟"], rows=[["أنا شخص كفء إلى حد معقول", "أنهيت مهمة كنت أؤجلها", "أستطيع الإنجاز عندما أكسر المهمة"], ["أنا شخص له قيمة", "استشارتني صديقتي في قرار مهم", "وجود من يستشيرني دليل على أن لي قيمة"]]),
    ),
    WorksheetSpec(
        slug="assertiveness",
        title="ورقة تدريب توكيد الذات",
        blank=Layout("form", fields=[("الموقف الاجتماعي", ""), ("الفكرة المعيقة", ""), ("المهارة المختارة", ""), ("الجملة أو السلوك الذي سأجربه", ""), ("ما الذي حدث بعد التجربة؟", "")]),
        guided=Layout("form", fields=[("الموقف الاجتماعي", "شخص يلح عليّ بطلب لا أريده"), ("الفكرة المعيقة", "إذا رفضت سيغضب ولن يحبني"), ("المهارة المختارة", ""), ("الجملة أو السلوك الذي سأجربه", ""), ("ما الذي حدث بعد التجربة؟", "")]),
        filled=Layout("form", fields=[("الموقف الاجتماعي", "شخص يلح عليّ بطلب لا أريده"), ("الفكرة المعيقة", "إذا رفضت سيغضب ولن يحبني"), ("المهارة المختارة", "الأسطوانة المشروخة"), ("الجملة أو السلوك الذي سأجربه", "لا أستطيع هذا اليوم"), ("ما الذي حدث بعد التجربة؟", "كرر الطلب مرتين ثم توقف")]),
    ),
    WorksheetSpec(
        slug="progress-tracker",
        title="متابعة التقدم الأسبوعي",
        blank=Layout("table", headers=["الأسبوع", "شدة المزاج", "أهم نشاط منفذ", "الواجب", "ملاحظة تقدم/تعثر"], rows=[["", "", "", "", ""] for _ in range(6)]),
        guided=Layout("table", headers=["الأسبوع", "شدة المزاج", "أهم نشاط منفذ", "الواجب", "ملاحظة تقدم/تعثر"], rows=[["الأول", "8/10", "مشي يومين", "ملء سجل فكرة واحدة", ""], ["الثاني", "", "", "", ""]]),
        filled=Layout("table", headers=["الأسبوع", "شدة المزاج", "أهم نشاط منفذ", "الواجب", "ملاحظة تقدم/تعثر"], rows=[["الأول", "8/10", "مشي يومين", "ملء سجل فكرة واحدة", "البداية كانت صعبة لكن الخروج خفف العزلة"], ["الثاني", "6/10", "مشي 4 أيام", "استكمال سجل الأفكار", "ظهر تحسن جزئي مع بقاء أفكار عدم القيمة"]]),
    ),
    WorksheetSpec(
        slug="relapse-prevention",
        title="خطة منع الانتكاسة",
        blank=Layout("table", headers=["العلامة المبكرة", "ماذا تعني لي؟", "الاستجابة المقترحة", "من يمكنني إبلاغه؟"], rows=[["", "", "", ""] for _ in range(5)]),
        guided=Layout("table", headers=["العلامة المبكرة", "ماذا تعني لي؟", "الاستجابة المقترحة", "من يمكنني إبلاغه؟"], rows=[["التوقف عن الخروج من الغرفة", "قد تكون بداية عودة الانسحاب", "", ""], ["", "", "", ""]]),
        filled=Layout("table", headers=["العلامة المبكرة", "ماذا تعني لي؟", "الاستجابة المقترحة", "من يمكنني إبلاغه؟"], rows=[["التوقف عن الخروج من الغرفة", "قد تكون بداية عودة الانسحاب", "إعادة جدول الصباح والخروج القصير", "أختي"], ["إلغاء المواعيد بلا سبب", "قد تعود أفكار اليأس", "مراجعة سجل الأفكار والاتصال بالداعم", "صديقتي"]]),
    ),
]


def copy_references() -> None:
    source_material = SOURCE_FILES_DIR / "material-science.pdf"
    slide_deck = SOURCE_FILES_DIR / "depression-slide-deck.pdf"
    if not source_material.exists() or not slide_deck.exists():
        raise FileNotFoundError(
            "Missing source PDFs in content/disorders/depression/source-files/. Expected material-science.pdf and depression-slide-deck.pdf."
        )
    copyfile(source_material, REFERENCES_DIR / "material-science.pdf")
    copyfile(slide_deck, REFERENCES_DIR / "depression-slide-deck.pdf")


def main() -> None:
    make_dirs()
    copy_references()
    for worksheet in WORKSHEETS:
        build_assets(worksheet)
    print(f"Generated assets in {PUBLIC}")


if __name__ == "__main__":
    main()
