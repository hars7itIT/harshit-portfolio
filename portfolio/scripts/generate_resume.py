from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT
from reportlab.lib import colors

doc = SimpleDocTemplate(
    "resume.pdf",
    pagesize=letter,
    topMargin=0.55 * inch,
    bottomMargin=0.55 * inch,
    leftMargin=0.65 * inch,
    rightMargin=0.65 * inch,
    title="Harshit Gupta - Resume",
)

styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "Name", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=20, leading=24, alignment=TA_LEFT, spaceAfter=2,
)
contact_style = ParagraphStyle(
    "Contact", parent=styles["Normal"], fontSize=9.5, leading=13,
    textColor=colors.HexColor("#333333"), spaceAfter=10,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=11.5, leading=14, spaceBefore=12, spaceAfter=4,
    textColor=colors.HexColor("#111111"), borderColor=colors.HexColor("#111111"),
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"], fontSize=10, leading=13.5, spaceAfter=2,
)
role_style = ParagraphStyle(
    "Role", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10.5,
    leading=13, spaceBefore=6,
)
sub_style = ParagraphStyle(
    "Sub", parent=styles["Normal"], fontSize=9.5, leading=12,
    textColor=colors.HexColor("#444444"), spaceAfter=3,
)
bullet_style = ParagraphStyle(
    "Bullet", parent=styles["Normal"], fontSize=9.8, leading=13, leftIndent=0,
)

story = []

story.append(Paragraph("Harshit Gupta", name_style))
story.append(Paragraph(
    "Azamgarh, Uttar Pradesh, India &nbsp;|&nbsp; you@example.com &nbsp;|&nbsp; +91 00000 00000 "
    "&nbsp;|&nbsp; linkedin.com/in/yourhandle &nbsp;|&nbsp; github.com/yourhandle",
    contact_style,
))

story.append(Paragraph("OBJECTIVE", section_style))
story.append(Paragraph(
    "Second-year Computer Science & Engineering student focused on full-stack and AI-powered "
    "software development. Builds production-style projects end to end -- database schema, "
    "backend routes, and front-end design -- to learn technologies by shipping with them, not "
    "just studying them. Looking for internship and open-source opportunities in software "
    "engineering or applied AI.",
    body_style,
))

story.append(Paragraph("EDUCATION", section_style))
story.append(Paragraph("Bachelor of Engineering (B.E.), Computer Science & Engineering", role_style))
story.append(Paragraph("UIET, Panjab University, Chandigarh -- Second Year (2024 - Present)", sub_style))
story.append(Paragraph(
    "Relevant coursework: Data Structures & Algorithms, Differential Equations, Database Systems, "
    "Object-Oriented Programming, Computer Networks.",
    body_style,
))

story.append(Paragraph("PROJECTS", section_style))

story.append(Paragraph("WanderLust -- Full-stack property listing platform", role_style))
story.append(Paragraph("Node.js, Express, MongoDB, Mongoose, EJS", sub_style))
story.append(ListFlowable([
    ListItem(Paragraph("Built an Airbnb-style listings platform with a full MVC architecture on Express and MongoDB.", bullet_style)),
    ListItem(Paragraph("Designed and implemented a complete front-end design system from scratch, including a defined visual identity, CSS, and EJS templates.", bullet_style)),
    ListItem(Paragraph("Debugged database name mismatches and schema validation issues across environments.", bullet_style)),
    ListItem(Paragraph("Scoped a roadmap for authentication, reviews, wishlists, Cloudinary, and Mapbox integration.", bullet_style)),
], bulletType="bullet", start="circle", leftIndent=14, bulletFontSize=6, spaceAfter=6))

story.append(Paragraph("FixIQ -- Browser-based AI product diagnostic tool", role_style))
story.append(Paragraph("Vanilla JavaScript, HTML, CSS, Anthropic API", sub_style))
story.append(ListFlowable([
    ListItem(Paragraph("Built a client-only diagnostic web app that calls the Anthropic API directly from the browser.", bullet_style)),
    ListItem(Paragraph("Implemented a secure API-key entry modal so users supply their own key rather than shipping one in source.", bullet_style)),
    ListItem(Paragraph("Solved ES module serving and API authentication header issues without any backend or build tooling.", bullet_style)),
], bulletType="bullet", start="circle", leftIndent=14, bulletFontSize=6, spaceAfter=6))

story.append(Paragraph("UIET Attendance Tracker -- College project", role_style))
story.append(Paragraph("HTML, CSS, JavaScript", sub_style))
story.append(ListFlowable([
    ListItem(Paragraph("Built an admin panel with subject-wise navigation wired into the college's existing login and attendance pages.", bullet_style)),
], bulletType="bullet", start="circle", leftIndent=14, bulletFontSize=6, spaceAfter=6))

story.append(Paragraph("SKILLS", section_style))
skills_table = [
    ("Languages", "C++, Python, JavaScript, TypeScript, SQL"),
    ("Frontend", "HTML5, CSS3, Tailwind CSS, React, Next.js, EJS"),
    ("Backend", "Node.js, Express.js"),
    ("Databases", "MongoDB, MySQL, PostgreSQL, Mongoose, Prisma ORM"),
    ("AI & ML", "Anthropic API, Prompt Engineering, LangChain (learning), RAG (learning)"),
    ("Tools", "Git, GitHub, VS Code, Spyder, Postman"),
]
for label, val in skills_table:
    story.append(Paragraph(f"<b>{label}:</b> {val}", body_style))

story.append(Paragraph("ACHIEVEMENTS & CERTIFICATIONS", section_style))
story.append(Paragraph(
    "Add hackathons, competitions, and certifications here as they happen.",
    body_style,
))

doc.build(story)
print("done")
